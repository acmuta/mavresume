"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { PlaceholderPreview } from "./PlaceholderPreview";

export const EducationPreview = () => {
  const resume = useResumeStore();

  if (!resume.education[0].school) {
    return (
      <PlaceholderPreview
        height="h-[120px]"
        description="Enter Education to Display!"
      />
    );
  }
  return (
    <div className="w-full flex flex-col gap-1 font-bold">
      <h1 className="border-b text-[2em] ">Education</h1>
      {resume.education.map((edu, index) => (
        <section key={index} className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-bold text-[1rem]">{edu.school}</p>
            <p>{edu.graduationYear}</p>
          </div>
        </section>
      ))}
    </div>
  );
};
