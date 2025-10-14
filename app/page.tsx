"use client"
import { useEffect, useRef, useState } from "react";
import { HeroSection } from "@/components/sections/hero";
import { PersonalInfoSection } from "../components/sections/personalInfo";
import { HeaderBar } from "../components/elements/headerbar";

export default function Home() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showHeader, setShowHeader] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const scrollToNextSection = (currentIndex: number) => {
    const nextSection = sectionRefs.current[currentIndex + 1];
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowHeader(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const heroSection = sectionRefs.current[0];
    if (heroSection) observer.observe(heroSection);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (showHeader) {
      setIsVisible(true);
    } else {
      
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [showHeader]);

  const sections = [
    { Component: HeroSection, id: "hero" },
    { Component: PersonalInfoSection, id: "personal-info" },
  ];

  return (
    <div className="bg-[#101113] text-white relative">
      {isVisible && (
        <div
          className={`fixed top-0 left-0 w-full z-50 transition-opacity duration-300 ${
            showHeader ? "opacity-100" : "opacity-0"
          }`}
        >
          <HeaderBar />
        </div>
      )}

      {sections.map(({ Component, id }, index) => (
        <div
          key={id}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          id={id}
          className="w-full h-screen"
        >
          <Component onContinue={() => scrollToNextSection(index)} />
        </div>
      ))}
    </div>
  );
}
