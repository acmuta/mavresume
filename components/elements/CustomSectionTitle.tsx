import { InfoIcon } from "lucide-react";
import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
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
    <section className="h-fit relative p-6 sm:p-8 flex flex-col text-start">
      <div className="w-full flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white">
            {title}
          </h1>
          <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-[#6d7895] hover:text-white hover:bg-white/10 transition-all"
              aria-label="Section guide"
            >
              <InfoIcon className="w-8 h-8" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1c1d21] border-2 border-dashed border-[#2d313a] rounded-2xl shadow-[0_25px_60px_rgba(3,4,7,0.55)] w-5/6 md:w-1/3 max-h-[80vh] flex flex-col overflow-hidden p-0">
            <div className="overflow-y-auto flex-1 p-6">
              {guide ? (
                <InfoGuide guide={guide} />
              ) : (
                <p className="text-sm text-[#a4a7b5]">No guide available.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
          </div>
          

          <p className="text-base md:text-xl text-[#cfd3e1] max-w-3xl">
            {description}
          </p>
        </div>
        
        
      </div>
    </section>
  );
};
