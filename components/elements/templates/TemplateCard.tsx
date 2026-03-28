"use client";

import React, { useState } from "react";
import { BriefcaseBusiness, ChevronRight, Layers3 } from "lucide-react";
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
import { getSectionLabelById } from "@/lib/resume/sections";

interface TemplateCardProps {
  template: ResumeTemplate;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const isAvailable = template.available;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const visibleRoles = template.roles.slice(0, 4);
  const hiddenRoleCount = Math.max(
    template.roles.length - visibleRoles.length,
    0,
  );

  return (
    <>
      <Card
        className={`relative flex h-full flex-col overflow-hidden border-[#2b3242] bg-[linear-gradient(180deg,rgba(20,23,31,0.86),rgba(12,13,18,0.92))] transition-all duration-300 ${
          isAvailable
            ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_28px_65px_rgba(3,4,7,0.6)]"
            : "cursor-not-allowed border-dashed opacity-60"
        }`}
      >
        <CardHeader className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
              Premade template
            </p>
            <CardTitle className="mt-2 text-xl text-white">
              {template.name}
            </CardTitle>
          </div>

          {template.description && (
            <CardDescription className="leading-relaxed text-[#cfd3e1]">
              {template.description}
            </CardDescription>
          )}

          <div className="space-y-2.5">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6d7895]">
              <Layers3 className="size-3.5" />
              Sections
            </p>
            <div className="flex flex-wrap gap-2">
              {template.sectionIds.map((sectionId) => (
                <span
                  key={sectionId}
                  className="inline-flex items-center rounded-md border border-[#2d313a] bg-[#1a1c22]/55 px-2.5 py-1 text-xs font-medium text-[#cfd3e1]"
                >
                  {getSectionLabelById(sectionId)}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6d7895]">
              <BriefcaseBusiness className="size-3.5" />
              Roles
            </p>
            <div className="flex flex-wrap gap-2">
              {visibleRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center rounded-md border border-[#29437f] bg-[#274cbc]/15 px-2.5 py-1 text-xs font-medium text-[#a8bbff]"
                >
                  {role}
                </span>
              ))}
              {hiddenRoleCount > 0 && (
                <span className="inline-flex items-center rounded-md border border-[#2d313a] bg-[#1a1c22]/55 px-2.5 py-1 text-xs font-medium text-[#6d7895]">
                  +{hiddenRoleCount} more
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="mt-auto">
          {isAvailable && template.route ? (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="h-11 w-full rounded-xl bg-[#274cbc] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#315be1]"
            >
              Get Started
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              disabled
              className="h-11 w-full cursor-not-allowed rounded-xl bg-[#2b3242] px-4 text-sm font-semibold text-[#6d7895]"
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
