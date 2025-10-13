"use client"
import { useRef } from 'react';
import { HeroSection } from '@/components/sections/hero';

export default function Home() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToNextSection = (currentIndex: number) => {
    const nextSection = sectionRefs.current[currentIndex + 1];
    if (nextSection) {
      nextSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const sections = [
    { Component: HeroSection, id: 'hero' },
  ]

  return (
    <div className='bg-[#101113] text-white'>
      {sections.map(({ Component, id }, index) => (
        <div
          key={id}
          ref={(el) => { sectionRefs.current[index] = el; }}
          id={id}
          className="w-full h-screen"
        >
          <Component onContinue={() => scrollToNextSection(index)} />
        </div>
      ))}
    </div>
  );
}