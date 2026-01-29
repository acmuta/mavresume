"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, FileText } from "lucide-react";
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
import { useSessionStore } from "@/store/useSessionStore";
import { createResume } from "@/lib/resumeService";

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
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    // Validate input
    const trimmedName = resumeName.trim();
    if (!trimmedName) {
      setError("Please enter a name for your resume");
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
        templateType ?? undefined
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
      setError(null);
      setIsCreating(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#15171c] border-[#2d313a] text-white">
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

        {/* Resume Name Section */}
        <div className="space-y-4 py-4">
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
              className="bg-[#1a1c22]/50 border-[#2d313a] text-white placeholder:text-[#6d7895] focus-visible:border-[#274cbc] focus-visible:ring-[#274cbc]/20"
              autoFocus
            />
            <p className="text-xs text-[#6d7895]">
              Give your resume a memorable name to find it later
            </p>
          </div>

          {/* Error Message */}
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
            disabled={isCreating || !resumeName.trim()}
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
