import React from "react";
import { Plus, X } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import {
  SkillLineKey,
  Skills,
  useResumeStore,
} from "../../../store/useResumeStore";
import {
  Technologies,
  utaEngineeringCourses,
} from "../../../data/university-data";
import { Combobox } from "../../ui/combobox";
import { Input } from "../../ui/input";

type StandardSkillLine = Exclude<SkillLineKey, "custom">;

type SkillLineConfig = {
  key: StandardSkillLine;
  label: string;
  recommendedTitle: string;
  recommendedDescription: string;
  yourTitle: string;
  placeholder: string;
};

const DEFAULT_VISIBLE_LINES: SkillLineKey[] = ["languages", "technologies"];

const STANDARD_LINE_ORDER: StandardSkillLine[] = [
  "languages",
  "technologies",
  "frameworks",
  "platforms",
];

const SKILL_LINE_CONFIG: SkillLineConfig[] = [
  {
    key: "languages",
    label: "Languages",
    recommendedTitle: "Recommended languages",
    recommendedDescription:
      "Add suggested languages based on the coursework you selected.",
    yourTitle: "Your languages",
    placeholder: "Add languages...",
  },
  {
    key: "technologies",
    label: "Technologies",
    recommendedTitle: "Recommended technologies",
    recommendedDescription:
      "Use course-based recommendations as a starting point.",
    yourTitle: "Your technologies",
    placeholder: "Add technologies...",
  },
  {
    key: "frameworks",
    label: "Frameworks",
    recommendedTitle: "Recommended frameworks",
    recommendedDescription:
      "Use course-based recommendations as a starting point.",
    yourTitle: "Your frameworks",
    placeholder: "Add frameworks...",
  },
  {
    key: "platforms",
    label: "Platforms",
    recommendedTitle: "Recommended platforms",
    recommendedDescription:
      "Use course-based recommendations as a starting point.",
    yourTitle: "Your platforms",
    placeholder: "Add platforms...",
  },
];

const unique = (values: string[]) => Array.from(new Set(values));

