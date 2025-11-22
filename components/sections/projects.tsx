import { Plus } from "lucide-react";
import { CustomSectionTitle } from "../elements/CustomSectionTitle";
import { ProjectAccordion } from "../elements/ProjectAccordion";
import { useResumeStore } from "../../store/useResumeStore";

interface SectionProps {
  onContinue: () => void;
}

export function ProjectsSection({ onContinue }: SectionProps) {
  const { addProject } = useResumeStore();
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="md:flex flex-col border-2 p-7 bg-[#151618] border-[#1c1d21] rounded-2xl w-full">
        {/* Title and Description */}
        <CustomSectionTitle
          title="Projects"
          description="Share the projects you’ve built or worked on-class, personal, or team-based."
        />
        <section className="mt-4 flex flex-col gap-3 rounded-2xl border-[2px] border-[#313339] border-dashed shadow-lg p-4">

          <ProjectAccordion />

          <button
            className="w-full py-4 flex justify-center items-center text-sm bg-[#282a2f]/20 font-semibold text-[#51545c] hover:text-white transition rounded-2xl border-[2px] border-dashed border-[#41444c]"
            onClick={() =>
              addProject({
                title: "",
                technologies: [],
                bulletPoints: [],
              })
            }
          >
            <Plus className="mr-1" />
            <p>Add Project</p>
          </button>
        </section>
      </div>
    </div>
  );
}
