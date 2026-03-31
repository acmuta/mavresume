"use client";

import React from "react";
import { Check, Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RefinementItem {
  index: number;
  original: string;
  refined: string;
}

interface RefineAllOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  refinements: RefinementItem[];
  onAccept: (index: number) => void;
  onDecline: (index: number) => void;
  onAcceptAll: () => void;
  onDeclineAll: () => void;
}

/**
 * Overlay dialog that displays all refined bullet points side-by-side.
 * Allows users to review, accept, or decline each refinement individually
 * or use bulk actions to accept/decline all at once.
 */
export const RefineAllOverlay: React.FC<RefineAllOverlayProps> = ({
  isOpen,
  onClose,
  refinements,
  onAccept,
  onDecline,
  onAcceptAll,
  onDeclineAll,
}) => {
  if (refinements.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[82vh] max-w-4xl overflow-y-auto border-[#2b3242] bg-[#10121a]/96 text-white ring-1 ring-inset ring-[#24304c]/70">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight text-white">
            Review Refined Bullet Points
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-[#7f8cab]">
            Compare the original and AI-refined versions. Accept or decline each
            refinement individually, or use the bulk actions below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pr-1">
          {refinements.map((item) => (
            <div
              key={item.index}
              className="rounded-[1.25rem] bg-[#10121a]/62 p-3 ring-1 ring-inset ring-[#2b3242]"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
                  Bullet Point #{item.index + 1}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onAccept(item.index)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#2f5bf2] bg-[#2f5bf2] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-white transition hover:border-[#3d68ff] hover:bg-[#3d68ff]"
                    title="Accept this refinement"
                  >
                    <Check className="size-3.5" />
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => onDecline(item.index)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#2b3242] bg-[#151923] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#c4cbdd] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
                    title="Decline this refinement"
                  >
                    <X className="size-3.5" />
                    Decline
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[1rem] bg-[#0f1117]/58 p-3 ring-1 ring-inset ring-[#24304c]/70">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6d7895]">
                    Original
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#a4a7b5]">
                    {item.original}
                  </p>
                </div>
                <div className="rounded-[1rem] bg-[#11172a]/55 p-3 ring-1 ring-inset ring-[#2f5bf2]/35">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
                    <Sparkles className="size-3.5 text-[#89a5ff]" />
                    AI Refined
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#d6def3]">
                    {item.refined}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#2b3242] pt-3">
          <Button
            onClick={onDeclineAll}
            variant="outline"
            className="rounded-full border-[#2b3242] bg-[#151923] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#c4cbdd] hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
          >
            <X className="mr-1 size-3.5" />
            Decline All
          </Button>
          <Button
            onClick={onAcceptAll}
            className="rounded-full bg-[#2f5bf2] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#3d68ff]"
          >
            <Check className="mr-1 size-3.5 text-[#58f5c3]" />
            Accept All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};





