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
  months,
  universitiesData,
} from "../../data/university-data";
import { Education, useResumeStore } from "../../store/useResumeStore";
import { Label } from "../ui/label";
import { CustomTextField } from "./CustomTextField";

interface EducationAccordionItemProps {
  index: number;
  education: Education[];
}

export const EducationAccordionItem: React.FC<EducationAccordionItemProps> = ({
  index,
  education,
}) => {
  const { updateEducation } = useResumeStore();

  return (
    <AccordionItem value={`Education-${index}`}>
      <AccordionTrigger className="text-lg flex items-center font-semibold no-underline">
        Education #{index + 1}
        {education[index]?.school && ` - ${education[index].school}`}
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
    </AccordionItem>
  );
};
