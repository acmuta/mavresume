"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";

export const CertificationsPreview = () => {
  const resume = useResumeStore();
  const headingStyle: React.CSSProperties = {
    fontSize: "var(--resume-heading-size)",
    fontWeight: "var(--resume-heading-weight)",
  };

  return (
    <div className="w-full flex flex-col gap-1">
      <h1 className="border-b" style={headingStyle}>Certifications</h1>
      {resume.certifications.map((entry, index) => (
        <p key={index} className="pl-1" style={{ fontSize: "var(--resume-body-size)" }}>
          • {entry.title || "Certification"}
          {entry.issuer ? `, ${entry.issuer}` : ""}
          {entry.date ? ` (${entry.date})` : ""}
        </p>
      ))}
    </div>
  );
}
