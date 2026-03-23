import React, { useState } from "react";
import { X } from "lucide-react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { Combobox } from "../../ui/combobox";
import {
  degreeData,
  majorData,
  months,
  universitiesData,
} from "../../../data/university-data";
import { Education, useResumeStore } from "../../../store/useResumeStore";
import { Label } from "../../ui/label";
import { CustomTextField } from "../form/CustomTextField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";

interface EducationAccordionItemProps {
  index: number;
  education: Education[];
}

export const EducationAccordionItem: React.FC<EducationAccordionItemProps> = ({
  index,
  education,
}) => {
  const { updateEducation, removeEducation } = useResumeStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    removeEducation(index);
    setShowDeleteDialog(false);
  };

  return (
    <AccordionItem value={`Education-${index}`}>
      <AccordionTrigger className="text-lg font-semibold no-underline">
        <div className="flex flex-1 items-center justify-between gap-4 pr-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
              Education {index + 1}
            </p>
            <p className="mt-2 text-left text-lg font-semibold text-white">
              {education[index]?.school || "New education entry"}
            </p>
          </div>

          {education.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2b3242] bg-[#10121a]/70 text-[#6d7895] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
              aria-label="Delete education entry"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent>
        <div className="grid gap-4">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#89a5ff]">
                University
              </label>
              <Combobox
                items={universitiesData}
                placeholder="Select university"
                value={education[index].school}
                onChange={(val) => {
                  updateEducation(index, {
                    school: Array.isArray(val) ? val[0] : val,
                  });
                }}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#89a5ff]">
                Major
              </label>
              <Combobox
                items={majorData}
                placeholder="Select major"
                value={education[index].major}
                onChange={(val) =>
                  updateEducation(index, {
                    major: Array.isArray(val) ? val[0] : val,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#89a5ff]">
                Degree
              </label>
              <Combobox
                items={degreeData}
                placeholder="Select degree"
                value={education[index].degree}
                onChange={(val) =>
                  updateEducation(index, {
                    degree: Array.isArray(val) ? val[0] : val,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#89a5ff]">
                Graduation date
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Combobox
                  items={months}
                  value={education[index].graduationMonth}
                  onChange={(val) =>
                    updateEducation(index, {
                      graduationMonth: Array.isArray(val) ? val[0] : val,
                    })
                  }
                  placeholder="Grad month"
                />
                <Combobox
                  items={["2025", "2026", "2027", "2028", "2029"]}
                  placeholder="Grad year"
                  value={education[index].graduationYear}
                  onChange={(val) =>
                    updateEducation(index, {
                      graduationYear: Array.isArray(val) ? val[0] : val,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="rounded-[1.35rem] bg-[#10121a]/66 p-4 ring-1 ring-inset ring-[#2b3242]">
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="checkbox"
                checked={education[index].includeGPA}
                onChange={(e) => {
                  updateEducation(index, { includeGPA: e.target.checked });
                }}
                className="checkbox border border-[#6F748B] hover:border-white transition"
              />
              <Label htmlFor="gpa" className="text-[#cfd3e1]">
                Include GPA on resume
              </Label>
            </div>

            {education[index].includeGPA && (
              <div className="mt-4 max-w-xs">
                <CustomTextField
                  id="gpa"
                  label="GPA"
                  placeholder="Enter GPA"
                  value={education[index].gpa}
                  onChange={(e) =>
                    updateEducation(index, { gpa: e.target.value })
                  }
                />
              </div>
            )}
          </div>
        </div>
      </AccordionContent>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="w-[92vw] max-w-lg rounded-[2rem] border border-[#2b3242] bg-[#111319]/96 text-white shadow-[0_25px_60px_rgba(3,4,7,0.5)]">
          <DialogHeader>
            <DialogTitle>Delete education entry?</DialogTitle>
            <DialogDescription className="text-[#a4a7b5]">
              This removes the entry from the builder and the final resume.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              onClick={() => setShowDeleteDialog(false)}
              variant="outline"
              className="rounded-full border-[#2b3242] bg-transparent hover:bg-[#161b25] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="rounded-full bg-[#274cbc] text-white hover:bg-[#315be1]"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AccordionItem>
  );
};
