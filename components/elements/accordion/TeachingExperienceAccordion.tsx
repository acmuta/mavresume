import React from "react";
import { Accordion } from "../../ui/accordion";
import { useResumeStore } from "../../../store/useResumeStore";
import { TeachingExperienceAccordionItem } from "./TeachingExperienceAccordionItem";

export const TeachingExperienceAccordion = () => {
  const { teachingExperience } = useResumeStore();

  return (
    <Accordion type="single" collapsible defaultValue="TeachingExperience-0">
      {teachingExperience.map((_, index) => (
        <TeachingExperienceAccordionItem
          key={index}
          index={index}
          entries={teachingExperience}
        />
      ))}
    </Accordion>
  );
};
