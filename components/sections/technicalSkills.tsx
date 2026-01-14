import { Plus } from "lucide-react";
import { CustomSectionTitle } from "../elements/CustomSectionTitle";
import { NoteBox } from "../elements/NoteBox";
import {
  Technologies,
  utaEngineeringCourses,
} from "../../data/university-data";
import { useResumeStore } from "../../store/useResumeStore";
import { Combobox } from "../ui/combobox";
import { TechnicalSkillsAccordion } from "../elements/TechnicalSkillsAccordion";

interface SectionProps {
  onContinue: () => void;
}

export function TechnicalSkillsSection({ onContinue }: SectionProps) {
  const { relevantCourses, skills, addSkills } = useResumeStore();

  const recommendations = (() => {
    const selected = utaEngineeringCourses.filter((c) =>
      relevantCourses?.includes(c.value)
    );

    const allLanguages = [...new Set(selected.flatMap((c) => c.languages))];
    const allTechnologies = [...new Set(selected.flatMap((c) => c.tools))];

    return {
      languages: allLanguages.filter(
        (lang) => !skills.languagesList.includes(lang)
      ),
      technologies: allTechnologies.filter(
        (tech) => !skills.technologiesList.includes(tech)
      ),
    };
  })();

  const clearInputs = () => {
    useResumeStore.setState({
      skills: { languagesList: [], technologiesList: [] },
    });
  };

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="md:flex flex-col md:p-7 w-full">
        {/* Title and Description */}
        <CustomSectionTitle
          title="Technical Skills"
          description="Highlight the tools, technologies, and strengths you bring to the table."
        />
        <section className="mt-4 flex flex-col gap-3 p-4">
          <NoteBox
            icon="Lightbulb"
            note="Based on your previous courses, we've identified languages and technologies to highlight on your resume!"
          />
          <TechnicalSkillsAccordion />
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
            Next<span className="hidden md:block">: Projects</span>
          </button>
        </section> */}
      </div>
    </div>
  );
}
