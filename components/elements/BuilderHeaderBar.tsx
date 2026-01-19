"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Wand2 } from "lucide-react";
import { MobileResumePreviewDrawer } from "./MobileResumePreviewDrawer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const BuilderHeaderBar = () => {
  const [status, setStatus] = useState<{
    limit: number;
    remaining: number;
    reset: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const r = await fetch("/api/rate-limit/refinement", {
        credentials: "include",
      });
      if (r.ok) {
        const d = await r.json();
        setStatus(d);
      } else {
        setStatus(null);
      }
    } catch {
      setStatus(null);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchStatus(true);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [fetchStatus]);

  // Refetch when a refinement completes (single or batch); debounce for batch
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const onRefinement = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fetchStatus(true), 150);
    };
    window.addEventListener("refinement-complete", onRefinement);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("refinement-complete", onRefinement);
    };
  }, [fetchStatus]);

  const tooltipText =
    status && status.reset > 0
      ? `AI bullet refinements left this minute. Resets in ${Math.max(0, Math.ceil((status.reset - Date.now()) / 1000))}s`
      : "AI bullet refinements left this minute";

  return (
    <div className="w-full fixed top-0 left-0 z-20 h-[8vh] md:ml-25 border-b bg-[#15171c]/90 border-[#2d313a] backdrop-blur-md">
      <div className="flex h-full items-center justify-between gap-4 px-5">
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="flex items-center gap-1.5 rounded-lg border border-[#2d313a] bg-[#1a1c22]/80 px-2 py-1 text-sm shrink-0"
                  aria-label={tooltipText}
                >
                  {loading ? (
                    <div
                      className="h-4 w-12 rounded bg-white/5"
                      aria-hidden
                    />
                  ) : status === null ? (
                    <span className="text-[#6d7895]">—</span>
                  ) : (
                    <>
                      <Wand2
                        className="size-3.5 text-[#6d7895] shrink-0"
                        aria-hidden
                      />
                      <span
                        className={
                          status.remaining === 0
                            ? "text-amber-400/90"
                            : "text-[#cfd3e1]"
                        }
                      >
                        {status.remaining} / {status.limit}
                      </span>
                    </>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>{tooltipText}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div
            className="font-bold tracking-tight text-2xl 
                mask-[linear-gradient(to_bottom,black_40%,transparent)] 
                mask-size-[100%_100%] mask-no-repeat pointer-events-none"
          >
            RESUME<span className="font-extralight">BUILDER</span>
          </div>
        </div>
        {/* Mobile Preview Button */}
        <div className="block md:hidden">
          <MobileResumePreviewDrawer />
        </div>
      </div>
    </div>
  );
};
