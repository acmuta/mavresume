import { CustomSectionTitle } from "../elements/form/CustomSectionTitle";
import { NoteBox } from "../elements/feedback/NoteBox";
import { TechnicalSkillsAccordion } from "../elements/accordion/TechnicalSkillsAccordion";

export function TechnicalSkillsSection() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-full flex-col gap-6 px-2 py-2 sm:px-3 sm:py-3">
        <CustomSectionTitle
          title="Technical Skills"
          description="List the tools, languages, and technologies that should show up on your resume."
        />

        <section className="grid gap-4">
          <NoteBox
            icon="Lightbulb"
            note="We use your coursework to suggest languages and technologies you may want to include."
          />
          <TechnicalSkillsAccordion />
        </section>
      </div>
    </div>
  );
}
