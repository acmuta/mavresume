"use client";
import React from "react";
import { Square } from "lucide-react";
import { Button } from "../../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

interface ResumeBorderToggleButtonProps {
  showBorder: boolean;
  onToggle: () => void;
}

/**
 * Button component that toggles the border on the resume preview.
 * Matches styling of other header buttons (SectionReorderButton, ResumeDocPreview, ResumeDocDownloadButton).
 */
export const ResumeBorderToggleButton = ({
  showBorder,
  onToggle,
}: ResumeBorderToggleButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className={`h-10 w-10 rounded-full transition-all ${
            showBorder
              ? "border border-[#4b5a82] bg-[#161b25] text-white"
              : "border border-transparent text-[#6d7895] hover:border-[#2b3242] hover:bg-[#161b25] hover:text-white"
          }`}
          aria-label="Toggle border"
          onClick={onToggle}
        >
          <Square className="w-7 h-7" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle border</p>
      </TooltipContent>
    </Tooltip>
  );
};
