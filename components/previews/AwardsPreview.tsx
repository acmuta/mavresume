"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";

export const AwardsPreview = () => {
  const resume = useResumeStore();
  const headingStyle: React.CSSProperties = {
    fontSize: "var(--resume-heading-size)",
    fontWeight: "var(--resume-heading-weight)",
  };

  return (
    <div className="w-full flex flex-col gap-1">
      <h1 className="border-b" style={headingStyle}>
        Awards
      </h1>
      {resume.awards.map((entry, index) => (
        <p
          key={index}
          className="pl-1"
          style={{ fontSize: "var(--resume-body-size)" }}
        >
          • {entry.title || "Award"}
          {entry.issuer ? `, ${entry.issuer}` : ""}
          {entry.date ? ` (${entry.date})` : ""}
        </p>
      ))}
    </div>
  );
};
