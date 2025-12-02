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
      // Extract error message from API response, fallback to generic error
      const errorData = await response.json().catch(() => ({}));
      return {
        refinedText: bulletText,
        error: errorData.error || "Failed to refine bullet point",
      };
    }

    const data = await response.json();
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
 * Refines multiple bullet points in batch
 * @param bulletPoints - Array of bullet point texts to refine
 * @param context - Optional context (title, technologies) to improve refinement
 * @returns Promise with array of refined texts or error messages
 */
/**
 * Refines multiple bullet points in batch.
 * Processes sequentially (not in parallel) to avoid OpenAI rate limits.
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


