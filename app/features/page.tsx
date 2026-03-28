"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  Loader2,
  MessageSquareText,
  ScanSearch,
  Settings2,
  Sparkles,
  UploadCloud,
  Wand2,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";


const systemHighlights = [
  {
    label: "Resume Builder",
    title:
      "Start with a product that helps students produce a better first draft",
    description:
      "The builder is not just a form. It combines structure, editing controls, live document feedback, and AI refinement into one guided workspace.",
    badgeClass: "border-[#274cbc]/35 bg-[#274cbc]/14 text-[#a8bbff]",
    accent: "text-[#89a5ff]",
    items: [
      {
        icon: Sparkles,
        title: "Template-based starting point",
        description:
          "Students open a major-specific structure or a custom setup instead of facing a blank page.",
      },
      {
        icon: Settings2,
        title: "Flexible section management",
        description:
          "Sections can be added, reordered, and tuned to fit the resume goal without changing tools.",
      },
      {
        icon: FileText,
        title: "Live PDF output",
        description:
          "The document updates as the student edits, which makes the product feel concrete and reliable.",
      },
    ],
    demo: "builder" as const,
  },
  {
    label: "Resume Review",
    title: "Show that feedback happens on the resume, not away from it",
    description:
      "The review system keeps the submitted PDF at the center of the workflow, so comments, queue state, and final feedback all stay tied to the same file.",
    badgeClass: "border-[#58f5c3]/30 bg-[#58f5c3]/12 text-[#c8ffe7]",
    accent: "text-[#58f5c3]",
    items: [
      {
        icon: ClipboardCheck,
        title: "Simple intake and queueing",
        description:
          "Students submit once, then reviewers claim work from a clear pending and active queue.",
      },
      {
        icon: ScanSearch,
        title: "Inline PDF annotations",
        description:
          "Feedback attaches to highlights and marked regions instead of getting lost in separate notes.",
      },
      {
        icon: MessageSquareText,
        title: "Final written summary",
        description:
          "Students do not just get scattered comments. They also receive a clear closing summary.",
      },
    ],
    demo: "review" as const,
  },
] as const;

const proofBlocks = [
  {
    eyebrow: "AI refinement",
    title: "Show the jump from rough bullet to sharper resume language",
    description:
      "Feature pages work better when they demonstrate the product interaction itself. Here, the builder proves its value by showing the before-and-after refinement state instead of describing AI in the abstract.",
    demo: "refinement" as const,
  },
  {
    eyebrow: "Review handoff",
    title: "Make the submit flow feel operational, not conceptual",
    description:
      "The system credibility improves when users can see that a real PDF, a real priority, and real reviewer context move through the workflow together.",
    demo: "submission" as const,
  },
  {
    eyebrow: "PDF annotations",
    title: "Keep the review proof anchored to the document itself",
    description:
      "A public features page should make it obvious that feedback in MavResume is attached to the resume, with visible annotations and a sidebar that keeps review context organized.",
    demo: "annotations" as const,
  },
] as const;


