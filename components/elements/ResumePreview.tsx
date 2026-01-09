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
    <div className="w-full h-full flex justify-center items-center p-6 overflow-auto">
      
      <section
        className="absolute flex flex-col gap-2 
             w-[clamp(20rem,37vw,35rem)] 
             aspect-[1.03/1.414]
             rounded-2xl
             border-2 border-dashed border-[#2d313a]
             bg-[#151618] text-white 
             shadow-[0_20px_60px_rgba(3,4,7,0.4)]
             px-4 py-4 text-[0.48vw]
             overflow-hidden"
      >
        
        <div className="w-32 h-32 bg-[#274cbc]/5 rounded-full blur-3xl pointer-events-none" />

        <PersonalInfoPreview />
        <EducationPreview />
        <TechnicalSkillsPreview />
        <ProjectsPreview />
        <ExperiencePreview />
      </section>
    </div>
  );
};
