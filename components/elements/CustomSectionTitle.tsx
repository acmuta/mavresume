import { InfoIcon } from "lucide-react";
import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { InfoGuide } from "../guides/InfoGuide";
import { InfoGuides } from "../guides/InfoGuideConfig";

interface CustomSectionTitleProps {
  title: string;
  description: string;
}

// Map section titles to guide names (case-insensitive matching)
const titleToGuideNameMap: Record<string, string> = {
  "personal information": "personal information",
  education: "education",
  "technical skills": "skills",
  projects: "projects",
  experience: "experience",
};

export const CustomSectionTitle: React.FC<CustomSectionTitleProps> = ({
  title,
  description,
}) => {
  // Normalize title to lowercase for matching
  const normalizedTitle = title.toLowerCase().trim();

  // Get guide name from map, or use normalized title as fallback
  const guideName = titleToGuideNameMap[normalizedTitle] || normalizedTitle;

  // Find guide with case-insensitive matching
  const guide = InfoGuides.find(
    (g) => g.name.toLowerCase() === guideName.toLowerCase()
  );

  return (
    <section
      className="h-fit relative rounded-2xl border-[2px] border-[#313339] border-dashed 
                 shadow-lg p-4 flex flex-col text-start"
    >
      <div className="w-full flex items-center relative">
        <h1 className="text-4xl md:text-[4rem] font-bold mb-2">{title}</h1>
        <div className=" absolute right-4 flex items-center gap-1">
          <Dialog>
            <DialogTrigger asChild>
              <InfoIcon className="w-6 h-6 text-[#51545c] hover:text-white transition" />
            </DialogTrigger>
            <DialogContent className="bg-[#1c1d21] border-[2px] border-[#313339] rounded-2xl shadow-lg w-5/6 md:w-1/3 max-h-[80vh] flex flex-col overflow-hidden p-0">
              <div className="overflow-y-auto flex-1 p-6">
                {guide ? (
                  <InfoGuide guide={guide} />
                ) : (
                  <p className="text-sm">No guide available.</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <p className="text-sm md:text-xl w-full 2xl:w-3/4">{description}</p>
    </section>
  );
};
