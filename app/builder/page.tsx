"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardCheck, Edit3, Loader2, Plus, Settings2 } from "lucide-react";

import { Button } from "../../components/ui/button";
import { SubmitReviewModal } from "../../components/elements/resume/SubmitReviewModal";
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
  const [resumeName, setResumeName] = useState("Resume");
  const [showSubmitReviewModal, setShowSubmitReviewModal] = useState(false);
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<
    string | null
  >(null);

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
        setResumeName(resumeWithData.name || "Resume");
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
  const builderFileName = `${resumeName || "Resume"}.pdf`;

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
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[1.6rem] border border-[#2b3242] bg-[radial-gradient(circle_at_top_left,_rgba(39,76,188,0.16),_transparent_42%),linear-gradient(180deg,_rgba(18,20,27,0.92),_rgba(11,12,16,0.96))] px-3 py-3 shadow-[0_24px_60px_rgba(3,4,7,0.34)] sm:px-4"
        >
          <div className="absolute inset-0 opacity-65">
            <div className="absolute left-0 top-0 h-24 w-24 rounded-full bg-[#274cbc]/18 blur-[65px]" />
            <div className="absolute bottom-0 right-0 h-20 w-20 rounded-full bg-[#19c8ff]/10 blur-[55px]" />
          </div>

          <div className="relative flex w-full flex-col gap-3 px-3 py-3 sm:px-4 sm:py-3.5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1.5 xl:flex-row xl:items-center xl:gap-3">
                  <h1 className="text-[1.45rem] font-semibold tracking-tight text-white sm:text-[1.7rem]">
                    {sections[currentSectionIndex]?.label}
                  </h1>
                </div>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#cfd3e1]">
                  Edit this section and watch the final document update beside
                  the form.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                <Button
                  onClick={() => {
                    setSubmitSuccessMessage(null);
                    setShowSubmitReviewModal(true);
                  }}
                  className="h-10 rounded-full bg-[#274cbc] px-4 text-sm font-semibold text-white hover:bg-[#315be1]"
                >
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Submit for Review
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsSectionManagerOpen(true)}
                  className="h-10 rounded-full border-[#2b3242] bg-[#10121a]/70 px-4 text-sm text-[#cfd3e1] shadow-none hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Manage Sections
                </Button>
              </div>
            </div>

            {submitSuccessMessage && (
              <div className="inline-flex w-fit items-center rounded-full border border-[#58f5c3]/30 bg-[#58f5c3]/12 px-3 py-1.5 text-sm text-[#c8ffe7]">
                {submitSuccessMessage}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => goToSection(index)}
                  disabled={isTransitioning || currentSectionIndex === index}
                  className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium transition-all ${
                    activeSection === section.id
                      ? "border-[#4b5a82] bg-[#274cbc] text-white shadow-[0_12px_30px_rgba(39,76,188,0.25)]"
                      : "border-[#2b3242] bg-[#10121a]/70 text-[#a4a7b5] hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
                  } disabled:cursor-not-allowed`}
                >
                  <span className="mr-2 text-[11px] uppercase tracking-[0.18em] opacity-70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

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
      {showSubmitReviewModal && (
        <SubmitReviewModal
          mode="builder"
          builderLabel={resumeName}
          builderFileName={builderFileName}
          onClose={() => setShowSubmitReviewModal(false)}
          onSubmitted={() => {
            setShowSubmitReviewModal(false);
            setSubmitSuccessMessage(
              "Review request submitted from your current builder resume.",
            );
          }}
        />
      )}
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
