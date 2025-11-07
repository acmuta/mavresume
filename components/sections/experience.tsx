import { CustomSectionTitle } from "../elements/CustomSectionTitle";

interface SectionProps {
  onContinue: () => void;
}

export function ExperienceSection({ onContinue }: SectionProps) {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="md:flex flex-col border-2 p-7 bg-[#151618] border-[#1c1d21] rounded-2xl w-full">
        {/* Title and Description */}
        <CustomSectionTitle
          title="Experience"
          description="List your jobs or internships. Focus on what you did and the impact you made."
        />
      </div>
    </div>
  );
}
