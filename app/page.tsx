"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Layers3,
  MessageSquareText,
  ScanSearch,
  Sparkles,
  Wand2,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";

const capabilityRail = [
  "Guided resume builder",
  "PDF review annotations",
  "One shared workflow",
] as const;

const dualSystem = [
  {
    icon: Wand2,
    label: "Builder",
    title: "Build the resume",
    items: [
      "Guided prompts help students turn coursework and projects into resume sections.",
      "Bullet refinement helps make weak lines clearer and stronger.",
      "The finished PDF is ready to send straight into review.",
    ],
  },
  {
    icon: MessageSquareText,
    label: "Review",
    title: "Review the PDF",
    items: [
      "Reviewers pick up pending and active work from one place.",
      "Comments attach to exact lines and highlighted PDF regions.",
      "A review summary gives the student clear next steps.",
    ],
  },
] as const;

const workflowSteps = [
  {
    number: "01",
    icon: Sparkles,
    title: "Build",
    description: "Create the resume with prompts, structure, and stronger bullet writing.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Submit",
    description: "Send the finished PDF with notes so the reviewer has context.",
  },
  {
    number: "03",
    icon: ScanSearch,
    title: "Review",
    description: "Get comments directly on the PDF plus a final written summary.",
  },
] as const;


export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#101113] text-white">
      <BackgroundAtmosphere />

      <section className="relative px-4 pb-16 pt-5 sm:px-6 sm:pb-20 sm:pt-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-bold tracking-tight text-3xl sm:text-4xl [mask-image:linear-gradient(to_bottom,black_40%,transparent)] [mask-repeat:no-repeat] [mask-size:100%_100%]">
                MAV<span className="font-extralight">RESUME</span>
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[#6d7895] sm:text-xs">
                Developed By ACM @ UTA
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full border-[#2b3242] bg-[#10121a]/70 px-4 text-sm font-semibold text-[#cfd3e1] hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
              >
                <Link href="/features">Features</Link>
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

          <div className="grid gap-10 pb-12 pt-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(460px,1.05fr)] lg:items-center lg:gap-6 lg:pb-16 lg:pt-14">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-[#2b3242] bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#89a5ff] backdrop-blur">
                Builder + review system
              </div>

              <h1 className="mt-6 text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Draft with guidance.
                <br />
                Review in context.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#cfd3e1] sm:text-lg">
                Build the resume in one guided flow, then get feedback on that
                same PDF from the review system.
              </p>

              <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Button
                  asChild
                  className="h-12 rounded-full bg-[#274cbc] px-6 text-sm font-semibold text-white hover:bg-[#315be1] sm:text-base"
                >
                  <Link href="/login">
                    Open MavResume
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <p className="text-sm text-[#6d7895]">
                  Built for UTA Mavericks, designed like a modern product.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {capabilityRail.map((item) => (
                  <div
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-[#2b3242] bg-[#10121a]/70 px-3 py-1.5 text-sm text-[#cfd3e1] backdrop-blur-sm"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#58f5c3]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <HeroSystemVisual />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="py-5"
          >
            <div className="grid gap-4 text-sm text-[#cfd3e1] sm:grid-cols-3 sm:gap-6">
              <RailItem
                label="Build faster"
                value="Guided prompts and refinements keep the first draft moving."
              />
              <RailItem
                label="Review the same PDF"
                value="The file students export is the same file reviewers mark up."
              />
              <RailItem
                label="Get clearer feedback"
                value="Annotations and summaries stay together in one review flow."
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="How it works"
            title="Students build the resume. Reviewers mark up the PDF."
            description="MavResume handles both steps, so moving from writing to feedback feels clear from the start."
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_100px_minmax(0,1fr)] lg:gap-8">
            <SystemColumn {...dualSystem[0]} align="left" />

            <div className="relative hidden lg:flex items-center justify-center">
              <motion.div
                aria-hidden="true"
                className="h-full w-px bg-[linear-gradient(180deg,rgba(39,76,188,0),rgba(39,76,188,0.9),rgba(25,200,255,0.35),rgba(39,76,188,0))]"
                animate={{ opacity: [0.45, 0.9, 0.45] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute flex size-14 items-center justify-center rounded-full border border-[#2b3242] bg-[#12151d]/90 text-[#8fa5ff] shadow-[0_0_40px_rgba(39,76,188,0.18)] backdrop-blur-sm"
                animate={{ y: [-120, 120, -120] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Layers3 className="size-5" />
              </motion.div>
            </div>

            <SystemColumn {...dualSystem[1]} align="right" />
          </div>
        </div>
      </section>

      <section className="relative px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Simple flow"
            title="Build it. Submit it. Get feedback."
            description="The product follows one clear path from first draft to reviewed PDF."
          />

          <div className="mt-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="absolute left-0 right-0 top-6 h-px bg-[linear-gradient(90deg,rgba(39,76,188,0),rgba(39,76,188,0.85),rgba(25,200,255,0.35),rgba(39,76,188,0))]" />
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
              {workflowSteps.map((step, index) => (
                <WorkflowStep key={step.number} step={step} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-12 pt-6 sm:px-6 sm:pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[2rem] border border-[#2b3242] bg-[radial-gradient(circle_at_top,_rgba(39,76,188,0.18),_transparent_45%),linear-gradient(180deg,_rgba(17,18,25,0.9),_rgba(11,12,16,0.95))] px-6 py-8 shadow-[0_25px_60px_rgba(3,4,7,0.4)] sm:px-8 sm:py-10"
          >
            <div className="absolute inset-0 opacity-70">
              <div className="absolute left-10 top-0 h-32 w-32 rounded-full bg-[#274cbc]/20 blur-[80px]" />
              <div className="absolute bottom-0 right-8 h-24 w-24 rounded-full bg-[#19c8ff]/12 blur-[60px]" />
            </div>

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#89a5ff]">
                  Ready to start
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Login to start building or reviewing.
                </h2>
              </div>

              <Button
                asChild
                className="h-12 rounded-full bg-[#274cbc] px-6 text-sm font-semibold text-white hover:bg-[#315be1] sm:text-base"
              >
                <Link href="/login">
                  Login to MavResume
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <footer className="flex flex-col gap-3 pb-2 pt-8 text-sm text-[#6d7895] sm:flex-row sm:items-center sm:justify-between">
            <p>MavResume is product-first, with ACM @ UTA still in the DNA.</p>
            <p className="text-[#cfd3e1]">Built for UTA Mavericks.</p>
          </footer>
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

function HeroSystemVisual() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative mx-auto flex min-h-[430px] w-full max-w-[860px] items-center justify-center overflow-visible px-2 sm:px-4 lg:min-h-[560px] lg:px-8">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-[#23304e] opacity-50"
        animate={
          prefersReducedMotion
            ? undefined
            : { scale: [0.96, 1.02, 0.96], opacity: [0.3, 0.55, 0.3] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-[12%] rounded-full border border-dashed border-[#23304e]"
        animate={prefersReducedMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />

      <FloatingChip
        className="-left-[4%] top-[15%] lg:-left-[6%]"
        icon={Wand2}
        title="Builder"
        subtitle="Guided prompts"
        color="text-[#89a5ff]"
        duration={5.2}
      />
      <FloatingChip
        className="-right-[4%] top-[11%] lg:-right-[6%]"
        icon={MessageSquareText}
        title="Review"
        subtitle="Inline notes"
        color="text-[#58f5c3]"
        duration={5.8}
        delay={0.4}
      />
      <FloatingChip
        className="bottom-[12%] -left-[1%] lg:-left-[3%]"
        icon={Sparkles}
        title="Refine"
        subtitle="Sharper bullets"
        color="text-[#f5c76b]"
        duration={6.1}
        delay={0.2}
      />
      <FloatingChip
        className="bottom-[15%] -right-[1%] lg:-right-[3%]"
        icon={ScanSearch}
        title="Annotate"
        subtitle="On the PDF"
        color="text-[#8fa5ff]"
        duration={5.4}
        delay={0.5}
      />

      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-px w-[68%] -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(90deg,rgba(39,76,188,0),rgba(39,76,188,0.9),rgba(25,200,255,0.45),rgba(39,76,188,0))]"
        animate={
          prefersReducedMotion
            ? undefined
            : { opacity: [0.45, 1, 0.45], scaleX: [0.96, 1.02, 0.96] }
        }
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative z-10 w-full max-w-[350px] sm:max-w-[370px]"
        animate={
          prefersReducedMotion
            ? undefined
            : { y: [-10, 10, -10], rotate: [-1, 1, -1] }
        }
        transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 translate-x-5 translate-y-5 rounded-[2rem] border border-[#24304c] bg-[#0f1117]/70 backdrop-blur-sm" />
        <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-[2rem] border border-[#2b3242] bg-[#111219]/80 backdrop-blur-sm" />

        <div className="relative overflow-hidden rounded-[2rem] border border-[#3a4a71] bg-[radial-gradient(circle_at_top,_rgba(39,76,188,0.22),_transparent_42%),linear-gradient(180deg,_rgba(21,23,28,0.97),_rgba(12,13,18,0.98))] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
                Live system
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                Write it. Get it reviewed.
              </p>
            </div>
            <motion.div
              className="flex size-11 items-center justify-center rounded-2xl border border-[#2b3242] bg-[#12151d] text-[#8fa5ff]"
              animate={
                prefersReducedMotion ? undefined : { rotate: [0, 10, -10, 0] }
              }
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Layers3 className="size-5" />
            </motion.div>
          </div>

          <div className="mt-5 space-y-3">
            <MiniLane
              icon={Wand2}
              label="Resume build"
              text="Coursework, projects, and experience"
              accent="text-[#89a5ff]"
            />
            <MiniLane
              icon={FileText}
              label="Submitted PDF"
              text="One finished file moving into review"
              accent="text-[#cfd3e1]"
            />
            <MiniLane
              icon={MessageSquareText}
              label="Review feedback"
              text="Annotations plus a written summary"
              accent="text-[#58f5c3]"
            />
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-[#6d7895]">
            <span className="h-2 w-2 rounded-full bg-[#58f5c3]" />
            Students build. Reviewers respond on the same PDF.
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FloatingChip({
  className,
  icon: Icon,
  title,
  subtitle,
  color,
  duration,
  delay = 0,
}: {
  className: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  color: string;
  duration: number;
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={`absolute hidden w-[156px_56px] rounded-2xl border border-[#2b3242] bg-[#10121a]/90 px-3 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur-md sm:block ${className}`}
      animate={
        prefersReducedMotion
          ? undefined
          : { y: [-8, 10, -8], x: [-2, 4, -2], rotate: [-1, 1, -1] }
      }
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex size-10 items-center justify-center rounded-2xl bg-[#171b24] ${color}`}
        >
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#cfd3e1]">
            {title}
          </p>
          <p className="mt-1 text-[11px] text-[#6d7895]">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}

function MiniLane({
  icon: Icon,
  label,
  text,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  text: string;
  accent: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#222732] bg-[#111219]/78 px-3 py-3">
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-2xl bg-[#171b24] ${accent}`}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6d7895]">
          {label}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[#cfd3e1]">{text}</p>
      </div>
    </div>
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

function RailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#89a5ff]">
        {label}
      </p>
      <p className="mt-2 leading-relaxed text-[#cfd3e1]">{value}</p>
    </div>
  );
}

function SystemColumn({
  icon: Icon,
  label,
  title,
  items,
  align,
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  items: readonly string[];
  align: "left" | "right";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={align === "right" ? "lg:pt-16" : ""}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#171b24] text-[#8fa5ff]">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#89a5ff]">
            {label}
          </p>
          <h3 className="mt-1 text-2xl font-semibold text-white">{title}</h3>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <motion.div
            key={item}
            whileHover={{ x: align === "left" ? 6 : -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-3"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#58f5c3]" />
            <p className="text-sm leading-relaxed text-[#cfd3e1] sm:text-base">
              {item}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function WorkflowStep({
  step,
  index,
}: {
  step: (typeof workflowSteps)[number];
  index: number;
}) {
  const Icon = step.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
      className="relative"
    >
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full border border-[#2b3242] bg-[#12151d] text-[#8fa5ff] shadow-[0_0_30px_rgba(39,76,188,0.12)]">
          <Icon className="size-5" />
        </div>
        <span className="rounded-full border border-[#2b3242] bg-[#10121a] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
          Step {step.number}
        </span>
      </div>

      <h3 className="mt-5 text-2xl font-semibold text-white">{step.title}</h3>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#cfd3e1] sm:text-base">
        {step.description}
      </p>
    </motion.article>
  );
}
