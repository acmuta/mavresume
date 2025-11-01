import { CustomSectionTitle } from "../elements/CustomSectionTitle";

interface SectionProps {
  onContinue: () => void;
}

export function TechnicalSkillsSection({ onContinue }: SectionProps) {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="md:flex flex-col border-2 p-7 bg-[#151618] border-[#1c1d21] rounded-2xl w-full">
        {/* Title and Description */}
        <CustomSectionTitle
          title="Technical Skills"
          description="Start with the basics - your name, contact details, and links so employers can reach you."
        />
      </div>
      
    </div>
  );
}
