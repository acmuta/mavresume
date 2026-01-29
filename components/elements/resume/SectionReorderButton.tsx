"use client";
import React, { useState } from "react";
import { Settings2 } from "lucide-react";
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
            className="rounded-full px-5 text-[#6d7895] hover:text-white hover:bg-white/10 transition-all"
            aria-label="Manage sections"
            onClick={() => setIsOpen(true)}
          >
            <Settings2 className="w-7 h-7" />
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
