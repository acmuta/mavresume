import { Plus } from "lucide-react";
import { useResumeStore } from "../../store/useResumeStore";
import { CustomSectionTitle } from "../elements/CustomSectionTitle";
import { ExperienceAccordion } from "../elements/ExperienceAccordion";

interface SectionProps {
  onContinue: () => void;
}

export function ExperienceSection({ onContinue }: SectionProps) {
  const { addExperience } = useResumeStore();

  const clearInputs = () => {
    const emptyExperience = {
      position: "",
      company: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      isCurrent: false,
      bulletPoints: ["", "", ""],
    };
    useResumeStore.setState({ experience: [emptyExperience] });
  };
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="md:flex flex-col p-7 w-full">
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

        {/* <section className="mt-4 flex justify-center gap-2 rounded-2xl border-[2px] border-[#313339] border-dashed shadow-lg p-4">
          <button
            className="btn w-[49%] font-bold bg-[#2A2C31] rounded-xl border border-[#2c2e34]"
            onClick={clearInputs}
          >
            Clear Inputs
          </button>
          <button
            className="btn w-[49%] font-bold bg-[#274CBC] rounded-xl border border-[#2a4fbe]"
            onClick={onContinue}
          >
            Next<span className="hidden md:block">: Education</span>
          </button>
        </section> */}
      </div>
    </div>
  );
}
