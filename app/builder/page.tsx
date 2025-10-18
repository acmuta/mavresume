"use client";
import { useRef } from "react";
import { PersonalInfoSection } from "../../components/sections/personalInfo";
import { BuilderHeaderBar } from "../../components/elements/BuilderHeaderBar";
import { Fade } from "react-awesome-reveal";

export default function BuilderPage() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToNextSection = (currentIndex: number) => {
    const nextSection = sectionRefs.current[currentIndex + 1];
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const sections = [
    { Component: PersonalInfoSection, id: "personal-info" },
    
  ];

  return (
    <div className="bg-[#101113] text-white relative">
      <div className="fixed top-0 left-0 w-full z-50">
        <BuilderHeaderBar />
      </div>

      {sections.map(({ Component, id }, index) => (
        <div
          key={id}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          id={id}
          className="w-full h-screen"
        >
          <Fade
            triggerOnce
            direction="up"
            duration={800}
            className="relative h-full w-full overflow-hidden"
          >
            <Component onContinue={() => scrollToNextSection(index)} />
          </Fade>
        </div>
      ))}
    </div>
  );
}
