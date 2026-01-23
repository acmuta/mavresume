import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import {
  buildRefinementCacheKey,
  getCachedRefinement,
  setCachedRefinement,
} from "@/lib/refine-cache";
import { checkRefinementLimit, getRefinementLimitStatus } from "@/lib/ratelimit";
import { getOpenAIClient } from "@/lib/openai"

const openai = getOpenAIClient();
/**
 * API endpoint for AI-powered bullet point refinement.
 *
 * Accepts a bullet point and optional context (title, technologies) to generate
 * a more impactful, ATS-friendly version using OpenAI's GPT-4o-mini model.
 *
 * Data flow: Client → POST /api/refine-bullet → OpenAI API → Refined text → Client
 *
 * @param request - Next.js request containing { bulletText: string, context?: { title?, technologies?[] } }
 * @returns JSON response with { refinedText: string } or { error: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { bulletText, context } = body;

    if (!bulletText || typeof bulletText !== "string") {
      return NextResponse.json(
        { error: "bulletText is required and must be a string" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Cache lookup: return cached refinement when available to avoid redundant AI calls
    const cacheKey = await buildRefinementCacheKey(user.id, bulletText, context);
    const cached = await getCachedRefinement(cacheKey);
    if (cached !== null) {
      const rateLimit = await getRefinementLimitStatus(user.id);
      return NextResponse.json({ refinedText: cached, rateLimit });
    }

    // Rate limit: only consume when we would call OpenAI (cache miss)
    const { success, limit, remaining, reset } = await checkRefinementLimit(
      user.id
    );
    if (!success) {
      const retryAfter = Math.max(
        1,
        Math.ceil((reset - Date.now()) / 1000)
      );
      return NextResponse.json(
        { error: "Too many refinement requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(Math.floor(reset / 1000)),
            "Retry-After": String(retryAfter),
          },
        }
      );
    }

    // Build context string for the prompt - includes title and technologies to help
    // the AI generate more relevant and contextual refinements
    let contextString = "";
    if (context) {
      if (context.title) {
        contextString += `Project/Experience Title: ${context.title}\n`;
      }
      if (context.technologies && context.technologies.length > 0) {
        contextString += `Technologies Used: ${context.technologies.join(
          ", "
        )}\n`;
      }
    }

    // Construct prompt with context to guide AI refinement
    const prompt = `${contextString ? `Context:\n${contextString}\n` : ""}Original bullet point: ${bulletText}

Refine this bullet point and return ONLY the refined text.`;

    // Call OpenAI API with optimized settings
    // Temperature 0.4 for consistent, professional outputs
    // Max tokens 150 is sufficient for a single bullet point
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert resume writer. Refine bullet points to be:
- Action-oriented (start with verbs like Led, Developed, Increased, Optimized)
- Quantified with metrics when possible (%, $, time saved)
- ATS-friendly with relevant keywords
- Concise (under 25 words)
Return ONLY the refined text, no explanations or markdown.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 150,
    });

    // Fallback to original text if API returns empty/null response
    const refinedText =
      completion.choices[0]?.message?.content?.trim() || bulletText;

    await setCachedRefinement(cacheKey, refinedText);
    return NextResponse.json({ refinedText, rateLimit: { limit, remaining, reset } });
  } catch (error) {
    console.error("Error refining bullet point:", error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to refine bullet point" },
      { status: 500 }
    );
  }
}
