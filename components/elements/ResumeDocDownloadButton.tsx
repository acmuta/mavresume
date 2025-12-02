"use client";

import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import { ResumeDoc } from "./ResumeDoc";
import { DownloadIcon } from "lucide-react";
import { useResumeStore } from "../../store/useResumeStore";

export const ResumeDocDownloadButton = () => {
  const { personalInfo } = useResumeStore();
  return (
    // <PDFDownloadLink document={<ResumeDoc />} fileName={`${personalInfo.name} - Resume.pdf`}>
    <DownloadIcon className="w-6 h-6 text-gray-500 hover:text-white transition cursor-pointer" />
    // </PDFDownloadLink>
  );
};
