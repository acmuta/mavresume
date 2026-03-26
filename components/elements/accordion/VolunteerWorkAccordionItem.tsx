import React from "react";
import { Experience, useResumeStore } from "../../../store/useResumeStore";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { CustomTextField } from "../form/CustomTextField";
import { Combobox } from "../../ui/combobox";
import { months, years } from "../../../data/university-data";
import { Label } from "../../ui/label";
import { X, Plus } from "lucide-react";

interface VolunteerWorkAccordionItemProps {
  index: number;
  entries: Experience[];
}

export const VolunteerWorkAccordionItem: React.FC<
  VolunteerWorkAccordionItemProps
> = ({ index, entries }) => {
  const { updateVolunteerWork, removeVolunteerWork } = useResumeStore();

  const handleAddBulletPoint = () => {
    const newBulletPoints = [...entries[index].bulletPoints, ""];
    updateVolunteerWork(index, { bulletPoints: newBulletPoints });
  };

  const handleDeleteBulletPoint = (bpIndex: number) => {
    if (entries[index].bulletPoints.length <= 1) return;
    const newBulletPoints = entries[index].bulletPoints.filter(
      (_, i) => i !== bpIndex,
    );
    updateVolunteerWork(index, { bulletPoints: newBulletPoints });
  };

  return (
    <AccordionItem value={`VolunteerWork-${index}`}>
      <AccordionTrigger className="text-lg font-semibold no-underline">
        <div className="flex flex-1 items-center justify-between gap-4 pr-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
              Volunteer Entry {index + 1}
            </p>
            <p className="mt-2 text-left text-lg font-semibold text-white">
              {entries[index]?.position || "New volunteer entry"}
            </p>
          </div>
          {entries.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeVolunteerWork(index);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2b3242] bg-[#10121a]/70 text-[#6d7895] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
              aria-label="Delete volunteer entry"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid gap-4">
          <div className="grid gap-5 md:grid-cols-2">
            <CustomTextField
              id={`volunteer-role-${index}`}
              label="Role"
              placeholder="Volunteer Role"
              value={entries[index].position}
              onChange={(e) => {
                updateVolunteerWork(index, { position: e.target.value });
              }}
            />
            <CustomTextField
              id={`volunteer-org-${index}`}
              label="Organization"
              placeholder="Organization Name"
              value={entries[index].company}
              onChange={(e) => {
                updateVolunteerWork(index, { company: e.target.value });
              }}
            />

            <div className="grid gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#89a5ff]">
                Start date
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Combobox
                  items={months}
                  placeholder="Select month"
                  value={entries[index].startMonth}
                  onChange={(val) =>
                    updateVolunteerWork(index, { startMonth: val as string })
                  }
                />
                <Combobox
                  items={years}
                  placeholder="Select year"
                  value={entries[index].startYear}
                  onChange={(val) =>
                    updateVolunteerWork(index, { startYear: val as string })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#89a5ff]">
                End date
              </label>
              {!entries[index].isCurrent ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Combobox
                    items={months}
                    placeholder="Select month"
                    value={entries[index].endMonth}
                    onChange={(val) =>
                      updateVolunteerWork(index, { endMonth: val as string })
                    }
                  />
                  <Combobox
                    items={years}
                    placeholder="Select year"
                    value={entries[index].endYear}
                    onChange={(val) =>
                      updateVolunteerWork(index, { endYear: val as string })
                    }
                  />
                </div>
              ) : (
                <div className="inline-flex h-12 items-center rounded-2xl border border-[#2b3242] bg-[#10121a]/88 px-4 text-sm text-[#cfd3e1]">
                  Present
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex flex-wrap items-center gap-3 rounded-full bg-[#10121a]/72 px-4 py-3 ring-1 ring-inset ring-[#2b3242]">
              <input
                type="checkbox"
                checked={entries[index].isCurrent}
                onChange={(e) => {
                  updateVolunteerWork(index, { isCurrent: e.target.checked });
                }}
                className="checkbox border border-[#6F748B] hover:border-white transition"
              />
              <Label className="text-[#cfd3e1]">Current Role</Label>
            </div>
          </div>

          <div className="grid gap-4 rounded-[1.35rem] bg-[#10121a]/58 p-4 ring-1 ring-inset ring-[#2b3242]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#89a5ff]">
                Bullet points
              </p>
              <p className="mt-2 text-sm text-[#6d7895]">
                Describe service impact, responsibilities, and outcomes.
              </p>
            </div>

            <div className="grid gap-3">
              {entries[index].bulletPoints.map((bp, bpIndex) => (
                <div key={bpIndex} className="flex items-start gap-2">
                  <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#58f5c3]" />
                  <input
                    className="h-12 w-full rounded-2xl border border-[#2b3242] bg-[#10121a]/88 px-4 text-sm text-white placeholder:text-[#6d7895] outline-none transition focus:border-[#4b5a82] focus:bg-[#161b25]"
                    placeholder={`Bullet Point #${bpIndex + 1}`}
                    value={bp}
                    onChange={(e) => {
                      const newBulletPoints = [...entries[index].bulletPoints];
                      newBulletPoints[bpIndex] = e.target.value;
                      updateVolunteerWork(index, { bulletPoints: newBulletPoints });
                    }}
                  />
                  {entries[index].bulletPoints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteBulletPoint(bpIndex)}
                      className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#2b3242] bg-[#151923] px-3 text-[#6d7895] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
                      title="Delete bullet point"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddBulletPoint}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#2b3242] bg-[#10121a]/80 px-4 text-sm font-medium text-[#cfd3e1] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
              title="Add bullet point"
            >
              <Plus className="size-4" />
              <span>Add Bullet Point</span>
            </button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
