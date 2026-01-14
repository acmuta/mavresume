"use client";
import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { Skeleton } from "../ui/skeleton";

export const EducationPreview = () => {
  const resume = useResumeStore();

  return (
    <div className="w-full flex flex-col gap-1">
      <h1 className="border-b text-[2em] font-bold">Education</h1>
      {resume.education.map((edu, index) => (
        <section key={index} className="flex flex-col">
          <div className="flex justify-between items-center font-bold">
            {edu.school ? (
              <p className="text-[1.5em]">{edu.school}</p>
            ) : (
              <Skeleton className="h-[2.5em] w-48" />
            )}

            <div className="text-[1.5em]">
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
                <p className="text-[1.2em]">
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
                  <p className="text-[1.2em]">GPA: {edu.gpa}</p>
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
          <p className="text-[1.2em] pl-4 -indent-2">
            <span className="font-bold">• Relevant Coursework</span>:{" "}
            {resume.relevantCourses.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};
