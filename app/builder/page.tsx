"use client";
import { useRef } from "react";
import { PersonalInfoSection } from "../../components/sections/personalInfo";
import { BuilderHeaderBar } from "../../components/elements/BuilderHeaderBar";
import { Fade } from "react-awesome-reveal";
import { TechnicalSkillsSection } from "../../components/sections/technicalSkills";
import { EducationSection } from "../../components/sections/education";
import { ExperienceSection } from "../../components/sections/experience";
import { ProjectsSection } from "../../components/sections/projects";

/**
 * Builder page orchestrates the multi-section resume form.
 * 
 * Structure:
 * - Fixed header bar at top (BuilderHeaderBar) tracks active section
 * - Full-screen sections stacked vertically with scroll-snap behavior
 * - Each section receives onContinue callback to scroll to next section
 * 
 * Section order: Personal Info → Education → Technical Skills → Projects → Experience
 * 
 * Navigation: Sections use refs array to enable programmatic scrolling via "Next" buttons.
 */
export default function BuilderPage() {
  // Refs array stores DOM references to each section for scroll navigation
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  /**
   * Scrolls to the next section when user clicks "Next" button.
   * Uses smooth scroll behavior for better UX.
   */
  const scrollToNextSection = (currentIndex: number) => {
    const nextSection = sectionRefs.current[currentIndex + 1];
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Section configuration: defines order and IDs for navigation/header tracking
  const sections = [
    { Component: PersonalInfoSection, id: "personal-info" },
    { Component: EducationSection, id: "education"},
    { Component: TechnicalSkillsSection, id: "technical-skills" }, 
    { Component: ProjectsSection, id: "projects" },
    { Component: ExperienceSection, id: "experience" },
    
  ];

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-0 left-0 w-full z-50">
        <BuilderHeaderBar />
      </div>

      {/* Render each section as full-screen div with ref for scroll navigation */}
      {sections.map(({ Component, id }, index) => (
        <div
          key={id}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          id={id}
          className="w-full h-screen"
        >
          {/* Fade animation on scroll into view */}
          <Fade
            triggerOnce
            direction="up"
            duration={800}
            className="relative h-full w-full overflow-hidden"
          >
            {/* Pass onContinue callback to enable "Next" button navigation */}
            <Component onContinue={() => scrollToNextSection(index)} />
          </Fade>
        </div>
      ))}

     
      
    </div>
  );
}
