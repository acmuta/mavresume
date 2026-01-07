"use client";
import { useState } from "react";
import { PersonalInfoSection } from "../../components/sections/personalInfo";
import { BuilderHeaderBar } from "../../components/elements/BuilderHeaderBar";
import { TechnicalSkillsSection } from "../../components/sections/technicalSkills";
import { EducationSection } from "../../components/sections/education";
import { ExperienceSection } from "../../components/sections/experience";
import { ProjectsSection } from "../../components/sections/projects";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function BuilderPage() {
  // Track current section index for single-section display
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Section configuration: defines order and IDs for navigation/header tracking
  const sections = [
    { Component: PersonalInfoSection, id: "personal-info" },
    { Component: EducationSection, id: "education" },
    { Component: TechnicalSkillsSection, id: "technical-skills" },
    { Component: ProjectsSection, id: "projects" },
    { Component: ExperienceSection, id: "experience" },
  ];

  /**
   * Navigate to the previous section with fade transition
   */
  const goToPrevious = () => {
    if (currentSectionIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      // Fade out current section
      setTimeout(() => {
        setCurrentSectionIndex((prev) => prev - 1);
        // Fade in new section after a brief delay to allow React to render
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 250); // Half of transition duration for smooth fade out
    }
  };

  /**
   * Navigate to the next section with fade transition
   */
  const goToNext = () => {
    if (currentSectionIndex < sections.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      // Fade out current section
      setTimeout(() => {
        setCurrentSectionIndex((prev) => prev + 1);
        // Fade in new section after a brief delay to allow React to render
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 250); // Half of transition duration for smooth fade out
    }
  };

  const CurrentSection = sections[currentSectionIndex].Component;

  const sectionIds = [
    "personal-info",
    "education",
    "technical-skills",
    "projects",
    "experience",
  ];

  const activeSection = sectionIds[currentSectionIndex] || "personal-info";

  return (
    <div className="relative min-h-screen  text-white">
      {/* Background gradient overlay matching landing page */}
      <div className="absolute inset-0 " />

      {/* Main content area matching landing page structure */}
      <main className="relative z-10 px-4 pb-20 lg:px-8">
        <BuilderHeaderBar currentSectionIndex={currentSectionIndex} />
        <div className="mx-auto flex max-w-6xl flex-col gap-8 pt-6">
          {/* Navigation controls */}
          
          <div className="flex items-center justify-center gap-5">

            {/* Left navigation arrow */}
            {currentSectionIndex > 0 && (
              <Button
                onClick={goToPrevious}
                disabled={isTransitioning}
                variant="outline"
                size="icon-lg"
                className="z-40
                rounded-2xl border-2 border-dashed border-[#2d313a]
                bg-[#151618]/80 backdrop-blur-sm
                text-white hover:text-white
                hover:bg-[#1c1d21]/90 hover:border-[#3d4353]
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg hover:shadow-xl hover:scale-[1.05]"
                aria-label="Previous section"
              >
                <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
              </Button>
            )}

            {/* Navigation steps */}
            <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
              <span
                className={`px-2 py-1 rounded-lg transition-all duration-200 ${
                  activeSection === "personal-info"
                    ? "text-white bg-white/10"
                    : "text-[#6d7895] hover:text-[#cfd3e1]"
                }`}
              >
                Personal Info
              </span>
              <ChevronRight className="w-4 h-4 text-[#6d7895]" />

              <span
                className={`px-2 py-1 rounded-lg transition-all duration-200 ${
                  activeSection === "education"
                    ? "text-white bg-white/10"
                    : "text-[#6d7895] hover:text-[#cfd3e1]"
                }`}
              >
                Education
              </span>
              <ChevronRight className="w-4 h-4 text-[#6d7895]" />

              <span
                className={`px-2 py-1 rounded-lg transition-all duration-200 ${
                  activeSection === "technical-skills"
                    ? "text-white bg-white/10"
                    : "text-[#6d7895] hover:text-[#cfd3e1]"
                }`}
              >
                Skills
              </span>
              <ChevronRight className="w-4 h-4 text-[#6d7895]" />

              <span
                className={`px-2 py-1 rounded-lg transition-all duration-200 ${
                  activeSection === "projects"
                    ? "text-white bg-white/10"
                    : "text-[#6d7895] hover:text-[#cfd3e1]"
                }`}
              >
                Projects
              </span>
              <ChevronRight className="w-4 h-4 text-[#6d7895]" />

              <span
                className={`px-2 py-1 rounded-lg transition-all duration-200 ${
                  activeSection === "experience"
                    ? "text-white bg-white/10"
                    : "text-[#6d7895] hover:text-[#cfd3e1]"
                }`}
              >
                Experience
              </span>
            </nav>

            {/* Right navigation arrow - hidden on last section */}
            {currentSectionIndex < sections.length - 1 && (
              <Button
                onClick={goToNext}
                disabled={isTransitioning}
                variant="outline"
                size="icon-lg"
                className="z-40
                rounded-2xl border-2 border-dashed border-[#2d313a]
                bg-[#151618]/80 backdrop-blur-sm
                text-white hover:text-white
                hover:bg-[#1c1d21]/90 hover:border-[#3d4353]
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg hover:shadow-xl hover:scale-[1.05]"
                aria-label="Next section"
              >
                <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
              </Button>
            )}
          </div>

          {/* Section container with hero-like panel framing */}
          <section className="relative overflow-hidden rounded-3xl border-2 border-dashed border-[#2c3037] bg-[radial-gradient(circle_at_top,_#1c2233,_#101113_70%)] shadow-[0_25px_60px_rgba(3,4,7,0.55)]">
            {/* Subtle background glow effects */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <div className="absolute -top-24 left-16 h-64 w-64 rounded-full bg-[#274cbc]/20 blur-[100px]" />
              <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-[#19c8ff]/15 blur-[80px]" />
            </div>

            {/* Section content with fade transition */}
            <div
              key={currentSectionIndex}
              className={`relative transition-opacity duration-500 ease-in-out ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              <CurrentSection onContinue={goToNext} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
