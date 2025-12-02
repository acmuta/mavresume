"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { PlaceholderPreview } from "./PlaceholderPreview";

export const TechnicalSkillsPreview = () => {
  const resume = useResumeStore();

  if (
    !resume.skills.languagesList.length ||
    !resume.skills.technologiesList.length
  ) {
    return (
      <PlaceholderPreview
        height="h-1/10"
        description="Select Skills to Display!"
      />
    );
  }
  return (
    <div className="w-full flex flex-col ">
      <h1 className="border-b text-[2em] font-bold">Technical Skills</h1>
      <div className="flex flex-wrap items-center mt-1">
        <h2 className="font-bold text-[1.3em] mr-1">Languages:</h2>
        {resume.skills.languagesList.map((lang, index) => (
          <p key={index} className="text-[1.2em] mr-1">
            {lang}
            {index !== resume.skills.languagesList.length - 1 ? ", " : ""}
          </p>
        ))}
      </div>
      <div className="flex flex-wrap items-center mt-1">
        <h2 className="font-bold text-[1.3em] mr-1">Technologies:</h2>
        {resume.skills.technologiesList.map((tech, index) => (
          <p key={index} className="text-[1.2em] mr-1">
            {tech}
            {index !== resume.skills.technologiesList.length - 1 ? ", " : ""}
          </p>
        ))}
      </div>
    </div>
  );
};
