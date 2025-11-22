"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { PlaceholderPreview } from "./PlaceholderPreview";

export const PersonalInfoPreview = () => {
  const resume = useResumeStore();

  if (!resume.personalInfo.name) {
    return (
      <PlaceholderPreview
        height="h-[70px] mt-2"
        description="Enter Name to Display!"
      />
    );
  }

  return (
    <div className="w-full text-center">
      <div className="">
        <p className="text-[2.5em] font-bold">{resume.personalInfo.name}</p>
      </div>
      <p className="text-[1em]">
        {[
          resume.personalInfo.email,
          resume.personalInfo.phone,
          resume.personalInfo.linkedin,
          resume.personalInfo.github,
        ]
          .filter(Boolean)
          .join(" • ")}
      </p>
    </div>
  );
};
