"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { ResumeTemplate } from "../../../data/resume-templates";
import { CreateResumeModal } from "./CreateResumeModal";

interface TemplateCardProps {
  template: ResumeTemplate;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const isAvailable = template.available;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card
        className={`relative transition-all h-70 flex flex-col justify-between duration-300 ${
          isAvailable
            ? "hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(3,4,7,0.7)] cursor-pointer"
            : "opacity-60 cursor-not-allowed border-dashed"
        }`}
      >
        <CardHeader>
          <CardTitle className="text-xl">{template.name}</CardTitle>
          {template.description && (
            <CardDescription className="mt-2">
              {template.description}
            </CardDescription>
          )}
          {/* Section Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {template.sections.map((section) => (
              <span
                key={section}
                className="inline-flex items-center rounded-md border border-[#2d313a] bg-[#1a1c22]/50 px-2.5 py-0.5 text-xs font-medium text-[#cfd3e1]"
              >
                {section}
              </span>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {isAvailable && template.route ? (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full rounded-xl bg-[#274cbc] px-4 text-sm font-semibold text-white hover:bg-[#315be1] transition-colors"
            >
              Get Started
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              disabled
              className="w-full rounded-xl bg-[#2b3242] px-4 text-sm font-semibold text-[#6d7895] cursor-not-allowed"
            >
              Coming Soon
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Create Resume Modal */}
      <CreateResumeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        templateType={template.route ?? null}
        templateName={template.name}
      />
    </>
  );
};
