"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";

import { useResumeStore } from "../../../store/useResumeStore";
import { useContentOverflow } from "../../../lib/hooks/useContentOverflow";
import { OverflowWarningBadge } from "./OverflowWarningBadge";
import {
  computePreviewTypography,
  resolvePdfMarginPaddingPx,
  toPreviewFontFamily,
} from "@/lib/resume/pdfSettings";
import {
  CORE_SECTION_ID,
  getSectionLabelById,
  normalizeSectionId,
} from "@/lib/resume/sections";
import { getPreviewSectionComponent } from "@/lib/resume/sectionRuntimeRegistry";

const BASE_PADDING_PERCENT = 100 / 595.28;
const SECTION_GAP_MAP: Record<string, string> = {
  tight: "0.65em",
  normal: "0.9em",
  relaxed: "1.15em",
};

export const ResumePreview = () => {
  const { sectionOrder, showBorder, pdfSettings } = useResumeStore();

  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { fillPercentage, isNearOverflow, isOverflowing } = useContentOverflow(
    containerRef,
    contentRef,
  );

  const UnknownPreviewSection = ({ id }: { id: string }) => (
    <div className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-amber-100">
      <p className="font-semibold" style={{ fontSize: "var(--resume-heading-size)" }}>
        {getSectionLabelById(id)}
      </p>
      <p style={{ fontSize: "var(--resume-body-size)" }}>
        Section preview is not implemented yet.
      </p>
    </div>
  );

  const normalizedSectionOrder = sectionOrder.map((id) => normalizeSectionId(id));
  const reorderableSections = normalizedSectionOrder.filter(
    (id) => id !== CORE_SECTION_ID,
  );
  const PersonalInfoPreviewComponent = getPreviewSectionComponent(CORE_SECTION_ID);
  const pagePaddingPercent = `${resolvePdfMarginPaddingPx(pdfSettings) * BASE_PADDING_PERCENT}%`;
  const sectionGap =
    SECTION_GAP_MAP[pdfSettings.sectionSpacingDensity] ?? "0.9em";
  const previewTypography = computePreviewTypography(pdfSettings);

  return (
    <div className="flex h-full w-full items-start justify-center px-2 pb-2 pt-1 md:px-3 md:pb-3">
      <motion.section
        ref={containerRef}
        initial={{ opacity: 0, y: 14, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`relative aspect-[1/1.414] w-full max-w-[46rem] overflow-hidden rounded-[1.5rem] border bg-[#111] text-white shadow-[0_24px_60px_rgba(0,0,0,0.28)] transition-all duration-300 ${
          showBorder ? "border-[#2d313a]" : "border-transparent"
        }`}
      >
        <div
          className="absolute inset-0"
          style={{ padding: pagePaddingPercent }}
        >
          <div
            ref={contentRef}
            className="flex flex-col text-[0.44rem] sm:text-[0.5rem] md:text-[0.56rem] xl:text-[0.6rem]"
            style={{
              gap: sectionGap,
              fontSize: `${previewTypography.scale * 100}%`,
              lineHeight: pdfSettings.lineHeight,
              fontFamily: toPreviewFontFamily(pdfSettings),
              ["--resume-heading-size" as string]: `${previewTypography.headingEm}em`,
              ["--resume-subheading-size" as string]: `${previewTypography.subheadingEm}em`,
              ["--resume-label-size" as string]: `${previewTypography.labelEm}em`,
              ["--resume-body-size" as string]: `${previewTypography.bodyEm}em`,
              ["--resume-name-size" as string]: `${previewTypography.nameEm}em`,
              ["--resume-heading-weight" as string]: String(
                pdfSettings.sectionHeadingWeight,
              ),
            }}
          >
            {PersonalInfoPreviewComponent ? <PersonalInfoPreviewComponent /> : null}

            {reorderableSections.map((sectionId) => {
              const SectionComponent = getPreviewSectionComponent(sectionId);
              if (!SectionComponent) {
                return <UnknownPreviewSection key={sectionId} id={sectionId} />;
              }
              return <SectionComponent key={sectionId} />;
            })}
          </div>
        </div>

        {isNearOverflow && (
          <OverflowWarningBadge
            percentage={fillPercentage}
            isOverflowing={isOverflowing}
          />
        )}
      </motion.section>
    </div>
  );
};
