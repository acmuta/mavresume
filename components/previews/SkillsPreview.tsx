"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";

export const SkillsPreview = () => {
  const resume = useResumeStore();
  const headingStyle: React.CSSProperties = {
    fontSize: "var(--resume-heading-size)",
    fontWeight: "var(--resume-heading-weight)",
  };

  return (
    <div className="w-full flex flex-col gap-1">
      <h1 className="border-b" style={headingStyle}>Skills</h1>
      {resume.skillsSection.coreSkills.length > 0 && (
        <p style={{ fontSize: "var(--resume-body-size)" }}>
          {resume.skillsSection.coreSkills.join(", ")}
        </p>
      )}
      {resume.skillsSection.coreSkills.length === 0 && (
        <p style={{ fontSize: "var(--resume-body-size)" }}>No skills added</p>
      )}
    </div>
  );
};
