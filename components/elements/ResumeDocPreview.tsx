"use client";
import { PDFViewer } from "@react-pdf/renderer";
import React from "react";
import { ResumeDoc } from "./ResumeDoc";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { EyeIcon } from "lucide-react";
import { useResumeStore } from "../../store/useResumeStore";

export const ResumeDocPreview = () => {
  const resumeData = useResumeStore();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full px-5 text-[#6d7895] hover:text-white hover:bg-white/10 transition-all"
          aria-label="Preview PDF"
        >
          <EyeIcon className="w-7 h-7" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1c1d21] border-2 border-dashed border-[#2d313a] rounded-3xl shadow-[0_25px_60px_rgba(3,4,7,0.55)] w-[80vw] h-[90vh]">
        <div className="w-full h-full p-2">
          <PDFViewer className="w-full h-full rounded-2xl">
            <ResumeDoc />
          </PDFViewer>
        </div>
      </DialogContent>
    </Dialog>
  );
};
