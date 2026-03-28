import React from "react";
import { Accordion } from "../../ui/accordion";
import { useResumeStore } from "../../../store/useResumeStore";
import { LeadershipActivitiesAccordionItem } from "./LeadershipActivitiesAccordionItem";

export const LeadershipActivitiesAccordion = () => {
  const { leadershipActivities } = useResumeStore();

  return (
    <Accordion type="single" collapsible defaultValue="Leadership-0">
      {leadershipActivities.map((_, index) => {
        return (
          <LeadershipActivitiesAccordionItem
            key={index}
            index={index}
            entries={leadershipActivities}
          />
        );
      })}
    </Accordion>
  );
};
