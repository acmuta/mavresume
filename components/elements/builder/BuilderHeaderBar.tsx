"use client";

import React from "react";
import { Loader2, Check, AlertCircle, Cloud } from "lucide-react";
import { MobileResumePreviewDrawer } from "../resume/MobileResumePreviewDrawer";
import { MobileSidebar } from "./MobileSidebar";
import { RateLimitStatus } from "../refinement/RateLimitStatus";
import { useResumeStore } from "@/store/useResumeStore";

const SaveStatusIndicator: React.FC = () => {
  const { saveStatus, currentResumeId } = useResumeStore();

  if (!currentResumeId) {
    return null;
  }

  const statusConfig = {
    idle: {
      icon: <Cloud className="h-4 w-4 text-[#6d7895]" />,
      text: "Auto-save",
      className: "text-[#6d7895]",
    },
    saving: {
      icon: <Loader2 className="h-4 w-4 animate-spin text-[#89a5ff]" />,
      text: "Saving",
      className: "text-[#89a5ff]",
    },
    saved: {
      icon: <Check className="h-4 w-4 text-[#58f5c3]" />,
      text: "Saved",
      className: "text-[#58f5c3]",
    },
    error: {
      icon: <AlertCircle className="h-4 w-4 text-red-400" />,
      text: "Save failed",
      className: "text-red-400",
    },
  } as const;

  const config = statusConfig[saveStatus];

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-[#2b3242] bg-[#10121a]/80 px-3 py-1.5 text-xs font-medium ${config.className}`}
    >
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};

export const BuilderHeaderBar = () => {
  return (
    <div className="fixed inset-x-0 top-0 z-30 px-3 py-3 md:pl-[7.25rem] md:pr-5 xl:px-6 xl:pl-[7.5rem]">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 rounded-full border border-[#2b3242] bg-[#0f1117]/82 px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex md:hidden">
            <MobileSidebar />
          </div>

          <div>
            <p className="font-bold tracking-tight text-xl sm:text-2xl [mask-image:linear-gradient(to_bottom,black_40%,transparent)] [mask-repeat:no-repeat] [mask-size:100%_100%]">
              RESUME<span className="font-extralight">BUILDER</span>
            </p>
            <p className="hidden text-[11px] uppercase tracking-[0.22em] text-[#6d7895] sm:block">
              Guided editing workspace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 lg:flex">
            <SaveStatusIndicator />
            <RateLimitStatus />
          </div>

          <div className="flex lg:hidden">
            <MobileResumePreviewDrawer />
          </div>
        </div>
      </div>
    </div>
  );
};
