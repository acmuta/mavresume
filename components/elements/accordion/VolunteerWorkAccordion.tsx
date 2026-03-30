import React from "react";
import { Accordion } from "../../ui/accordion";
import { useResumeStore } from "../../../store/useResumeStore";
import { VolunteerWorkAccordionItem } from "./VolunteerWorkAccordionItem";

export const VolunteerWorkAccordion = () => {
  const { volunteerWork } = useResumeStore();

  return (
    <Accordion type="single" collapsible defaultValue="VolunteerWork-0">
      {volunteerWork.map((_, index) => (
        <VolunteerWorkAccordionItem
          key={index}
          index={index}
          entries={volunteerWork}
        />
      ))}
    </Accordion>
  );
};
