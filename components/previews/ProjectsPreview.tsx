"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { PlaceholderPreview } from "./PlaceholderPreview";

export const ProjectsPreview = () => {
  const resume = useResumeStore();

  if (!resume.projects[0].title) {
    return (
      <PlaceholderPreview
        height="h-1/10"
        description="Enter Projects to Display!"
      />
    );
  }
  return (
    <div className="w-full flex flex-col gap-1">
      <h1 className="border-b text-[2em] font-bold">Projects</h1>
      {resume.projects.map((proj, index) => (
        <section key={index} className="flex flex-col">
          <div className="flex justify-between items-center ">
            <p className="text-[1.5em] font-bold">{proj.title}</p>

            <div className="text-[1.2em]">
              <p>{proj.technologies.join(", ")}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              {proj.bulletPoints.map((point, idx) => (
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
