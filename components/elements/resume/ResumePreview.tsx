"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";

import { PersonalInfoPreview } from "../../previews/PersonalInfoPreview";
import { EducationPreview } from "../../previews/EducationPreview";
import { TechnicalSkillsPreview } from "../../previews/TechnicalSkillsPreview";
import { ProjectsPreview } from "../../previews/ProjectsPreview";
import { ExperiencePreview } from "../../previews/ExperiencePreview";
import { useResumeStore } from "../../../store/useResumeStore";
import { useContentOverflow } from "../../../lib/hooks/useContentOverflow";
import { OverflowWarningBadge } from "./OverflowWarningBadge";

const PDF_PAGE_PADDING_PERCENT = `${(32 / 595.28) * 100}%`;

export const ResumePreview = () => {
  const { sectionOrder, showBorder } = useResumeStore();

  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { fillPercentage, isNearOverflow, isOverflowing } = useContentOverflow(
    containerRef,
    contentRef,
  );

  const sectionMap: Record<string, React.ComponentType> = {
    "personal-info": PersonalInfoPreview,
    education: EducationPreview,
    "technical-skills": TechnicalSkillsPreview,
    projects: ProjectsPreview,
    experience: ExperiencePreview,
  };

  const reorderableSections = sectionOrder.filter((id) => id !== "personal-info");

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
          style={{ padding: PDF_PAGE_PADDING_PERCENT }}
        >
          <div
            ref={contentRef}
            className="flex flex-col gap-[0.9em] text-[0.44rem] sm:text-[0.5rem] md:text-[0.56rem] xl:text-[0.6rem]"
          >
            <PersonalInfoPreview />

            {reorderableSections.map((sectionId) => {
              const SectionComponent = sectionMap[sectionId];
              if (!SectionComponent) return null;
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
