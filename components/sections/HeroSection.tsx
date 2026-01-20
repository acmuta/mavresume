import { Wand2 } from "lucide-react";
import { HomeCTAButtons } from "@/components/elements/HomeCTAButtons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden rounded-3xl border-2 border-dashed border-[#2c3037] bg-[radial-gradient(circle_at_top,_#1c2233,_#101113_70%)] p-8 shadow-[0_25px_60px_rgba(3,4,7,0.55)] sm:p-10"
    >
      <div className="absolute inset-0 opacity-60">
        <div className="absolute -top-24 left-16 h-64 w-64 rounded-full bg-[#274cbc]/30 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-[#19c8ff]/20 blur-[80px]" />
      </div>

      <div className="relative flex flex-col gap-12 lg:flex-row">
        <div className="flex flex-1 flex-col gap-6">
          <span className="inline-flex w-fit items-center rounded-full border border-[#2b3242] bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#89a5ff] backdrop-blur">
            Brought to you by ACM @ UTA
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Built for students who don&apos;t know where to start.
            </h1>
            <p className="text-lg text-[#cfd3e1] sm:text-xl">
              MavResume welcomes undergrads into an easy, guided flow that turns
              class projects and campus involvement into recruiter-ready bullet
              points.
            </p>
          </div>
          <HomeCTAButtons />
          <Card className="border-dashed border-[#2a303d] bg-white/5">
            <CardHeader className="p-4">
              <CardTitle className="text-base text-white/90">Mission</CardTitle>
              <CardDescription className="text-sm text-[#cdd1df]">
                Help UTA undergrads build confident, recruiter-ready resumes in
                minutes with prompts shaped by actual career coaches.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-dashed border-[#2a303d] bg-white/5">
            <CardHeader className="p-4">
              <CardTitle className="text-base text-white/90">
                The Problem We Solve
              </CardTitle>
              <CardDescription className="text-sm text-[#cdd1df]">
                Undergraduates often lack experience or clarity on what belongs
                on a resume. Our builder guides them from blank page to polished
                PDF with recommendations and AI-powered tools.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="flex flex-1 flex-col gap-5 lg:max-w-sm">
          <Card className="border border-[#1c1f29] bg-[#15171c]/90">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                Guided Builder Snapshot
              </CardTitle>
              <CardDescription>
                Quick cues, helpful tips, and resume-ready formatting from the
                start.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border-2 border-dashed border-[#2d323d] bg-[#1a1d24] p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-[#7581a6]">
                  Suggested skills
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  {["Python", "MATLAB", "SolidWorks", "Pandas"].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-2xl border border-[#3d4353] bg-[#20242f]/80 px-3 py-1 text-white"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border-2 border-dashed border-[#2d323d] bg-[#1a1d24] p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-[#7581a6]">
                  Bullet builder
                </p>
                <p className="mt-2 text-sm text-[#c9cedc]">
                  Led a 4-person team in{" "}
                  <span className="font-semibold text-white">CSE 3310</span> to
                  prototype a campus parking app, reducing search time by 35%.
                </p>
              </div>
            </CardContent>
          </Card>

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
                    • Led a 4-person team to develop a campus parking app,
                    reducing search time by 35%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
