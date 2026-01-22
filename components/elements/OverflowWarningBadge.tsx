"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface OverflowWarningBadgeProps {
  /** Current fill percentage of the container */
  percentage: number;
  /** Whether content is actually overflowing (>100%) */
  isOverflowing?: boolean;
}

/**
 * A subtle warning badge that appears when resume content approaches
 * or exceeds the page boundary.
 * 
 * Design:
 * - Small pill/badge positioned at bottom-right of preview
 * - Amber/warning colors that work with the dark theme
 * - Smooth fade-in animation
 * - Shows "Page limit" warning with optional percentage
 * 
 * @param percentage - Current fill percentage (for display)
 * @param isOverflowing - True when content exceeds container bounds
 */
export const OverflowWarningBadge = ({
  percentage,
  isOverflowing = false,
}: OverflowWarningBadgeProps) => {
  return (
    <div
      className={`
        absolute bottom-3 right-3 z-10
        flex items-center gap-1.5
        px-2.5 py-1.5
        rounded-full
        text-[0.65rem] font-medium
        backdrop-blur-sm
        shadow-lg
        animate-in fade-in duration-300
        ${
          isOverflowing
            ? "bg-red-500/20 text-red-300 border border-red-500/30"
            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
        }
      `}
      role="status"
      aria-live="polite"
      aria-label={
        isOverflowing
          ? "Content is overflowing the page"
          : "Content is nearing page limit"
      }
    >
      <AlertTriangle
        className={`w-3 h-3 ${isOverflowing ? "text-red-400" : "text-amber-400"}`}
      />
      <span>
        {isOverflowing ? "Overflowing" : "Near limit"}
        <span className="ml-1 opacity-70">({percentage}%)</span>
      </span>
    </div>
  );
};
