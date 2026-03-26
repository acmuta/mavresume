"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";

export const CourseworkPreview = () => {
  const resume = useResumeStore();
  const headingStyle: React.CSSProperties = {
    fontSize: "var(--resume-heading-size)",
    fontWeight: "var(--resume-heading-weight)",
  };

  return (
    <div className="w-full flex flex-col gap-1">
      <h1 className="border-b" style={headingStyle}>Coursework</h1>
      {resume.coursework.map((group, index) => (
        <div key={index} className="mt-1">
          <p className="font-bold" style={{ fontSize: "var(--resume-label-size)" }}>
            {group.category || "Category"}
          </p>
          <p style={{ fontSize: "var(--resume-body-size)" }}>
            {group.courses.join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
}
