"use client";
import React, { useRef } from "react";
import { PersonalInfoPreview } from "../../previews/PersonalInfoPreview";
import { EducationPreview } from "../../previews/EducationPreview";
import { TechnicalSkillsPreview } from "../../previews/TechnicalSkillsPreview";
import { ProjectsPreview } from "../../previews/ProjectsPreview";
import { ExperiencePreview } from "../../previews/ExperiencePreview";
import { useResumeStore } from "../../../store/useResumeStore";
import { useContentOverflow } from "../../../lib/hooks/useContentOverflow";
import { OverflowWarningBadge } from "./OverflowWarningBadge";

/**
 * Live resume preview component displayed in builder sidebar.
 *
 * This component:
 * - Composes preview sections in resume order (matches PDF structure)
 * - Renders sections dynamically based on sectionOrder from store
 * - All child preview components read from Zustand store via useResumeStore()
 * - Updates reactively when store changes (form inputs trigger re-renders)
 * - Styled to match A4 aspect ratio (1:1.414 or 210mm:297mm) for accurate preview
 * - Displays overflow warning when content approaches page boundary
 *
 * Data flow: Form input → store update → preview components re-render → UI updates
 */


export const ResumePreview = () => {
  const { sectionOrder, showBorder } = useResumeStore();

  // Refs for overflow detection
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track content overflow relative to container
  const { fillPercentage, isNearOverflow, isOverflowing } = useContentOverflow(
    containerRef,
    contentRef
  );

  // Map section IDs to their preview components
  const sectionMap: Record<string, React.ComponentType> = {
    "personal-info": PersonalInfoPreview,
    "education": EducationPreview,
    "technical-skills": TechnicalSkillsPreview,
    "projects": ProjectsPreview,
    "experience": ExperiencePreview,
  };

  // Get reorderable sections (excluding personal-info which is always first)
  const reorderableSections = sectionOrder.filter(
    (id) => id !== "personal-info"
  );

  return (
    <div className="w-full h-full flex items-center justify-center p-3 ">
      <section
        ref={containerRef}
        className={`relative flex flex-col gap-2
             w-[clamp(20rem,37vw,35rem)]
             aspect-[1/1.414] text-white scale-120
             px-6 py-2 text-[0.9vw] md:text-[0.45vw]
             overflow-hidden border transition-all duration-300 ${
               showBorder ? "border-[#2d313a]" : "border-transparent"
             }`}
      >
        {/* Content wrapper for overflow measurement */}
        <div ref={contentRef} className="flex flex-col gap-2">
          {/* Personal Info is always rendered first */}
          <PersonalInfoPreview />

          {/* Render other sections in the order specified by sectionOrder */}
          {reorderableSections.map((sectionId) => {
            const SectionComponent = sectionMap[sectionId];
            if (!SectionComponent) return null;
            return <SectionComponent key={sectionId} />;
          })}
        </div>

        {/* Overflow warning badge - appears when content approaches page limit */}
        {isNearOverflow && (
          <OverflowWarningBadge
            percentage={fillPercentage}
            isOverflowing={isOverflowing}
          />
        )}
      </section>
    </div>
  );
};
