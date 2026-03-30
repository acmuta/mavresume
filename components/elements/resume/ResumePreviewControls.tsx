"use client";
import { useState } from "react";
import { ClipboardCheck } from "lucide-react";

import { SectionReorderButton } from "./SectionReorderButton";
import { ResumeBorderToggleButton } from "./ResumeBorderToggleButton";
import { ResumeDocPreview } from "./ResumeDocPreview";
import { ResumeDocDownloadButton } from "./ResumeDocDownloadButton";
import { ResumeSettingsControlButton } from "./ResumeSettingsControlButton";
import { SubmitReviewModal } from "./SubmitReviewModal";
import { Button } from "../../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { useResumeStore } from "../../../store/useResumeStore";

export const ResumePreviewControls = () => {
  const { showBorder, setShowBorder, personalInfo } = useResumeStore();
  const [showSubmitReviewModal, setShowSubmitReviewModal] = useState(false);

  const builderLabel = personalInfo?.name || undefined;
  const builderFileName = personalInfo?.name
    ? `${personalInfo.name} - Resume.pdf`
    : "Resume.pdf";

  return (
    <>
      <SectionReorderButton />
      <ResumeBorderToggleButton
        showBorder={showBorder!}
        onToggle={() => setShowBorder && setShowBorder(!showBorder)}
      />
      <ResumeSettingsControlButton />
      <ResumeDocPreview />
      <ResumeDocDownloadButton />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-10 w-10 rounded-full border border-[#3153b4] bg-[#274cbc] text-white transition-all hover:bg-[#315be1]"
            aria-label="Submit for review"
            onClick={() => setShowSubmitReviewModal(true)}
          >
            <ClipboardCheck className="h-6 w-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Submit for Review</p>
        </TooltipContent>
      </Tooltip>

      {showSubmitReviewModal && (
        <SubmitReviewModal
          mode="builder"
          builderLabel={builderLabel}
          builderFileName={builderFileName}
          onClose={() => setShowSubmitReviewModal(false)}
          onSubmitted={() => setShowSubmitReviewModal(false)}
        />
      )}
    </>
  );
};
