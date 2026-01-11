import React, { useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Combobox } from "../ui/combobox";
import {
  degreeData,
  majorData,
  months,
  universitiesData,
} from "../../data/university-data";
import { Education, useResumeStore } from "../../store/useResumeStore";
import { Label } from "../ui/label";
import { CustomTextField } from "./CustomTextField";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

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
      <AccordionTrigger className="text-lg flex items-center font-semibold no-underline">
        <span className="flex-1 text-left">
          Education #{index + 1}
          {education[index]?.school && ` - ${education[index].school}`}
        </span>
        {education.length > 1 && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            className="ml-2 p-1 rounded hover:bg-[#2d313a] transition-colors opacity-70 hover:opacity-100"
            aria-label="Delete education entry"
          >
            <X className="size-4" />
          </div>
        )}
      </AccordionTrigger>

      <AccordionContent>
        <div className="w-full font-semibold flex gap-4 justify-center items-center">
          <div className="w-9/10 flex flex-col gap-2">
            {/* University */}
            <div className="flex w-fit flex-wrap gap-2 items-center">
              <label>Select University:</label>
              <Combobox
                items={universitiesData}
                placeholder="Select University"
                value={education[index].school}
                onChange={(val) => {
                  updateEducation(index, {
                    school: Array.isArray(val) ? val[0] : val,
                  });
                }}
              />

              <label>Gradation Date:</label>
              <Combobox
                items={months}
                value={education[index].graduationMonth}
                onChange={(val) =>
                  updateEducation(index, {
                    graduationMonth: Array.isArray(val) ? val[0] : val,
                  })
                }
                placeholder="Grad Month"
              />
              <Combobox
                items={["2025", "2026", "2027", "2028", "2029"]}
                placeholder="Grad Year"
                value={education[index].graduationYear}
                onChange={(val) =>
                  updateEducation(index, {
                    graduationYear: Array.isArray(val) ? val[0] : val,
                  })
                }
              />
            </div>

            {/* Degree & Major */}
            <div className="flex w-fit flex-wrap gap-2 items-center">
              <label>Select Degree:</label>

              <Combobox
                items={degreeData}
                placeholder="Select Degree"
                value={education[index].degree}
                onChange={(val) =>
                  updateEducation(index, {
                    degree: Array.isArray(val) ? val[0] : val,
                  })
                }
              />

              <label>of</label>

              <Combobox
                items={majorData}
                placeholder="Select Major"
                value={education[index].major}
                onChange={(val) =>
                  updateEducation(index, {
                    major: Array.isArray(val) ? val[0] : val,
                  })
                }
              />
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={education[index].includeGPA}
                onChange={(e) => {
                  updateEducation(index, { includeGPA: e.target.checked });
                }}
                className="checkbox border border-[#6F748B] hover:border-white transition"
              />
              <Label htmlFor="gpa">Include GPA on Resume</Label>
              {education[index].includeGPA && (
                <CustomTextField
                  id="text"
                  placeholder="Enter GPA"
                  value={education[index].gpa}
                  onChange={(e) =>
                    updateEducation(index, { gpa: e.target.value })
                  }
                />
              )}
            </div>
          </div>
        </div>
      </AccordionContent>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-[#151618] border-[#1c1d21] text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Delete Education Entry?</DialogTitle>
            <DialogDescription className="text-[#a4a7b5]">
              Are you sure you want to delete this education entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => setShowDeleteDialog(false)}
              variant="outline"
              className="border-[#2d313a] hover:bg-[#1c1d21]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AccordionItem>
  );
};
