"use client";
import { useEffect, useRef, useState } from "react";
import { HeroSection } from "@/components/sections/hero";
import { PersonalInfoSection } from "../components/sections/personalInfo";
import { HomeHeaderBar } from "../components/elements/HomeHeaderBar";

export default function Home() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showHeader, setShowHeader] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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
  

  const sections = [{ Component: HeroSection, id: "hero" }];

  return (
    <div className="bg-[#101113] text-white relative">
      {isVisible && (
        <div
          className={`fixed top-0 left-0 w-full z-50 transition-opacity duration-300 ${
            showHeader ? "opacity-100" : "opacity-0"
          }`}
        >
          <HomeHeaderBar />
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
          <Component />
        </div>
      ))}
    </div>
  );
}
