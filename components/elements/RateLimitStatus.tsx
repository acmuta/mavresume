"use client";

import React from "react";

interface RateLimitStatusProps {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds
  isLoading?: boolean;
}

/**
 * Formats reset time into human-readable format.
 * Handles timestamps in both seconds and milliseconds, validates input,
 * and caps display at reasonable maximums.
 *
 * @param resetTimestamp - Unix timestamp (seconds or milliseconds) when rate limit resets
 * @returns Formatted string like "2h 15m", "45m", or "30s", or empty string if invalid
 */
function formatResetTime(resetTimestamp: number): string {
  if (!resetTimestamp || resetTimestamp <= 0) {
    return "";
  }

  const nowMs = Date.now();
  const nowSeconds = Math.floor(nowMs / 1000);

  // Detect if timestamp is in milliseconds (>= 1e12) or seconds (< 1e10)
  // Convert to seconds if it looks like milliseconds
  let resetSeconds = resetTimestamp;
  if (resetTimestamp >= 1e12) {
    // Looks like milliseconds, convert to seconds
    resetSeconds = Math.floor(resetTimestamp / 1000);
  } else if (resetTimestamp < 1e9) {
    // Too small to be a valid Unix timestamp (before 2001)
    return "";
  }

  // Calculate seconds until reset
  let secondsUntilReset = Math.max(0, resetSeconds - nowSeconds);

  // Cap at 24 hours to avoid displaying unrealistic values
  const maxDisplaySeconds = 24 * 3600; // 24 hours
  if (secondsUntilReset > maxDisplaySeconds) {
    // If reset time is more than 24 hours away, it's likely invalid
    // Return empty string to hide the reset time
    return "";
  }

  if (secondsUntilReset === 0) {
    return "resets now";
  }

  const hours = Math.floor(secondsUntilReset / 3600);
  const minutes = Math.floor((secondsUntilReset % 3600) / 60);
  const seconds = secondsUntilReset % 60;

  if (hours > 0) {
    return `resets in ${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  } else if (minutes > 0) {
    return `resets in ${minutes}m`;
  } else {
    return `resets in ${seconds}s`;
  }
}

/**
 * Rate limit status badge component.
 * Displays current rate limit usage with remaining requests and reset time.
 *
 * Styled to match BuilderHeaderBar design with dark theme badge.
 *
 * @param limit - Total requests allowed per hour
 * @param remaining - Number of requests remaining
 * @param reset - Unix timestamp when rate limit resets
 * @param isLoading - Whether status is currently being fetched
 */
export const RateLimitStatus: React.FC<RateLimitStatusProps> = ({
  limit,
  remaining,
  reset,
  isLoading = false,
}) => {
  // Don't render if loading and no data yet
  if (isLoading && reset === 0) {
    return null;
  }

  const resetTimeStr = reset > 0 ? formatResetTime(reset) : "";
  const isLow = remaining <= 3; // Warning when 3 or fewer remaining
  const isAtLimit = remaining === 0;

  // Determine text color based on remaining count
  const textColor = isAtLimit
    ? "text-red-400" // Red when at limit
    : isLow
    ? "text-yellow-400" // Yellow warning when low
    : "text-[#89a5ff]"; // Blue accent for normal state

  return (
    <div
      className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#2b3242] 
        bg-[#1a1d24]/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.05em] 
        backdrop-blur-sm ${textColor}`}
      title={`Rate limit: ${remaining} of ${limit} requests remaining per hour`}
    >
      <span className="text-[#cfd3e1]">
        {remaining}/{limit}
      </span>
      <span className="text-[#6d7895]">refinements remaining</span>
      {resetTimeStr && <span className="text-[#6d7895]">- {resetTimeStr}</span>}
    </div>
  );
};
