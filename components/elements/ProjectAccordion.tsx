import React from "react";
import { Accordion } from "../ui/accordion";
import { useResumeStore } from "../../store/useResumeStore";
import { ProjectAccordionItem } from "./ProjectAccordionItem";

export const ProjectAccordion = () => {
  const { projects } = useResumeStore();

  return (
    <Accordion type="single" collapsible>
      {projects.map((_, index) => {
        return (
          <ProjectAccordionItem
            key={index}
            index={index}
            projects={projects}
          />
        );
      })}
    </Accordion>
  );
};
