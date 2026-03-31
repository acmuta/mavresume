"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, FileText, BriefcaseBusiness, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSessionStore } from "@/store/useSessionStore";
import { createResume } from "@/lib/resumeService";
import { resumeTemplates } from "@/data/resume-templates";

interface CreateResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateType: string | null;
  templateName: string;
}

/**
 * Modal for creating a new resume.
 *
 * Prompts the user for a resume name before creating the resume in Supabase
 * and navigating to the builder page.
 *
 * Structured with sections to allow future settings (privacy, font preferences, etc.)
 * to be added below the name input.
 */
export const CreateResumeModal: React.FC<CreateResumeModalProps> = ({
  open,
  onOpenChange,
  templateType,
  templateName,
}) => {
  const router = useRouter();
  const { user, isAuthenticated } = useSessionStore();

  const [resumeName, setResumeName] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTemplate = useMemo(() => {
    if (!templateType || templateType === "custom") {
      return null;
    }

    return resumeTemplates.find((template) => template.route === templateType) ?? null;
  }, [templateType]);

  const isCustomTemplate = templateType === "custom";

  const customRoleGroups = useMemo(
    () =>
      resumeTemplates.map((template) => ({
        id: template.id,
        label: template.name,
        roles: Array.from(new Set(template.roles)),
      })),
    [],
  );

  const availableRoleGroups = useMemo(() => {
    if (isCustomTemplate) {
      return customRoleGroups;
    }

    if (!selectedTemplate) {
      return [];
    }

    return [
      {
        id: selectedTemplate.id,
        label: selectedTemplate.name,
        roles: selectedTemplate.roles,
      },
    ];
  }, [customRoleGroups, isCustomTemplate, selectedTemplate]);

  const availableRoles = useMemo(
    () =>
      Array.from(
        new Set(
          availableRoleGroups.flatMap((roleGroup) => roleGroup.roles),
        ),
      ),
    [availableRoleGroups],
  );

  const requiresRole = availableRoles.length > 0;

  const handleCreate = async () => {
    // Validate input
    const trimmedName = resumeName.trim();
    if (!trimmedName) {
      setError("Please enter a name for your resume");
      return;
    }

    if (requiresRole && !selectedRole) {
      setError("Please choose the role this resume is targeting");
      return;
    }

    if (requiresRole && selectedRole && !availableRoles.includes(selectedRole)) {
      setError("Please choose a valid role for this template");
      return;
    }

    // Check authentication
    if (!isAuthenticated || !user) {
      setError("You must be logged in to create a resume");
      // Optionally redirect to login
      router.push("/login?redirect=/templates");
      return;
    }

    setError(null);
    setIsCreating(true);

    try {
      const { resume } = await createResume(
        user.id,
        trimmedName,
        templateType ?? undefined,
        selectedRole ?? undefined,
      );

      // Close modal and navigate to builder
      onOpenChange(false);
      router.push(`/builder?id=${resume.id}`);
    } catch (err) {
      console.error("Failed to create resume:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create resume. Please try again."
      );
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isCreating) {
      handleCreate();
    }
  };

  // Reset state when modal closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setResumeName("");
      setSelectedRole(null);
      setError(null);
      setIsCreating(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] w-[94vw] max-w-2xl overflow-y-auto rounded-[2rem] border border-[#2b3242] bg-[radial-gradient(circle_at_top,_rgba(39,76,188,0.16),_transparent_42%),linear-gradient(180deg,_rgba(18,20,27,0.96),_rgba(11,12,16,0.98))] text-white shadow-[0_30px_80px_rgba(3,4,7,0.45)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5 text-[#274cbc]" />
            Create New Resume
          </DialogTitle>
          <DialogDescription className="text-[#a4a7b5]">
            {templateType
              ? `Using the ${templateName} template`
              : "Create a custom resume"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="rounded-[1.5rem] border border-[#2b3242] bg-[#10121a]/65 p-4">
            <div className="space-y-2">
              <Label htmlFor="resume-name" className="text-[#cfd3e1]">
                Resume Name
              </Label>
              <Input
                id="resume-name"
                placeholder="e.g., Software Engineer Resume"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isCreating}
                className="border-[#2d313a] bg-[#1a1c22]/50 text-white placeholder:text-[#6d7895] focus-visible:border-[#274cbc] focus-visible:ring-[#274cbc]/20"
                autoFocus
              />
              <p className="text-xs text-[#6d7895]">
                Give your resume a memorable name to find it later
              </p>
            </div>
          </div>

          {requiresRole && (
            <div className="rounded-[1.5rem] border border-[#2b3242] bg-[#10121a]/65 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#274cbc]/30 bg-[#274cbc]/14 text-[#9fb3ff]">
                  <BriefcaseBusiness className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <Label className="text-sm font-semibold text-white">
                    Target Role
                  </Label>
                  <p className="mt-1 text-sm leading-relaxed text-[#a4a7b5]">
                    Choose the role this resume is optimized for. We&apos;ll use it
                    to tailor the builder help experience with role-specific
                    qualifications.
                  </p>
                </div>
              </div>

              {isCustomTemplate ? (
                <Accordion
                  type="multiple"
                  defaultValue={availableRoleGroups
                    .slice(0, 2)
                    .map((roleGroup) => roleGroup.id)}
                  className="mt-4 gap-2"
                >
                  {availableRoleGroups.map((roleGroup) => (
                    <AccordionItem
                      key={roleGroup.id}
                      value={roleGroup.id}
                      className="rounded-2xl border border-[#2b3242] bg-[#11131b]/65 shadow-none"
                    >
                      <AccordionTrigger className="px-4 py-3.5 hover:no-underline sm:px-4">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-white">
                            {roleGroup.label}
                          </p>
                          <p className="text-xs text-[#8f9abb]">
                            {roleGroup.roles.length} roles
                          </p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 sm:px-4">
                        <div className="flex flex-wrap gap-2.5">
                          {roleGroup.roles.map((role) => {
                            const isSelected = selectedRole === role;

                            return (
                              <button
                                key={`${roleGroup.id}-${role}`}
                                type="button"
                                onClick={() => {
                                  setSelectedRole(role);
                                  setError(null);
                                }}
                                disabled={isCreating}
                                className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-all sm:text-sm ${
                                  isSelected
                                    ? "border-[#4b5a82] bg-[#274cbc] text-white shadow-[0_12px_30px_rgba(39,76,188,0.25)]"
                                    : "border-[#2b3242] bg-[#10121a]/80 text-[#cfd3e1] hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
                                } disabled:cursor-not-allowed disabled:opacity-60`}
                              >
                                {isSelected && (
                                  <CheckCircle2 className="h-4 w-4" />
                                )}
                                <span>{role}</span>
                              </button>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="mt-4 flex flex-wrap gap-3">
                  {availableRoles.map((role) => {
                    const isSelected = selectedRole === role;

                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role);
                          setError(null);
                        }}
                        disabled={isCreating}
                        className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                          isSelected
                            ? "border-[#4b5a82] bg-[#274cbc] text-white shadow-[0_12px_30px_rgba(39,76,188,0.25)]"
                            : "border-[#2b3242] bg-[#10121a]/80 text-[#cfd3e1] hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {isSelected && <CheckCircle2 className="h-4 w-4" />}
                        <span>{role}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-500/10 border border-red-500/30 px-3 py-2">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isCreating}
            className="hover:text-white bg-[#151618] border border-[#2d313a] hover:bg-[#1c1d21]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating || !resumeName.trim() || (requiresRole && !selectedRole)}
            className="bg-[#274cbc] text-white hover:bg-[#315be1]"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Resume"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
