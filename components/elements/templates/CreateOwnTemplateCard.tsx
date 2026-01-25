"use client";

import React, { useState } from "react";
import { Sparkles, ChevronRight } from "lucide-react";
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
      <Card className="relative transition-all h-70 flex flex-col justify-between duration-300 opacity-90 border-2 border-dashed border-[#274cbc]/50 bg-gradient-to-br from-[#1a1c22]/80 via-[#151618]/70 to-[#1a1c22]/80 backdrop-blur-md hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(39,76,188,0.3)]">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#274cbc]/20 border border-[#274cbc]/30">
              <Sparkles className="w-6 h-6 text-[#274cbc]" />
            </div>
            <CardTitle className="text-xl">Create Your Own</CardTitle>
          </div>
          <CardDescription className="mt-2">
            Build a completely custom resume tailored to your unique experience
            and career path.
          </CardDescription>
          {/* Custom Sections Tag */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="inline-flex items-center rounded-md border border-[#274cbc]/40 bg-[#274cbc]/10 px-2.5 py-0.5 text-xs font-medium text-[#89a5ff]">
              Fully Customizable
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full rounded-xl bg-gradient-to-r from-[#274cbc] to-[#315be1] border border-[#274cbc]/40 px-4 text-sm font-semibold text-white hover:from-[#315be1] hover:to-[#3d6bff] transition-all"
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
