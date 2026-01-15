"use client";
import React, { useState } from "react";
import { ListOrdered } from "lucide-react";
import { Button } from "../ui/button";
import { SectionOrderModal } from "./SectionOrderModal";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

/**
 * Button component that opens the section reordering modal.
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
            aria-label="Reorder sections"
            onClick={() => setIsOpen(true)}
          >
            <ListOrdered className="w-7 h-7" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reorder sections</p>
        </TooltipContent>
      </Tooltip>
      <SectionOrderModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};
