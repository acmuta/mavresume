import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { getRedis } from "./redis";

let _limiter: Ratelimit | null | undefined = undefined;

function getLimiter(): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  if (_limiter !== undefined) return _limiter;
  const limit = parseInt(
    process.env.REFINE_RATELIMIT_REQUESTS || "20",
    10
  );
  const window = (process.env.REFINE_RATELIMIT_WINDOW || "30 m") as Duration;
  _limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(limit, window),
    prefix: "rl:refine",
  });
  return _limiter;
}

/**
 * Checks the refinement rate limit for the given user ID (Supabase user.id).
 * Uses a fixed window; only requests that would call OpenAI (cache miss) should
 * invoke this. On Redis or Ratelimit errors, fails open (returns success: true).
 * Config: REFINE_RATELIMIT_REQUESTS (default 20), REFINE_RATELIMIT_WINDOW (default "30 m").
 *
 * @param userId - Supabase user.id (sole identifier; no IP or other identity).
 * @returns success, limit, remaining, reset (reset is Unix timestamp in milliseconds).
 */
export async function checkRefinementLimit(userId: string): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const limiter = getLimiter();
  if (!limiter) return { success: true, limit: 0, remaining: 999, reset: 0 };
  try {
    const { success, limit, remaining, reset } = await limiter.limit(userId);
    return { success, limit, remaining, reset };
  } catch {
    return { success: true, limit: 0, remaining: 999, reset: 0 };
  }
}

/**
 * Returns the current refinement rate limit status without consuming.
 * Use for displaying usage to the user or on cache hits.
 * When Redis/limiter is unavailable, returns limit: 0 (treat as unlimited).
 */
export async function getRefinementLimitStatus(userId: string): Promise<{
  limit: number;
  remaining: number;
  reset: number;
}> {
  const limiter = getLimiter();
  if (!limiter) return { limit: 0, remaining: 999, reset: 0 };
  try {
    return await limiter.getRemaining(userId);
  } catch {
    return { limit: 0, remaining: 999, reset: 0 };
  }
}

/**
 * Checks and consumes multiple rate limit credits at once for batch operations.
 * Used by the batch refinement endpoint to consume N credits for N bullets.
 *
 * First checks if enough credits are available, then consumes them all.
 * If not enough credits, returns success: false without consuming any.
 *
 * @param userId - Supabase user.id
 * @param count - Number of credits to consume (e.g., number of bullets to refine)
 * @returns success, limit, remaining, reset (reset is Unix timestamp in milliseconds)
 */
export async function checkRefinementLimitBatch(
  userId: string,
  count: number
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  if (count <= 0) {
    return { success: true, limit: 0, remaining: 999, reset: 0 };
  }

  const limiter = getLimiter();
  if (!limiter) return { success: true, limit: 0, remaining: 999, reset: 0 };

  try {
    // First check if we have enough remaining credits
    const status = await limiter.getRemaining(userId);
    if (status.remaining < count) {
      return {
        success: false,
        limit: status.limit,
        remaining: status.remaining,
        reset: status.reset,
      };
    }

    // Consume credits by calling limit() count times
    // We do this sequentially to ensure accurate counting
    let lastResult = { success: true, limit: 0, remaining: 999, reset: 0 };
    for (let i = 0; i < count; i++) {
      const result = await limiter.limit(userId);
      lastResult = {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
      // If any call fails (shouldn't happen after our check), stop
      if (!result.success) {
        return lastResult;
      }
    }

    return lastResult;
  } catch {
    // Fail open on errors
    return { success: true, limit: 0, remaining: 999, reset: 0 };
  }
}
