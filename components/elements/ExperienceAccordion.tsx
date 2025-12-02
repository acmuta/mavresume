import React from "react";
import { Accordion } from "../ui/accordion";
import { useResumeStore } from "../../store/useResumeStore";
import { ExperienceAccordionItem } from "./ExperienceAccordionItem";

export const ExperienceAccordion = () => {
  const { experience } = useResumeStore();
  return (
    <Accordion type="single" collapsible>
      {experience.map((_, index) => {
        return (
          <ExperienceAccordionItem
            key={index}
            index={index}
            experience={experience}
          />
        );
      })}
    </Accordion>
  );
};
