import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Combobox } from "../ui/combobox";
import {
  degreeData,
  majorData,
  universitiesData,
} from "../../data/university-data";
import { Project, useResumeStore } from "../../store/useResumeStore";

interface ProjectAccordionItemProps {
  index: number;
  projects: Project[];
}

export const ProjectAccordionItem: React.FC<ProjectAccordionItemProps> = ({
  index,
  projects,
}) => {
  return (
    <AccordionItem value={`Project-${index}`}>
      <AccordionTrigger className="text-lg flex items-center font-semibold no-underline">
        Project #{index + 1}
        {projects[index]?.title && ` - ${projects[index].title}`}
      </AccordionTrigger>
      <div className="w-full font-semibold flex gap-4 justify-center items-center">
        <div className="w-9/10 flex flex-col gap-2">
          <div className="flex w-fit flex-wrap gap-2 items-center">
            <label>Project Title:</label>
            {/* <Combobox
              items={universitiesData}
              placeholder="Select University..."
              value={education[index].school}
              onChange={(val) => {
                updateEducation(index, {
                  school: Array.isArray(val) ? val[0] : val,
                });
              }}
            /> */}

            <label>Technologies Used</label>
            {/* <Combobox
              items={["Python", "JavaScript", "TypeScript", "React", "Node.js"]}
              placeholder="Selected Technologies..."
              value={projects[index].technologies}
              onChange={(val) =>
                updateEducation(index, {
                  graduationYear: Array.isArray(val) ? val[0] : val,
                })
              }
            /> */}
          </div>
        </div>
      </div>

      <AccordionContent></AccordionContent>
    </AccordionItem>
  );
};
