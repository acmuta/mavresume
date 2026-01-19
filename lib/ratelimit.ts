import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { getRedis } from "./redis";

let _limiter: Ratelimit | null | undefined = undefined;

function getLimiter(): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  if (_limiter !== undefined) return _limiter;
  const limit = parseInt(
    process.env.REFINE_RATELIMIT_REQUESTS || "5",
    10
  );
  const window = (process.env.REFINE_RATELIMIT_WINDOW || "1 m") as Duration;
  _limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix: "rl:refine",
  });
  return _limiter;
}

/**
 * Checks the refinement rate limit for the given user ID (Supabase user.id).
 * Uses a sliding window; only requests that would call OpenAI (cache miss) should
 * invoke this. On Redis or Ratelimit errors, fails open (returns success: true).
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
 * Returns the refinement rate limit status for the given user without consuming a token.
 * Uses Ratelimit.getRemaining. On Redis or Ratelimit errors, fails open with a default.
 *
 * @param userId - Supabase user.id (sole identifier).
 * @returns limit, remaining, reset (reset is Unix timestamp in milliseconds).
 */
export async function getRefinementLimitStatus(userId: string): Promise<{
  limit: number;
  remaining: number;
  reset: number;
}> {
  const limiter = getLimiter();
  if (!limiter) return { limit: 60, remaining: 60, reset: 0 };
  try {
    const { limit, remaining, reset } = await limiter.getRemaining(userId);
    return { limit, remaining, reset };
  } catch {
    return { limit: 60, remaining: 60, reset: 0 };
  }
}
