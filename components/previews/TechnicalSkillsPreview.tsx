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
      {[
        { label: "Languages", values: resume.skills.languagesList },
        { label: "Frameworks", values: resume.skills.frameworksList },
        { label: "Tools", values: resume.skills.toolsList },
        { label: "Platforms", values: resume.skills.platformsList },
      ].map((group) => (
        <div key={group.label} className="flex flex-wrap items-center mt-1">
          <h2
            className="font-bold mr-1"
            style={{ fontSize: "var(--resume-label-size)" }}
          >
            {group.label}:
          </h2>
          {group.values.length > 0 ? (
            group.values.map((value, index) => (
              <p
                key={`${group.label}-${value}`}
                className="mr-1"
                style={{ fontSize: "var(--resume-body-size)" }}
              >
                {value}
                {index !== group.values.length - 1 ? ", " : ""}
              </p>
            ))
          ) : (
            <>
              <Skeleton className="h-[1.2em] w-16 mr-1" />
              <Skeleton className="h-[1.2em] w-20 mr-1" />
              <Skeleton className="h-[1.2em] w-14 mr-1" />
            </>
          )}
        </div>
      ))}
    </div>
  );
};
