import { useState } from "react";
import { Plus, X } from "lucide-react";

import { useResumeStore } from "../../store/useResumeStore";
import { CustomSectionTitle } from "../elements/form/CustomSectionTitle";

export function SkillsSection() {
  const { skillsSection, updateSkillsSection } = useResumeStore();
  const [coreSkillInput, setCoreSkillInput] = useState("");

  const addCoreSkill = () => {
    const nextSkill = coreSkillInput.trim();
    if (!nextSkill) return;

    updateSkillsSection({
      coreSkills: Array.from(new Set([...skillsSection.coreSkills, nextSkill])),
    });
    setCoreSkillInput("");
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-full flex-col gap-6 px-2 py-2 sm:px-3 sm:py-3">
        <CustomSectionTitle
          title="Skills"
          description="Add concise non-technical or cross-functional skills for templates that use a general skills section."
        />

        <section className="grid gap-4">
          <div className="grid gap-3 rounded-[1.35rem] bg-[#10121a]/62 p-4 ring-1 ring-inset ring-[#2b3242]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
              Core Skills
            </p>
            <p className="text-sm text-[#6d7895]">
              Add concise non-technical or cross-functional skills.
            </p>

            <div className="flex min-h-14 flex-wrap gap-2 rounded-[1.15rem] bg-[#0f1117]/58 p-3 ring-1 ring-inset ring-[#24304c]/70">
              {skillsSection.coreSkills.length > 0 ? (
                skillsSection.coreSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() =>
                      updateSkillsSection({
                        coreSkills: skillsSection.coreSkills.filter(
                          (item) => item !== skill,
                        ),
                      })
                    }
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-[#2b3242] bg-[#151923] px-3 py-1.5 text-sm text-white"
                  >
                    {skill}
                    <X className="h-3.5 w-3.5 text-[#6d7895]" />
                  </button>
                ))
              ) : (
                <p className="text-sm text-[#6d7895]">No core skills yet.</p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                value={coreSkillInput}
                onChange={(e) => setCoreSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCoreSkill();
                  }
                }}
                className="h-11 w-full rounded-2xl border border-[#2b3242] bg-[#10121a]/88 px-4 text-sm text-white placeholder:text-[#6d7895]"
                placeholder="Type a core skill..."
              />
              <button
                type="button"
                onClick={addCoreSkill}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#2b3242] bg-[#10121a]/80 px-4 text-sm font-medium text-[#cfd3e1] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
              >
                <Plus className="h-4 w-4" />
                Add Core Skill
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
