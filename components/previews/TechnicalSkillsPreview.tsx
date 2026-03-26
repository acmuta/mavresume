"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { Skeleton } from "../ui/skeleton";

export const TechnicalSkillsPreview = () => {
  const resume = useResumeStore();
  const sectionHeadingStyle: React.CSSProperties = {
    fontSize: "var(--resume-heading-size)",
    fontWeight: "var(--resume-heading-weight)",
  };

  return (
    <div className="w-full flex flex-col ">
      <h1 className="border-b" style={sectionHeadingStyle}>
        Technical Skills
      </h1>
      <div className="flex flex-wrap items-center mt-1">
        <h2 className="font-bold mr-1" style={{ fontSize: "var(--resume-label-size)" }}>
          Languages:
        </h2>
        {resume.skills.languagesList.length > 0 ? (
          resume.skills.languagesList.map((lang, index) => (
            <p key={index} className="mr-1" style={{ fontSize: "var(--resume-body-size)" }}>
              {lang}
              {index !== resume.skills.languagesList.length - 1 ? ", " : ""}
            </p>
          ))
        ) : (
          <>
            <Skeleton className="h-[1.2em] w-16 mr-1" />
            <Skeleton className="h-[1.2em] w-20 mr-1" />
            <Skeleton className="h-[1.2em] w-14 mr-1" />
            <Skeleton className="h-[1.2em] w-18 mr-1" />
            <Skeleton className="h-[1.2em] w-16 mr-1" />
          </>
        )}
      </div>
      <div className="flex flex-wrap items-center mt-1">
        <h2 className="font-bold mr-1" style={{ fontSize: "var(--resume-label-size)" }}>
          Technologies:
        </h2>
        {resume.skills.technologiesList.length > 0 ? (
          resume.skills.technologiesList.map((tech, index) => (
            <p key={index} className="mr-1" style={{ fontSize: "var(--resume-body-size)" }}>
              {tech}
              {index !== resume.skills.technologiesList.length - 1 ? ", " : ""}
            </p>
          ))
        ) : (
          <>
            <Skeleton className="h-[1.2em] w-20 mr-1" />
            <Skeleton className="h-[1.2em] w-24 mr-1" />
            <Skeleton className="h-[1.2em] w-18 mr-1" />
            <Skeleton className="h-[1.2em] w-22 mr-1" />
            <Skeleton className="h-[1.2em] w-20 mr-1" />
          </>
        )}
      </div>
    </div>
  );
};
