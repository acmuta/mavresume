"use client";
import React from "react";
import { Square } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
          className={`rounded-full px-5 transition-all ${
            showBorder
              ? "text-white bg-white/10"
              : "text-[#6d7895] hover:text-white hover:bg-white/10"
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