export const TechnicalSkillsAccordion = () => {
  const { relevantCourses, skills, addSkills } = useResumeStore();

  const visibleSkillLines =
    skills.visibleSkillLines && skills.visibleSkillLines.length > 0
      ? skills.visibleSkillLines
      : DEFAULT_VISIBLE_LINES;

  const recommendations = (() => {
    const selected = utaEngineeringCourses.filter((course) =>
      relevantCourses?.includes(course.value),
    );

    const allLanguages = unique(selected.flatMap((course) => course.languages));
    const allTechnologies = unique(selected.flatMap((course) => course.tools));

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
      frameworks: allTechnologies.filter(
        (tech) => !skills.frameworksList.includes(tech),
      ),
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

  const getSelectedValues = (line: StandardSkillLine): string[] => {
    if (line === "languages") return skills.languagesList;
    if (line === "technologies") return skills.technologiesList;
    if (line === "frameworks") return skills.frameworksList;
    return skills.platformsList;
  };

  const getCustomValues = (line: StandardSkillLine): string[] => {
    if (line === "languages") return skills.customLanguages || [];
    if (line === "technologies") return skills.customTechnologies || [];
    if (line === "frameworks") return skills.customFrameworks || [];
    return skills.customPlatforms || [];
  };

  const buildPartialUpdate = (
    line: StandardSkillLine,
    values: string[],
  ): Partial<Skills> => {
    if (line === "languages") return { languagesList: values };
    if (line === "technologies") return { technologiesList: values };
    if (line === "frameworks") return { frameworksList: values };
    return { platformsList: values };
  };

  const buildCustomPartialUpdate = (
    line: StandardSkillLine,
    values: string[],
  ): Partial<Skills> => {
    if (line === "languages") return { customLanguages: values };
    if (line === "technologies") return { customTechnologies: values };
    if (line === "frameworks") return { customFrameworks: values };
    return { customPlatforms: values };
  };

  const updateSkills = (partial: Partial<Skills>) => {
    addSkills(partial);
  };

  const addVisibleLine = (line: SkillLineKey) => {
    if (visibleSkillLines.includes(line)) return;

    const nextVisible = [...visibleSkillLines, line];
    updateSkills({
      visibleSkillLines: nextVisible,
      customSkillEntry:
        line === "custom"
          ? {
              title: skills.customSkillEntry?.title || "Custom Entry",
              values: skills.customSkillEntry?.values || [],
              customValues: skills.customSkillEntry?.customValues || [],
            }
          : skills.customSkillEntry,
    });
  };

  const removeVisibleLine = (line: SkillLineKey) => {
    const nextVisible = visibleSkillLines.filter((value) => value !== line);
    updateSkills({
      visibleSkillLines: nextVisible,
      customSkillEntry: line === "custom" ? null : skills.customSkillEntry,
    });
  };

  const getLineItems = (line: StandardSkillLine) => {
    const customValues = getCustomValues(line);
    return [...Technologies, ...customValues.filter((value) => !Technologies.includes(value))];
  };

  const hiddenStandardLines = STANDARD_LINE_ORDER.filter(
    (line) => !visibleSkillLines.includes(line),
  );

  const customSkillEntry = skills.customSkillEntry || {
    title: "Custom Entry",
    values: [],
    customValues: [],
  };

  const customEntryItems = [
    ...Technologies,
    ...skills.languagesList,
    ...skills.technologiesList,
    ...skills.frameworksList,
    ...skills.platformsList,
    ...(customSkillEntry.customValues || []),
  ].filter((value, index, list) => list.indexOf(value) === index);

  const orderedVisibleLines = [
    ...STANDARD_LINE_ORDER.filter((line) => visibleSkillLines.includes(line)),
    ...(visibleSkillLines.includes("custom") ? (["custom"] as SkillLineKey[]) : []),
  ];

  return (
    <div className="grid gap-4">
      <div className="rounded-[1.35rem] bg-[#10121a]/62 p-4 ring-1 ring-inset ring-[#2b3242]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
          Add Optional Lines
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#6d7895]">
          Languages and Technologies are shown by default. Add Frameworks,
          Platforms, or a Custom Entry when you need them.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {hiddenStandardLines.map((line) => {
            const config = SKILL_LINE_CONFIG.find((entry) => entry.key === line);
            if (!config) return null;

            return (
              <button
                key={line}
                onClick={() => addVisibleLine(line)}
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-[#2b3242] bg-[#151923] px-3 py-1.5 text-sm text-[#cfd3e1] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
              >
                <Plus className="h-3.5 w-3.5 text-[#58f5c3]" />
                {config.label}
              </button>
            );
          })}

          {!visibleSkillLines.includes("custom") ? (
            <button
              onClick={() => addVisibleLine("custom")}
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[#2b3242] bg-[#151923] px-3 py-1.5 text-sm text-[#cfd3e1] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
            >
              <Plus className="h-3.5 w-3.5 text-[#58f5c3]" />
              Custom Entry
            </button>
          ) : null}
        </div>
      </div>

      <Accordion
        type="single"
        collapsible
        defaultValue={orderedVisibleLines[0] || "languages"}
      >
        {orderedVisibleLines.map((line) => {
          if (line === "custom") {
            return (
              <AccordionItem key="custom" value="custom">
                <AccordionTrigger className="text-left no-underline">
                  <div className="pr-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
                      {customSkillEntry.title || "Custom Entry"}
                    </p>
                    <p className="mt-2 text-base font-medium text-white">
                      {formatSkillsPreview(customSkillEntry.values || [])}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4">
                    <div className="rounded-[1.35rem] bg-[#10121a]/62 p-4 ring-1 ring-inset ring-[#2b3242]">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
                        Custom entry title
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[#6d7895]">
                        Name this line exactly how you want it to appear on your
                        resume.
                      </p>
                      <Input
                        className="mt-4 h-11 rounded-[0.95rem] border-[#2b3242] bg-[#0f1117]/70 text-white placeholder:text-[#6d7895]"
                        value={customSkillEntry.title}
                        placeholder="e.g. Databases"
                        onChange={(event) =>
                          updateSkills({
                            customSkillEntry: {
                              ...customSkillEntry,
                              title: event.target.value,
                            },
                          })
                        }
                      />
                    </div>

                    <SkillSelector
                      title="Custom entry values"
                      description="Select to add more, or click a selected chip to remove it."
                      items={customEntryItems}
                      selected={customSkillEntry.values || []}
                      placeholder="Add values..."
                      onChange={(val) =>
                        updateSkills({
                          customSkillEntry: {
                            ...customSkillEntry,
                            values: Array.isArray(val) ? val : [val],
                          },
                        })
                      }
                      onCreateItem={(value) => {
                        const currentCustomValues = customSkillEntry.customValues || [];
                        if (currentCustomValues.includes(value)) return;

                        updateSkills({
                          customSkillEntry: {
                            ...customSkillEntry,
                            customValues: [...currentCustomValues, value],
                          },
                        });
                      }}
                      onRemove={(value) =>
                        updateSkills({
                          customSkillEntry: {
                            ...customSkillEntry,
                            values: (customSkillEntry.values || []).filter(
                              (item) => item !== value,
                            ),
                          },
                        })
                      }
                    />

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeVisibleLine("custom")}
                        className="inline-flex items-center gap-1 rounded-full border border-[#2b3242] bg-[#151923] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#cfd3e1] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                        Hide line
                      </button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          }

          const config = SKILL_LINE_CONFIG.find((entry) => entry.key === line);
          if (!config) return null;

          const selectedValues = getSelectedValues(line);
          const recommendedValues = recommendations[line];

          return (
            <AccordionItem key={line} value={line}>
              <AccordionTrigger className="text-left no-underline">
                <div className="pr-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
                    {config.label}
                  </p>
                  <p className="mt-2 text-base font-medium text-white">
                    {formatSkillsPreview(selectedValues)}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4">
                  <SkillBlock
                    title={config.recommendedTitle}
                    description={config.recommendedDescription}
                    items={recommendedValues}
                    onAdd={(value) => {
                      if (selectedValues.includes(value)) return;
                      updateSkills(
                        buildPartialUpdate(line, [...selectedValues, value]),
                      );
                    }}
                  />

                  <SkillSelector
                    title={config.yourTitle}
                    description="Select to add more, or click a selected chip to remove it."
                    items={getLineItems(line)}
                    selected={selectedValues}
                    placeholder={config.placeholder}
                    onChange={(val) =>
                      updateSkills(
                        buildPartialUpdate(
                          line,
                          Array.isArray(val) ? val : [val],
                        ),
                      )
                    }
                    onCreateItem={(value) => {
                      const currentCustom = getCustomValues(line);
                      if (currentCustom.includes(value)) return;
                      updateSkills(
                        buildCustomPartialUpdate(line, [...currentCustom, value]),
                      );
                    }}
                    onRemove={(value) =>
                      updateSkills(
                        buildPartialUpdate(
                          line,
                          selectedValues.filter((item) => item !== value),
                        ),
                      )
                    }
                  />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeVisibleLine(line)}
                      className="inline-flex items-center gap-1 rounded-full border border-[#2b3242] bg-[#151923] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#cfd3e1] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                      Hide line
                    </button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
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
