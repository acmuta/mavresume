"use client";
import React, { useState } from "react";
import { ArrowUpDown, Edit3 } from "lucide-react";
import { Button } from "../../ui/button";
import { SectionManagerModal } from "./SectionManagerModal";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

/**
 * Button component that opens the section management modal.
 * Matches styling of other header buttons (ResumeDocPreview, ResumeDocDownloadButton).
 */
export const SectionReorderButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-10 w-10 rounded-full border border-transparent text-[#6d7895] transition-all hover:border-[#2b3242] hover:bg-[#161b25] hover:text-white"
          aria-label="Manage sections"
          onClick={() => setIsOpen(true)}
        >
            <Edit3 className="w-7 h-7" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Manage sections</p>
        </TooltipContent>
      </Tooltip>
      <SectionManagerModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};
