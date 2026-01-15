"use client";

import React from "react";
import { Fade } from "react-awesome-reveal";
import { resumeTemplates } from "../../data/resume-templates";
import { TemplateCard } from "../../components/elements/TemplateCard";
import { HomeHeaderBar } from "../../components/elements/HomeHeaderBar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";

export default function TemplatesPage() {
  return (
    <div className="relative min-h-screen bg-[#101113] text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#11131a] via-[#0d0e12] to-[#09090b]" />
      
      {/* Header Bar */}
      <div className="fixed top-0 left-0 z-50 w-full">
        <HomeHeaderBar />
      </div>

      <main className="relative z-10 px-4 py-20 sm:px-6 lg:px-8 pt-32">
        <div className="mx-auto flex max-w-7xl flex-col gap-16">
          {/* Title Section */}
          <Fade direction="down" duration={600} triggerOnce>
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Choose Your Template
              </h1>
              <p className="text-lg text-[#cfd3e1] sm:text-xl max-w-2xl mx-auto">
                Select the resume template that best fits your field of study and career goals.
              </p>
            </div>
          </Fade>

          {/* Templates Carousel */}
          <div className="w-full px-8 md:px-12 lg:px-16">
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {resumeTemplates.map((template, index) => (
                  <CarouselItem
                    key={template.id}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <Fade
                      direction="up"
                      duration={800}
                      delay={index * 100}
                      triggerOnce
                    >
                      <TemplateCard template={template} />
                    </Fade>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4 md:-left-8 lg:-left-12 border-[#2d313a] bg-[#15171c]/90 hover:bg-[#1a1c22] text-white hover:text-white" />
              <CarouselNext className="hidden md:flex -right-4 md:-right-8 lg:-right-12 border-[#2d313a] bg-[#15171c]/90 hover:bg-[#1a1c22] text-white hover:text-white" />
            </Carousel>
          </div>
        </div>
      </main>
    </div>
  );
}
