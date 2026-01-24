import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import {
  buildRefinementCacheKey,
  getCachedRefinement,
  setCachedRefinement,
} from "@/lib/refine-cache";
import {
  checkRefinementLimitBatch,
  getRefinementLimitStatus,
} from "@/lib/ratelimit";
import { getOpenAIClient } from "@/lib/openai"

interface BulletInput {
  text: string;
  context?: {
    title?: string;
    technologies?: string[];
  };
}

interface BulletResult {
  refinedText: string;
  fromCache: boolean;
  error?: string;
}

/**
 * API endpoint for batch AI-powered bullet point refinement.
 *
 * Accepts an array of bullet points and refines them in a single OpenAI call,
 * while maintaining individual caching for each bullet.
 *
 * Data flow:
 * 1. Check cache for each bullet individually
 * 2. Collect uncached bullets
 * 3. Make single OpenAI call with all uncached bullets
 * 4. Cache each refined bullet individually
 * 5. Return all results (cached + newly refined)
 *
 * @param request - Next.js request containing { bullets: Array<{ text: string, context?: { title?, technologies?[] } }> }
 * @returns JSON response with { results: Array<{ refinedText: string, fromCache: boolean, error?: string }>, rateLimit: {...} }
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bullets } = body as { bullets: BulletInput[] };

    if (!bullets || !Array.isArray(bullets) || bullets.length === 0) {
      return NextResponse.json(
        { error: "bullets array is required and must not be empty" },
        { status: 400 }
      );
    }

    if (bullets.length > 20) {
      return NextResponse.json(
        { error: "Maximum 20 bullets per batch request" },
        { status: 400 }
      );
    }

    // Initialize results array with same length as input
    const results: BulletResult[] = new Array(bullets.length);

    // Track which bullets need refinement (not cached)
    const uncachedBullets: Array<{
      originalIndex: number;
      text: string;
      context?: BulletInput["context"];
      cacheKey: string;
    }> = [];

    // Check cache for each bullet individually
    for (let i = 0; i < bullets.length; i++) {
      const bullet = bullets[i];

      if (!bullet.text || typeof bullet.text !== "string" || bullet.text.trim().length === 0) {
        results[i] = {
          refinedText: bullet.text || "",
          fromCache: false,
          error: "Empty or invalid bullet text",
        };
        continue;
      }

      const cacheKey = await buildRefinementCacheKey(
        user.id,
        bullet.text,
        bullet.context
      );
      const cached = await getCachedRefinement(cacheKey);

      if (cached !== null) {
        // Found in cache - use cached result
        results[i] = {
          refinedText: cached,
          fromCache: true,
        };
      } else {
        // Not in cache - need to refine
        uncachedBullets.push({
          originalIndex: i,
          text: bullet.text.trim(),
          context: bullet.context,
          cacheKey,
        });
      }
    }

    // If all bullets were cached, return early
    if (uncachedBullets.length === 0) {
      const rateLimit = await getRefinementLimitStatus(user.id);
      return NextResponse.json({ results, rateLimit });
    }

    // Rate limit check for uncached bullets count
    const { success, limit, remaining, reset } = await checkRefinementLimitBatch(
      user.id,
      uncachedBullets.length
    );

    if (!success) {
      const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
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

    // Build batch prompt for uncached bullets
    // Use shared context from first bullet if available (typically all bullets share same context)
    const sharedContext = uncachedBullets[0]?.context;
    let contextString = "";
    if (sharedContext) {
      if (sharedContext.title) {
        contextString += `Project/Experience Title: ${sharedContext.title}\n`;
      }
      if (sharedContext.technologies && sharedContext.technologies.length > 0) {
        contextString += `Technologies Used: ${sharedContext.technologies.join(", ")}\n`;
      }
    }

    // Build numbered list of bullets
    const bulletList = uncachedBullets
      .map((b, idx) => `${idx + 1}. ${b.text}`)
      .join("\n");

    const prompt = `Refine these resume bullet points to be more impactful and professional.

${contextString ? `Context:\n${contextString}\n` : ""}Input bullet points:
${bulletList}

Return a JSON object with a "results" key containing an array of exactly ${uncachedBullets.length} refined bullet strings.`;

    // Get OpenAI client (lazy initialized at request time)
    const openai = getOpenAIClient();

    // Call OpenAI API with optimized settings
    // Temperature 0.4 for consistent outputs
    // response_format guarantees valid JSON
    // frequency_penalty 0.3 encourages variety across bullets
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert resume writer. Refine bullet points to be action-oriented, quantified with metrics when possible, ATS-friendly, and concise (under 25 words each). Return a JSON object with a "results" array containing the refined bullet strings.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: Math.min(185 * uncachedBullets.length, 2000),
      response_format: { type: "json_object" },
      frequency_penalty: 0.3,
    });

    const responseText = completion.choices[0]?.message?.content?.trim() || "";

    // Parse JSON response - expects { results: [...] } format from response_format
    let refinedTexts: string[];
    try {
      const parsed = JSON.parse(responseText);
      // Handle both { results: [...] } and direct array format for flexibility
      refinedTexts = Array.isArray(parsed) ? parsed : (parsed.results || []);

      if (!Array.isArray(refinedTexts)) {
        throw new Error("Response does not contain a valid results array");
      }

      // Ensure we have the right number of results
      if (refinedTexts.length !== uncachedBullets.length) {
        console.warn(
          `OpenAI returned ${refinedTexts.length} results for ${uncachedBullets.length} bullets`
        );
        // Pad or truncate as needed
        while (refinedTexts.length < uncachedBullets.length) {
          refinedTexts.push(uncachedBullets[refinedTexts.length].text);
        }
        refinedTexts = refinedTexts.slice(0, uncachedBullets.length);
      }
    } catch (parseError) {
      console.error("Failed to parse OpenAI batch response:", parseError);
      console.error("Response was:", responseText);

      // Fallback: return original texts with error
      for (const bullet of uncachedBullets) {
        results[bullet.originalIndex] = {
          refinedText: bullet.text,
          fromCache: false,
          error: "Failed to parse AI response",
        };
      }
      return NextResponse.json({
        results,
        rateLimit: { limit, remaining, reset },
      });
    }

    // Map refined texts back to original positions and cache them
    for (let i = 0; i < uncachedBullets.length; i++) {
      const bullet = uncachedBullets[i];
      const refinedText =
        typeof refinedTexts[i] === "string" ? refinedTexts[i].trim() : bullet.text;

      results[bullet.originalIndex] = {
        refinedText,
        fromCache: false,
      };

      // Cache the individual refined bullet
      await setCachedRefinement(bullet.cacheKey, refinedText);
    }

    return NextResponse.json({
      results,
      rateLimit: { limit, remaining, reset },
    });
  } catch (error) {
    console.error("Error in batch bullet refinement:", error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to refine bullet points" },
      { status: 500 }
    );
  }
}
