"use client";

import { HelpCircle } from "lucide-react";
import React from "react";
import { useGuideStore } from "@/store/useGuideStore";

interface CustomSectionTitleProps {
  title: string;
  description: string;
}

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
    <section className="relative overflow-hidden px-1 py-1">
      <div className="absolute left-0 top-0 h-20 w-20 rounded-full bg-[#274cbc]/14 blur-[55px]" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#89a5ff]">
            Builder section
          </p>
          <h1 className="mt-2 text-[1.8rem] font-semibold tracking-tight text-white sm:text-[2.15rem]">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#cfd3e1] sm:text-[0.95rem]">
            {description}
          </p>
        </div>

        <button
          onClick={handleOpenHelp}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2b3242] bg-[#10121a]/78 text-[#6d7895] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
          aria-label="Open help for this section"
          title="View tips and guides for this section"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
};
