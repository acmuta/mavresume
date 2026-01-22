"use client";
import React, { useEffect, useState } from "react";
import { useRateLimitStore } from "@/store/useRateLimitStore";

function formatResetsIn(resetMs: number, asOfMs: number = Date.now()): string | null {
  const remainingMs = resetMs - asOfMs;
  if (remainingMs <= 0) return null;
  return `Resets in ${Math.ceil(remainingMs / 60_000)}m`;
}

/**
 * Returns the appropriate color class for the remaining/limit display.
 * - Green: > 25% remaining (healthy)
 * - Amber: 10-25% remaining (warning)
 * - Red: <= 10% remaining (critical)
 */
function getRemainingColor(remaining: number, limit: number): string {
  if (limit <= 0) return "text-[#cfd3e1]";
  const percentage = (remaining / limit) * 100;
  if (percentage <= 10) return "text-red-400";
  if (percentage <= 25) return "text-amber-300";
  return "";
}

/**
 * Displays the current AI refinement rate limit status.
 * Shows remaining/total refinements with a live countdown to reset.
 * Color-coded: green (healthy), amber (warning at 25%), red (critical at 10%).
 */
export const RateLimitStatus: React.FC = () => {
  const { limit, remaining, reset, load } = useRateLimitStore();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    load();
  }, [load]);

  // Live countdown: tick every second when the rate-limit badge is shown
  useEffect(() => {
    if (limit <= 0) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [limit]);

  const resetTimeStr = formatResetsIn(reset, now);

  if (limit <= 0) {
    return null;
  }

  return (
    <div
      className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#2b3242] bg-[#1a1d24]/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.05em] backdrop-blur-sm"
      title={`Rate limit: ${remaining} of ${limit} refinements remaining`}
      aria-label={`${remaining} of ${limit} refinements remaining${resetTimeStr ? `, ${resetTimeStr}` : ""}`}
    >
      <span className={`tabular-nums ${getRemainingColor(remaining, limit)}`}>
        {remaining}/{limit}
      </span>
      <span className="text-[#6d7895]">refinements remaining</span>
      {resetTimeStr && (
        <span className="text-[#6d7895]">- {resetTimeStr}</span>
      )}
    </div>
  );
};
