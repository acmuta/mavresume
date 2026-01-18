import { CustomSectionTitle } from "../elements/CustomSectionTitle";
import { NoteBox } from "../elements/NoteBox";
import { TechnicalSkillsAccordion } from "../elements/TechnicalSkillsAccordion";

export function TechnicalSkillsSection() {

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
      </div>
    </div>
  );
}
