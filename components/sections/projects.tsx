import { CustomSectionTitle } from "../elements/CustomSectionTitle";
import { ProjectAccordion } from "../elements/ProjectAccordion";

interface SectionProps {
  onContinue: () => void;
}

export function ProjectsSection({ onContinue }: SectionProps) {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="md:flex flex-col border-2 p-7 bg-[#151618] border-[#1c1d21] rounded-2xl w-full">
        {/* Title and Description */}
        <CustomSectionTitle
          title="Projects"
          description="Share the projects you’ve built or worked on—class, personal, or team-based."
        />
        <section className="mt-4 flex flex-col gap-3 rounded-2xl border-[2px] border-[#313339] border-dashed shadow-lg p-4">

          <ProjectAccordion />
        </section>
      </div>
    </div>
  );
}
