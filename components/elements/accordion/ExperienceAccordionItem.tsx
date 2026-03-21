import React, { useState } from "react";
import { Experience, useResumeStore } from "../../../store/useResumeStore";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { CustomTextField } from "../form/CustomTextField";
import { Combobox } from "../../ui/combobox";
import { months, years } from "../../../data/university-data";
import { Label } from "../../ui/label";
import { Wand2, Loader2, X, Plus } from "lucide-react";
import { BulletRefinementButton } from "../refinement/BulletRefinementButton";
import { BulletRefinementPreview } from "../refinement/BulletRefinementPreview";
import { RefineAllOverlay } from "../refinement/RefineAllOverlay";
import { refineBulletPointsBatch } from "@/lib/bulletRefinement";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExperienceAccordionItemProps {
  index: number;
  experience: Experience[];
}

export const ExperienceAccordionItem: React.FC<
  ExperienceAccordionItemProps
> = ({ index, experience }) => {
  const { updateExperience, removeExperience } = useResumeStore();
  const [isRefiningAll, setIsRefiningAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [previewTexts, setPreviewTexts] = useState<Record<number, string>>({});
  const [showRefineAllOverlay, setShowRefineAllOverlay] = useState(false);
  const [batchRefinements, setBatchRefinements] = useState<
    Array<{ index: number; original: string; refined: string }>
  >([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    removeExperience(index);
    setShowDeleteDialog(false);
  };

  /**
   * Refines all non-empty bullet points for this experience entry in batch.
   *
   * Data flow:
   * 1. Filter non-empty bullets from the array (may have empty slots)
   * 2. Call refineBulletPointsBatch with experience context (single API call)
   * 3. Collect successful refinements and open overlay dialog
   * 4. Users can accept/decline each refinement in the overlay
   *
   * The mapping logic preserves the original array structure: empty slots stay empty,
   * and refined bullets are shown in the overlay for review.
   */
  const handleRefineAll = async () => {
    const exp = experience[index];
    const nonEmptyBullets = exp.bulletPoints.filter(
      (bp) => bp && bp.trim().length > 0
    );

    if (nonEmptyBullets.length === 0) {
      setError("Please add at least one bullet point before refining.");
      setShowErrorDialog(true);
      return;
    }

    setIsRefiningAll(true);
    setError(null);

    try {
      // Pass experience context (position + company) to help AI generate relevant refinements
      // Uses batch API for single OpenAI call efficiency
      const results = await refineBulletPointsBatch(nonEmptyBullets, {
        title: `${exp.position} at ${exp.company}`,
      });

      // Check for errors - batch may partially succeed
      const hasError = results.some((r) => r.error);
      if (hasError) {
        const errorMessages = results
          .filter((r) => r.error)
          .map((r) => r.error)
          .join(", ");
        setError(`Some bullets failed to refine: ${errorMessages}`);
        setShowErrorDialog(true);
      }

      // Collect successful refinements with their indices for the overlay
      const refinements: Array<{
        index: number;
        original: string;
        refined: string;
      }> = [];
      let resultIndex = 0;
      for (let i = 0; i < exp.bulletPoints.length; i++) {
        if (exp.bulletPoints[i] && exp.bulletPoints[i].trim().length > 0) {
          if (results[resultIndex] && !results[resultIndex].error) {
            refinements.push({
              index: i,
              original: exp.bulletPoints[i],
              refined: results[resultIndex].refinedText,
            });
          }
          resultIndex++;
        }
      }

      // Open overlay with all refinements
      if (refinements.length > 0) {
        setBatchRefinements(refinements);
        setShowRefineAllOverlay(true);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      setShowErrorDialog(true);
    } finally {
      setIsRefiningAll(false);
    }
  };

  const handleAcceptIndividual = (bulletIndex: number) => {
    const refinement = batchRefinements.find((r) => r.index === bulletIndex);
    if (refinement) {
      // Update store with refined text
      const newBulletPoints = [...experience[index].bulletPoints];
      newBulletPoints[bulletIndex] = refinement.refined;
      updateExperience(index, { bulletPoints: newBulletPoints });

      // Remove from batch refinements
      setBatchRefinements((prev) =>
        prev.filter((r) => r.index !== bulletIndex)
      );

      // Close overlay if no refinements left
      if (batchRefinements.length === 1) {
        setShowRefineAllOverlay(false);
        setBatchRefinements([]);
      }
    }
  };

  const handleDeclineIndividual = (bulletIndex: number) => {
    // Remove from batch refinements
    setBatchRefinements((prev) => prev.filter((r) => r.index !== bulletIndex));

    // Close overlay if no refinements left
    if (batchRefinements.length === 1) {
      setShowRefineAllOverlay(false);
      setBatchRefinements([]);
    }
  };

  const handleAcceptAll = () => {
    // Update store with all refined texts
    const newBulletPoints = [...experience[index].bulletPoints];
    batchRefinements.forEach((refinement) => {
      newBulletPoints[refinement.index] = refinement.refined;
    });
    updateExperience(index, { bulletPoints: newBulletPoints });

    // Close overlay and clear refinements
    setShowRefineAllOverlay(false);
    setBatchRefinements([]);
  };

  const handleDeclineAll = () => {
    // Close overlay without updating store
    setShowRefineAllOverlay(false);
    setBatchRefinements([]);
  };

  const handleAddBulletPoint = () => {
    const newBulletPoints = [...experience[index].bulletPoints, ""];
    updateExperience(index, { bulletPoints: newBulletPoints });
  };

  const handleDeleteBulletPoint = (bpIndex: number) => {
    if (experience[index].bulletPoints.length <= 1) return; // Safety check
    const newBulletPoints = experience[index].bulletPoints.filter(
      (_, i) => i !== bpIndex
    );
    updateExperience(index, { bulletPoints: newBulletPoints });
    
    // Clean up preview text if it exists for deleted bullet
    if (previewTexts[bpIndex]) {
      setPreviewTexts((prev) => {
        const updated = { ...prev };
        delete updated[bpIndex];
        // Reindex remaining preview texts
        const reindexed: Record<number, string> = {};
        Object.keys(updated).forEach((key) => {
          const oldIndex = parseInt(key);
          if (oldIndex > bpIndex) {
            reindexed[oldIndex - 1] = updated[oldIndex];
          } else {
            reindexed[oldIndex] = updated[oldIndex];
          }
        });
        return reindexed;
      });
    }
  };

  return (
    <AccordionItem value={`Experience-${index}`}>
      <AccordionTrigger className="text-lg font-semibold no-underline">
        <div className="flex flex-1 items-center justify-between gap-4 pr-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
              Experience {index + 1}
            </p>
            <p className="mt-2 text-left text-lg font-semibold text-white">
              {experience[index]?.position || "New experience entry"}
            </p>
          </div>
          {experience.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2b3242] bg-[#10121a]/70 text-[#6d7895] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
              aria-label="Delete experience entry"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid gap-4">
          <div className="grid gap-5 md:grid-cols-2">
            <CustomTextField
              id={`position-${index}`}
              label="Position"
              placeholder="Position Title"
              value={experience[index].position}
              onChange={(e) => {
                updateExperience(index, { position: e.target.value });
              }}
            />
            <CustomTextField
              id={`company-${index}`}
              label="Company"
              placeholder="Company Name"
              value={experience[index].company}
              onChange={(e) => {
                updateExperience(index, { company: e.target.value });
              }}
            />

            <div className="grid gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#89a5ff]">
                Start date
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Combobox
                  items={months}
                  placeholder="Select month"
                  value={experience[index].startMonth}
                  onChange={(val) =>
                    updateExperience(index, { startMonth: val as string })
                  }
                />
                <Combobox
                  items={years}
                  placeholder="Select year"
                  value={experience[index].startYear}
                  onChange={(val) =>
                    updateExperience(index, { startYear: val as string })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#89a5ff]">
                End date
              </label>
              {!experience[index].isCurrent ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Combobox
                    items={months}
                    placeholder="Select month"
                    value={experience[index].endMonth}
                    onChange={(val) =>
                      updateExperience(index, { endMonth: val as string })
                    }
                  />
                  <Combobox
                    items={years}
                    placeholder="Select year"
                    value={experience[index].endYear}
                    onChange={(val) =>
                      updateExperience(index, { endYear: val as string })
                    }
                  />
                </div>
              ) : (
                <div className="inline-flex h-12 items-center rounded-2xl border border-[#2b3242] bg-[#10121a]/88 px-4 text-sm text-[#cfd3e1]">
                  Present
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex flex-wrap items-center gap-3 rounded-full bg-[#10121a]/72 px-4 py-3 ring-1 ring-inset ring-[#2b3242]">
              <input
                type="checkbox"
                checked={experience[index].isCurrent}
                onChange={(e) => {
                  updateExperience(index, { isCurrent: e.target.checked });
                }}
                className="checkbox border border-[#6F748B] hover:border-white transition"
              />
              <Label className="text-[#cfd3e1]">Current Position</Label>
            </div>
          </div>

          <div className="grid gap-4 rounded-[1.35rem] bg-[#10121a]/58 p-4 ring-1 ring-inset ring-[#2b3242]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#89a5ff]">
                  Bullet points
                </p>
                <p className="mt-2 text-sm text-[#6d7895]">
                  Describe your role and achievements.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRefineAll}
                disabled={
                  isRefiningAll ||
                  !experience[index].bulletPoints.some(
                    (bp) => bp && bp.trim().length > 0,
                  )
                }
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[#2b3242] bg-[#151923] px-4 text-sm text-[#89a5ff] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                title="Refine all bullet points with AI"
              >
                {isRefiningAll ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Refining...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="size-4" />
                    <span>Refine All</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid gap-3">
              {experience[index].bulletPoints.map((bp, bpIndex) => (
                <div key={bpIndex} className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#58f5c3]" />
                    <input
                      className="h-12 w-full rounded-2xl border border-[#2b3242] bg-[#10121a]/88 px-4 text-sm text-white placeholder:text-[#6d7895] outline-none transition focus:border-[#4b5a82] focus:bg-[#161b25]"
                      placeholder={`Bullet Point #${bpIndex + 1}`}
                      value={bp}
                      onChange={(e) => {
                        const newBulletPoints = [
                          ...experience[index].bulletPoints,
                        ];
                        newBulletPoints[bpIndex] = e.target.value;
                        updateExperience(index, {
                          bulletPoints: newBulletPoints,
                        });
                      }}
                    />
                    <BulletRefinementButton
                      bulletText={bp}
                      onRefinedPreview={(refinedText) => {
                        setPreviewTexts((prev) => ({
                          ...prev,
                          [bpIndex]: refinedText,
                        }));
                      }}
                      context={{
                        title: `${experience[index].position} at ${experience[index].company}`,
                      }}
                      isExternalLoading={isRefiningAll}
                    />
                    {experience[index].bulletPoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteBulletPoint(bpIndex)}
                        className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#2b3242] bg-[#151923] px-3 text-[#6d7895] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
                        title="Delete bullet point"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                  {previewTexts[bpIndex] && (
                    <BulletRefinementPreview
                      refinedText={previewTexts[bpIndex]}
                      originalText={bp}
                      onAccept={() => {
                        const newBulletPoints = [
                          ...experience[index].bulletPoints,
                        ];
                        newBulletPoints[bpIndex] = previewTexts[bpIndex];
                        updateExperience(index, {
                          bulletPoints: newBulletPoints,
                        });
                        setPreviewTexts((prev) => {
                          const updated = { ...prev };
                          delete updated[bpIndex];
                          return updated;
                        });
                      }}
                      onDecline={() => {
                        setPreviewTexts((prev) => {
                          const updated = { ...prev };
                          delete updated[bpIndex];
                          return updated;
                        });
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddBulletPoint}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#2b3242] bg-[#10121a]/80 px-4 text-sm font-medium text-[#cfd3e1] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
              title="Add bullet point"
            >
              <Plus className="size-4" />
              <span>Add Bullet Point</span>
            </button>
          </div>
        </div>
      </AccordionContent>

      <RefineAllOverlay
        isOpen={showRefineAllOverlay}
        onClose={handleDeclineAll}
        refinements={batchRefinements}
        onAccept={handleAcceptIndividual}
        onDecline={handleDeclineIndividual}
        onAcceptAll={handleAcceptAll}
        onDeclineAll={handleDeclineAll}
      />

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="rounded-[2rem] border border-[#2b3242] bg-[#111319]/96 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Refinement Error</DialogTitle>
            <DialogDescription className="text-[#a4a7b5]">
              {error || "An error occurred while refining the bullet points."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button
              onClick={() => setShowErrorDialog(false)}
              className="rounded-full bg-[#274CBC] hover:bg-[#315be1]"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="w-[92vw] max-w-lg rounded-[2rem] border border-[#2b3242] bg-[#111319]/96 text-white">
          <DialogHeader>
            <DialogTitle>Delete Experience Entry?</DialogTitle>
            <DialogDescription className="text-[#a4a7b5]">
              Are you sure you want to delete this experience entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => setShowDeleteDialog(false)}
              variant="outline"
              className="rounded-full border-[#2d313a] bg-transparent hover:bg-[#161b25] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="rounded-full bg-[#274cbc] text-white hover:bg-[#315be1]"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AccordionItem>
  );
};
