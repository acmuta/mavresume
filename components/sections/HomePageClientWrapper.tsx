"use client";

import { useState, useEffect, type ReactNode, type ComponentType } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  FileCheck2,
  FileText,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Fade } from "react-awesome-reveal";

import { PreviewContext } from "@/components/contexts/PreviewContext";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Guided resume builder",
    description: "Step-by-step prompts tuned for UTA undergrads.",
    icon: LayoutDashboard,
  },
  {
    title: "Skill recommendations",
    description: "Auto-suggests languages & tools from your courses.",
    icon: Sparkles,
  },
  {
    title: "Course-to-experience converter",
    description: "Translate class projects into impact bullet points.",
    icon: FileText,
  },
  {
    title: "Section reordering (DND Kit)",
    description: "Drag-and-drop sections to match recruiter priority.",
    icon: Layers,
  },
  {
    title: "ATS-friendly PDF export",
    description: "Clean formatting that passes automated scanners.",
    icon: FileCheck2,
  },
  {
    title: "AI refinement tools",
    description: "Polish phrasing with confident, action-focused copy.",
    icon: Wand2,
  },
  {
    title: "Major-specific templates",
    description: "Layouts tailored for engineering, business, & more.",
    icon: GraduationCap,
  },
];

const whyPoints = [
  "Recruiter-approved tips baked into every step.",
  "UTA-specific course and project recommendations.",
  "Designed for students with little to no experience.",
  "Fast, guided, no-fluff workflow from draft to PDF.",
];

type FlowPreviewComponent = ComponentType<{
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  setCurrentStep: (step: number | ((prev: number) => number)) => void;
}>;

export function HomePageClientWrapper({ children }: { children: ReactNode }) {
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [FlowPreview, setFlowPreview] = useState<FlowPreviewComponent | null>(
    null,
  );

  useEffect(() => {
    if (showPreview && !FlowPreview) {
      import("@/components/elements/home/FlowPreview").then((m) =>
        setFlowPreview(() => m.FlowPreview),
      );
    }
  }, [showPreview, FlowPreview]);

  const openPreview = () => {
    setCurrentStep(0);
    setShowPreview(true);
  };

  return (
    <PreviewContext.Provider value={{ openPreview }}>
      <main className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-16">
          {children}

          {showPreview && FlowPreview && (
            <FlowPreview
              isOpen={showPreview}
              onClose={() => setShowPreview(false)}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          )}

          <section className="space-y-5">
            <Fade direction="up" duration={700} delay={200} triggerOnce>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-[#6d7895]">
                    What you get
                  </p>
                  <h2 className="text-3xl font-semibold sm:text-4xl">
                    Guided tools to build faster with confidence.
                  </h2>
                </div>
                <div className="text-sm text-[#a4a9ba]">
                  Every feature mirrors the builder experience to keep the UI
                  familiar from the start.
                </div>
              </div>
            </Fade>

            <div className="grid gap-4 md:grid-cols-2">
              {features.map(({ title, description, icon: Icon }, index) => {
                const delays = [300, 400, 500, 600, 700, 800, 900];
                return (
                  <Fade
                    key={title}
                    direction="up"
                    duration={600}
                    delay={delays[index]}
                    triggerOnce
                  >
                    <Card className="h-full border-2 border-dashed border-[#2d313a] bg-[#15171c]/80 hover:scale-[1.02] transition-transform duration-300">
                      <CardHeader className="flex flex-row items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#1f2330]/80 text-[#8fa5ff]">
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{title}</CardTitle>
                          <CardDescription>{description}</CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  </Fade>
                );
              })}
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <Fade direction="right" duration={800} delay={300} triggerOnce>
              <Card className="border-2 border-dashed border-[#2d313a] bg-[#15171c]/80">
                <CardHeader>
                  <CardDescription className="text-xs uppercase tracking-[0.4em] text-[#6d7895]">
                    Why MavResume?
                  </CardDescription>
                  <CardTitle className="text-3xl">
                    Built with Resume Experts to meet Students where they are.
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {whyPoints.map((point, index) => {
                      const delays = [400, 500, 600, 700];
                      return (
                        <Fade
                          key={point}
                          direction="up"
                          duration={500}
                          delay={delays[index]}
                          triggerOnce
                        >
                          <li className="flex items-start gap-3 text-sm">
                            <CheckCircle2 className="mt-0.5 size-5 text-[#58f5c3]" />
                            <span className="text-[#cfd3e1]">{point}</span>
                          </li>
                        </Fade>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </Fade>

            <Fade direction="left" duration={800} delay={500} triggerOnce>
              <Card className="border-2 border-dashed border-[#2d313a] bg-gradient-to-br from-[#14151d] to-[#0f1016]">
                <CardHeader>
                  <CardDescription className="text-xs uppercase tracking-[0.4em] text-[#6d7895]">
                    Ready when you are
                  </CardDescription>
                  <CardTitle className="text-2xl">
                    Go from blank page to polished PDF in one session.
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-[#cfd3e1]">
                    Resume sections mirror the builder layout, so you already
                    know what to expect when you click start.
                  </p>
                  <Button
                    asChild
                    className="h-12 rounded-2xl bg-[#274cbc] text-base font-semibold hover:bg-[#315be1] hover:scale-[1.01] transition-transform duration-300"
                  >
                    <Link href="/login">Start Building Your Resume</Link>
                  </Button>
                </CardContent>
              </Card>
            </Fade>
          </section>

          <Fade direction="up" duration={600} delay={400} triggerOnce>
            <footer className="mt-4 border-t border-[#1d2028] pt-6 text-xs text-[#8b90a3] sm:text-sm">
              <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-[#cfd3e1]">
                    Developed by{" "}
                    <a
                      href="https://www.acmuta.com"
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-[#274cbc]/60 decoration-2 underline-offset-4 hover:text-white"
                    >
                      ACM @ UTA
                    </a>
                  </p>
                  <p className="text-[0.7rem] text-[#8b90a3] sm:text-xs">
                    UTA&apos;s largest computer science organization - uniting
                    students through technology.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="https://github.com/acmuta/mavresume"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#2b3242] bg-[#10121a] px-3 py-1 text-xs font-medium text-[#cfd3e1] hover:border-[#3f4a67] hover:text-white"
                  >
                    <FaGithub className="size-4" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://discord.gg/WjrDwNn5es"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#28324b] bg-[#0e111b] px-3 py-1 text-xs font-medium text-[#cfd3e1] hover:border-[#3c4c77] hover:text-white"
                  >
                    <FaDiscord className="size-4" />
                    <span>ACM Discord</span>
                  </a>
                </div>
              </div>
            </footer>
          </Fade>
        </div>
      </main>
    </PreviewContext.Provider>
  );
}
