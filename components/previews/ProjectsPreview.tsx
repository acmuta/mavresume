"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { Skeleton } from "../ui/skeleton";

export const ProjectsPreview = () => {
  const resume = useResumeStore();

  return (
    <div className="w-full flex flex-col gap-1">
      <h1 className="border-b text-[2em] font-bold">Projects</h1>
      {resume.projects.map((proj, index) => (
        <section key={index} className="flex flex-col">
          <div className="flex justify-between items-center ">
            {proj.title ? (
              <p className="text-[1.5em] font-bold">{proj.title}</p>
            ) : (
              <Skeleton className="h-[1.5em] w-48" />
            )}

            <div className="text-[1.2em]">
              {proj.technologies && proj.technologies.length > 0 ? (
                <p>{proj.technologies.join(", ")}</p>
              ) : (
                <div className="flex flex-wrap items-center gap-1">
                  <Skeleton className="h-[1.2em] w-16" />
                  <Skeleton className="h-[1.2em] w-20" />
                  <Skeleton className="h-[1.2em] w-14" />
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              {proj.bulletPoints.map((point, idx) =>
                point ? (
                  <p key={idx} className="text-[1.2em] pl-4 -indent-2">
                    • {point}
                  </p>
                ) : (
                  <Skeleton
                    key={idx}
                    className={`h-[1.2em] pl-4 mt-1 w-5/6`}
                  />
                )
              )}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};
