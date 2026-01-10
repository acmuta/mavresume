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
    <div className="w-full h-full flex items-center justify-center p-3 ">
      
      <section
        className="flex flex-col gap-2 
             w-[clamp(20rem,37vw,35rem)] 
             aspect-[1.1/1.414] text-white scale-115
             px-4 py-4 text-[0.48vw]
             overflow-hidden "
      >

        <PersonalInfoPreview />
        <EducationPreview />
        <TechnicalSkillsPreview />
        <ProjectsPreview />
        <ExperiencePreview />
      </section>
    </div>
  );
};
