import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { checkRateLimit, createRateLimitHeaders } from "@/lib/rateLimit";
import {
  getCachedRefinement,
  setCachedRefinement,
} from "@/lib/refinementCache";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Step 1: Check cache first - cache hits bypass rate limiting and AI costs
    const cachedResult = await getCachedRefinement(bulletText, context);
    if (cachedResult) {
      return NextResponse.json(
        { refinedText: cachedResult, cached: true },
        { status: 200 }
      );
    }

    // Step 2: Check rate limit - fail-fast before calling expensive OpenAI API
    const rateLimitResult = await checkRateLimit(request);
    if (!rateLimitResult.allowed) {
      const rateLimitHeaders = createRateLimitHeaders(rateLimitResult);
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
        },
        {
          status: 429,
          headers: rateLimitHeaders,
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

    // Construct prompt with context to guide AI refinement toward ATS-friendly,
    // metric-driven bullet points with strong action verbs
    const prompt = `You are a professional resume writing assistant. Refine the following resume bullet point to make it more impactful, ATS-friendly, and professional. Use strong action verbs, include quantifiable metrics when possible, and focus on achievements and impact.
    ${
      contextString ? `Context:\n${contextString}\n` : ""
    } Original bullet point: ${bulletText}
    Refined bullet point (return only the refined text, no explanations or markdown):`;

    // Call OpenAI API with system message to enforce clean output format
    // Temperature 0.7 balances creativity with consistency
    // Max tokens 200 limits response length to typical bullet point size
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume writing assistant. Always return only the refined bullet point text, without any explanations, markdown formatting, or additional commentary.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    // Fallback to original text if API returns empty/null response
    const refinedText =
      completion.choices[0]?.message?.content?.trim() || bulletText;

    // Step 3: Cache the result before returning (non-blocking, fails gracefully)
    // This ensures future identical requests can be served from cache
    await setCachedRefinement(bulletText, context, refinedText);

    // Step 4: Return response with rate limit headers
    const rateLimitHeaders = createRateLimitHeaders(rateLimitResult);
    return NextResponse.json(
      { refinedText },
      {
        status: 200,
        headers: rateLimitHeaders,
      }
    );
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
