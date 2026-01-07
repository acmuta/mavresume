"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Fade } from "react-awesome-reveal";
import { FaDiscord, FaGithub } from "react-icons/fa";

interface BuilderHeaderBarProps {
  currentSectionIndex: number;
}

export const BuilderHeaderBar = ({ currentSectionIndex }: BuilderHeaderBarProps) => {
  // Map section index to section ID for styling
  const sectionIds = [
    "personal-info",
    "education",
    "technical-skills",
    "projects",
    "experience",
  ];

  const sectionNames = [
    "Personal Info",
    "Education",
    "Skills",
    "Projects",
    "Experience",
  ];

  const activeSection = sectionIds[currentSectionIndex] || "personal-info";

  return (
    <Fade
      direction="down"
      duration={500}
      className="relative w-full overflow-hidden"
    >
      {/* Backdrop blur mask matching HomeHeaderBar */}
      <div
        className="absolute inset-0 backdrop-blur-sm 
        [mask-image:linear-gradient(to_top,rgba(0,0,0,1)_0%,rgba(0,0,0,0.6)_40%,rgba(0,0,0,0)_100%)]
        pointer-events-none z-0"
      />

      {/* Header content */}
      <header className="relative z-10 w-full px-4 py-3 sm:px-6 lg:px-8">
        <div
          className="mx-auto flex max-w-2xl flex-col gap-3 
          rounded-2xl border border-white/10 
          bg-[#05060a]/80 shadow-[0_18px_45px_rgba(0,0,0,0.65)] 
          px-4 py-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="font-bold tracking-tight text-2xl sm:text-4xl 
                [mask-image:linear-gradient(to_bottom,black_40%,transparent)] 
                [mask-size:100%_100%] [mask-repeat:no-repeat]"
              >
                MAV<span className="font-extralight">RESUME</span>
              </Link>

              <span
                className="hidden sm:inline-flex rounded-full text-xs border border-[#2b3242] 
                bg-white/5 px-3 py-0.5 font-medium uppercase tracking-[0.2em] 
                text-[#89a5ff]"
              >
                Builder
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="https://www.acmuta.com"
                target="_blank"
                rel="noreferrer"
                className="hidden lg:inline-flex items-center gap-2 rounded-full border border-[#2b3242] bg-[#10121a] px-3 py-1 text-xs font-medium text-[#cfd3e1] hover:border-[#3f4a67] hover:text-white transition-colors"
              >
                <span>ACM @ UTA</span>
              </Link>
              <Link
                href="https://discord.gg/WjrDwNn5es"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#2b3242] bg-[#10121a] text-[#cfd3e1] hover:border-[#3f4a67] hover:text-white transition-colors"
                aria-label="Discord"
              >
                <FaDiscord className="w-4 h-4" />
              </Link>
              <Link
                href="https://github.com/acmuta/mavresume"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#2b3242] bg-[#10121a] text-[#cfd3e1] hover:border-[#3f4a67] hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </header>
    </Fade>
  );
};
