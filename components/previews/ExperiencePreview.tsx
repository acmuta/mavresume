"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { Skeleton } from "../ui/skeleton";

export const ExperiencePreview = () => {
  const resume = useResumeStore();
  const sectionHeadingStyle: React.CSSProperties = {
    fontSize: "var(--resume-heading-size)",
    fontWeight: "var(--resume-heading-weight)",
  };

  return (
    <div className="w-full flex flex-col gap-1">
      <h1 className="border-b" style={sectionHeadingStyle}>Experience</h1>
      {resume.experience.map((exp, index) => (
        <section key={index} className="flex flex-col">
          <div className="flex justify-between items-center ">
            {exp.company || exp.position ? (
              <p className="font-bold" style={{ fontSize: "var(--resume-subheading-size)" }}>
                {exp.company && `${exp.company} -`} {exp.position}
              </p>
            ) : (
              <Skeleton className="h-[1.5em] w-56" />
            )}

            <div style={{ fontSize: "var(--resume-body-size)" }}>
              {exp.startMonth && exp.startYear ? (
                <p>
                  {exp.startMonth} {exp.startYear} -{" "}
                  {exp.isCurrent
                    ? "Present"
                    : exp.endMonth && exp.endYear
                    ? `${exp.endMonth} ${exp.endYear}`
                    : " "}
                </p>
              ) : (
                <Skeleton className="h-[1.2em] w-32" />
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              {exp.bulletPoints.map((point, idx) =>
                point ? (
                  <p key={idx} className="pl-4 -indent-2" style={{ fontSize: "var(--resume-body-size)" }}>
                    • {point}
                  </p>
                ) : (
                  <Skeleton
                    key={idx}
                    className={`h-[1.2em] pl-4 mt-1 ${
                      idx === 0 ? "w-full" : idx === 1 ? "w-5/6" : "w-4/5"
                    }`}
                  />
                )
              )}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};
