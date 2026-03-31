"use client";

import React from "react";
import { Check, Sparkles, X } from "lucide-react";

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
> = ({ refinedText, onAccept, onDecline }) => {
  return (
    <div className="mt-2 rounded-[1.25rem] bg-[#10121a]/62 p-3 ring-1 ring-inset ring-[#2b3242] animate-in fade-in duration-200">
      <div className="flex flex-col gap-3">
        <div className="rounded-[1rem] bg-[#11172a]/55 p-3 ring-1 ring-inset ring-[#2f5bf2]/35">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
            <Sparkles className="size-3.5 text-[#58f5c3]" />
            AI Refined
          </span>
          <p className="mt-2 text-sm leading-relaxed text-[#d6def3]">
            {refinedText}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onAccept}
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#2f5bf2] bg-[#2f5bf2] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-white transition hover:border-[#3d68ff] hover:bg-[#3d68ff]"
            title="Accept refined text"
          >
            <Check className="size-3.5 text-[#89a5ff]" />
            Accept
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#2b3242] bg-[#151923] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#c4cbdd] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
            title="Decline refined text"
          >
            <X className="size-3.5" />
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};


