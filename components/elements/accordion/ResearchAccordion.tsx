import React from "react";
import { Accordion } from "../../ui/accordion";
import { useResumeStore } from "../../../store/useResumeStore";
import { ResearchAccordionItem } from "./ResearchAccordionItem";

export const ResearchAccordion = () => {
  const { research } = useResumeStore();

  return (
    <Accordion type="single" collapsible defaultValue="Research-0">
      {research.map((_, index) => (
        <ResearchAccordionItem key={index} index={index} entries={research} />
      ))}
    </Accordion>
  );
};
