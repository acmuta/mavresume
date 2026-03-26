"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { Skeleton } from "../ui/skeleton";

export const EducationPreview = () => {
  const resume = useResumeStore();
  const sectionHeadingStyle: React.CSSProperties = {
    fontSize: "var(--resume-heading-size)",
    fontWeight: "var(--resume-heading-weight)",
  };

  return (
    <div className="w-full flex flex-col gap-1">
      <h1 className="border-b" style={sectionHeadingStyle}>
        Education
      </h1>
      {resume.education.map((edu, index) => (
        <section key={index} className="flex flex-col">
          <div className="flex justify-between items-center font-bold">
            {edu.school ? (
              <p style={{ fontSize: "var(--resume-subheading-size)" }}>
                {edu.school}
              </p>
            ) : (
              <Skeleton className="h-[2.5em] w-48" />
            )}

            <div style={{ fontSize: "var(--resume-subheading-size)" }}>
              {edu.graduationMonth && edu.graduationYear ? (
                <p>
                  {edu.graduationMonth} {edu.graduationYear}
                </p>
              ) : (
                <Skeleton className="h-[2.5em] w-24" />
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex">
              {edu.degree || edu.major ? (
                <p style={{ fontSize: "var(--resume-body-size)" }}>
                  {edu.degree && edu.major
                    ? `${edu.degree} In ${edu.major}`
                    : edu.degree || edu.major}
                </p>
              ) : (
                <Skeleton className="h-[2.2em] w-56" />
              )}
            </div>
            <div>
              {edu.includeGPA ? (
                edu.gpa ? (
                  <p style={{ fontSize: "var(--resume-body-size)" }}>
                    GPA: {edu.gpa}
                  </p>
                ) : (
                  <Skeleton className="h-[2.2em] w-20" />
                )
              ) : null}
            </div>
          </div>
        </section>
      ))}
      <div>
        {resume.relevantCourses && (
          <p className="pl-4 -indent-2" style={{ fontSize: "var(--resume-body-size)" }}>
            <span className="font-bold">• Relevant Coursework</span>:{" "}
            {resume.relevantCourses.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};
