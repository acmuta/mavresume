"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, Settings2 } from "lucide-react";

import { Button } from "../../components/ui/button";
import { useGuideStore } from "../../store/useGuideStore";
import { useResumeStore, type SectionId } from "../../store/useResumeStore";
import { getResumeWithData } from "../../lib/resumeService";
import { useAutoSave } from "../../lib/hooks/useAutoSave";
import { SectionManagerModal } from "../../components/elements/resume/SectionManagerModal";
import { ResumeSettingsModal } from "../../components/elements/resume/ResumeSettingsModal";
import {
  CORE_SECTION_ID,
  getSectionLabelById,
  normalizeSectionId,
} from "@/lib/resume/sections";
import {
  getBuilderSectionComponent,
  getSectionRuntimeDefinition,
} from "@/lib/resume/sectionRuntimeRegistry";

function SectionNotImplemented() {
  return (
    <div className="rounded-[1.5rem] border border-amber-500/35 bg-amber-500/10 p-6 text-sm text-amber-100 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
      This section is part of the dynamic template system, but its form UI is
      not implemented yet.
    </div>
  );
}

function BuilderPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resumeId = searchParams.get("id");
  const { setCurrentSection, setCurrentTemplateType, setCurrentRole } =
    useGuideStore();
  const {
    currentResumeId,
    setCurrentResumeId,
    setResumeFromDatabase,
    sectionOrder,
    isResumeSettingsOpen,
    setIsResumeSettingsOpen,
  } = useResumeStore();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSectionManagerOpen, setIsSectionManagerOpen] = useState(false);

  useAutoSave(!!currentResumeId);

  useEffect(() => {
    async function loadResume() {
      if (!resumeId) {
        router.replace("/templates");
        return;
      }

      setIsLoading(true);
      setLoadError(null);
      setCurrentTemplateType(null);
      setCurrentRole(null);

      try {
        const resumeWithData = await getResumeWithData(resumeId);

        if (!resumeWithData) {
          setLoadError("Resume not found");
          setTimeout(() => router.replace("/dashboard"), 2000);
          return;
        }

        setCurrentResumeId(resumeId);
        setCurrentTemplateType(resumeWithData.template_type ?? null);
        setCurrentRole(resumeWithData.resume_data?.role ?? null);

        if (resumeWithData.resume_data) {
          setResumeFromDatabase({
            role: resumeWithData.resume_data.role,
            personal_info: resumeWithData.resume_data.personal_info,
            education: resumeWithData.resume_data.education,
            projects: resumeWithData.resume_data.projects,
            experience: resumeWithData.resume_data.experience,
            leadership_activities:
              resumeWithData.resume_data.leadership_activities,
            skills: resumeWithData.resume_data.skills,
            section_order: resumeWithData.resume_data.section_order,
            section_data: resumeWithData.resume_data.section_data,
            schema_version: resumeWithData.resume_data.schema_version,
            pdf_settings: resumeWithData.resume_data.pdf_settings,
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
  }, [
    resumeId,
    router,
    setCurrentResumeId,
    setCurrentRole,
    setCurrentTemplateType,
    setResumeFromDatabase,
  ]);

  const sections = useMemo(() => {
    return sectionOrder.map((id) => {
      const normalizedId = normalizeSectionId(id);
      const runtimeDefinition = getSectionRuntimeDefinition(normalizedId);
      return {
        Component:
          getBuilderSectionComponent(normalizedId) ?? SectionNotImplemented,
        id: normalizedId as SectionId,
        label: runtimeDefinition?.label ?? getSectionLabelById(normalizedId),
      };
    });
  }, [sectionOrder]);

  useEffect(() => {
    if (currentSectionIndex >= sections.length && sections.length > 0) {
      setCurrentSectionIndex(sections.length - 1);
    }
  }, [sections.length, currentSectionIndex]);

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
        setTimeout(() => setIsTransitioning(false), 60);
      }, 180);
    }
  };

  const activeSection = sections[currentSectionIndex]?.id || CORE_SECTION_ID;
  const CurrentSection =
    sections[currentSectionIndex]?.Component || SectionNotImplemented;

  if (isLoading) {
    return (
      <main className="relative z-10 px-1 py-2 md:px-2">
        <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full border border-[#2b3242] bg-[#111319]/80 text-[#89a5ff] shadow-[0_0_40px_rgba(39,76,188,0.15)]">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <p className="text-sm uppercase tracking-[0.24em] text-[#6d7895]">
            Loading builder
          </p>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="relative z-10 px-1 py-2 md:px-2">
        <div className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center">
          <div className="rounded-[2rem] border border-red-500/30 bg-red-500/10 px-8 py-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <p className="text-base font-medium text-red-300">{loadError}</p>
            <p className="mt-3 text-sm text-[#a4a7b5]">
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (sections.length === 0) {
    return (
      <main className="relative z-10 px-1 py-2 md:px-2">
        <div className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center">
          <div className="w-full max-w-xl rounded-[2rem] border border-[#2b3242] bg-[radial-gradient(circle_at_top,_rgba(39,76,188,0.16),_transparent_45%),linear-gradient(180deg,_rgba(21,23,28,0.94),_rgba(11,12,16,0.96))] px-8 py-10 text-center shadow-[0_30px_80px_rgba(3,4,7,0.42)]">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-[#2b3242] bg-[#151923] text-[#89a5ff]">
              <Settings2 className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-white">
              Start by adding sections
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#cfd3e1]">
              Your resume is empty right now. Add the sections you want, then
              start filling them in.
            </p>
            <Button
              onClick={() => setIsSectionManagerOpen(true)}
              className="mt-6 h-11 rounded-full bg-[#274cbc] px-6 text-sm font-semibold text-white hover:bg-[#315be1]"
            >
              <Plus className="mr-2 h-4 w-4" />
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

  return (
    <main className="relative z-10 px-1 py-2 md:px-2">
      <div className="mx-auto flex max-w-[980px] flex-col gap-5">  
        <div className="w-full flex-1">
           <div className="flex w-full justify-center text-center my-3">
              <div className="min-w-0">
                <button
                  type="button"
                  onClick={() => setIsSectionManagerOpen(true)}
                  className="group relative text-[11px] font-semibold uppercase tracking-[0.24em] text-[#89a5ff] transition hover:text-[#b3c2ff]"
                  aria-label="Open section manager"
                >
                  <span className="relative inline-block after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#89a5ff] after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                    Manage Sections
                  </span>
                </button>
              </div>
            </div>
          <div className=" pb-0.5 overflow-x-auto ">

            <div className="mx-auto flex w-max min-w-full justify-center px-4 ">
              <div className="inline-flex px-15 py-1.5  min-w-max items-center gap-1.5 rounded-2xl border border-[#2b3242] bg-[#0f141f]/80 [mask-image:linear-gradient(to_right,transparent_0%,transparent_3%,black_12%,black_88%,transparent_97%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,transparent_3%,black_12%,black_88%,transparent_97%,transparent_100%)]">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => goToSection(index)}
                    disabled={isTransitioning || currentSectionIndex === index}
                    className={`inline-flex h-9 items-center rounded-xl border px-3.5 text-sm font-medium whitespace-nowrap transition-all ${
                      activeSection === section.id
                        ? "border-[#4f66a6] bg-[#274cbc]/85 text-white shadow-[0_8px_20px_rgba(39,76,188,0.28)]"
                        : "border-transparent bg-transparent text-[#a4a7b5] hover:border-[#3e4a67] hover:bg-[#161e30] hover:text-white"
                    } disabled:cursor-not-allowed`}
                    aria-current={
                      activeSection === section.id ? "page" : undefined
                    }
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={activeSection}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: isTransitioning ? 0 : 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="relative"
          >
            <CurrentSection />
          </motion.section>
        </AnimatePresence>
      </div>

      <SectionManagerModal
        open={isSectionManagerOpen}
        onOpenChange={setIsSectionManagerOpen}
      />
      <ResumeSettingsModal
        open={isResumeSettingsOpen}
        onOpenChange={(open) => setIsResumeSettingsOpen(open)}
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
