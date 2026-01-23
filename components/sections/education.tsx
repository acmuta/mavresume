import { utaEngineeringCourses } from "../../data/university-data";
import { useResumeStore } from "../../store/useResumeStore";
import { CustomSectionTitle } from "../elements/form/CustomSectionTitle";
import { NoteBox } from "../elements/feedback/NoteBox";
import { Combobox } from "../ui/combobox";
import { Plus } from "lucide-react";
import { EducationAccordion } from "../elements/accordion/EducationAccordion";

export function EducationSection() {
  const { addEducation, relevantCourses } = useResumeStore();

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="md:flex flex-col md:p-7 w-full">
        {/* Title and Description */}
        <CustomSectionTitle
          title="Education"
          description="Show what your studying and courses you've taken. Include your degree, school, major, and graduation date."
        />

        <section className="mt-4 flex flex-col gap-3  p-4">
          <EducationAccordion />

          <button
            className="w-full py-4 flex justify-center items-center text-sm bg-[#282a2f]/20 font-semibold text-[#51545c] hover:text-white transition rounded-2xl border-[2px] border-dashed border-[#41444c]"
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
          >
            <Plus className="mr-1" />
            <p>Add Education</p>
          </button>

          <div className="divider m-0"></div>

          <NoteBox
            icon="Info"
            note="Don't skip this! Adding coursework helps us identify related skills
          and projects to put on your resume."
          />

          <div className="flex w-fit font-semibold flex-wrap gap-2 items-center">
            <label htmlFor="">Add All Relevant Coursework: </label>
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
              placeholder="Select Courses..."
              multiSelect
            />
          </div>
        </section>
      </div>
    </div>
  );
}
