"use client";

import React from "react";
import { Check, X } from "lucide-react";

interface BulletRefinementPreviewProps {
  refinedText: string;
  originalText: string;
  onAccept: () => void;
  onDecline: () => void;
}

/**
 * Preview box component that displays AI-refined bullet point text.
 * Allows users to review and accept/decline the refinement before it's applied.
 *
 * Styling matches the app's design system: rounded-2xl, dashed borders, dark theme.
 */
export const BulletRefinementPreview: React.FC<
  BulletRefinementPreviewProps
> = ({ refinedText, originalText, onAccept, onDecline }) => {
  return (
    <div className="mt-2 rounded-2xl border-[2px] border-[#313339] border-dashed bg-[#1a1d24]/80 p-3 animate-in fade-in duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.1em] text-[#89a5ff]">
              AI Refined
            </span>
          </div>
          <p className="text-sm text-[#cfd3e1] leading-relaxed">
            {refinedText}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAccept}
            className="inline-flex items-center justify-center rounded-xl border border-[#274CBC] bg-[#274CBC] px-3 py-1.5 text-white transition hover:bg-[#315be1] hover:border-[#315be1]"
            title="Accept refined text"
          >
            <Check className="size-4" />
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="inline-flex items-center justify-center rounded-xl border border-[#2b3242] bg-[#2A2C31] px-3 py-1.5 text-[#a4a7b5] transition hover:border-[#3f4a67] hover:bg-[#1f2330] hover:text-white"
            title="Decline refined text"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
