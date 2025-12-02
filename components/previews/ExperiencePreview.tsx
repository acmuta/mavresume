"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { PlaceholderPreview } from "./PlaceholderPreview";
import { Ephesis } from "next/font/google";

export const ExperiencePreview = () => {
  const resume = useResumeStore();

  if (!resume.experience[0].position) {
    return (
      <PlaceholderPreview
        height="h-1/10"
        description="Enter Experience to Display!"
      />
    );
  }
  return (
    <div className="w-full flex flex-col gap-1">
      <h1 className="border-b text-[2em] font-bold">Experience</h1>
      {resume.experience.map((exp, index) => (
        <section key={index} className="flex flex-col">
          <div className="flex justify-between items-center ">
            <p className="text-[1.5em] font-bold">
              {exp.company && `${exp.company} -`} {exp.position}
            </p>

            <div className="text-[1.2em]">
              {exp.startMonth && exp.startYear && (
                <p>
                  {exp.startMonth} {exp.startYear} -{" "}
                  {exp.isCurrent
                    ? "Present"
                    : exp.endMonth && exp.endYear
                    ? `${exp.endMonth} ${exp.endYear}`
                    : " "}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              {exp.bulletPoints.map((point, idx) => (
                <p key={idx} className="text-[1.2em] pl-4 -indent-2">
                  {point && `• ${point}`}
                </p>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};
