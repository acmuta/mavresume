"use client";

import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import { ResumeDoc } from "./ResumeDoc";
import { Button } from "../ui/button";
import { DownloadIcon } from "lucide-react";
import { useResumeStore } from "../../store/useResumeStore";

export const ResumeDocDownloadButton = () => {
  const { personalInfo } = useResumeStore();
  return (
    // <PDFDownloadLink document={<ResumeDoc />} fileName={`${personalInfo.name} - Resume.pdf`}>
    <Button
      variant="ghost"
      size="icon-sm"
      className="rounded-xl text-[#6d7895] hover:text-white hover:bg-white/10 transition-all"
      aria-label="Download PDF"
    >
      <DownloadIcon className="w-5 h-5" />
    </Button>
    // </PDFDownloadLink>
  );
};
