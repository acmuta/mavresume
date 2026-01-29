"use client";
import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PersonalInfoSection } from "../../components/sections/personalInfo";
import { TechnicalSkillsSection } from "../../components/sections/technicalSkills";
import { EducationSection } from "../../components/sections/education";
import { ExperienceSection } from "../../components/sections/experience";
import { ProjectsSection } from "../../components/sections/projects";
import { Loader2, Settings2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Fade } from "react-awesome-reveal";
import { useGuideStore } from "../../store/useGuideStore";
import { useResumeStore, type SectionId } from "../../store/useResumeStore";
import { getResumeWithData } from "../../lib/resumeService";
import { useAutoSave } from "../../lib/hooks/useAutoSave";
import { SectionManagerModal } from "../../components/elements/resume/SectionManagerModal";

/**
 * Section configuration map.
 * Maps section IDs to their components and display labels.
 */
const SECTION_CONFIG: Record<string, { Component: React.FC; label: string }> = {
  "personal-info": { Component: PersonalInfoSection, label: "Personal Info" },
  education: { Component: EducationSection, label: "Education" },
  "technical-skills": { Component: TechnicalSkillsSection, label: "Skills" },
  projects: { Component: ProjectsSection, label: "Projects" },
  experience: { Component: ExperienceSection, label: "Experience" },
};

function BuilderPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resumeId = searchParams.get("id");
  const { setCurrentSection } = useGuideStore();
  const {
    currentResumeId,
    setCurrentResumeId,
    setResumeFromDatabase,
    sectionOrder,
  } = useResumeStore();

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Track current section index for single-section display
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Section manager modal state
  const [isSectionManagerOpen, setIsSectionManagerOpen] = useState(false);

  // Enable auto-save when resume is loaded
  useAutoSave(!!currentResumeId);

  // Load resume from database on mount
  useEffect(() => {
    async function loadResume() {
      // If no resume ID, redirect to templates
      if (!resumeId) {
        router.replace("/templates");
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const resumeWithData = await getResumeWithData(resumeId);

        if (!resumeWithData) {
          setLoadError("Resume not found");
          // Redirect to dashboard after a short delay
          setTimeout(() => router.replace("/dashboard"), 2000);
          return;
        }

        // Set the current resume ID
        setCurrentResumeId(resumeId);

        // Hydrate the store with database data
        if (resumeWithData.resume_data) {
          setResumeFromDatabase({
            personal_info: resumeWithData.resume_data.personal_info,
            education: resumeWithData.resume_data.education,
            projects: resumeWithData.resume_data.projects,
            experience: resumeWithData.resume_data.experience,
            skills: resumeWithData.resume_data.skills,
            section_order: resumeWithData.resume_data.section_order,
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load resume:", error);
        setLoadError(
          error instanceof Error ? error.message : "Failed to load resume",
        );
        setIsLoading(false);
      }
    }

    loadResume();

    // Cleanup: reset store when leaving builder
    return () => {
      // Only reset if we're actually navigating away (not just re-rendering)
      // This is handled by the component unmount
    };
  }, [resumeId, router, setCurrentResumeId, setResumeFromDatabase]);

  // Build dynamic sections array from sectionOrder
  const sections = useMemo(() => {
    return sectionOrder
      .filter((id) => SECTION_CONFIG[id]) // Only include sections that have a config
      .map((id) => ({
        Component: SECTION_CONFIG[id].Component,
        id: id as SectionId,
        label: SECTION_CONFIG[id].label,
      }));
  }, [sectionOrder]);

  // Clamp currentSectionIndex if sections are removed
  useEffect(() => {
    if (currentSectionIndex >= sections.length && sections.length > 0) {
      setCurrentSectionIndex(sections.length - 1);
    }
  }, [sections.length, currentSectionIndex]);

  // Update guide store when section changes (for contextual help)
  useEffect(() => {
    const sectionId = sections[currentSectionIndex]?.id;
    if (sectionId) {
      setCurrentSection(sectionId);
    }
  }, [currentSectionIndex, sections, setCurrentSection]);

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

  const activeSection = sections[currentSectionIndex]?.id || "personal-info";

  // Loading state
  if (isLoading) {
    return (
      <main className="relative text-white z-10 md:px-4 py-5 md:py-20 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#274cbc]" />
          <p className="text-[#a4a7b5]">Loading your resume...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (loadError) {
    return (
      <main className="relative text-white z-10 md:px-4 py-5 md:py-20 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 min-h-[50vh]">
          <div className="rounded-md bg-red-500/10 border border-red-500/30 px-6 py-4 text-center">
            <p className="text-red-400">{loadError}</p>
            <p className="text-sm text-[#6d7895] mt-2">
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Handle empty sections state
  if (sections.length === 0) {
    return (
      <main className="relative text-white z-10 md:px-4 py-5 md:py-20 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-6 min-h-[50vh]">
          <div className="rounded-2xl border-2 border-dashed border-[#2d313a] bg-[#151618]/80 px-8 py-12 text-center">
            <Settings2 className="w-12 h-12 text-[#3d4353] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              No Sections Added
            </h2>
            <p className="text-[#6d7895] mb-6 max-w-md">
              Your resume doesn&apos;t have any sections yet. Add sections to
              start building your resume.
            </p>
            <Button
              onClick={() => setIsSectionManagerOpen(true)}
              className="bg-[#274cbc] text-white hover:bg-[#315be1] rounded-xl px-6"
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Manage Sections
            </Button>
          </div>
        </div>
        <SectionManagerModal
          open={isSectionManagerOpen}
          onOpenChange={setIsSectionManagerOpen}
        />
      </main>
    );
  }

  const CurrentSection =
    sections[currentSectionIndex]?.Component || PersonalInfoSection;

  return (
    <main className="relative text-white z-10 px-2 py-3 md:px-4 md:py-20 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 md:gap-5">
        {/* Navigation controls */}
        <Fade
          triggerOnce
          className="flex flex-col relative items-center justify-center p-2 md:p-3 rounded-2xl border-2 border-[#1b1d20]
                bg-[#151618]/80 gap-2 md:gap-5 bg-[radial-gradient(circle_at_top,#1c2233,#101113_70%)] shadow-[0_25px_60px_rgba(3,4,7,0.55)]"
        >
          <div className="flex relative flex-col items-center w-full">
            {/* Header with title and manage button */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-sm md:text-md font-bold">Navigation</h1>
              {/* Manage Sections button - visible on all screen sizes */}
              <Button
                onClick={() => setIsSectionManagerOpen(true)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:h-10 md:w-10 text-[#6d7895] hover:text-white hover:bg-white/10 transition-all duration-300"
                aria-label="Manage sections"
              >
                <Settings2 className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
            
            {/* Horizontal scrollable navigation */}
            <div className="w-full overflow-x-auto scrollbar-hide">
              <nav className="flex items-center gap-2 min-w-max px-1 py-1 justify-center">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => goToSection(index)}
                    disabled={isTransitioning || currentSectionIndex === index}
                    className={`py-2 px-4 md:py-1.5 text-xs md:text-sm font-medium rounded-full whitespace-nowrap transition-all duration-300 ${
                      activeSection === section.id
                        ? "px-6 md:px-8 text-white bg-[#274cbc]"
                        : "text-[#6d7895] hover:text-[#cfd3e1] hover:bg-white/5 cursor-pointer"
                    } disabled:cursor-not-allowed`}
                    aria-label={`Go to ${section.label} section`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
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
              <CurrentSection />
            </div>
          </section>
        </Fade>
      </div>

      {/* Section Manager Modal */}
      <SectionManagerModal
        open={isSectionManagerOpen}
        onOpenChange={setIsSectionManagerOpen}
      />
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
