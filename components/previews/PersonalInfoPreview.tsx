"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { Skeleton } from "../ui/skeleton";

export const PersonalInfoPreview = () => {
  const { personalInfo } = useResumeStore();

  const formattedLinkedIn = personalInfo.linkedin
    ? `linkedin.com/in/${personalInfo.linkedin}`
    : null;

  const formattedGitHub = personalInfo.github
    ? `github.com/${personalInfo.github}`
    : null;

  const customContacts = (personalInfo.customContacts || []).filter(
    (contact) => contact.trim() !== ""
  );
  
  const contactMethods = [
    { value: personalInfo.email, width: "w-22" },
    { value: personalInfo.phone, width: "w-20" },
    { value: formattedLinkedIn, width: "w-30" },
    { value: formattedGitHub, width: "w-22" },
    ...customContacts.map((contact) => ({ value: contact, width: "w-24" })),
  ];

  const contactItems = contactMethods.map((method, index) => {
    if (method.value) {
      return <span key={index}>{method.value}</span>;
    }
    return (
      <Skeleton
        key={index}
        className={`h-[1.6em] ${method.width} inline-block`}
      />
    );
  });

  return (
    <div className="w-full text-center mt-2">
      {personalInfo.name ? (
        <p className="text-[2.5em] font-bold">{personalInfo.name}</p>
      ) : (
        <Skeleton className="h-[3.5em] w-3/5 mx-auto mb-3" />
      )}
      <div className="text-[1.2em] flex flex-wrap items-center justify-center gap-1">
        {contactItems.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="mx-1">•</span>}
            {item}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
