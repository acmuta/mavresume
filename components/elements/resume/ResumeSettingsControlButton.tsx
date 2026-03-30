"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";

import { useResumeStore } from "@/store/useResumeStore";

import { Button } from "../../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

export const ResumeSettingsControlButton = () => {
  const { setIsResumeSettingsOpen } = useResumeStore();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-10 w-10 rounded-full border border-transparent text-[#6d7895] transition-all hover:border-[#2b3242] hover:bg-[#161b25] hover:text-white"
          aria-label="Resume settings"
          onClick={() => setIsResumeSettingsOpen(true)}
        >
          <SlidersHorizontal className="h-7 w-7" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Resume Settings</p>
      </TooltipContent>
    </Tooltip>
  );
};
