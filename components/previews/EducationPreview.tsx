"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { PlaceholderPreview } from "./PlaceholderPreview";

export const EducationPreview = () => {
  const resume = useResumeStore();

  if (!resume.education[0].school) {
    return (
      <PlaceholderPreview
        height="h-1/10"
        description="Enter Education to Display!"
      />
    );
  }
  return (
    <div className="w-full flex flex-col gap-1">
      <h1 className="border-b text-[2em] font-bold">Education</h1>
      {resume.education.map((edu, index) => (
        <section key={index} className="flex flex-col">
          <div className="flex justify-between items-center font-bold">
            <p className="text-[1.5em]">{edu.school}</p>

            <div className="text-[1.5em]">
              <p>
                {edu.graduationMonth} {edu.graduationYear}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex">
              <p className="text-[1.2em]">
                {edu.degree && edu.major
                  ? `${edu.degree} In ${edu.major}`
                  : edu.degree || edu.major}
              </p>
            </div>
            <div>
              {edu.includeGPA && edu.gpa && (
                <p className="text-[1.2em]">GPA: {edu.gpa}</p>
              )}
            </div>
          </div>
        </section>
      ))}
      <div>
        {resume.relevantCourses && (
          <p className="text-[1.2em] pl-4 -indent-2">
            <span className="font-bold">• Relevant Coursework</span>:{" "}
            {resume.relevantCourses.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};
