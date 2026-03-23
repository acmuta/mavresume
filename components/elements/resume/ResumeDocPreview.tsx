"use client";
import { PDFViewer } from "@react-pdf/renderer";
import React from "react";
import { ResumeDoc } from "./ResumeDoc";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { EyeIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

export const ResumeDocPreview = () => {

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-10 w-10 rounded-full border border-transparent text-[#6d7895] transition-all hover:border-[#2b3242] hover:bg-[#161b25] hover:text-white"
              aria-label="Preview PDF"
            >
              <EyeIcon className="w-7 h-7" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Preview PDF</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="h-[90vh] w-[92vw] max-w-6xl rounded-[2rem] border border-[#2b3242] bg-[#111319]/96 shadow-[0_25px_60px_rgba(3,4,7,0.55)]">
        <div className="w-full h-full p-2">
          <PDFViewer className="w-full h-full rounded-2xl">
            <ResumeDoc />
          </PDFViewer>
        </div>
      </DialogContent>
    </Dialog>
  );
};
