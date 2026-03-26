"use client";

import React from "react";
import { EyeIcon } from "lucide-react";

import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from "../../ui/drawer";
import { ResumePreview } from "./ResumePreview";
import { ResumePreviewControls } from "./ResumePreviewControls";
import { TooltipProvider } from "../../ui/tooltip";
import { Button } from "../../ui/button";

export const MobileResumePreviewDrawer = () => {
  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full border border-[#2b3242] px-5 text-[#cfd3e1] transition-all hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
          aria-label="Preview Resume"
        >
          <EyeIcon className="mr-2 h-5 w-5" />
          <span className="text-sm">Preview</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh] border-t border-[#2d313a] bg-[#111319]/94 backdrop-blur-xl">
        <DrawerHeader className="px-4 pb-2 pt-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
                Live preview
              </p>
              <div className="mt-1 text-sm text-[#6d7895]">
                PDF-sized output
              </div>
            </div>
            <TooltipProvider>
              <div className="flex items-center gap-1 rounded-full border border-[#2b3242] bg-[#0f1117]/78 p-1.5">
                <ResumePreviewControls />
              </div>
            </TooltipProvider>
          </div>
        </DrawerHeader>
        <div className="overflow-y-auto px-2 pb-3">
          <div className="rounded-[1.75rem] border border-[#222733] bg-[#0d0f14]/72">
            <ResumePreview />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
