"use client";
import { PDFViewer } from "@react-pdf/renderer";
import React from "react";
import { ResumeDoc } from "./ResumeDoc";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { EyeIcon } from "lucide-react";
import { useResumeStore } from "../../store/useResumeStore";

export const ResumeDocPreview = () => {
  const resumeData = useResumeStore();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <EyeIcon className="w-6 h-6 text-gray-500 hover:text-white transition cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="bg-[#1c1d21] border-[2px] border-[#313339] rounded-2xl shadow-lg w-[80vw] h-[90vh]">
        <div className="w-full h-full p-2">
          <PDFViewer className="w-full h-full rounded-2xl">
            <ResumeDoc />
          </PDFViewer>
        </div>
      </DialogContent>
    </Dialog>
  );
};
