"use client";

import { HelpCircle } from "lucide-react";
import React from "react";
import { useGuideStore } from "@/store/useGuideStore";

interface CustomSectionTitleProps {
  title: string;
  description: string;
}

/**
 * CustomSectionTitle Component
 *
 * Displays the section title with description and a help button.
 * The help button now opens the floating help widget instead of a modal,
 * providing a better UX that doesn't interrupt the workflow.
 */

export const CustomSectionTitle: React.FC<CustomSectionTitleProps> = ({
  title,
  description,
}) => {
  const { setWidgetExpanded, setActiveWidgetTab } = useGuideStore();

  const handleOpenHelp = () => {
    setActiveWidgetTab("tips");
    setWidgetExpanded(true);
  };

  return (
    <section className="h-fit relative p-6 sm:p-8 flex flex-col text-start">
      <div className="w-full flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white">
              {title}
            </h1>
            <button
              onClick={handleOpenHelp}
              className="rounded-full p-2 text-[#6d7895] hover:text-white hover:bg-white/10 transition-all"
              aria-label="Open help for this section"
              title="View tips and guides for this section"
            >
              <HelpCircle className="w-6 h-6 md:w-7 md:h-7" />
            </button>
          </div>

          <p className="text-base md:text-xl text-[#cfd3e1] max-w-3xl">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};
