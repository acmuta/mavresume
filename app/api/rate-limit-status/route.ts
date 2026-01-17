import { NextRequest, NextResponse } from "next/server";
import { getRateLimitStatus } from "@/lib/rateLimit";

/**
 * GET endpoint for checking current rate limit status.
 * 
 * This endpoint provides read-only access to rate limit information
 * for display purposes. Note: This endpoint does consume one rate limit
 * quota check (via getRateLimitStatus), so it should be used sparingly.
 * 
 * Returns current rate limit status including:
 * - limit: Total requests allowed per hour
 * - remaining: Number of requests remaining in current window
 * - reset: Unix timestamp when the rate limit resets
 * 
 * @param request - Next.js request object
 * @returns JSON response with rate limit status
 */
export async function GET(request: NextRequest) {
  try {
    const status = await getRateLimitStatus(request);

    return NextResponse.json({
      limit: status.limit,
      remaining: status.remaining,
      reset: status.reset,
    });
  } catch (error) {
    console.error("Error fetching rate limit status:", error);
    
    // Return default values on error
    return NextResponse.json(
      {
        limit: 20,
        remaining: 20,
        reset: Math.floor(Date.now() / 1000) + 3600,
      },
      { status: 200 } // Return 200 even on error to prevent UI breaking
    );
  }
}
