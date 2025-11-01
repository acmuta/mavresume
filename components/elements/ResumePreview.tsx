import React from "react";
import { PersonalInfoPreview } from "../previews/PersonalInfoPreview";

export const ResumePreview = () => {
  return (
    <section
      className="relative 
             w-[clamp(18rem,35vw,32rem)] 
             aspect-[1/1.414]
             rounded-2xl
             border-[4px] border-[#313339] border-dashed 
             shadow-lg px-[.5rem] py-[.5rem] text-[0.7vw]"
    >
      
      <PersonalInfoPreview />
    </section>
  );
};
