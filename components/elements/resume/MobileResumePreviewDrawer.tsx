"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../../ui/drawer";
import { ResumePreview } from "./ResumePreview";
import { ResumeDocPreview } from "./ResumeDocPreview";
import { ResumeDocDownloadButton } from "./ResumeDocDownloadButton";
import { SectionReorderButton } from "./SectionReorderButton";
import { ResumeBorderToggleButton } from "./ResumeBorderToggleButton";
import { TooltipProvider } from "../../ui/tooltip";
import { EyeIcon } from "lucide-react";
import { Button } from "../../ui/button";


export const MobileResumePreviewDrawer = () => {
   const [showBorder, setShowBorder] = useState(false);
   
  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full px-5 text-[#6d7895] hover:text-white hover:bg-white/10 transition-all"
          aria-label="Preview Resume"
        >
          <EyeIcon className="w-7 h-7 mr-2" />
          <span className="text-sm">Preview</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-[#15171c]/90 backdrop-blur-sm border-t border-[#2d313a] max-h-[90vh]">
        <DrawerHeader className="h-[8vh] px-5 flex items-center justify-between border-b border-[#2d313a]">
          <div
            className="font-bold tracking-tight text-2xl 
                mask-[linear-gradient(to_bottom,black_40%,transparent)] 
                mask-size-[100%_100%] mask-no-repeat pointer-events-none"
          >
            RESUME<span className="font-extralight">PREVIEW</span>
          </div>
          {/* Resume Preview Controls */}
          <TooltipProvider>
            <div className="flex justify-center items-center border rounded-3xl px-1 py-1 gap-1 bg-[#1a1c22] border-[#2d313a]">
              <SectionReorderButton />
              <ResumeBorderToggleButton
                showBorder={showBorder}
                onToggle={() => setShowBorder(!showBorder)}
              />
              <ResumeDocPreview />
              <ResumeDocDownloadButton />
            </div>
          </TooltipProvider>
        </DrawerHeader>
        <div className="w-full h-[calc(90vh-8vh)] overflow-y-auto">
          <ResumePreview />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
