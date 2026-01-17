"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PersonalInfoSection } from "../../components/sections/personalInfo";
import { BuilderHeaderBar } from "../../components/elements/BuilderHeaderBar";
import { TechnicalSkillsSection } from "../../components/sections/technicalSkills";
import { EducationSection } from "../../components/sections/education";
import { ExperienceSection } from "../../components/sections/experience";
import { ProjectsSection } from "../../components/sections/projects";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Fade } from "react-awesome-reveal";

function BuilderPageContent() {
  const searchParams = useSearchParams();
  const resumeType = searchParams.get("type");

  // Track current section index for single-section display
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Store resume type for future template-specific logic
  useEffect(() => {
    if (resumeType) {
      // TODO: Store in Zustand store or use for template-specific configuration
    }
  }, [resumeType]);

  // Section configuration: defines order and IDs for navigation/header tracking
  const sections = [
    { Component: PersonalInfoSection, id: "personal-info" },
    { Component: EducationSection, id: "education" },
    { Component: TechnicalSkillsSection, id: "technical-skills" },
    { Component: ProjectsSection, id: "projects" },
    { Component: ExperienceSection, id: "experience" },
  ];

  const goToPrevious = () => {
    if (currentSectionIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSectionIndex((prev) => prev - 1);
        // Fade in new section after a brief delay to allow React to render
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 250);
    }
  };
  const goToNext = () => {
    if (currentSectionIndex < sections.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSectionIndex((prev) => prev + 1);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 250);
    }
  };
  const goToSection = (targetIndex: number) => {
    if (
      targetIndex >= 0 &&
      targetIndex < sections.length &&
      targetIndex !== currentSectionIndex &&
      !isTransitioning
    ) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSectionIndex(targetIndex);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 250);
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

      
      <main className="relative text-white z-10 md:px-4 py-5 md:py-20 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 ">
          {/* Navigation controls */}
          <Fade
            triggerOnce
            className="flex flex-col items-center justify-center p-2 md:p-3 rounded-3xl border border-[#1b1d20]
                bg-[#151618]/80 gap-5 bg-[radial-gradient(circle_at_top,#1c2233,#101113_70%)] shadow-[0_25px_60px_rgba(3,4,7,0.55)]"
          >
            <div className="flex flex-col items-center">
              <h1 className="text-md font-bold">Navigation</h1>
              <div className="flex items-center scale-60 md:scale-100 gap-2">
                {/* Left navigation arrow */}
                {currentSectionIndex > 0 && (
                  <Button
                    onClick={goToPrevious}
                    disabled={isTransitioning}
                    variant="outline"
                    size="icon-lg"
                    className="z-40 hidden md:flex justify-center
                rounded-2xl border-2 border-[#2d313a]
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
                <nav className="flex items-center gap-1.5 text-md font-bold">
                  <button
                    onClick={() => goToSection(0)}
                    disabled={isTransitioning || currentSectionIndex === 0}
                    className={`px-2 py-1 rounded-lg transition-all duration-200 ${
                      activeSection === "personal-info"
                        ? "text-white bg-white/10 cursor-default"
                        : "text-[#6d7895] hover:text-[#cfd3e1] hover:bg-white/5 cursor-pointer"
                    } disabled:cursor-not-allowed`}
                    aria-label="Go to Personal Info section"
                  >
                    Personal Info
                  </button>
                  <ChevronRight className="w-4 h-4 text-[#6d7895]" />

                  <button
                    onClick={() => goToSection(1)}
                    disabled={isTransitioning || currentSectionIndex === 1}
                    className={`px-2 py-1 rounded-lg transition-all duration-200 ${
                      activeSection === "education"
                        ? "text-white bg-white/10 cursor-default"
                        : "text-[#6d7895] hover:text-[#cfd3e1] hover:bg-white/5 cursor-pointer"
                    } disabled:cursor-not-allowed`}
                    aria-label="Go to Education section"
                  >
                    Education
                  </button>
                  <ChevronRight className="w-4 h-4 text-[#6d7895]" />

                  <button
                    onClick={() => goToSection(2)}
                    disabled={isTransitioning || currentSectionIndex === 2}
                    className={`px-2 py-1 rounded-lg transition-all duration-200 ${
                      activeSection === "technical-skills"
                        ? "text-white bg-white/10 cursor-default"
                        : "text-[#6d7895] hover:text-[#cfd3e1] hover:bg-white/5 cursor-pointer"
                    } disabled:cursor-not-allowed`}
                    aria-label="Go to Technical Skills section"
                  >
                    Skills
                  </button>
                  <ChevronRight className="w-4 h-4 text-[#6d7895]" />

                  <button
                    onClick={() => goToSection(3)}
                    disabled={isTransitioning || currentSectionIndex === 3}
                    className={`px-2 py-1 rounded-lg transition-all duration-200 ${
                      activeSection === "projects"
                        ? "text-white bg-white/10 cursor-default"
                        : "text-[#6d7895] hover:text-[#cfd3e1] hover:bg-white/5 cursor-pointer"
                    } disabled:cursor-not-allowed`}
                    aria-label="Go to Projects section"
                  >
                    Projects
                  </button>
                  <ChevronRight className="w-4 h-4 text-[#6d7895]" />

                  <button
                    onClick={() => goToSection(4)}
                    disabled={isTransitioning || currentSectionIndex === 4}
                    className={`px-2 py-1 rounded-lg transition-all duration-200 ${
                      activeSection === "experience"
                        ? "text-white bg-white/10 cursor-default"
                        : "text-[#6d7895] hover:text-[#cfd3e1] hover:bg-white/5 cursor-pointer"
                    } disabled:cursor-not-allowed`}
                    aria-label="Go to Experience section"
                  >
                    Experience
                  </button>
                </nav>

                {/* Right navigation arrow - hidden on last section */}
                {currentSectionIndex < sections.length - 1 && (
                  <Button
                    onClick={goToNext}
                    disabled={isTransitioning}
                    variant="outline"
                    size="icon-lg"
                    className="z-40 hidden md:flex justify-center
                rounded-2xl border-2 border-[#2d313a]
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
            </div>
          </Fade>
          <Fade triggerOnce>
            <section className="relative overflow-hidden rounded-3xl border-2 border-dashed border-[#2c3037] bg-[radial-gradient(circle_at_top,#1c2233,#101113_70%)] shadow-[0_25px_60px_rgba(3,4,7,0.55)]">
              {/* background glow effects */}
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
          </Fade>
        </div>
      </main>

  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuilderPageContent />
    </Suspense>
  );
}
