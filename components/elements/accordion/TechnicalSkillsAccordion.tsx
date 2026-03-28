import React from "react";
import { Plus } from "lucide-react";

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
import { Combobox } from "../../ui/combobox";

export const TechnicalSkillsAccordion = () => {
  const { relevantCourses, skills, addSkills } = useResumeStore();

  const recommendations = (() => {
    const selected = utaEngineeringCourses.filter((c) =>
      relevantCourses?.includes(c.value),
    );

    const allLanguages = [...new Set(selected.flatMap((c) => c.languages))];
    const allTechnologies = [...new Set(selected.flatMap((c) => c.tools))];

    return {
      languages: allLanguages.filter(
        (lang) => !skills.languagesList.includes(lang),
      ),
      frameworks: allTechnologies.filter(
        (tech) => !skills.frameworksList.includes(tech),
      ),
      tools: allTechnologies.filter((tech) => !skills.toolsList.includes(tech)),
      platforms: allTechnologies.filter(
        (tech) => !skills.platformsList.includes(tech),
      ),
    };
  })();

  const formatSkillsPreview = (list: string[]) => {
    if (!list || list.length === 0) return "None selected";
    const maxVisible = 3;
    if (list.length <= maxVisible) return list.join(", ");
    const visible = list.slice(0, maxVisible).join(", ");
    return `${visible} +${list.length - maxVisible} more`;
  };

  const customLanguages = skills.customLanguages || [];
  const customFrameworks = skills.customFrameworks || [];
  const customTools = skills.customTools || [];
  const customPlatforms = skills.customPlatforms || [];

  const languagesItems = [
    ...Technologies,
    ...customLanguages.filter((lang) => !Technologies.includes(lang)),
  ];

  const frameworksItems = [
    ...Technologies,
    ...customFrameworks.filter((tech) => !Technologies.includes(tech)),
  ];

  const toolsItems = [
    ...Technologies,
    ...customTools.filter((tech) => !Technologies.includes(tech)),
  ];

  const platformsItems = [
    ...Technologies,
    ...customPlatforms.filter((tech) => !Technologies.includes(tech)),
  ];

  return (
    <Accordion type="single" collapsible defaultValue="Languages">
      <AccordionItem value="Languages">
        <AccordionTrigger className="text-left no-underline">
          <div className="pr-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
              Languages
            </p>
            <p className="mt-2 text-base font-medium text-white">
              {formatSkillsPreview(skills.languagesList)}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid gap-4">
            <SkillBlock
              title="Recommended languages"
              description="Add suggested languages based on the coursework you selected."
              items={recommendations.languages}
              onAdd={(lang) =>
                addSkills({
                  languagesList: [...skills.languagesList, lang],
                  frameworksList: skills.frameworksList,
                  toolsList: skills.toolsList,
                  platformsList: skills.platformsList,
                  technologiesList: skills.technologiesList,
                  customLanguages: skills.customLanguages,
                  customTechnologies: skills.customTechnologies,
                  customFrameworks: skills.customFrameworks,
                  customTools: skills.customTools,
                  customPlatforms: skills.customPlatforms,
                })
              }
            />

            <SkillSelector
              title="Your languages"
              description="Select to add more, or click a selected chip to remove it."
              items={languagesItems}
              selected={skills.languagesList}
              placeholder="Add languages..."
              onChange={(val) =>
                addSkills({
                  languagesList: val as string[],
                  frameworksList: skills.frameworksList,
                  toolsList: skills.toolsList,
                  platformsList: skills.platformsList,
                  technologiesList: skills.technologiesList,
                  customLanguages: skills.customLanguages,
                  customTechnologies: skills.customTechnologies,
                  customFrameworks: skills.customFrameworks,
                  customTools: skills.customTools,
                  customPlatforms: skills.customPlatforms,
                })
              }
              onCreateItem={(value) => {
                const currentCustom = skills.customLanguages || [];
                if (!currentCustom.includes(value)) {
                  addSkills({
                    languagesList: skills.languagesList,
                    frameworksList: skills.frameworksList,
                    toolsList: skills.toolsList,
                    platformsList: skills.platformsList,
                    technologiesList: skills.technologiesList,
                    customLanguages: [...currentCustom, value],
                    customTechnologies: skills.customTechnologies,
                    customFrameworks: skills.customFrameworks,
                    customTools: skills.customTools,
                    customPlatforms: skills.customPlatforms,
                  });
                }
              }}
              onRemove={(lang) =>
                addSkills({
                  languagesList: skills.languagesList.filter((l) => l !== lang),
                  frameworksList: skills.frameworksList,
                  toolsList: skills.toolsList,
                  platformsList: skills.platformsList,
                  technologiesList: skills.technologiesList,
                  customLanguages: skills.customLanguages,
                  customTechnologies: skills.customTechnologies,
                  customFrameworks: skills.customFrameworks,
                  customTools: skills.customTools,
                  customPlatforms: skills.customPlatforms,
                })
              }
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="Frameworks">
        <AccordionTrigger className="text-left no-underline">
          <div className="pr-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
              Frameworks
            </p>
            <p className="mt-2 text-base font-medium text-white">
              {formatSkillsPreview(skills.frameworksList)}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid gap-4">
            <SkillBlock
              title="Recommended frameworks"
              description="Use course-based recommendations as a starting point."
              items={recommendations.frameworks}
              onAdd={(tech) =>
                addSkills({
                  languagesList: skills.languagesList,
                  frameworksList: [...skills.frameworksList, tech],
                  toolsList: skills.toolsList,
                  platformsList: skills.platformsList,
                  technologiesList: skills.technologiesList,
                  customLanguages: skills.customLanguages,
                  customTechnologies: skills.customTechnologies,
                  customFrameworks: skills.customFrameworks,
                  customTools: skills.customTools,
                  customPlatforms: skills.customPlatforms,
                })
              }
            />

            <SkillSelector
              title="Your frameworks"
              description="Select to add more, or click a selected chip to remove it."
              items={frameworksItems}
              selected={skills.frameworksList}
              placeholder="Add frameworks..."
              onChange={(val) =>
                addSkills({
                  languagesList: skills.languagesList,
                  frameworksList: val as string[],
                  toolsList: skills.toolsList,
                  platformsList: skills.platformsList,
                  technologiesList: skills.technologiesList,
                  customLanguages: skills.customLanguages,
                  customTechnologies: skills.customTechnologies,
                  customFrameworks: skills.customFrameworks,
                  customTools: skills.customTools,
                  customPlatforms: skills.customPlatforms,
                })
              }
              onCreateItem={(value) => {
                const currentCustom = skills.customFrameworks || [];
                if (!currentCustom.includes(value)) {
                  addSkills({
                    languagesList: skills.languagesList,
                    frameworksList: skills.frameworksList,
                    toolsList: skills.toolsList,
                    platformsList: skills.platformsList,
                    technologiesList: skills.technologiesList,
                    customLanguages: skills.customLanguages,
                    customTechnologies: skills.customTechnologies,
                    customFrameworks: [...currentCustom, value],
                    customTools: skills.customTools,
                    customPlatforms: skills.customPlatforms,
                  });
                }
              }}
              onRemove={(tech) =>
                addSkills({
                  frameworksList: skills.frameworksList.filter(
                    (t) => t !== tech,
                  ),
                  languagesList: skills.languagesList,
                  toolsList: skills.toolsList,
                  platformsList: skills.platformsList,
                  technologiesList: skills.technologiesList,
                  customLanguages: skills.customLanguages,
                  customTechnologies: skills.customTechnologies,
                  customFrameworks: skills.customFrameworks,
                  customTools: skills.customTools,
                  customPlatforms: skills.customPlatforms,
                })
              }
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="Tools">
        <AccordionTrigger className="text-left no-underline">
          <div className="pr-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
              Tools
            </p>
            <p className="mt-2 text-base font-medium text-white">
              {formatSkillsPreview(skills.toolsList)}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid gap-4">
            <SkillBlock
              title="Recommended tools"
              description="Use course-based recommendations as a starting point."
              items={recommendations.tools}
              onAdd={(tool) =>
                addSkills({
                  languagesList: skills.languagesList,
                  frameworksList: skills.frameworksList,
                  toolsList: [...skills.toolsList, tool],
                  platformsList: skills.platformsList,
                  technologiesList: skills.technologiesList,
                  customLanguages: skills.customLanguages,
                  customTechnologies: skills.customTechnologies,
                  customFrameworks: skills.customFrameworks,
                  customTools: skills.customTools,
                  customPlatforms: skills.customPlatforms,
                })
              }
            />

            <SkillSelector
              title="Your tools"
              description="Select to add more, or click a selected chip to remove it."
              items={toolsItems}
              selected={skills.toolsList}
              placeholder="Add tools..."
              onChange={(val) =>
                addSkills({
                  languagesList: skills.languagesList,
                  frameworksList: skills.frameworksList,
                  toolsList: val as string[],
                  platformsList: skills.platformsList,
                  technologiesList: skills.technologiesList,
                  customLanguages: skills.customLanguages,
                  customTechnologies: skills.customTechnologies,
                  customFrameworks: skills.customFrameworks,
                  customTools: skills.customTools,
                  customPlatforms: skills.customPlatforms,
                })
              }
              onCreateItem={(value) => {
                const currentCustom = skills.customTools || [];
                if (!currentCustom.includes(value)) {
                  addSkills({
                    languagesList: skills.languagesList,
                    frameworksList: skills.frameworksList,
                    toolsList: skills.toolsList,
                    platformsList: skills.platformsList,
                    technologiesList: skills.technologiesList,
                    customLanguages: skills.customLanguages,
                    customTechnologies: skills.customTechnologies,
                    customFrameworks: skills.customFrameworks,
                    customTools: [...currentCustom, value],
                    customPlatforms: skills.customPlatforms,
                  });
                }
              }}
              onRemove={(tool) =>
                addSkills({
                  toolsList: skills.toolsList.filter((t) => t !== tool),
                  languagesList: skills.languagesList,
                  frameworksList: skills.frameworksList,
                  platformsList: skills.platformsList,
                  technologiesList: skills.technologiesList,
                  customLanguages: skills.customLanguages,
                  customTechnologies: skills.customTechnologies,
                  customFrameworks: skills.customFrameworks,
                  customTools: skills.customTools,
                  customPlatforms: skills.customPlatforms,
                })
              }
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="Platforms">
        <AccordionTrigger className="text-left no-underline">
          <div className="pr-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
              Platforms
            </p>
            <p className="mt-2 text-base font-medium text-white">
              {formatSkillsPreview(skills.platformsList)}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid gap-4">
            <SkillBlock
              title="Recommended platforms"
              description="Use course-based recommendations as a starting point."
              items={recommendations.platforms}
              onAdd={(platform) =>
                addSkills({
                  languagesList: skills.languagesList,
                  frameworksList: skills.frameworksList,
                  toolsList: skills.toolsList,
                  platformsList: [...skills.platformsList, platform],
                  technologiesList: skills.technologiesList,
                  customLanguages: skills.customLanguages,
                  customTechnologies: skills.customTechnologies,
                  customFrameworks: skills.customFrameworks,
                  customTools: skills.customTools,
                  customPlatforms: skills.customPlatforms,
                })
              }
            />

            <SkillSelector
              title="Your platforms"
              description="Select to add more, or click a selected chip to remove it."
              items={platformsItems}
              selected={skills.platformsList}
              placeholder="Add platforms..."
              onChange={(val) =>
                addSkills({
                  languagesList: skills.languagesList,
                  frameworksList: skills.frameworksList,
                  toolsList: skills.toolsList,
                  platformsList: val as string[],
                  technologiesList: skills.technologiesList,
                  customLanguages: skills.customLanguages,
                  customTechnologies: skills.customTechnologies,
                  customFrameworks: skills.customFrameworks,
                  customTools: skills.customTools,
                  customPlatforms: skills.customPlatforms,
                })
              }
              onCreateItem={(value) => {
                const currentCustom = skills.customPlatforms || [];
                if (!currentCustom.includes(value)) {
                  addSkills({
                    languagesList: skills.languagesList,
                    frameworksList: skills.frameworksList,
                    toolsList: skills.toolsList,
                    platformsList: skills.platformsList,
                    technologiesList: skills.technologiesList,
                    customLanguages: skills.customLanguages,
                    customTechnologies: skills.customTechnologies,
                    customFrameworks: skills.customFrameworks,
                    customTools: skills.customTools,
                    customPlatforms: [...currentCustom, value],
                  });
                }
              }}
              onRemove={(platform) =>
                addSkills({
                  platformsList: skills.platformsList.filter(
                    (p) => p !== platform,
                  ),
                  languagesList: skills.languagesList,
                  frameworksList: skills.frameworksList,
                  toolsList: skills.toolsList,
                  technologiesList: skills.technologiesList,
                  customLanguages: skills.customLanguages,
                  customTechnologies: skills.customTechnologies,
                  customFrameworks: skills.customFrameworks,
                  customTools: skills.customTools,
                  customPlatforms: skills.customPlatforms,
                })
              }
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

function SkillBlock({
  title,
  description,
  items,
  onAdd,
}: {
  title: string;
  description: string;
  items: string[];
  onAdd: (value: string) => void;
}) {
  return (
    <div className="rounded-[1.35rem] bg-[#10121a]/62 p-4 ring-1 ring-inset ring-[#2b3242]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[#6d7895]">
        {description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <button
              key={item}
              onClick={() => onAdd(item)}
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[#2b3242] bg-[#151923] px-3 py-1.5 text-sm text-[#cfd3e1] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
            >
              <Plus className="h-3.5 w-3.5 text-[#58f5c3]" />
              {item}
            </button>
          ))
        ) : (
          <p className="text-sm text-[#6d7895]">
            No recommendations right now.
          </p>
        )}
      </div>
    </div>
  );
}

