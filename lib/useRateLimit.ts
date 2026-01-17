import { useState, useEffect, useCallback, useRef } from "react";
import { RateLimitInfo } from "./bulletRefinement";

/**
 * Rate limit state interface.
 */
interface RateLimitState {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds
  isLoading: boolean;
}

/**
 * Custom hook for managing rate limit state and fetching status.
 * 
 * Features:
 * - Fetches rate limit status on mount
 * - Periodic polling every 45 seconds as safety net
 * - Manual update function for immediate updates from response headers
 * - Automatic cleanup on unmount
 * 
 * @returns Rate limit state and update function
 */
export function useRateLimit() {
  const [state, setState] = useState<RateLimitState>({
    limit: 20,
    remaining: 20,
    reset: 0,
    isLoading: true,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fetches current rate limit status from API endpoint.
   */
  const fetchRateLimitStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/rate-limit-status");
      if (response.ok) {
        const data = await response.json();
        setState({
          limit: data.limit || 20,
          remaining: data.remaining ?? 20,
          reset: data.reset || 0,
          isLoading: false,
        });
      } else {
        // On error, keep existing state but mark as loaded
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Failed to fetch rate limit status:", error);
      // On error, keep existing state but mark as loaded
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  /**
   * Updates rate limit state from response headers.
   * Called immediately after refinement requests to get real-time updates.
   */
  const updateFromHeaders = useCallback((rateLimit?: RateLimitInfo) => {
    if (rateLimit) {
      setState({
        limit: rateLimit.limit,
        remaining: rateLimit.remaining,
        reset: rateLimit.reset,
        isLoading: false,
      });
    }
  }, []);

  // Fetch on mount only
  // Note: We don't poll periodically because status updates come from:
  // 1. Response headers after each refinement request (real-time)
  // 2. Manual refetch if needed
  // Polling was removed to avoid consuming quota unnecessarily
  useEffect(() => {
    fetchRateLimitStatus();

    // Cleanup on unmount (no interval to clear, but keeping structure for future use)
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchRateLimitStatus]);

  return {
    ...state,
    updateFromHeaders,
    refetch: fetchRateLimitStatus,
  };
}
