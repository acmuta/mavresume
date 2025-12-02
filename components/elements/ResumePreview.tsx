import React from "react";
import { PersonalInfoPreview } from "../previews/PersonalInfoPreview";
import { EducationPreview } from "../previews/EducationPreview";
import { TechnicalSkillsPreview } from "../previews/TechnicalSkillsPreview";
import { ProjectsPreview } from "../previews/ProjectsPreview";
import { ExperiencePreview } from "../previews/ExperiencePreview";

/**
 * Live resume preview component displayed in builder sidebar.
 *
 * This component:
 * - Composes preview sections in resume order (matches PDF structure)
 * - All child preview components read from Zustand store via useResumeStore()
 * - Updates reactively when store changes (form inputs trigger re-renders)
 * - Styled to match A4 aspect ratio for realistic preview
 *
 * Data flow: Form input → store update → preview components re-render → UI updates
 */
export const ResumePreview = () => {
  return (
    <section
      className="relative flex flex-col gap-2 
             w-[clamp(20rem,37vw,35rem)] 
             aspect-[1.03/1.414]
             rounded-2xl
             border-[4px] border-[#313339] border-dashed 
             shadow-lg px-[1rem] py-[1rem] text-[0.48vw] "
    >
      <PersonalInfoPreview />
      <EducationPreview />
      <TechnicalSkillsPreview />
      <ProjectsPreview />
      <ExperiencePreview />
    </section>
  );
};
