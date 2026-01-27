"use client";
import React from "react";
import { Loader2, Check, AlertCircle, Cloud } from "lucide-react";
import { MobileResumePreviewDrawer } from "../resume/MobileResumePreviewDrawer";
import { RateLimitStatus } from "../refinement/RateLimitStatus";
import { useResumeStore } from "@/store/useResumeStore";

/**
 * Save status indicator component.
 * Displays the current save state with appropriate icon and text.
 */
const SaveStatusIndicator: React.FC = () => {
  const { saveStatus, currentResumeId } = useResumeStore();

  // Don't show indicator if no resume is loaded
  if (!currentResumeId) {
    return null;
  }

  const statusConfig = {
    idle: {
      icon: <Cloud className="w-4 h-4 text-[#6d7895]" />,
      text: "Auto-save enabled",
      className: "text-[#6d7895]",
    },
    saving: {
      icon: <Loader2 className="w-4 h-4 animate-spin text-[#6d7895]" />,
      text: "Saving...",
      className: "text-[#6d7895]",
    },
    saved: {
      icon: <Check className="w-4 h-4 text-[#274cbc]" />,
      text: "Saved",
      className: "text-[#274cbc]",
    },
    error: {
      icon: <AlertCircle className="w-4 h-4 text-red-400" />,
      text: "Save failed",
      className: "text-red-400",
    },
  };

  const config = statusConfig[saveStatus];

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border border-[#2b3242] bg-[#1a1d24]/80 px-3 py-1 text-xs ${config.className}`}
    >
      {config.icon}
      <span className="text-xs font-medium">{config.text}</span>
    </div>
  );
};

export const BuilderHeaderBar = () => {
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
          
          {/* Save Status Indicator */}
          <div className="flex items-center gap-3">
            <SaveStatusIndicator />
            <RateLimitStatus />
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
