import React from "react";
import { Accordion } from "../../ui/accordion";
import { useResumeStore } from "../../../store/useResumeStore";
import { EducationAccordionItem } from "./EducationAccordionItem";

export const EducationAccordion = () => {
  const { education } = useResumeStore();

  return (
    <Accordion type="single" collapsible defaultValue="Education-0">
      {education.map((_, index) => {
        return (
          <EducationAccordionItem
            key={index}
            index={index}
            education={education}
          />
        );
      })}
    </Accordion>
  );
};
