"use client";
import { SectionReorderButton } from "./SectionReorderButton";
import { ResumeBorderToggleButton } from "./ResumeBorderToggleButton";
import { ResumeDocPreview } from "./ResumeDocPreview";
import { ResumeDocDownloadButton } from "./ResumeDocDownloadButton";
import { useResumeStore } from "../../store/useResumeStore";

export const ResumePreviewControls = () => {
    const { showBorder, setShowBorder } = useResumeStore()

  return (
    <>
      <SectionReorderButton />
      <ResumeBorderToggleButton
        showBorder={showBorder!}
        onToggle={() => setShowBorder && setShowBorder(!showBorder)}
      />
      <ResumeDocPreview />
      <ResumeDocDownloadButton />
    </>
  );
};


