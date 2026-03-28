import { Plus } from "lucide-react";

import { useResumeStore } from "../../store/useResumeStore";
import { CustomSectionTitle } from "../elements/form/CustomSectionTitle";
import { TeachingExperienceAccordion } from "../elements/accordion/TeachingExperienceAccordion";

export function TeachingExperienceSection() {
  const { addTeachingExperience } = useResumeStore();

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-full flex-col gap-6 px-2 py-2 sm:px-3 sm:py-3">
        <CustomSectionTitle
          title="Teaching Experience"
          description="Add teaching roles that show instruction scope, mentorship, and learning outcomes."
        />

        <section className="grid gap-4">
          <TeachingExperienceAccordion />

          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#2b3242] bg-[#10121a]/80 px-5 text-sm font-medium text-[#cfd3e1] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
            onClick={() =>
              addTeachingExperience({
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
            type="button"
          >
            <Plus className="h-4 w-4" />
            Add Teaching Entry
          </button>
        </section>
      </div>
    </div>
  );
}
