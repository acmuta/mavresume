import React from "react";
import { Accordion } from "../../ui/accordion";
import { useResumeStore } from "../../../store/useResumeStore";
import { ClinicalExperienceAccordionItem } from "./ClinicalExperienceAccordionItem";

export const ClinicalExperienceAccordion = () => {
  const { clinicalExperience } = useResumeStore();

  return (
    <Accordion type="single" collapsible defaultValue="ClinicalExperience-0">
      {clinicalExperience.map((_, index) => (
        <ClinicalExperienceAccordionItem
          key={index}
          index={index}
          entries={clinicalExperience}
        />
      ))}
    </Accordion>
  );
};