export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#101113] text-white">
      <BackgroundAtmosphere />

      <section className="relative px-4 pt-5 sm:px-6  sm:pt-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <Link
                href="/"
                className="font-bold tracking-tight text-3xl sm:text-4xl [mask-image:linear-gradient(to_bottom,black_40%,transparent)] [mask-repeat:no-repeat] [mask-size:100%_100%]"
              >
                MAV<span className="font-extralight">RESUME</span>
              </Link>
              <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[#6d7895] sm:text-xs">
                Features overview
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full border-[#2b3242] bg-[#10121a]/70 px-4 text-sm font-semibold text-[#cfd3e1] hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
              >
                <Link href="/">Home</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-full bg-[#274cbc] px-4 text-sm font-semibold text-white hover:bg-[#315be1]"
              >
                <Link href="/login">
                  Login
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow=""
            title="A high-level look at both sides of MavResume"
            description="The strongest feature pages explain the product as a system, then back that story up with concrete UI moments. This section keeps the high-level view while showing what those workflows actually look like."
          />

          <div className="mt-12 grid gap-14 xl:grid-cols-2 xl:gap-16">
            {systemHighlights.map((system, index) => (
              <SystemFeaturePanel
                key={system.label}
                index={index}
                {...system}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="resume workflow"
            title="See the workflow in practice"
            description="Feature pages gain credibility when they demonstrate the product interaction itself. These proof blocks use real MavResume UI patterns to show how value appears inside the workflow."
          />

          <div className="mt-12 grid gap-16">
            {proofBlocks.map((block, index) => (
              <ProofBlock key={block.title} index={index} {...block} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-12 pt-6 sm:px-6 sm:pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute left-0 right-0 top-0 h-px bg-[linear-gradient(90deg,rgba(39,76,188,0),rgba(39,76,188,0.85),rgba(25,200,255,0.35),rgba(39,76,188,0))]" />
            <div className="absolute -top-14 left-10 h-28 w-28 rounded-full bg-[#274cbc]/14 blur-[75px]" />

            <div className="relative flex flex-col gap-5 pt-10 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#89a5ff]">
                  Ready to try it
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Start with the builder, then carry the same resume into
                  review.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#cfd3e1] sm:text-base">
                  MavResume is most convincing when both systems are seen
                  together: structured drafting up front, then contextual PDF
                  feedback at the end.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:min-w-[240px]">
                <Button
                  asChild
                  className="h-12 rounded-full bg-[#274cbc] px-6 text-sm font-semibold text-white hover:bg-[#315be1] sm:text-base"
                >
                  <Link href="/login">
                    Start building
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function BackgroundAtmosphere() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,_#12141b_0%,_#0d0e12_45%,_#09090b_100%)]" />
      <div className="absolute left-1/2 top-0 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-[#274cbc]/10 blur-[180px]" />
      <div className="absolute right-0 top-[18rem] h-80 w-80 rounded-full bg-[#19c8ff]/8 blur-[160px]" />
      <div className="absolute left-0 top-[34rem] h-72 w-72 rounded-full bg-[#274cbc]/8 blur-[160px]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:120px_120px]" />
    </>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#89a5ff]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[#cfd3e1] sm:text-base">
        {description}
      </p>
    </div>
  );
}


function HeroAnnotationSurface() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="rounded-[1.75rem] border border-[#2b3242] bg-[linear-gradient(180deg,rgba(17,18,25,0.96),rgba(13,14,20,0.94))] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#58f5c3]">
            PDF annotation
          </p>
          <p className="mt-2 text-sm text-[#cfd3e1]">
            Feedback stays attached to the resume.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#2b3242] bg-[#10121a]/80 px-3 py-1 text-xs text-[#cfd3e1]">
          <MessageSquareText className="size-3.5 text-[#58f5c3]" />1 annotation
        </div>
      </div>

      <div className="relative mt-4 h-[340px] overflow-hidden rounded-[1.4rem] border border-[#242938] bg-[linear-gradient(180deg,#12141b,#0d0f15)]">
        <div className="absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(143,165,255,0.1),rgba(143,165,255,0))]" />

        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-[#2b3242] bg-[#11131a]/90 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#89a5ff]">
          <ScanSearch className="size-3.5" />
          Review view
        </div>

        <div className="absolute left-5 top-14 w-[68%] max-w-[290px] rounded-[1.5rem] border border-[#d7dce8] bg-white px-5 py-5 text-[#0d1016] shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#111827]">
            Experience
          </p>
          <p className="mt-4 text-[0.9rem] font-medium text-[#111827]">
            Operations Assistant
          </p>
          <div className="mt-3 space-y-3 text-[0.88rem] leading-relaxed text-[#4b5563]">
            <p>
              Built an inventory tracker for student organization events and
              improved visibility across supply planning.
            </p>
            <p className="relative">
              Coordinated event materials across multiple student teams and{" "}
              <span className="relative inline-block">
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-[0.06rem] top-[0.08rem] rounded bg-[#f5c76b]/55"
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { opacity: [0.45, 0.9, 0.45] }
                  }
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="relative">
                  reduced restock confusion during high-volume events
                </span>
              </span>
              .
            </p>
            <p>
              Documented supply workflows so new officers could continue the
              process without losing context.
            </p>
          </div>
        </div>

        <div className="absolute right-5 top-[4.8rem] w-[188px] rounded-[1.3rem] border border-[#2b3242] bg-[#15171c]/94 p-4 shadow-[0_16px_36px_rgba(0,0,0,0.24)]">
          <div className="flex items-center gap-2 text-[#89a5ff]">
            <MessageSquareText className="size-4" />
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#cfd3e1]">
              Annotation list
            </p>
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#6d7895]">
            #1 · Page 1
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#cfd3e1]">
            Impact note linked directly to the highlighted sentence.
          </p>
        </div>

        <div className="absolute bottom-5 right-5 z-10 w-[220px] rounded-[1.4rem] border border-dashed border-[#2d313a] bg-[#111219]/96 p-4 text-sm text-white shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#89a5ff]">
            Annotation
          </p>
          <p className="mt-3 leading-relaxed text-[#cfd3e1]">
            Clarify the impact here so the reviewer can immediately see what
            improved during those events.
          </p>
          <div className="mt-3 border-t border-[#20242d] pt-3 text-[11px] uppercase tracking-[0.16em] text-[#6d7895]">
            Page 1 · Text note
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemFeaturePanel({
  label,
  title,
  description,
  badgeClass,
  accent,
  items,
  demo,
  index,
}: {
  label: string;
  title: string;
  description: string;
  badgeClass: string;
  accent: string;
  items: readonly {
    icon: LucideIcon;
    title: string;
    description: string;
  }[];
  demo: "builder" | "review";
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
      className="relative"
    >
      <div className="relative">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${badgeClass}`}
        >
          {label}
        </span>
        <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white">
          {title}
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#cfd3e1] sm:text-base">
          {description}
        </p>

        <div className="mt-8 grid gap-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {items.map((item) => (
              <div key={item.title}>
                <div
                  className={`flex size-10 items-center justify-center rounded-2xl border border-[#2b3242] bg-[#10121a]/70 ${accent}`}
                >
                  <item.icon className="size-4" />
                </div>
                <h4 className="mt-4 text-base font-semibold text-white">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-[#a4a7b5]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ProofBlock({
  eyebrow,
  title,
  description,
  demo,
  index,
}: {
  eyebrow: string;
  title: string;
  description: string;
  demo: "refinement" | "submission" | "annotations";
  index: number;
}) {
  const isReversed = index % 2 === 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative"
    >
      <div className="absolute left-0 right-0 top-0 h-px bg-[linear-gradient(90deg,rgba(39,76,188,0),rgba(39,76,188,0.65),rgba(25,200,255,0.18),rgba(39,76,188,0))]" />

      <div
        className={`relative grid gap-8 pt-8 xl:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] xl:items-center ${
          isReversed ? "xl:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#89a5ff]">
            {eyebrow}
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[#cfd3e1] sm:text-base">
            {description}
          </p>
        </div>

        <div className="pt-1">
          {demo === "refinement" && <BulletRefinementMarketingDemo compact />}
          {demo === "submission" && <SubmissionMarketingDemo />}
          {demo === "annotations" && <AnnotationMarketingDemo compact />}
        </div>
      </div>
    </motion.article>
  );
}

function BulletRefinementMarketingDemo({
  compact = false,
}: {
  compact?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="rounded-[1.6rem] border border-[#2b3242] bg-[#111219]/88 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
            AI bullet refinement
          </p>
          <p className="mt-2 text-sm text-[#cfd3e1]">
            Project bullet before and after.
          </p>
        </div>
        <div className="inline-flex h-10 items-center gap-2 rounded-2xl border border-[#2b3242] bg-[#151923] px-3 text-sm text-[#89a5ff]">
          <Wand2 className="size-4" />
          Refine
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="flex items-start gap-2">
          <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#58f5c3]" />
          <div className="w-full rounded-2xl border border-[#2b3242] bg-[#10121a]/88 px-4 py-3 text-sm text-[#cfd3e1]">
            Built inventory tracker for student organization and helped people
            keep up with supplies.
          </div>
        </div>

        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="rounded-2xl border-[2px] border-dashed border-[#313339] bg-[#1a1d24]/80 p-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.1em] text-[#89a5ff]">
                  AI refined
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#cfd3e1]">
                Built an inventory tracker for a student organization, improving
                supply visibility and reducing restock confusion across events.
              </p>
            </div>

            {!compact && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl border border-[#274cbc] bg-[#274cbc] px-3 py-1.5 text-white"
                >
                  <Check className="size-4" />
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl border border-[#2b3242] bg-[#2A2C31] px-3 py-1.5 text-[#a4a7b5]"
                >
                  <span className="text-sm">x</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function AnnotationMarketingDemo({ compact = false }: { compact?: boolean }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_260px] xl:gap-5">
      <div className="rounded-[1.6rem] border border-[#2b3242] bg-[#111219]/88 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#58f5c3]">
              PDF annotation
            </p>
            <p className="mt-2 text-sm text-[#cfd3e1]">
              Feedback sits on the resume itself.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2b3242] bg-[#10121a]/70 px-3 py-1 text-xs text-[#cfd3e1]">
            <MessageSquareText className="size-3.5 text-[#58f5c3]" />1
            annotation
          </div>
        </div>

        <div className="mt-4 rounded-[1.35rem] border border-[#d7dce8] bg-white p-5 text-[#0d1016]">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#111827]">
            Experience
          </p>

          <div className="mt-4 space-y-3 text-[0.95rem] leading-relaxed text-[#4b5563]">
            <p className="font-medium text-[#111827]">Operations Assistant</p>
            <p>
              &bull; Built an inventory tracker for student organization events
              and improved visibility across supply planning, checkouts, and
              volunteer coordination.
            </p>
            
            <span className="relative inline-block">
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-[0.08rem] top-[0.08rem] rounded bg-[#f5c76b]/55"
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: [0.45, 0.9, 0.45] }
                }
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className="relative">
                &bull; reduced restock confusion during high-volume events
              </span>
              
            </span>
            <p className="relative">
              &bull; Coordinated event materials across multiple student teams
            </p>
          </div>

          <div className="mt-6 flex justify-center xl:justify-end">
            <div className="w-full max-w-[20rem] rounded-2xl border border-dashed border-[#2d313a] bg-[#111219]/95 p-4 text-sm text-white shadow-[0_18px_45px_rgba(0,0,0,0.25)]">
              <p className="leading-relaxed text-[#cfd3e1]">
                Clarify the impact here so the recruiter can immediately see what
                changed or improved during those events.
              </p>
              {!compact && (
                <div className="mt-3 flex gap-2 border-t border-[#20242d] pt-3">
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#89a5ff]">
                    Edit
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-red-400">
                    Delete
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[1.6rem] border border-[#2b3242] bg-[#15171c]/90 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
        <div className="border-b border-[#2d313a] pb-3">
          <div className="flex items-center gap-2 text-[#89a5ff]">
            <MessageSquareText className="size-4" />
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#cfd3e1]">
              Annotations
            </p>
          </div>
          <p className="mt-2 text-sm font-medium text-white">Annotation list</p>
        </div>

        <div className="pt-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-[#6d7895]">
            #1 · Page 1 · text
          </p>
          <p className="text-sm leading-relaxed text-[#cfd3e1]">
            Clarify the impact of the event coordination work so the reader
            understands the operational result instead of only the task.
          </p>
          <button
            type="button"
            className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-[#89a5ff]"
          >
            Jump to annotation
          </button>
        </div>
      </div>
    </div>
  );
}

function SubmissionMarketingDemo() {
  return (
    <div className="rounded-[1.6rem] border border-[#2b3242] bg-[#111219]/88 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
      <div className="inline-flex items-center rounded-full border border-[#2b3242] bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
        Resume review
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_240px] xl:items-start">
        <div className="rounded-2xl border-2 border-dashed border-[#2d313a] bg-[#10121a] p-5 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#1f2330]/80 text-[#8fa5ff]">
            <UploadCloud className="size-5" />
          </div>
          <p className="mt-4 font-medium text-white">Resume.pdf uploaded</p>
          <p className="mt-1 text-sm text-[#6d7895]">
            Ready for priority and review notes.
          </p>
        </div>

        <div className="grid gap-3">
          <div className="rounded-2xl border border-dashed border-[#3d4353] bg-[#1a1d24] px-4 py-3 text-sm text-white">
            Priority: High
          </div>
          <div className="rounded-2xl border border-dashed border-[#3d4353] bg-[#1a1d24] px-4 py-3 text-sm text-[#cfd3e1]">
            Please focus on my projects and technical skills.
          </div>
          <div className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#274cbc] px-4 text-sm font-semibold text-white">
            <ClipboardCheck className="size-4" />
            Submit for Review
          </div>
        </div>
      </div>
    </div>
  );
}

function OperationalStrip({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <StatusBadge
        icon={Loader2}
        label="Auto-save"
        value="Saving"
        accent="text-[#89a5ff]"
        spinning
        compact={compact}
      />
      <StatusBadge
        icon={Settings2}
        label="Resume settings"
        value="Typography"
        accent="text-[#cfd3e1]"
        compact={compact}
      />
      <StatusBadge
        icon={FileText}
        label="PDF output"
        value="Preview ready"
        accent="text-[#58f5c3]"
        compact={compact}
      />
    </div>
  );
}

function StatusBadge({
  icon: Icon,
  label,
  value,
  accent,
  spinning = false,
  compact = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  accent: string;
  spinning?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="rounded-[1.25rem] border border-[#2b3242] bg-[#10121a]/74 p-3">
      <div className={`flex items-center gap-2 ${accent}`}>
        <Icon className={`size-4 ${spinning ? "animate-spin" : ""}`} />
        <span className="text-xs font-medium uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>
      <p
        className={`${compact ? "mt-2" : "mt-3"} text-sm font-medium text-white`}
      >
        {value}
      </p>
    </div>
  );
}

function ReviewMiniSurface() {
  return (
    <div className="grid gap-5">
      <QueueMiniSurface compact />
      <AnnotationMarketingDemo compact />
    </div>
  );
}

function StatesMiniSurface({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-[1.25rem] border border-[#2b3242] bg-[#10121a]/74 p-3">
        <div className="flex items-center gap-2 text-[#89a5ff]">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-xs font-medium uppercase tracking-[0.18em]">
            Saving
          </span>
        </div>
        {!compact && (
          <p className="mt-3 text-sm text-white">Builder state is syncing.</p>
        )}
      </div>
      <div className="rounded-[1.25rem] border border-[#274cbc]/40 bg-[#274cbc]/15 p-3">
        <div className="flex items-center gap-2 text-[#8fa5ff]">
          <Clock3 className="size-4" />
          <span className="text-xs font-medium uppercase tracking-[0.18em]">
            In review
          </span>
        </div>
        {!compact && (
          <p className="mt-3 text-sm text-white">Accepted by reviewer.</p>
        )}
      </div>
      <div className="rounded-[1.25rem] border border-[#58f5c3]/30 bg-[#58f5c3]/12 p-3">
        <div className="flex items-center gap-2 text-[#58f5c3]">
          <CheckCircle2 className="size-4" />
          <span className="text-xs font-medium uppercase tracking-[0.18em]">
            Completed
          </span>
        </div>
        {!compact && (
          <p className="mt-3 text-sm text-white">Feedback is ready to view.</p>
        )}
      </div>
    </div>
  );
}

function SettingsMiniSurface() {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-[#4b5a82] bg-[#274cbc] px-3 py-1 text-xs text-white">
          Serif
        </span>
        <span className="rounded-full border border-[#2b3242] bg-[#10121a]/70 px-3 py-1 text-xs text-[#cfd3e1]">
          Standard margin
        </span>
        <span className="rounded-full border border-[#2b3242] bg-[#10121a]/70 px-3 py-1 text-xs text-[#cfd3e1]">
          Normal spacing
        </span>
      </div>
      <div className="rounded-[1.25rem] border border-[#2b3242] bg-[#10121a]/74 p-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#89a5ff]">
          Heading size
        </p>
        <div className="mt-3 h-2 rounded-full bg-[#1b2130]">
          <div className="h-2 w-[62%] rounded-full bg-[#274cbc]" />
        </div>
      </div>
    </div>
  );
}

function QueueMiniSurface({ compact = false }: { compact?: boolean }) {
  const rows = [
    { name: "Computer Science Resume", status: "Pending", accent: "pending" },
    { name: "Finance Resume", status: "Active", accent: "active" },
  ] as const;

  return (
    <div className="rounded-[1.45rem] border border-[#2b3242] bg-[#10121a]/74 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
            Reviewer queue
          </p>
          <p className="mt-2 text-sm text-[#cfd3e1]">
            Pending and active work stay separated.
          </p>
        </div>
        {!compact && (
          <div className="inline-flex items-center rounded-full border border-[#2b3242] bg-[#111219] px-3 py-1 text-xs text-[#cfd3e1]">
            2 reviews
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-3">
        {rows.map((row) => (
          <div
            key={row.name}
            className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-[#2b3242] bg-[#111219]/88 px-3 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {row.name}
              </p>
              <p className="mt-1 text-xs text-[#6d7895]">
                Priority and notes travel with the request.
              </p>
            </div>
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                row.accent === "pending"
                  ? "border-[#f59e0b]/35 bg-[#f59e0b]/12 text-[#f5c76b]"
                  : "border-[#274cbc]/40 bg-[#274cbc]/15 text-[#8fa5ff]"
              }`}
            >
              {row.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
