import { CustomSectionTitle } from "../elements/CustomSectionTitle";

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
      </div>
    </div>
  );
}
