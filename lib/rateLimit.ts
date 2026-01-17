import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

/**
 * Initialize Upstash Redis client for rate limiting.
 * Uses REST API which is compatible with Vercel Serverless/Edge runtimes.
 */
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Rate limiter instance using sliding window algorithm.
 * Limits: 20 requests per hour per identifier (IP address or user ID).
 * 
 * Sliding window provides smoother distribution compared to fixed window,
 * preventing hard stops at window boundaries.
 */
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 h"),
  analytics: true,
  prefix: "ratelimit:refine-bullet",
});

/**
 * Extracts IP address from NextRequest, handling various proxy scenarios.
 * Checks X-Forwarded-For header (Vercel) and falls back to direct connection.
 */
function getIpAddress(request: NextRequest): string {
  // Vercel provides X-Forwarded-For header with original client IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0].trim();
  }

  // Fallback to CF-Connecting-IP (Cloudflare) or X-Real-IP
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Last resort: use a default identifier
  // In practice, one of the above headers should always be present in production
  return "unknown";
}

/**
 * Rate limit check result interface.
 */
export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds
}

/**
 * Checks rate limit for a given request.
 * 
 * @param request - Next.js request object
 * @returns Rate limit check result with allowed status and metadata
 * 
 * @example
 * const result = await checkRateLimit(request);
 * if (!result.allowed) {
 *   return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
 * }
 */
export async function checkRateLimit(
  request: NextRequest
): Promise<RateLimitResult> {
  try {
    const identifier = getIpAddress(request);
    
    const result = await ratelimit.limit(identifier);

    return {
      allowed: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    // Fail-closed: if rate limiting fails, deny the request for security
    console.error("Rate limit check failed:", error);
    
    // Return denied status with default values
    return {
      allowed: false,
      limit: 20,
      remaining: 0,
      reset: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    };
  }
}

/**
 * Checks rate limit status without consuming quota (read-only).
 * 
 * IMPORTANT: This function does NOT consume rate limit quota.
 * It reads directly from Redis to get the current sliding window state.
 * 
 * @param request - Next.js request object
 * @returns Rate limit status with limit, remaining, and reset time
 */
export async function getRateLimitStatus(
  request: NextRequest
): Promise<RateLimitResult> {
  try {
    const identifier = getIpAddress(request);
    
    // The @upstash/ratelimit library stores sliding window data in Redis sorted sets
    // Key format: "{prefix}:{identifier}" where prefix is "ratelimit:refine-bullet"
    // We need to read this directly without calling limit() which would increment
    
    // Try to use a read-only Redis query to get the current count
    // The ratelimit library stores requests as timestamps in a sorted set
    const key = `ratelimit:refine-bullet:${identifier}`;
    
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour window
    const windowStart = now - windowMs;
    
    // Count entries in the sliding window (Redis ZCOUNT)
    // This is a read-only operation that doesn't modify data
    const count = await redis.zcount(key, windowStart, now);
    
    const limit = 20;
    const remaining = Math.max(0, limit - count);
    
    // Calculate reset time: oldest entry timestamp + 1 hour
    // If no entries, default to 1 hour from now
    let resetTimestamp = Math.floor(now / 1000) + 3600;
    
    if (count > 0) {
      try {
        // Get the oldest entry (first in sorted set with scores)
        // Returns array where even indices are values, odd are scores
        const oldest = await redis.zrange(key, 0, 0, { withScores: true });
        
        if (oldest && Array.isArray(oldest) && oldest.length >= 2) {
          // oldest[1] is the score (timestamp in milliseconds)
          const oldestTimestamp = oldest[1] as number;
          if (oldestTimestamp && oldestTimestamp > 0) {
            // Reset = oldest timestamp + 1 hour (convert to seconds)
            resetTimestamp = Math.floor((oldestTimestamp + windowMs) / 1000);
          }
        }
      } catch (err) {
        // If we can't read oldest entry, use default reset time
        console.warn("Could not read oldest entry for reset time calculation:", err);
      }
    }
    
    return {
      allowed: remaining > 0,
      limit,
      remaining,
      reset: resetTimestamp,
    };
  } catch (error) {
    // Fail-open: return default values so UI doesn't break
    // The status will be updated from response headers on next refinement request
    console.error("Rate limit status check failed (read-only):", error);
    
    return {
      allowed: true,
      limit: 20,
      remaining: 20, // Assume full quota on error
      reset: Math.floor(Date.now() / 1000) + 3600,
    };
  }
}

/**
 * Creates rate limit headers for HTTP response.
 * 
 * @param result - Rate limit check result
 * @returns Headers object with standard rate limit headers
 */
export function createRateLimitHeaders(result: RateLimitResult): HeadersInit {
  const headers: HeadersInit = {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
  };

  if (!result.allowed) {
    // Calculate retry-after in seconds
    const retryAfter = Math.max(0, result.reset - Math.floor(Date.now() / 1000));
    headers["Retry-After"] = retryAfter.toString();
  }

  return headers;
}
