"use client";
import React, { useEffect } from "react";
import { MobileResumePreviewDrawer } from "./MobileResumePreviewDrawer";
import { useRateLimitStore } from "@/store/useRateLimitStore";

function formatResetsIn(resetMs: number): string | null {
  const remainingMs = resetMs - Date.now();
  if (remainingMs <= 0) return null;
  if (remainingMs >= 60_000) return `Resets in ${Math.ceil(remainingMs / 60_000)}m`;
  return `Resets in ${Math.ceil(remainingMs / 1000)}s`;
}

export const BuilderHeaderBar = () => {
  const { limit, remaining, reset, load } = useRateLimitStore();

  useEffect(() => {
    load();
  }, [load]);

  const resetTimeStr = formatResetsIn(reset);
  const textColor =
    limit > 0 && remaining <= Math.ceil(limit * 0.1) ? "text-amber-400" : "";

  return (
    <div className="w-full fixed top-0 left-0 z-20 h-[8vh] md:ml-25 border-b bg-[#15171c]/90 border-[#2d313a] backdrop-blur-md">
      <div className="flex h-full items-center justify-between gap-4 px-5">
        <div className="flex w-full mr-[44vw] pr-25 items-center justify-between gap-4">
          <div
            className="font-bold tracking-tight text-2xl 
                mask-[linear-gradient(to_bottom,black_40%,transparent)] 
                mask-size-[100%_100%] mask-no-repeat pointer-events-none"
          >
            RESUME<span className="font-extralight">BUILDER</span>
          </div>
          {limit > 0 && (
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#2b3242] bg-[#1a1d24]/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.05em] backdrop-blur-sm ${textColor}`}
              title={`Rate limit: ${remaining} of ${limit} refinements remaining`}
              aria-label={`${remaining} of ${limit} refinements remaining${resetTimeStr ? `, ${resetTimeStr}` : ""}`}
            >
              <span className="text-[#cfd3e1] tabular-nums">
                {remaining}/{limit}
              </span>
              <span className="text-[#6d7895]">refinements remaining</span>
              {resetTimeStr && (
                <span className="text-[#6d7895]">- {resetTimeStr}</span>
              )}
            </div>
          )}
        </div>
        {/* Mobile Preview Button */}
        <div className="block md:hidden">
          <MobileResumePreviewDrawer />
        </div>
      </div>
    </div>
  );
};
