"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
import { FaDiscord, FaGithub } from "react-icons/fa";
import { Fade } from "react-awesome-reveal";

import { HomeHeaderBar } from "@/components/elements/HomeHeaderBar";
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

export default function Home() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [showHeader, setShowHeader] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowHeader(!entry.isIntersecting),
      { threshold: 0.1 }
    );

    const heroSection = heroRef.current;
    if (heroSection) observer.observe(heroSection);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (showHeader) {
      setIsVisible(true);
      return;
    }

    const timeout = setTimeout(() => setIsVisible(false), 300);
    return () => clearTimeout(timeout);
  }, [showHeader]);

  return (
    <div className="relative min-h-screen bg-[#101113] text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#11131a] via-[#0d0e12] to-[#09090b] " />

      {isVisible && (
        <div
          className={`fixed top-0 left-0 z-50 w-full transition-opacity duration-300 ${
            showHeader ? "opacity-100" : "opacity-0"
          }`}
        >
          <HomeHeaderBar />
        </div>
      )}

      <main className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-16">
          <section
            ref={heroRef}
            id="hero"
            className="relative overflow-hidden rounded-3xl border-2 border-dashed border-[#2c3037] bg-[radial-gradient(circle_at_top,_#1c2233,_#101113_70%)] p-8 shadow-[0_25px_60px_rgba(3,4,7,0.55)] sm:p-10"
          >
            <div className="absolute inset-0 opacity-60">
              <div className="absolute -top-24 left-16 h-64 w-64 rounded-full bg-[#274cbc]/30 blur-[100px]" />
              <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-[#19c8ff]/20 blur-[80px]" />
            </div>

            <div className="relative flex flex-col gap-12 lg:flex-row">
              <div className="flex flex-1 flex-col gap-6">
                <Fade direction="down" duration={600} triggerOnce>
                  <span className="inline-flex w-fit items-center rounded-full border border-[#2b3242] bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#89a5ff] backdrop-blur">
                    Brought to you by ACM @ UTA
                  </span>
                </Fade>
                <Fade direction="up" duration={800} delay={200} triggerOnce>
                  <div className="space-y-4">
                    <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                      Built for students who don't know where to start.
                    </h1>
                    <p className="text-lg text-[#cfd3e1] sm:text-xl">
                      MavResume welcomes undergrads into an easy, guided flow
                      that turns class projects and campus involvement into
                      recruiter-ready bullet points.
                    </p>
                  </div>
                </Fade>
                <Fade direction="up" duration={800} delay={400} triggerOnce>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      asChild
                      className="h-12 rounded-2xl bg-[#274cbc] px-6 text-base font-semibold text-white hover:bg-[#315be1] hover:scale-[1.01] transition duration-300"
                    >
                      <Link href="/builder">Start Building Your Resume</Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 rounded-2xl border-dashed border-[#2f323a] bg-transparent px-6 text-base text-white hover:text-white shadow-none hover:border-[#4b4f5c] hover:bg-[#161920] hover:scale-[1.01] transition duration-300"
                    >
                      Preview the flow
                    </Button>
                  </div>
                </Fade>
                <Fade direction="left" duration={800} delay={300} triggerOnce>
                  <Card className="border-dashed border-[#2a303d] bg-white/5">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base text-white/90">
                        Mission
                      </CardTitle>
                      <CardDescription className="text-sm text-[#cdd1df]">
                        Help UTA undergrads build confident, recruiter-ready
                        resumes in minutes with prompts shaped by actual career
                        coaches.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Fade>
                <Fade direction="left" duration={800} delay={400} triggerOnce>
                  <Card className="border-dashed border-[#2a303d] bg-white/5">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base text-white/90">
                        The Problem We Solve
                      </CardTitle>
                      <CardDescription className="text-sm text-[#cdd1df]">
                        Undergraduates often lack experience or clarity on what
                        belongs on a resume. Our builder guides them from blank
                        page to polished PDF with recommendations and AI-powered
                        tools.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Fade>
              </div>

              <div className="flex flex-1 flex-col gap-5 lg:max-w-sm">
                <Fade direction="right" duration={800} delay={500} triggerOnce>
                  <Card className="border border-[#1c1f29] bg-[#15171c]/90">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                        Guided Builder Snapshot
                      </CardTitle>
                      <CardDescription>
                        Quick cues, helpful tips, and resume-ready formatting
                        from the start.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-2xl border-2 border-dashed border-[#2d323d] bg-[#1a1d24] p-4">
                        <p className="text-sm uppercase tracking-[0.2em] text-[#7581a6]">
                          Suggested skills
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-sm">
                          {["Python", "MATLAB", "SolidWorks", "Pandas"].map(
                            (skill) => (
                              <span
                                key={skill}
                                className="rounded-2xl border border-[#3d4353] bg-[#20242f]/80 px-3 py-1 text-white"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <div className="rounded-2xl border-2 border-dashed border-[#2d323d] bg-[#1a1d24] p-4">
                        <p className="text-sm uppercase tracking-[0.2em] text-[#7581a6]">
                          Bullet builder
                        </p>
                        <p className="mt-2 text-sm text-[#c9cedc]">
                          Led a 4-person team in{" "}
                          <span className="font-semibold text-white">
                            CSE 3310
                          </span>{" "}
                          to prototype a campus parking app, reducing search
                          time by 35%.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Fade>

                <Fade direction="right" duration={800} delay={700} triggerOnce>
                  <Card className="border-2 border-dashed border-[#2a303d] bg-[#111219]/80">
                    <CardHeader className="pb-1.5">
                      <CardTitle className="text-base text-white/90">
                        AI Bullet Refinement
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Transform basic bullets into impact statements
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-1.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-xl border border-dashed border-[#2d323d] bg-[#1a1d24] p-2">
                          <p className="text-[10px] uppercase tracking-[0.15em] text-[#7581a6] mb-1">
                            Before
                          </p>
                          <p className="text-xs text-[#a4a9ba] leading-tight">
                            • Worked on a project with a team
                          </p>
                        </div>
                        <Wand2 className="size-3.5 text-[#3c67eb] flex-shrink-0" />
                        <div className="flex-1 rounded-xl border border-dashed border-[#3d4353] bg-[#1f2330] p-2">
                          <p className="text-[10px] uppercase tracking-[0.15em] text-[#8fa5ff] mb-1">
                            After
                          </p>
                          <p className="text-xs text-white/90 leading-tight">
                            • Led a 4-person team to develop a campus parking
                            app, reducing search time by 35%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Fade>
              </div>
            </div>
          </section>

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
                    <Link href="/builder">Start Building Your Resume</Link>
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
    </div>
  );
}
