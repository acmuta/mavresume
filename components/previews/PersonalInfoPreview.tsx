"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { PlaceholderPreview } from "./PlaceholderPreview";

export const PersonalInfoPreview = () => {
  const { personalInfo } = useResumeStore();

  if (!personalInfo.name) {
    return (
      <PlaceholderPreview
        height="h-1/10 mt-2"
        description="Enter Name to Display!"
      />
    );
  }
  const formattedLinkedIn = personalInfo.linkedin
    ? `linkedin.com/in/${personalInfo.linkedin}`
    : null;

  const formattedGitHub = personalInfo.github
    ? `github.com/${personalInfo.github}`
    : null;

  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    formattedLinkedIn,
    formattedGitHub,
  ].filter(Boolean);

  return (
    <div className="w-full text-center">
      <p className="text-[2.5em] font-bold">{personalInfo.name}</p>
      <p className="text-[1.2em]">{contactItems.join(" • ")}</p>
    </div>
  );
};
