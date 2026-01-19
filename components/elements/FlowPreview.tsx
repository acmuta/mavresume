"use client";

import { useEffect, useRef, useState, JSX } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X, Play, Pause } from "lucide-react";
import { Fade } from "react-awesome-reveal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { CustomSectionTitle } from "./CustomSectionTitle";

interface FlowPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  setCurrentStep: (step: number | ((prevStep: number) => number)) => void;
}

const STEPS = [
  { id: "personal-info", label: "Personal Info" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
] as const;

// Mock data for each section
const mockData = {
  personalInfo: {
    name: "Alex Martinez",
    email: "alex.martinez@mavs.uta.edu",
    phone: "(817) 555-0123",
    linkedin: "linkedin.com/in/alex-martinez",
    github: "github.com/alexmartinez",
  },
  education: [
    {
      school: "University of Texas at Arlington",
      degree: "Bachelor of Science",
      major: "Computer Science",
      graduationMonth: "May",
      graduationYear: "2025",
      gpa: "3.7",
      courses: ["Data Structures", "Algorithms", "Software Engineering", "Database Systems"],
    },
  ],
  skills: {
    languages: ["Python", "Java", "JavaScript", "C++"],
    technologies: ["React", "Node.js", "MATLAB", "SolidWorks", "Git"],
  },
  projects: [
    {
      title: "Campus Parking App",
      technologies: ["React", "Node.js", "MongoDB"],
      bullets: [
        "Led a 4-person team in CSE 3310 to prototype a campus parking app",
        "Reduced search time by 35% using real-time location data",
        "Implemented RESTful API with Express.js serving 100+ daily users",
      ],
    },
  ],
  experience: [
    {
      company: "UTA ACM",
      position: "Software Developer Intern",
      startMonth: "June",
      startYear: "2023",
      endMonth: "August",
      endYear: "2023",
      isCurrent: false,
      bullets: [
        "Developed web applications using React and TypeScript",
        "Collaborated with team of 5 developers on open-source projects",
        "Improved application performance by 20% through code optimization",
      ],
    },
  ],
};

export const FlowPreview = ({
  isOpen,
  onClose,
  currentStep,
  setCurrentStep,
}: FlowPreviewProps): JSX.Element | null => {
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const currentStepRef = useRef(currentStep);
  const isTransitioningRef = useRef(isTransitioning);

  // Keep refs in sync with state
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  // Stop auto-advance when reaching the last step
  useEffect(() => {
    if (currentStep >= STEPS.length - 1 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [currentStep]);

  // Auto-advance logic
  useEffect(() => {
    if (!isOpen || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Don't start if already at last step
    if (currentStepRef.current >= STEPS.length - 1) {
      return;
    }

    intervalRef.current = setInterval(() => {
      // Use refs to get latest values, avoiding stale closures
      const canAdvance = currentStepRef.current < STEPS.length - 1;
      if (canAdvance && !isTransitioningRef.current) {
        setIsTransitioning(true);
        setTimeout(() => {
          // Use functional update to get the latest step value when updating
            setCurrentStep((latestStep: number): number => {
            if (latestStep < STEPS.length - 1) {
              return latestStep + 1;
            }
            return latestStep;
            });
          setTimeout(() => setIsTransitioning(false), 50);
        }, 250);
      }
    }, 3500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isOpen, isPaused, setCurrentStep]);

  // Scroll to preview when opened
  useEffect(() => {
    if (isOpen && previewRef.current) {
      setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [isOpen]);

  const handlePrevious = () => {
    if (currentStep > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 250);
      setIsPaused(true);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 250);
    }
  };

  const handleStepClick = (index: number) => {
    if (index !== currentStep && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(index);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 250);
      setIsPaused(true);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  if (!isOpen) return null;

  const currentStepData = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <Fade >
    <section
      ref={previewRef}
      id="flow-preview"
      className="relative overflow-hidden rounded-3xl border-2 border-dashed border-[#2c3037] bg-[radial-gradient(circle_at_top,_#1c2233,_#101113_70%)] shadow-[0_25px_60px_rgba(3,4,7,0.55)] transition-all duration-500"
      style={{ animation: "fadeInDown 0.5s ease-out" }}
    >
        {/* Background glow effects */}
        <div className="absolute inset-0 opacity-60 pointer-events-none">
          <div className="absolute -top-24 left-16 h-64 w-64 rounded-full bg-[#274cbc]/30 blur-[100px]" />
          <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-[#19c8ff]/20 blur-[80px]" />
        </div>

        <div className="relative p-6 sm:p-8 md:p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                Resume Builder Flow
              </h2>
              <p className="text-sm md:text-base text-[#cfd3e1]">
                Step {currentStep + 1} of {STEPS.length}: {currentStepData.label}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full text-[#6d7895] hover:text-white hover:bg-white/10 transition-all"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation - Desktop breadcrumb style */}
          <nav className="hidden md:flex items-center justify-center gap-2 mb-8 flex-wrap">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={isTransitioning}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-200 font-medium text-sm ${
                    currentStep === index
                      ? "text-white bg-[#274cbc] cursor-default"
                      : "text-[#6d7895] hover:text-[#cfd3e1] hover:bg-white/5 cursor-pointer"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label={`Go to ${step.label} section`}
                >
                  {step.label}
                </button>
                {index < STEPS.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-[#6d7895]" />
                )}
              </div>
            ))}
          </nav>

          {/* Navigation - Mobile dot indicators */}
          <div className="md:hidden flex items-center justify-center gap-2 mb-6">
            {STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                disabled={isTransitioning}
                className={`transition-all duration-200 rounded-full ${
                  currentStep === index
                    ? "w-3 h-3 bg-[#274cbc]"
                    : "w-2 h-2 bg-[#6d7895] hover:bg-[#89a5ff]"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={`Go to ${step.label} section`}
              >
                <span className="sr-only">{step.label}</span>
              </button>
            ))}
          </div>

          {/* Content area with fade transition */}
          <div
            className={`transition-opacity duration-500 ease-in-out mb-8 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            <Card className="border-dashed border-[#2d313a] bg-[#151618]/80">
              <CardContent className="p-6 sm:p-8">
                {currentStep === 0 && <PersonalInfoStep data={mockData.personalInfo} />}
                {currentStep === 1 && <EducationStep data={mockData.education[0]} />}
                {currentStep === 2 && <SkillsStep data={mockData.skills} />}
                {currentStep === 3 && <ProjectsStep data={mockData.projects[0]} />}
                {currentStep === 4 && <ExperienceStep data={mockData.experience[0]} />}
              </CardContent>
            </Card>
          </div>

          {/* Control bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                disabled={currentStep === 0 || isTransitioning}
                className="rounded-2xl border-2 border-[#2d313a] bg-[#151618]/80 text-white hover:text-white hover:bg-[#1c1d21]/90 hover:border-[#3d4353] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={togglePause}
                disabled={isLastStep || isTransitioning}
                className="rounded-2xl border-2 border-[#2d313a] bg-[#151618]/80 text-white hover:text-white hover:bg-[#1c1d21]/90 hover:border-[#3d4353] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={isPaused ? "Resume auto-advance" : "Pause auto-advance"}
              >
                {isPaused ? (
                  <Play className="w-5 h-5" />
                ) : (
                  <Pause className="w-5 h-5" />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={isLastStep || isTransitioning}
                className="rounded-2xl border-2 border-[#2d313a] bg-[#151618]/80 text-white hover:text-white hover:bg-[#1c1d21]/90 hover:border-[#3d4353] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next step"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* CTA Button - Show on last step */}
            {isLastStep && (
              <Button
                asChild
                className="h-12 rounded-2xl bg-[#274cbc] px-6 text-base font-semibold text-white hover:bg-[#315be1] hover:scale-[1.01] transition duration-300"
              >
                <Link href="/login">Ready to build your resume?</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </Fade>
  );
}

// Step content components
function PersonalInfoStep({ data }: { data: typeof mockData.personalInfo }) {
  return (
    <div className="space-y-4">
      <CustomSectionTitle
        title="Personal Information"
        description="Start with the basics - your name, contact details, and links so employers can reach you."
      />
      <div className="space-y-3 pt-4">
        <div className="rounded-2xl border-2 border-dashed border-[#2d323d] bg-[#1a1d24] p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-[#7581a6] mb-2">
            Full Name
          </p>
          <p className="text-lg text-white">{data.name}</p>
        </div>
        <div className="rounded-2xl border-2 border-dashed border-[#2d323d] bg-[#1a1d24] p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-[#7581a6] mb-2">
            Contact Information
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-[#c9cedc]">
            <span>{data.email}</span>
            <span>•</span>
            <span>{data.phone}</span>
          </div>
        </div>
        <div className="rounded-2xl border-2 border-dashed border-[#2d323d] bg-[#1a1d24] p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-[#7581a6] mb-2">
            Links
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-[#c9cedc]">
            <span>{data.linkedin}</span>
            <span>•</span>
            <span>{data.github}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EducationStep({ data }: { data: typeof mockData.education[0] }) {
  return (
    <div className="space-y-4">
      <CustomSectionTitle
        title="Education"
        description="Add your academic background, degree, and relevant coursework."
      />
      <div className="space-y-3 pt-4">
        <div className="rounded-2xl border-2 border-dashed border-[#2d323d] bg-[#1a1d24] p-4">
          <div className="flex justify-between items-start mb-2">
            <p className="text-lg font-semibold text-white">{data.school}</p>
            <p className="text-sm text-[#7581a6]">
              {data.graduationMonth} {data.graduationYear}
            </p>
          </div>
          <p className="text-base text-[#c9cedc] mb-2">
            {data.degree} in {data.major}
          </p>
          <p className="text-sm text-[#89a5ff]">GPA: {data.gpa}</p>
        </div>
        <div className="rounded-2xl border-2 border-dashed border-[#2d323d] bg-[#1a1d24] p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-[#7581a6] mb-3">
            Relevant Coursework
          </p>
          <div className="flex flex-wrap gap-2">
            {data.courses.map((course, idx) => (
              <span
                key={idx}
                className="rounded-2xl border border-[#3d4353] bg-[#20242f]/80 px-3 py-1 text-sm text-white"
              >
                {course}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillsStep({ data }: { data: typeof mockData.skills }) {
  return (
    <div className="space-y-4">
      <CustomSectionTitle
        title="Technical Skills"
        description="Skills are auto-suggested based on your coursework. Add or remove as needed."
      />
      <div className="space-y-4 pt-4">
        <div className="rounded-2xl border-2 border-dashed border-[#2d323d] bg-[#1a1d24] p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-[#7581a6] mb-3">
            Languages
          </p>
          <div className="flex flex-wrap gap-2">
            {data.languages.map((lang, idx) => (
              <span
                key={idx}
                className="rounded-2xl border border-[#3d4353] bg-[#20242f]/80 px-3 py-1 text-sm text-white"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border-2 border-dashed border-[#2d323d] bg-[#1a1d24] p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-[#7581a6] mb-3">
            Technologies
          </p>
          <div className="flex flex-wrap gap-2">
            {data.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="rounded-2xl border border-[#3d4353] bg-[#20242f]/80 px-3 py-1 text-sm text-white"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsStep({ data }: { data: typeof mockData.projects[0] }) {
  return (
    <div className="space-y-4">
      <CustomSectionTitle
        title="Projects"
        description="Showcase your class projects and personal work with impact-focused bullet points."
      />
      <div className="space-y-3 pt-4">
        <div className="rounded-2xl border-2 border-dashed border-[#2d323d] bg-[#1a1d24] p-4">
          <div className="flex justify-between items-start mb-3">
            <p className="text-lg font-semibold text-white">{data.title}</p>
            <div className="flex flex-wrap gap-2">
              {data.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="rounded-2xl border border-[#3d4353] bg-[#20242f]/80 px-2 py-1 text-xs text-[#89a5ff]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <ul className="space-y-2">
            {data.bullets.map((bullet, idx) => (
              <li key={idx} className="text-sm text-[#c9cedc] pl-4 -indent-2">
                • {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ExperienceStep({ data }: { data: typeof mockData.experience[0] }) {
  return (
    <div className="space-y-4">
      <CustomSectionTitle
        title="Experience"
        description="Add your work experience, internships, and leadership roles with quantified impact."
      />
      <div className="space-y-3 pt-4">
        <div className="rounded-2xl border-2 border-dashed border-[#2d323d] bg-[#1a1d24] p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-lg font-semibold text-white">
                {data.company} - {data.position}
              </p>
              <p className="text-sm text-[#7581a6] mt-1">
                {data.startMonth} {data.startYear} - {data.endMonth} {data.endYear}
              </p>
            </div>
          </div>
          <ul className="space-y-2">
            {data.bullets.map((bullet, idx) => (
              <li key={idx} className="text-sm text-[#c9cedc] pl-4 -indent-2">
                • {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}