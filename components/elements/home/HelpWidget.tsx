"use client";

import { useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  X,
  ChevronRight,
  Lightbulb,
  BookOpen,
  Check,
  AlertCircle,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";
import { useGuideStore } from "@/store/useGuideStore";
import {
  getSectionTip,
  getGuideByName,
  sectionIdToGuideName,
  InfoGuideData,
  SectionTip,
} from "@/components/guides/InfoGuideConfig";
import { InfoGuide } from "@/components/guides/InfoGuide";
import {
  getRoleData,
  getRoleQualificationsByImportance,
  type Qualification,
} from "@/data/role-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSectionLabelById } from "@/lib/resume/sections";

/**
 * Builder Help Modal
 *
 * A contextual help experience that provides:
 * - Shows tips for the current section being edited
 * - Quick access to full comprehensive guides
 * - Persists open state and the last selected tab
 */

export function HelpWidget() {
  const {
    isWidgetExpanded,
    toggleWidget,
    setWidgetExpanded,
    activeWidgetTab,
    setActiveWidgetTab,
    currentSection,
    currentTemplateType,
    currentRole,
  } = useGuideStore();

  // Get contextual content based on current section
  const sectionTip = getSectionTip(currentSection);
  const guideName = sectionIdToGuideName[currentSection];
  const fullGuide = guideName ? getGuideByName(guideName) : undefined;
  const roleGuide = getRoleData(currentTemplateType, currentRole);
  const roleQualifications = roleGuide
    ? getRoleQualificationsByImportance(roleGuide.qualifications)
    : null;
  const hasRoleGuide = Boolean(roleGuide && currentRole && roleQualifications);
  const currentSectionLabel = getSectionLabelById(currentSection);
  const availabilityPills = [
    {
      label: sectionTip ? "Quick tips ready" : "No quick tips yet",
      tone: sectionTip
        ? "border-[#274cbc]/35 bg-[#274cbc]/15 text-[#9fb3ff]"
        : "border-[#2b3242] bg-[#10121a]/70 text-[#6d7895]",
    },
    {
      label: fullGuide ? "Full guide available" : "Guide coming soon",
      tone: fullGuide
        ? "border-[#58f5c3]/30 bg-[#58f5c3]/10 text-[#c8ffe7]"
        : "border-[#2b3242] bg-[#10121a]/70 text-[#6d7895]",
    },
    {
      label: hasRoleGuide ? "Role guide active" : "No role guide",
      tone: hasRoleGuide
        ? "border-[#facc15]/25 bg-[#facc15]/10 text-[#fde68a]"
        : "border-[#2b3242] bg-[#10121a]/70 text-[#6d7895]",
    },
  ];

  useEffect(() => {
    if (activeWidgetTab === "role" && !hasRoleGuide) {
      setActiveWidgetTab("tips");
    }
  }, [activeWidgetTab, hasRoleGuide, setActiveWidgetTab]);

  return (
    <>
      <motion.button
        onClick={toggleWidget}
        className={`fixed bottom-6 right-6 z-40 flex h-12 items-center gap-2 rounded-full border border-[#2b3242] bg-[#0f1117]/90 px-4 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-all duration-300 ease-out hover:border-[#4b5a82] hover:bg-[#151923] hover:shadow-[0_24px_55px_rgba(0,0,0,0.38)] ${isWidgetExpanded ? "pointer-events-none scale-95 opacity-0" : "opacity-100"}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open builder help"
        aria-expanded={isWidgetExpanded}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#274cbc]/40 bg-[#274cbc]/16 text-[#9fb3ff]">
          <HelpCircle className="h-4 w-4" />
        </span>
        <span className="hidden sm:inline">Resume Help</span>
      </motion.button>

      <Dialog open={isWidgetExpanded} onOpenChange={setWidgetExpanded}>
        <DialogContent
          showCloseButton={false}
          className="w-[94vw] max-w-5xl gap-0 overflow-hidden rounded-[2rem] border border-[#2b3242] bg-[radial-gradient(circle_at_top_left,_rgba(39,76,188,0.18),_transparent_34%),linear-gradient(180deg,_rgba(18,20,27,0.98),_rgba(11,12,16,0.99))] p-0 text-white shadow-[0_30px_80px_rgba(3,4,7,0.45)]"
        >
          <div className="absolute inset-0 opacity-70">
            <div className="absolute left-0 top-0 h-32 w-32 rounded-full bg-[#274cbc]/16 blur-[75px]" />
            <div className="absolute bottom-0 right-0 h-28 w-28 rounded-full bg-[#19c8ff]/8 blur-[70px]" />
          </div>

          <div className="relative flex max-h-[85vh] flex-col overflow-hidden">
            <DialogHeader className="border-b border-[#2b3242] px-5 py-5 text-left sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#89a5ff]">
                    Builder help
                  </p>
                  <DialogTitle className="text-2xl font-semibold tracking-tight text-white sm:text-[2rem]">
                    Help for {currentSectionLabel}
                  </DialogTitle>
                  <DialogDescription className="max-w-2xl text-sm leading-relaxed text-[#a4a7b5]">
                    Stay in flow with section-specific advice, or switch to the
                    full guide when you want deeper resume-writing direction.
                  </DialogDescription>
                </div>

                <button
                  onClick={() => setWidgetExpanded(false)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2b3242] bg-[#10121a]/75 text-[#6d7895] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
                  aria-label="Close builder help"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </DialogHeader>

            <div className="flex min-h-0 flex-1 flex-col md:grid md:grid-cols-[280px_minmax(0,1fr)]">
              <aside className="min-h-0 overflow-y-auto border-b border-[#2b3242] bg-[#0f1117]/45 px-5 py-5 md:border-b-0 md:border-r md:px-6 md:py-6">
                <div className="rounded-[1.5rem] border border-[#2b3242] bg-[#10121a]/70 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
                  <div className="flex items-start gap-3">
                    
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
                        Currently editing
                      </p>
                      <p className="mt-2 text-base font-semibold text-white">
                        {currentSectionLabel}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[#a4a7b5]">
                        Use quick tips for a fast pass, or jump into the full
                        guide when you want examples and stronger structure.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {availabilityPills.map((pill) => (
                      <span
                        key={pill.label}
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${pill.tone}`}
                      >
                        {pill.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-[1.25rem] border border-[#2b3242] bg-[#10121a]/55 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Lightbulb className="h-4 w-4 text-[#facc15]" />
                      Quick Tips
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[#a4a7b5]">
                      Best when you need concise guidance before moving to the
                      next section.
                    </p>
                  </div>

                  <div className="rounded-[1.25rem] border border-[#2b3242] bg-[#10121a]/55 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <BookOpen className="h-4 w-4 text-[#89a5ff]" />
                      Full Guide
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[#a4a7b5]">
                      Best when you want deeper explanations, structure rules,
                      and section examples.
                    </p>
                  </div>

                  {hasRoleGuide && (
                    <div className="rounded-[1.25rem] border border-[#2b3242] bg-[#10121a]/55 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <BriefcaseBusiness className="h-4 w-4 text-[#facc15]" />
                        Role & Qualifications
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[#a4a7b5]">
                        Review the skills and qualifications this resume should
                        communicate for {currentRole}.
                      </p>
                    </div>
                  )}
                </div>
              </aside>

              <div className="flex min-h-0 flex-1 flex-col">
                <div className="border-b border-[#2b3242] px-5 py-4 sm:px-6">
                  <div className="inline-flex flex-wrap rounded-full border border-[#2b3242] bg-[#10121a]/70 p-1">
                    <button
                      onClick={() => setActiveWidgetTab("tips")}
                      className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all ${
                        activeWidgetTab === "tips"
                          ? "bg-[#274cbc] text-white shadow-[0_12px_30px_rgba(39,76,188,0.25)]"
                          : "text-[#a4a7b5] hover:text-white"
                      }`}
                    >
                      <Lightbulb className="h-4 w-4" />
                      Quick Tips
                    </button>
                    <button
                      onClick={() => setActiveWidgetTab("guide")}
                      className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all ${
                        activeWidgetTab === "guide"
                          ? "bg-[#274cbc] text-white shadow-[0_12px_30px_rgba(39,76,188,0.25)]"
                          : "text-[#a4a7b5] hover:text-white"
                      }`}
                    >
                      <BookOpen className="h-4 w-4" />
                      Full Guide
                    </button>
                    {hasRoleGuide && (
                      <button
                        onClick={() => setActiveWidgetTab("role")}
                        className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all ${
                          activeWidgetTab === "role"
                            ? "bg-[#274cbc] text-white shadow-[0_12px_30px_rgba(39,76,188,0.25)]"
                            : "text-[#a4a7b5] hover:text-white"
                        }`}
                      >
                        <BriefcaseBusiness className="h-4 w-4" />
                        Role & Qualifications
                      </button>
                    )}
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                  {activeWidgetTab === "tips" ? (
                    <TipsContent sectionTip={sectionTip} />
                  ) : activeWidgetTab === "guide" ? (
                    <GuideContent guide={fullGuide} />
                  ) : (
                    <RoleContent
                      roleTitle={currentRole}
                      requiredQualifications={roleQualifications?.required}
                      niceToHaveQualifications={roleQualifications?.niceToHave}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TipsContent({ sectionTip }: { sectionTip: SectionTip | undefined }) {
  if (!sectionTip) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-[#2b3242] bg-[#10121a]/55 px-6 py-10 text-center text-[#6d7895]">
        <p>No quick tips are available for this section yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-[#2b3242] bg-[#10121a]/65 p-5">
        <h4 className="flex items-center gap-2 text-base font-semibold text-white">
          <Lightbulb className="h-4 w-4 text-yellow-400" />
          {sectionTip.title}
        </h4>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {sectionTip.tips.map((tip, index) => (
            <li
              key={index}
              className="flex items-start gap-3 rounded-[1.15rem] border border-[#2b3242] bg-[#0f1117]/65 p-3 text-sm leading-relaxed text-[#cfd3e1]"
            >
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-[1.5rem] border border-green-500/20 bg-green-500/5 p-5">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-400">
            <Check className="h-4 w-4" />
          Do
          </h4>
          <ul className="space-y-2">
            {sectionTip.doList.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm leading-relaxed text-[#cfd3e1]"
              >
                <span className="shrink-0 text-green-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.5rem] border border-red-500/20 bg-red-500/5 p-5">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-400">
            <AlertCircle className="h-4 w-4" />
          Don&apos;t
          </h4>
          <ul className="space-y-2">
            {sectionTip.dontList.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm leading-relaxed text-[#cfd3e1]"
              >
                <span className="shrink-0 text-red-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function GuideContent({ guide }: { guide: InfoGuideData | undefined }) {
  if (!guide) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-[#2b3242] bg-[#10121a]/55 px-6 py-10 text-center text-[#6d7895]">
        <p>No full guide is available for this section yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-[#2b3242] bg-[#10121a]/65 p-5">
      <InfoGuide guide={guide} />
    </div>
  );
}

function RoleContent({
  roleTitle,
  requiredQualifications,
  niceToHaveQualifications,
}: {
  roleTitle: string | null;
  requiredQualifications: Qualification[] | undefined;
  niceToHaveQualifications: Qualification[] | undefined;
}) {
  if (!roleTitle || !requiredQualifications || !niceToHaveQualifications) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-[#2b3242] bg-[#10121a]/65 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#274cbc]/30 bg-[#274cbc]/14 text-[#9fb3ff]">
            <BriefcaseBusiness className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
              Target role
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
              {roleTitle}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#a4a7b5]">
              This resume is currently targeting {roleTitle}. Use these
              qualifications to decide what skills, tools, and impact signals
              should show up clearly across your sections.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <QualificationGroup
          title="Required"
          description="These are the core qualifications the role expects to see."
          icon={<Check className="h-4 w-4" />}
          items={requiredQualifications}
          className="border-green-500/20 bg-green-500/5"
          titleClassName="text-green-400"
          bulletClassName="text-green-400"
        />
        <QualificationGroup
          title="Nice to Have"
          description="These are useful differentiators that can strengthen your resume."
          icon={<Sparkles className="h-4 w-4" />}
          items={niceToHaveQualifications}
          className="border-[#274cbc]/25 bg-[#274cbc]/8"
          titleClassName="text-[#9fb3ff]"
          bulletClassName="text-[#89a5ff]"
        />
      </div>
    </div>
  );
}

function QualificationGroup({
  title,
  description,
  icon,
  items,
  className,
  titleClassName,
  bulletClassName,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  items: Qualification[];
  className: string;
  titleClassName: string;
  bulletClassName: string;
}) {
  return (
    <section className={`rounded-[1.5rem] border p-5 ${className}`}>
      <div className={`flex items-center gap-2 text-sm font-semibold ${titleClassName}`}>
        {icon}
        {title}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[#a4a7b5]">
        {description}
      </p>
      <ul className="mt-4 space-y-2">
        {items.map((qualification) => (
          <li
            key={`${title}-${qualification.skill}`}
            className="flex items-start gap-2 text-sm leading-relaxed text-[#cfd3e1]"
          >
            <span className={`mt-1 shrink-0 ${bulletClassName}`}>•</span>
            <span>{qualification.skill}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
