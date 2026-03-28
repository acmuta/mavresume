"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";

export const CaseStudiesPreview = () => {
  const resume = useResumeStore();
  const headingStyle: React.CSSProperties = {
    fontSize: "var(--resume-heading-size)",
    fontWeight: "var(--resume-heading-weight)",
  };

  return (
    <div className="w-full flex flex-col gap-1">
      <h1 className="border-b" style={headingStyle}>
        Case Studies
      </h1>
      {resume.caseStudies.map((entry, index) => (
        <div key={index} className="flex flex-col">
          <p
            className="font-bold"
            style={{ fontSize: "var(--resume-subheading-size)" }}
          >
            {entry.title || "Case Study"}
          </p>
          <p
            className="pl-4 -indent-2"
            style={{ fontSize: "var(--resume-body-size)" }}
          >
            • Problem: {entry.problem}
          </p>
          <p
            className="pl-4 -indent-2"
            style={{ fontSize: "var(--resume-body-size)" }}
          >
            • Approach: {entry.approach}
          </p>
          <p
            className="pl-4 -indent-2"
            style={{ fontSize: "var(--resume-body-size)" }}
          >
            • Outcome: {entry.outcome}
          </p>
        </div>
      ))}
    </div>
  );
};
