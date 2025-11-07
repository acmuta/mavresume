import React from "react";
import { PersonalInfoPreview } from "../previews/PersonalInfoPreview";
import { EducationPreview } from "../previews/EducationPreview";

export const ResumePreview = () => {
  return (
    <section
      className="relative flex flex-col gap-2 
             w-[clamp(18rem,35vw,32rem)] 
             aspect-[1/1.414]
             rounded-2xl
             border-[4px] border-[#313339] border-dashed 
             shadow-lg px-[1rem] py-[.5rem] text-[0.6vw]"
    >
      <PersonalInfoPreview />
      <EducationPreview />
    </section>
  );
};
