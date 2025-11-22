import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Combobox } from "../ui/combobox";
import { Project, useResumeStore } from "../../store/useResumeStore";
import { CustomTextField } from "./CustomTextField";
import { projectTechnologies } from "../../data/university-data";

interface ProjectAccordionItemProps {
  index: number;
  projects: Project[];
}

export const ProjectAccordionItem: React.FC<ProjectAccordionItemProps> = ({
  index,
  projects,
}) => {
  const { updateProject } = useResumeStore();
  return (
    <AccordionItem value={`Project-${index}`}>
      <AccordionTrigger className="text-lg flex items-center font-semibold no-underline">
        Project #{index + 1}
        {projects[index]?.title && ` - ${projects[index].title}`}
      </AccordionTrigger>
      <AccordionContent>
        <div className="w-full font-semibold flex gap-4 justify-center items-center">
          <div className="w-9/10 flex flex-col gap-2">
            <div className="flex w-fit flex-col gap-2 items-center">
              <div className="flex w-full gap-2 items-center">
                <label>Project Title:</label>
                <CustomTextField
                  id="text"
                  placeholder="Project Title"
                  value={projects[index].title}
                  onChange={(e) => {
                    updateProject(index, { title: e.target.value });
                  }}
                />
              </div>

              <div className="flex w-full gap-2 items-center">
                <label>Technologies Used:</label>
                <Combobox
                  items={projectTechnologies}
                  placeholder="Selected Technologies..."
                  value={projects[index].technologies}
                  onChange={(selectedItems) => {
                    updateProject(index, {
                      technologies: Array.isArray(selectedItems)
                        ? selectedItems
                        : selectedItems
                        ? [selectedItems]
                        : undefined,
                    });
                  }}
                  multiSelect
                />
              </div>
              <div className="flex w-full gap-2 items-start">
                <label htmlFor="" className="text-lg">Describe the project in bullet points</label>
                
                </div>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
