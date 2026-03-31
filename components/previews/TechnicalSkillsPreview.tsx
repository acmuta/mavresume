"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import type { SkillLineKey } from "../../store/useResumeStore";
import { Skeleton } from "../ui/skeleton";

export const TechnicalSkillsPreview = () => {
  const resume = useResumeStore();
  const visibleLines: SkillLineKey[] =
    resume.skills.visibleSkillLines && resume.skills.visibleSkillLines.length > 0
      ? resume.skills.visibleSkillLines
      : ["languages", "technologies"];
  const customEntry = resume.skills.customSkillEntry;

  const skillGroups = [
    {
      key: "languages",
      label: "Languages",
      values: resume.skills.languagesList,
    },
    {
      key: "technologies",
      label: "Technologies",
      values: resume.skills.technologiesList,
    },
    {
      key: "frameworks",
      label: "Frameworks",
      values: resume.skills.frameworksList,
    },
    {
      key: "platforms",
      label: "Platforms",
      values: resume.skills.platformsList,
    },
    {
      key: "custom",
      label: customEntry?.title?.trim() || "Custom Entry",
      values: customEntry?.values ?? [],
    },
  ].filter((group) => visibleLines.includes(group.key as SkillLineKey));

  const sectionHeadingStyle: React.CSSProperties = {
    fontSize: "var(--resume-heading-size)",
    fontWeight: "var(--resume-heading-weight)",
  };

  return (
    <div className="w-full flex flex-col ">
      <h1 className="border-b" style={sectionHeadingStyle}>
        Technical Skills
      </h1>
      {skillGroups.map((group) => (
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
