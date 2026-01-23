import { Plus } from "lucide-react";
import { useResumeStore } from "../../store/useResumeStore";
import { CustomSectionTitle } from "../elements/form/CustomSectionTitle";
import { ExperienceAccordion } from "../elements/accordion/ExperienceAccordion";

export function ExperienceSection() {
  const { addExperience } = useResumeStore();

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="md:flex flex-col md:p-7 w-full">
        {/* Title and Description */}
        <CustomSectionTitle
          title="Experience"
          description="List your jobs or internships. Focus on what you did and the impact you made."
        />

        <section className="mt-4 flex flex-col gap-3 p-4">
          <ExperienceAccordion />

          <button
            className="w-full py-4 flex justify-center items-center text-sm bg-[#282a2f]/20 font-semibold text-[#51545c] hover:text-white transition rounded-2xl border-[2px] border-dashed border-[#41444c]"
            onClick={() =>
              addExperience({
                position: "",
                company: "",
                startMonth: "",
                startYear: "",
                endMonth: "",
                endYear: "",
                isCurrent: false,
                bulletPoints: ["", "", ""],
              })
            }
          >
            <Plus className="mr-1" />
            <p>Add Experience</p>
          </button>
        </section>
      </div>
    </div>
  );
}
