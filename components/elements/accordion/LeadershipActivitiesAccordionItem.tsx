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

interface LeadershipActivitiesAccordionItemProps {
  index: number;
  entries: Experience[];
}

export const LeadershipActivitiesAccordionItem: React.FC<
  LeadershipActivitiesAccordionItemProps
> = ({ index, entries }) => {
  const {
    updateLeadershipActivity,
    removeLeadershipActivity,
  } = useResumeStore();

  const handleAddBulletPoint = () => {
    const newBulletPoints = [...entries[index].bulletPoints, ""];
    updateLeadershipActivity(index, { bulletPoints: newBulletPoints });
  };

  const handleDeleteBulletPoint = (bpIndex: number) => {
    if (entries[index].bulletPoints.length <= 1) return;
    const newBulletPoints = entries[index].bulletPoints.filter(
      (_, i) => i !== bpIndex,
    );
    updateLeadershipActivity(index, { bulletPoints: newBulletPoints });
  };

  return (
    <AccordionItem value={`Leadership-${index}`}>
      <AccordionTrigger className="text-lg font-semibold no-underline">
        <div className="flex flex-1 items-center justify-between gap-4 pr-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
              Leadership Entry {index + 1}
            </p>
            <p className="mt-2 text-left text-lg font-semibold text-white">
              {entries[index]?.position || "New leadership activity"}
            </p>
          </div>
          {entries.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeLeadershipActivity(index);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2b3242] bg-[#10121a]/70 text-[#6d7895] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
              aria-label="Delete leadership entry"
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
              id={`leadership-title-${index}`}
              label="Role"
              placeholder="Leadership Role"
              value={entries[index].position}
              onChange={(e) => {
                updateLeadershipActivity(index, { position: e.target.value });
              }}
            />
            <CustomTextField
              id={`leadership-org-${index}`}
              label="Organization"
              placeholder="Organization Name"
              value={entries[index].company}
              onChange={(e) => {
                updateLeadershipActivity(index, { company: e.target.value });
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
                    updateLeadershipActivity(index, { startMonth: val as string })
                  }
                />
                <Combobox
                  items={years}
                  placeholder="Select year"
                  value={entries[index].startYear}
                  onChange={(val) =>
                    updateLeadershipActivity(index, { startYear: val as string })
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
                      updateLeadershipActivity(index, { endMonth: val as string })
                    }
                  />
                  <Combobox
                    items={years}
                    placeholder="Select year"
                    value={entries[index].endYear}
                    onChange={(val) =>
                      updateLeadershipActivity(index, { endYear: val as string })
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
                  updateLeadershipActivity(index, { isCurrent: e.target.checked });
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
                Describe impact, ownership, and outcomes.
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
                      updateLeadershipActivity(index, { bulletPoints: newBulletPoints });
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
