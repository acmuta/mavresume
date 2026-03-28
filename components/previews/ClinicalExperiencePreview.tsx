"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { Skeleton } from "../ui/skeleton";

export const ClinicalExperiencePreview = () => {
  const resume = useResumeStore();
  const sectionHeadingStyle: React.CSSProperties = {
    fontSize: "var(--resume-heading-size)",
    fontWeight: "var(--resume-heading-weight)",
  };

  return (
    <div className="w-full flex flex-col gap-1">
      <h1 className="border-b" style={sectionHeadingStyle}>
        Clinical Experience
      </h1>
      {resume.clinicalExperience.map((entry, index) => (
        <section key={index} className="flex flex-col">
          <div className="flex justify-between items-center ">
            {entry.company || entry.position ? (
              <p
                className="font-bold"
                style={{ fontSize: "var(--resume-subheading-size)" }}
              >
                {entry.company && `${entry.company} -`} {entry.position}
              </p>
            ) : (
              <Skeleton className="h-[1.5em] w-56" />
            )}

            <div style={{ fontSize: "var(--resume-body-size)" }}>
              {entry.startMonth && entry.startYear ? (
                <p>
                  {entry.startMonth} {entry.startYear} -{" "}
                  {entry.isCurrent
                    ? "Present"
                    : entry.endMonth && entry.endYear
                      ? `${entry.endMonth} ${entry.endYear}`
                      : " "}
                </p>
              ) : (
                <Skeleton className="h-[1.2em] w-32" />
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              {entry.bulletPoints.map((point, idx) =>
                point ? (
                  <p
                    key={idx}
                    className="pl-4 -indent-2"
                    style={{ fontSize: "var(--resume-body-size)" }}
                  >
                    • {point}
                  </p>
                ) : (
                  <Skeleton
                    key={idx}
                    className={`h-[1.2em] pl-4 mt-1 ${
                      idx === 0 ? "w-full" : idx === 1 ? "w-5/6" : "w-4/5"
                    }`}
                  />
                ),
              )}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};
