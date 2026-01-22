import { useRateLimitStore } from "@/store/useRateLimitStore";

/**
 * Context passed to AI refinement to improve relevance of generated text.
 * Title and technologies help the AI understand the project/experience context.
 */
interface RefinementContext {
  title?: string;
  technologies?: string[];
}

/**
 * Response from refinement API or client function.
 * Always includes refinedText (falls back to original on error).
 */
interface RefinementResponse {
  refinedText: string;
  error?: string;
}

/**
 * Refines a single bullet point using AI
 * @param bulletText - The original bullet point text to refine
 * @param context - Optional context (title, technologies) to improve refinement
 * @returns Promise with refined text or error message
 */
export async function refineBulletPoint(
  bulletText: string,
  context?: RefinementContext
): Promise<RefinementResponse> {
  if (!bulletText || bulletText.trim().length === 0) {
    return {
      refinedText: bulletText,
      error: "Bullet point cannot be empty",
    };
  }

  try {
    // Call Next.js API route which proxies to OpenAI
    const response = await fetch("/api/refine-bullet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bulletText: bulletText.trim(),
        context: context || {},
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        const limitH = response.headers.get("X-RateLimit-Limit");
        const remainingH = response.headers.get("X-RateLimit-Remaining");
        const resetH = response.headers.get("X-RateLimit-Reset");
        if (limitH != null && remainingH != null && resetH != null) {
          useRateLimitStore.getState().set({
            limit: +limitH,
            remaining: +remainingH,
            reset: +resetH * 1000,
          });
        }
      }
      const errorData = await response.json().catch(() => ({}));
      return {
        refinedText: bulletText,
        error: errorData.error || "Failed to refine bullet point",
      };
    }

    const data = await response.json();
    if (data.rateLimit) {
      useRateLimitStore.getState().set(data.rateLimit);
    }
    return {
      refinedText: data.refinedText || bulletText,
    };
  } catch (error) {
    // Network errors (fetch failures) are caught here
    console.error("Error calling refinement API:", error);
    return {
      refinedText: bulletText,
      error: "Network error. Please check your connection and try again.",
    };
  }
}

/**
 * @deprecated Use refineBulletPointsBatch for better performance.
 * Refines multiple bullet points sequentially (one API call per bullet).
 * Kept for backwards compatibility.
 * 
 * @param bulletPoints - Array of bullet point texts to refine
 * @param context - Optional context (title, technologies) shared across all bullets
 * @returns Promise with array of refined texts or error messages
 */
export async function refineBulletPoints(
  bulletPoints: string[],
  context?: RefinementContext
): Promise<RefinementResponse[]> {
  const results: RefinementResponse[] = [];

  // Refine each bullet point sequentially to avoid rate limits
  // Sequential processing also ensures consistent ordering of results
  for (const bulletText of bulletPoints) {
    const result = await refineBulletPoint(bulletText, context);
    results.push(result);
    
    // Small delay between requests to be respectful to the API
    // Only add delay if processing multiple bullets (skip for single bullet)
    if (bulletPoints.length > 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return results;
}

/**
 * Refines multiple bullet points in a single batch API call.
 * 
 * This is the preferred method for "Refine All" operations as it:
 * - Makes a single OpenAI API call for all bullets (cost efficient)
 * - Checks cache for each bullet individually (reuses cached refinements)
 * - Caches each refined bullet individually (enables future reuse)
 * 
 * @param bulletPoints - Array of bullet point texts to refine
 * @param context - Optional context (title, technologies) shared across all bullets
 * @returns Promise with array of refined texts or error messages
 */
export async function refineBulletPointsBatch(
  bulletPoints: string[],
  context?: RefinementContext
): Promise<RefinementResponse[]> {
  if (!bulletPoints || bulletPoints.length === 0) {
    return [];
  }

  // Filter out empty bullets but track their positions
  const bulletInputs = bulletPoints.map((text) => ({
    text: text || "",
    context,
  }));

  try {
    const response = await fetch("/api/refine-bullets-batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bullets: bulletInputs }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        const limitH = response.headers.get("X-RateLimit-Limit");
        const remainingH = response.headers.get("X-RateLimit-Remaining");
        const resetH = response.headers.get("X-RateLimit-Reset");
        if (limitH != null && remainingH != null && resetH != null) {
          useRateLimitStore.getState().set({
            limit: +limitH,
            remaining: +remainingH,
            reset: +resetH * 1000,
          });
        }
      }
      const errorData = await response.json().catch(() => ({}));
      // Return error for all bullets
      return bulletPoints.map((text) => ({
        refinedText: text,
        error: errorData.error || "Failed to refine bullet points",
      }));
    }

    const data = await response.json();
    if (data.rateLimit) {
      useRateLimitStore.getState().set(data.rateLimit);
    }

    // Map API results back to RefinementResponse format
    const results: RefinementResponse[] = data.results.map(
      (result: { refinedText: string; error?: string }, index: number) => ({
        refinedText: result.refinedText || bulletPoints[index],
        error: result.error,
      })
    );

    return results;
  } catch (error) {
    console.error("Error calling batch refinement API:", error);
    // Return error for all bullets
    return bulletPoints.map((text) => ({
      refinedText: text,
      error: "Network error. Please check your connection and try again.",
    }));
  }
}


