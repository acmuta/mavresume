"use client";

import { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ResumeDoc } from "./ResumeDoc";
import { Button } from "../ui/button";
import { DownloadIcon } from "lucide-react";
import { useResumeStore } from "../../store/useResumeStore";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const ResumeDocDownloadButton = () => {
  const { personalInfo } = useResumeStore();
  const [isClient, setIsClient] = useState(false);
  
  // Ensure this only renders on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Generate filename: "{Full Name} - Resume.pdf" or "Resume.pdf" if no name
  const fileName = personalInfo.name
    ? `${personalInfo.name} - Resume.pdf`
    : "Resume.pdf";

  // Render a placeholder button during SSR
  if (!isClient) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full px-5 text-[#6d7895] hover:text-white hover:bg-white/10 transition-all"
            aria-label="Download PDF"
            disabled
          >
            <DownloadIcon className="w-7 h-7" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download PDF</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <PDFDownloadLink document={<ResumeDoc />} fileName={fileName}>
          {({ loading }) => (
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full px-5 text-[#6d7895] hover:text-white hover:bg-white/10 transition-all"
              aria-label="Download PDF"
              disabled={loading}
            >
              <DownloadIcon className="w-7 h-7" />
            </Button>
          )}
        </PDFDownloadLink>
      </TooltipTrigger>
      <TooltipContent>
        <p>Download PDF</p>
      </TooltipContent>
    </Tooltip>
  );
};
