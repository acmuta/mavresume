import React, { useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Combobox } from "../ui/combobox";
import { Project, useResumeStore } from "../../store/useResumeStore";
import { CustomTextField } from "./CustomTextField";
import { Technologies } from "../../data/university-data";
import { Dot, Wand2, Loader2, X, Plus } from "lucide-react";
import { BulletRefinementButton } from "./BulletRefinementButton";
import { BulletRefinementPreview } from "./BulletRefinementPreview";
import { RefineAllOverlay } from "./RefineAllOverlay";
import { refineBulletPointsBatch } from "@/lib/bulletRefinement";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProjectAccordionItemProps {
  index: number;
  projects: Project[];
}

export const ProjectAccordionItem: React.FC<ProjectAccordionItemProps> = ({
  index,
  projects,
}) => {
  const { updateProject, removeProject } = useResumeStore();
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
    removeProject(index);
    setShowDeleteDialog(false);
  };

  /**
   * Refines all non-empty bullet points for this project entry in batch.
   *
   * Data flow:
   * 1. Filter non-empty bullets from the array (may have empty slots)
   * 2. Call refineBulletPointsBatch with project context (single API call)
   * 3. Collect successful refinements and open overlay dialog
   * 4. Users can accept/decline each refinement in the overlay
   *
   * Projects include technologies in context (unlike experiences) to help AI
   * generate more technically accurate refinements.
   */
  const handleRefineAll = async () => {
    const project = projects[index];
    const nonEmptyBullets = project.bulletPoints.filter(
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
      // Pass project context (title + technologies) to help AI generate
      // technically accurate and relevant refinements
      // Uses batch API for single OpenAI call efficiency
      const results = await refineBulletPointsBatch(nonEmptyBullets, {
        title: project.title,
        technologies: project.technologies,
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
      for (let i = 0; i < project.bulletPoints.length; i++) {
        if (
          project.bulletPoints[i] &&
          project.bulletPoints[i].trim().length > 0
        ) {
          if (results[resultIndex] && !results[resultIndex].error) {
            refinements.push({
              index: i,
              original: project.bulletPoints[i],
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
      const newBulletPoints = [...projects[index].bulletPoints];
      newBulletPoints[bulletIndex] = refinement.refined;
      updateProject(index, { bulletPoints: newBulletPoints });

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
    const newBulletPoints = [...projects[index].bulletPoints];
    batchRefinements.forEach((refinement) => {
      newBulletPoints[refinement.index] = refinement.refined;
    });
    updateProject(index, { bulletPoints: newBulletPoints });

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
    const newBulletPoints = [...projects[index].bulletPoints, ""];
    updateProject(index, { bulletPoints: newBulletPoints });
  };

  const handleDeleteBulletPoint = (bpIndex: number) => {
    if (projects[index].bulletPoints.length <= 1) return; // Safety check
    const newBulletPoints = projects[index].bulletPoints.filter(
      (_, i) => i !== bpIndex
    );
    updateProject(index, { bulletPoints: newBulletPoints });
    
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
    <AccordionItem value={`Project-${index}`}>
      <AccordionTrigger className="text-lg flex items-center font-semibold no-underline">
        <span className="flex-1 text-left">
          Project #{index + 1}
          {projects[index]?.title && ` - ${projects[index].title}`}
        </span>
        {projects.length > 1 && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            className="ml-2 p-1 rounded-full hover:bg-[#2d313a] transition-colors opacity-70 hover:opacity-100"
            aria-label="Delete project entry"
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
                <label>Project Title:</label>
                <CustomTextField
                  id="text"
                  placeholder="Project Title"
                  value={projects[index].title}
                  onChange={(e) => {
                    updateProject(index, { title: e.target.value });
                  }}
                />
              </div>

              <div className="flex w-full gap-2 items-center">
                <label>Technologies Used:</label>
                <Combobox
                  items={Technologies}
                  placeholder="Selected Technologies..."
                  value={projects[index].technologies}
                  onChange={(selectedItems) => {
                    updateProject(index, {
                      technologies: Array.isArray(selectedItems)
                        ? selectedItems
                        : selectedItems
                        ? [selectedItems]
                        : undefined,
                    });
                  }}
                  multiSelect
                />
              </div>
              <div className="flex flex-col w-full gap-2 items-start">
                <div className="flex items-center justify-between w-full">
                  <label htmlFor="" className="text-lg">
                    Describe the project in bullet points
                  </label>
                  <button
                    type="button"
                    onClick={handleRefineAll}
                    disabled={
                      isRefiningAll ||
                      !projects[index].bulletPoints.some(
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

                {projects[index].bulletPoints.map((bp, bpIndex) => (
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
                            ...projects[index].bulletPoints,
                          ];
                          newBulletPoints[bpIndex] = e.target.value;
                          updateProject(index, {
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
                          title: projects[index].title,
                          technologies: projects[index].technologies,
                        }}
                        isExternalLoading={isRefiningAll}
                      />
                      {projects[index].bulletPoints.length > 1 && (
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
                            ...projects[index].bulletPoints,
                          ];
                          newBulletPoints[bpIndex] = previewTexts[bpIndex];
                          updateProject(index, {
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
        <DialogContent className="bg-[#151618] w-1/3 border-[#1c1d21] text-white">
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
        <DialogContent className="bg-[#151618] w-[30vw] border-[#1c1d21] text-white">
          <DialogHeader>
            <DialogTitle className="text-blue-200">Delete Project Entry?</DialogTitle>
            <DialogDescription className="text-[#a4a7b5]">
              Are you sure you want to delete this project entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => setShowDeleteDialog(false)}
              variant="outline"
              className="hover:text-white bg-[#151618] border border-[#2d313a] hover:bg-[#1c1d21]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="border border-[#2d313a] hover:bg-[#1c1d21]"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AccordionItem>
  );
};
