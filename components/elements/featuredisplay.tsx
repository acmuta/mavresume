import React from "react";
import { GradCapIcon } from "../../public/svgicons/gradcapicon";
import { GearIcon } from "../../public/svgicons/gearicon";
import { DocumentIcon } from "../../public/svgicons/documentIcon";
import { LightbulbIcon } from "../../public/svgicons/lightbulbicon";
import { PuzzleIcon } from "../../public/svgicons/puzzleIcon";

export const FeatureDisplay = () => {
  return (
    <section className="w-full flex items-center justify-center gap-8 bg-[#2e304622] border border-[#3c3f5a22] py-4 px-6 mt-2  rounded-3xl">
      <div className="flex flex-col w-28 items-center justify-center">
        <GradCapIcon size={10} className="" />
        <label className="font-semibold text-center">Made for Students</label>
      </div>
      <div className="flex flex-col w-28 items-center justify-center">
        <GearIcon size={10} className="" />
        <label className="font-semibold text-center">Step-by-Step Flow</label>
      </div>
      <div className="flex flex-col w-28 items-center justify-center">
        <LightbulbIcon size={10} className="" />
        <label className="font-semibold text-center">Smart Suggestions</label>
      </div>
      <div className="flex flex-col w-28 items-center justify-center">
        <PuzzleIcon size={10} className="" />
        <label className="font-semibold text-center">Tailored Pathways</label>
      </div>
      <div className="flex flex-col w-28 items-center justify-center">
        <DocumentIcon size={10} className="" />
        <label className="font-semibold text-center">No Template Needed</label>
      </div>
    </section>
  );
};
