import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { useResumeStore } from "../../../store/useResumeStore";
import {
  Technologies,
  utaEngineeringCourses,
} from "../../../data/university-data";
import { Plus } from "lucide-react";
import { Combobox } from "../../ui/combobox";

export const TechnicalSkillsAccordion = () => {
  const { relevantCourses, skills, addSkills } = useResumeStore();

  const recommendations = (() => {
    const selected = utaEngineeringCourses.filter((c) =>
      relevantCourses?.includes(c.value)
    );

    const allLanguages = [...new Set(selected.flatMap((c) => c.languages))];
    const allTechnologies = [...new Set(selected.flatMap((c) => c.tools))];

    return {
      languages: allLanguages.filter(
        (lang) => !skills.languagesList.includes(lang)
      ),
      technologies: allTechnologies.filter(
        (tech) => !skills.technologiesList.includes(tech)
      ),
    };
  })();

  const formatSkillsPreview = (list: string[]) => {
    if (!list || list.length === 0) return "";

    const maxVisible = 4;

    if (list.length <= maxVisible) {
      return list.join(", ");
    }

    const visible = list.slice(0, maxVisible).join(", ");
    const remaining = list.length - maxVisible;

    return `${visible} +${remaining} more`;
  };

  // Merge custom items with Technologies list
  const customLanguages = skills.customLanguages || [];
  const customTechnologies = skills.customTechnologies || [];

  const languagesItems = [
    ...Technologies,
    ...customLanguages.filter((lang) => !Technologies.includes(lang)),
  ];

  const technologiesItems = [
    ...Technologies,
    ...customTechnologies.filter((tech) => !Technologies.includes(tech)),
  ];

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="Languages">
        <AccordionTrigger className="text-lg flex items-center font-semibold no-underline">
          Languages{" "}
          {skills.languagesList.length > 0 &&
            `(${formatSkillsPreview(skills.languagesList)})`}
        </AccordionTrigger>
        <AccordionContent>
          <div className="p-4 rounded-2xl border-[2px] border-[#313339] border-dashed ">
            <h2 className="text-xl font-semibold ">
              Your Recommended Languages
            </h2>
            <div className="mt-2 flex flex-wrap gap-2 mb-1">
              {recommendations.languages.length > 0 ? (
                recommendations.languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() =>
                      addSkills({
                        languagesList: [...skills.languagesList, lang],
                        technologiesList: skills.technologiesList,
                        customLanguages: skills.customLanguages,
                        customTechnologies: skills.customTechnologies,
                      })
                    }
                    className="flex items-center px-2 py-1 italic bg-[#282a2f]/20 font-semibold text-white transition hover:border-[#b1b3b6] rounded-2xl border-[2px] border-dashed border-[#41444c]"
                  >
                    <Plus className="inline mr-1 max-w-12" />
                    <span>{lang}</span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-[#51545c]">No recommendations.</p>
              )}
            </div>
            <div className="divider my-1"></div>
            <div className="flex gap-2 h-fit items-center mb-1">
              <label className="font-semibold">
                Your Languages - Select to Add / Click to Remove
              </label>
            </div>
            <div className="w-full p-2 mb-2 h-fit flex flex-wrap bg-[#282a2f]/20 rounded-2xl gap-2 border-[2px] border-[#41444c]">
              <Combobox
                items={languagesItems}
                placeholder="Add languages..."
                value={skills.languagesList}
                disableDisplayValue={true}
                onChange={(val) =>
                  addSkills({
                    languagesList: val as string[],
                    technologiesList: skills.technologiesList,
                    customLanguages: skills.customLanguages,
                    customTechnologies: skills.customTechnologies,
                  })
                }
                onCreateItem={(value) => {
                  const currentCustom = skills.customLanguages || [];
                  if (!currentCustom.includes(value)) {
                    addSkills({
                      languagesList: skills.languagesList,
                      technologiesList: skills.technologiesList,
                      customLanguages: [...currentCustom, value],
                      customTechnologies: skills.customTechnologies,
                    });
                  }
                }}
                multiSelect
              />
              {skills.languagesList.length != 0 &&
                skills.languagesList.map((lang) => (
                  <button
                    key={lang}
                    onClick={() =>
                      addSkills({
                        languagesList: skills.languagesList.filter(
                          (l) => l !== lang
                        ),
                        technologiesList: skills.technologiesList,
                        customLanguages: skills.customLanguages,
                        customTechnologies: skills.customTechnologies,
                      })
                    }
                    className="flex items-center h-fit px-2 py-1 bg-[#282a2f]/50 font-semibold text-white transition border-[#b1b3b6]/20 rounded-2xl border-[2px]"
                  >
                    <span className="">{lang}</span>
                  </button>
                ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Technologies">
        <AccordionTrigger className="text-lg flex items-center font-semibold no-underline">
          Technologies{" "}
          {skills.technologiesList.length > 0 &&
            `(${formatSkillsPreview(skills.technologiesList)})`}
        </AccordionTrigger>
        <AccordionContent>
          <div className="p-4 rounded-2xl border-[2px] border-[#313339] border-dashed ">
            <h2 className="text-xl font-semibold ">
              Your Recommended Technologies
            </h2>
            <div className="mt-2 flex flex-wrap gap-2 mb-1">
              {recommendations.technologies.length > 0 ? (
                recommendations.technologies.map((tech) => (
                  <button
                    key={tech}
                    onClick={() =>
                      addSkills({
                        languagesList: skills.languagesList,
                        technologiesList: [...skills.technologiesList, tech],
                        customLanguages: skills.customLanguages,
                        customTechnologies: skills.customTechnologies,
                      })
                    }
                    className="flex items-center px-2 py-1 italic bg-[#282a2f]/20 font-semibold text-white transition hover:border-[#b1b3b6] rounded-2xl border-[2px] border-dashed border-[#41444c]"
                  >
                    <Plus className="inline mr-1 max-w-12" />
                    <span>{tech}</span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-[#51545c]">No recommendations.</p>
              )}
            </div>
            <div className="divider my-1"></div>
            <div className="flex gap-2 h-fit items-center mb-1">
              <label className="font-semibold">
                Your Technologies - Select to Add / Click to Remove
              </label>
            </div>
            <div className="w-full p-2 mb-2 h-fit flex flex-wrap bg-[#282a2f]/20 rounded-2xl gap-2 border-[2px] border-[#41444c]">
              <Combobox
                items={technologiesItems}
                placeholder="Add Technologies..."
                value={skills.technologiesList}
                disableDisplayValue={true}
                onChange={(val) =>
                  addSkills({
                    languagesList: skills.languagesList,
                    technologiesList: val as string[],
                    customLanguages: skills.customLanguages,
                    customTechnologies: skills.customTechnologies,
                  })
                }
                onCreateItem={(value) => {
                  const currentCustom = skills.customTechnologies || [];
                  if (!currentCustom.includes(value)) {
                    addSkills({
                      languagesList: skills.languagesList,
                      technologiesList: skills.technologiesList,
                      customLanguages: skills.customLanguages,
                      customTechnologies: [...currentCustom, value],
                    });
                  }
                }}
                multiSelect
              />
              {skills.technologiesList.length != 0 &&
                skills.technologiesList.map((tech) => (
                  <button
                    key={tech}
                    onClick={() =>
                      addSkills({
                        technologiesList: skills.technologiesList.filter(
                          (t) => t !== tech
                        ),
                        languagesList: skills.languagesList,
                        customLanguages: skills.customLanguages,
                        customTechnologies: skills.customTechnologies,
                      })
                    }
                    className="flex items-center h-fit px-2 py-1 bg-[#282a2f]/50 font-semibold text-white transition border-[#b1b3b6]/20 rounded-2xl border-[2px]"
                  >
                    <span className="">{tech}</span>
                  </button>
                ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
