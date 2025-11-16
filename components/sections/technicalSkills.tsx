import { Plus } from "lucide-react";
import { CustomSectionTitle } from "../elements/CustomSectionTitle";
import { NoteBox } from "../elements/NoteBox";
import { utaEngineeringCourses } from "../../data/university-data";
import { useResumeStore } from "../../store/useResumeStore";

interface SectionProps {
  onContinue: () => void;
}

export function TechnicalSkillsSection({ onContinue }: SectionProps) {
  const { relevantCourses } = useResumeStore();

  const recommendations = utaEngineeringCourses
    .filter((course) => relevantCourses?.includes(course.name))
    .reduce<{ languages: string[]; tools: string[] }>(
      (acc, course) => ({
        languages: [...acc.languages, ...course.languages],
        tools: [...acc.tools, ...course.tools],
      }),
      { languages: [], tools: [] }
    );
    
  console.log("Relevant Courses:", recommendations);

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="md:flex flex-col border-2 p-7 bg-[#151618] border-[#1c1d21] rounded-2xl w-full">
        {/* Title and Description */}
        <CustomSectionTitle
          title="Technical Skills"
          description="Highlight the tools, technologies, and strengths you bring to the table."
        />
        <section className="mt-4 flex flex-col gap-3 rounded-2xl border-[2px] border-[#313339] border-dashed shadow-lg p-4">
          <NoteBox
            icon="Lightbulb"
            note="Based on your previous courses, we've identified languages and technologies to highlight on your resume!"
          />
          <div>
            <h2 className="text-xl font-semibold ">
              Your Recommended Languages
            </h2>
            <div className="mt-2 flex flex-wrap gap-2 mb-3">
              {/* Example skill tags */}
              {recommendations.languages.length != 0 ? (
                recommendations.languages.map((language, index) => (
                  <button className="flex items-center px-2 py-1 italic bg-[#282a2f]/20 font-semibold text-white transition hover:border-[#b1b3b6] rounded-2xl border-[2px] border-dashed border-[#41444c]">
                    <Plus className="inline mr-1 max-w-12" />
                    <span className="">{language}</span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-[#51545c]">
                  No recommendations yet.
                </p>
              )}
            </div>

            <div className="w-full p-2 h-30 flex bg-[#282a2f]/20 rounded-2xl border-[2px] border-[#41444c]">
              {}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
