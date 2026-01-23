"use client";
import React, { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import { refineBulletPoint } from "@/lib/bulletRefinement";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * Props for BulletRefinementButton component.
 *
 * @param bulletText - The original bullet point text to refine
 * @param onRefinedPreview - Callback invoked with refined text when API call succeeds (shows preview)
 * @param context - Optional context (title, technologies) passed to AI for better refinement
 * @param size - Button size variant (defaults to "icon" for compact UI)
 * @param className - Additional CSS classes
 * @param isExternalLoading - Optional external loading state (e.g., when "Refine All" is active)
 */
interface BulletRefinementButtonProps {
  bulletText: string;
  onRefinedPreview: (refinedText: string) => void;
  context?: {
    title?: string;
    technologies?: string[];
  };
  size?: "sm" | "default" | "icon";
  className?: string;
  isExternalLoading?: boolean;
}

/**
 * Button component that triggers AI refinement of a single bullet point.
 *
 * Data flow: User click → API call → onRefinedPreview callback → preview box appears → user accepts/declines
 *
 * Handles loading state, error display, and validation (empty bullet check).
 */
export const BulletRefinementButton: React.FC<BulletRefinementButtonProps> = ({
  bulletText,
  onRefinedPreview,
  context,
  size = "icon",
  className,
  isExternalLoading = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // Combined loading state: either this button is loading or external (Refine All) is loading
  const showLoading = isLoading || isExternalLoading;

  /**
   * Handles the refinement flow: validate input → call API → show preview via callback.
   * Errors are displayed in a dialog; successful refinements trigger onRefinedPreview callback
   * which shows a preview box in the parent component (accordion item).
   */
  const handleRefine = async () => {
    if (!bulletText || bulletText.trim().length === 0) {
      setError("Please enter a bullet point before refining.");
      setShowErrorDialog(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await refineBulletPoint(bulletText, context);

      if (result.error) {
        // API returned an error (e.g., OpenAI API key missing, rate limit)
        setError(result.error);
        setShowErrorDialog(true);
      } else {
        // Success: pass refined text to parent component which shows preview box
        onRefinedPreview(result.refinedText);
      }
    } catch (err) {
      // Unexpected errors (e.g., network failures, parsing errors)
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      setShowErrorDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleRefine}
        disabled={showLoading || !bulletText || bulletText.trim().length === 0}
        className={`inline-flex items-center justify-center rounded-xl border border-[#2b3242] bg-[#1a1d24]/80 px-2 py-1.5 text-[#3c67eb] transition hover:border-[#3f4a67] hover:bg-[#1f2330] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title="Refine bullet point with AI"
      >
        {showLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Wand2 className="size-4" />
        )}
      </button>

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="bg-[#151618] w-1/3 border-[#1c1d21] text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Refinement Error</DialogTitle>
            <DialogDescription className="text-[#a4a7b5]">
              {error || "An error occurred while refining the bullet point."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button
              onClick={() => setShowErrorDialog(false)}
              className="bg-[#274CBC] hover:bg-[#315be1]"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
