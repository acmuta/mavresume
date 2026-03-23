import { Plus } from "lucide-react";

import { utaEngineeringCourses } from "../../data/university-data";
import { useResumeStore } from "../../store/useResumeStore";
import { CustomSectionTitle } from "../elements/form/CustomSectionTitle";
import { NoteBox } from "../elements/feedback/NoteBox";
import { Combobox } from "../ui/combobox";
import { EducationAccordion } from "../elements/accordion/EducationAccordion";

export function EducationSection() {
  const { addEducation, relevantCourses } = useResumeStore();

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-full flex-col gap-6 px-2 py-2 sm:px-3 sm:py-3">
        <CustomSectionTitle
          title="Education"
          description="Add your school, degree, major, graduation date, and any coursework that supports the rest of your resume."
        />

        <section className="grid gap-4">
          <EducationAccordion />

          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#2b3242] bg-[#10121a]/80 px-5 text-sm font-medium text-[#cfd3e1] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
            onClick={() =>
              addEducation({
                school: "",
                degree: "",
                major: "",
                includeGPA: false,
                graduationMonth: "",
                graduationYear: "",
              })
            }
            type="button"
          >
            <Plus className="h-4 w-4" />
            Add Education
          </button>
        </section>

        <section className="grid gap-4">
          <NoteBox
            icon="Info"
            note="Adding coursework helps us suggest related skills and technologies to include elsewhere in the resume."
          />

          <div className="grid gap-3 rounded-[1.5rem] bg-[#10121a]/72 p-4 ring-1 ring-inset ring-[#2b3242]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
                Relevant coursework
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#6d7895]">
                Select the courses that best support your skills and projects.
              </p>
            </div>

            <Combobox
              items={utaEngineeringCourses}
              value={relevantCourses}
              onChange={(selected) =>
                useResumeStore.setState({
                  relevantCourses: Array.isArray(selected)
                    ? selected
                    : selected
                      ? [selected]
                      : undefined,
                })
              }
              placeholder="Select courses..."
              multiSelect
            />
          </div>
        </section>
      </div>
    </div>
  );
}
