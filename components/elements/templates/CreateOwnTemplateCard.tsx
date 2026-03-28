"use client";

import React, { useState } from "react";
import { Sparkles, ChevronRight, Wand2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { CreateResumeModal } from "./CreateResumeModal";

export const CreateOwnTemplateCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="relative overflow-hidden border border-[#3659c4] bg-[radial-gradient(circle_at_top_right,rgba(39,76,188,0.32),transparent_50%),linear-gradient(140deg,rgba(17,20,30,0.98),rgba(12,13,18,0.98))] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_70px_rgba(39,76,188,0.35)]">
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute -right-10 top-0 h-28 w-28 rounded-full bg-[#274cbc]/30 blur-[55px]" />
          <div className="absolute left-3 bottom-2 h-20 w-20 rounded-full bg-[#19c8ff]/12 blur-[45px]" />
        </div>

        <CardHeader className="relative space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-[#3659c4] bg-[#274cbc]/20 text-[#a8bbff]">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#89a5ff]">
                Signature path
              </p>
              <CardTitle className="mt-1 text-xl text-white">
                Create your own template
              </CardTitle>
            </div>
          </div>

          <CardDescription className="leading-relaxed text-[#d7dcf2]">
            Build a completely custom resume tailored to your unique experience
            and career path.
          </CardDescription>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-md border border-[#3659c4] bg-[#274cbc]/15 px-2.5 py-1 text-xs font-medium text-[#a8bbff]">
              Fully Customizable
            </span>
            <span className="inline-flex items-center rounded-md border border-[#2d313a] bg-[#151a28]/65 px-2.5 py-1 text-xs font-medium text-[#cfd3e1]">
              <Wand2 className="mr-1 size-3.5" />
              Custom section order
            </span>
          </div>
        </CardHeader>

        <CardContent className="relative mt-auto">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="h-11 w-full rounded-xl border border-[#3659c4] bg-linear-to-r from-[#274cbc] to-[#315be1] px-4 text-sm font-semibold text-white transition-all hover:from-[#315be1] hover:to-[#3d6bff]"
          >
            Get Started
            <ChevronRight className="size-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Create Resume Modal */}
      <CreateResumeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        templateType="custom"
        templateName="Custom Template"
      />
    </>
  );
};
