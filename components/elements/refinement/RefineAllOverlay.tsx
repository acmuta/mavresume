"use client";

import React from "react";
import { Check, X } from "lucide-react";
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
      <DialogContent className="bg-[#151618] border-[#1c1d21] text-white max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Review Refined Bullet Points
          </DialogTitle>
          <DialogDescription className="text-[#a4a7b5]">
            Compare the original and AI-refined versions. Accept or decline each
            refinement individually, or use the bulk actions below.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {refinements.map((item) => (
            <div
              key={item.index}
              className="rounded-2xl border-[2px] border-[#313339] border-dashed bg-[#1a1d24]/80 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.1em] text-[#89a5ff]">
                  Bullet Point #{item.index + 1}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onAccept(item.index)}
                    className="inline-flex items-center justify-center rounded-xl border border-[#274CBC] bg-[#274CBC] px-3 py-1.5 text-sm text-white transition hover:bg-[#315be1] hover:border-[#315be1]"
                    title="Accept this refinement"
                  >
                    <Check className="mr-1 size-4" />
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => onDecline(item.index)}
                    className="inline-flex items-center justify-center rounded-xl border border-[#2b3242] bg-[#2A2C31] px-3 py-1.5 text-sm text-[#a4a7b5] transition hover:border-[#3f4a67] hover:bg-[#1f2330] hover:text-white"
                    title="Decline this refinement"
                  >
                    <X className="mr-1 size-4" />
                    Decline
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#6d7895]">
                    Original
                  </p>
                  <p className="text-sm text-[#a4a7b5] leading-relaxed">
                    {item.original}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#89a5ff]">
                    AI Refined
                  </p>
                  <p className="text-sm text-[#cfd3e1] leading-relaxed">
                    {item.refined}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#313339]">
          <Button
            onClick={onDeclineAll}
            variant="outline"
            className="border-[#2b3242] bg-[#2A2C31] text-[#a4a7b5] hover:bg-[#1f2330] hover:text-white"
          >
            Decline All
          </Button>
          <Button
            onClick={onAcceptAll}
            className="bg-[#274CBC] hover:bg-[#315be1]"
          >
            Accept All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};





