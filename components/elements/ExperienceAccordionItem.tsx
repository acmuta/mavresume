import React, { useState } from "react";
import { Experience, useResumeStore } from "../../store/useResumeStore";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { CustomTextField } from "./CustomTextField";
import { Combobox } from "../ui/combobox";
import { months, years } from "../../data/university-data";
import { Label } from "../ui/label";
import { Wand2, Loader2, X, Plus } from "lucide-react";
import { BulletRefinementButton } from "./BulletRefinementButton";
import { BulletRefinementPreview } from "./BulletRefinementPreview";
import { RefineAllOverlay } from "./RefineAllOverlay";
import { refineBulletPoints } from "@/lib/bulletRefinement";
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
   * 2. Call refineBulletPoints with experience context (position + company)
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
      const results = await refineBulletPoints(nonEmptyBullets, {
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
      <AccordionTrigger className="text-lg flex items-center font-semibold no-underline">
        <span className="flex-1 text-left">
          Experience #{index + 1}
          {experience[index]?.position && ` - ${experience[index].position}`}
        </span>
        {experience.length > 1 && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            className="ml-2 p-1 rounded hover:bg-[#2d313a] transition-colors opacity-70 hover:opacity-100"
            aria-label="Delete experience entry"
          >
            <X className="size-4" />
          </div>
        )}
      </AccordionTrigger>
      <AccordionContent>
        <div className="w-full font-semibold flex gap-4 justify-center items-center overflow-auto">
          <div className="w-9/10 flex flex-col gap-2">
            <div className="flex w-full flex-col gap-2 items-center">
              <div className="flex w-full gap-2 items-center">
                <label>Position:</label>
                <CustomTextField
                  id="text"
                  placeholder="Position Title"
                  value={experience[index].position}
                  onChange={(e) => {
                    updateExperience(index, { position: e.target.value });
                  }}
                />
                <label>at</label>
                <CustomTextField
                  id="text"
                  placeholder="Company Name"
                  value={experience[index].company}
                  onChange={(e) => {
                    updateExperience(index, { company: e.target.value });
                  }}
                />
                <input
                  type="checkbox"
                  checked={experience[index].isCurrent}
                  onChange={(e) => {
                    updateExperience(index, { isCurrent: e.target.checked });
                  }}
                  className="checkbox border border-[#6F748B] hover:border-white transition"
                />
                <Label>Current Position</Label>
              </div>

              <div className="flex w-full gap-2 items-center">
                <label>Date:</label>

                <Combobox
                  items={months}
                  placeholder="Select Month"
                  onChange={(val) =>
                    updateExperience(index, { startMonth: val as string })
                  }
                />
                <Combobox
                  items={years}
                  placeholder="Select Year"
                  onChange={(val) =>
                    updateExperience(index, { startYear: val as string })
                  }
                />
                <label> - </label>
                {!experience[index].isCurrent ? (
                  <div className="flex gap-2">
                    <Combobox
                      items={months}
                      placeholder="Select Month"
                      onChange={(val) =>
                        updateExperience(index, { endMonth: val as string })
                      }
                    />
                    <Combobox
                      items={years}
                      placeholder="Select Year"
                      onChange={(val) =>
                        updateExperience(index, { endYear: val as string })
                      }
                    />
                  </div>
                ) : (
                  <Label>Present</Label>
                )}
              </div>
              <div className="flex flex-col w-full gap-2 items-start">
                <div className="flex items-center justify-between w-full">
                  <label htmlFor="" className="text-lg">
                    Describe your role and achievements:
                  </label>
                  <button
                    type="button"
                    onClick={handleRefineAll}
                    disabled={
                      isRefiningAll ||
                      !experience[index].bulletPoints.some(
                        (bp) => bp && bp.trim().length > 0
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-[#2b3242] bg-[#1a1d24]/80 px-3 py-1.5 text-sm text-[#3c67eb] transition hover:border-[#3f4a67] hover:bg-[#1f2330] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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

                {experience[index].bulletPoints.map((bp, bpIndex) => (
                  <div key={bpIndex} className="flex flex-col w-full gap-2">
                    <div className="flex items-center w-full gap-2">
                      <p className="text-2xl">&bull;</p>
                      <input
                        className="flex flex-wrap text-sm w-full border-b py-2 border-[#6F748B] 
                             focus:outline-none focus:border-white hover:text-white 
                             hover:border-white transition"
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
                          // Show preview box instead of updating store immediately
                          setPreviewTexts((prev) => ({
                            ...prev,
                            [bpIndex]: refinedText,
                          }));
                        }}
                        context={{
                          title: `${experience[index].position} at ${experience[index].company}`,
                        }}
                      />
                      {experience[index].bulletPoints.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteBulletPoint(bpIndex)}
                          className="inline-flex items-center justify-center rounded-xl border border-[#2b3242] bg-[#1a1d24]/80 px-2 py-1.5 text-[#6d7895] transition hover:border-[#3f4a67] hover:bg-[#1f2330] hover:text-white"
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
                          // Update store with refined text
                          const newBulletPoints = [
                            ...experience[index].bulletPoints,
                          ];
                          newBulletPoints[bpIndex] = previewTexts[bpIndex];
                          updateExperience(index, {
                            bulletPoints: newBulletPoints,
                          });
                          // Remove from preview state
                          setPreviewTexts((prev) => {
                            const updated = { ...prev };
                            delete updated[bpIndex];
                            return updated;
                          });
                        }}
                        onDecline={() => {
                          // Remove from preview state (don't update store)
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
                <button
                  type="button"
                  onClick={handleAddBulletPoint}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#2b3242] bg-[#1a1d24]/80 px-3 py-1.5 text-sm text-[#6d7895] transition hover:border-[#3f4a67] hover:bg-[#1f2330] hover:text-white"
                  title="Add bullet point"
                >
                  <Plus className="size-4" />
                  <span>Add Bullet Point</span>
                </button>
              </div>
            </div>
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
        <DialogContent className="bg-[#151618] border-[#1c1d21] text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Refinement Error</DialogTitle>
            <DialogDescription className="text-[#a4a7b5]">
              {error || "An error occurred while refining the bullet points."}
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

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-[#151618] border-[#1c1d21] text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Delete Experience Entry?</DialogTitle>
            <DialogDescription className="text-[#a4a7b5]">
              Are you sure you want to delete this experience entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => setShowDeleteDialog(false)}
              variant="outline"
              className="border-[#2d313a] hover:bg-[#1c1d21]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AccordionItem>
  );
};