function SkillSelector({
  title,
  description,
  items,
  selected,
  placeholder,
  onChange,
  onCreateItem,
  onRemove,
}: {
  title: string;
  description: string;
  items: string[];
  selected: string[];
  placeholder: string;
  onChange: (value: string | string[]) => void;
  onCreateItem: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  return (
    <div className="rounded-[1.35rem] bg-[#10121a]/62 p-4 ring-1 ring-inset ring-[#2b3242]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[#6d7895]">
        {description}
      </p>
      <div className="mt-4 grid gap-3">
        <Combobox
          items={items}
          placeholder={placeholder}
          value={selected}
          disableDisplayValue
          onChange={onChange}
          onCreateItem={onCreateItem}
          multiSelect
        />

        <div className="flex min-h-14 flex-wrap gap-2 rounded-[1.15rem] bg-[#0f1117]/58 p-3 ring-1 ring-inset ring-[#24304c]/70">
          {selected.length > 0 ? (
            selected.map((item) => (
              <button
                key={item}
                onClick={() => onRemove(item)}
                type="button"
                className="inline-flex items-center rounded-full border border-[#2b3242] bg-[#151923] px-3 py-1.5 text-sm text-white transition hover:border-[#4b5a82] hover:bg-[#161b25]"
              >
                {item}
              </button>
            ))
          ) : (
            <p className="text-sm text-[#6d7895]">Nothing selected yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
