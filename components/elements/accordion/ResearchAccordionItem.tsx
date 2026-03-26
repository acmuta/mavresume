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

interface ResearchAccordionItemProps {
  index: number;
  entries: Experience[];
}

export const ResearchAccordionItem: React.FC<ResearchAccordionItemProps> = ({
  index,
  entries,
}) => {
  const { updateResearch, removeResearch } = useResumeStore();
  const [isRefiningAll, setIsRefiningAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [previewTexts, setPreviewTexts] = useState<Record<number, string>>({});
  const [showRefineAllOverlay, setShowRefineAllOverlay] = useState(false);
  const [batchRefinements, setBatchRefinements] = useState<
    Array<{ index: number; original: string; refined: string }>
  >([]);

  const handleRefineAll = async () => {
    const entry = entries[index];
    const nonEmptyBullets = entry.bulletPoints.filter(
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
      const results = await refineBulletPointsBatch(nonEmptyBullets, {
        title: `${entry.position} at ${entry.company}`,
      });

      const hasError = results.some((r) => r.error);
      if (hasError) {
        const errorMessages = results
          .filter((r) => r.error)
          .map((r) => r.error)
          .join(", ");
        setError(`Some bullets failed to refine: ${errorMessages}`);
        setShowErrorDialog(true);
      }

      const refinements: Array<{
        index: number;
        original: string;
        refined: string;
      }> = [];
      let resultIndex = 0;
      for (let i = 0; i < entry.bulletPoints.length; i++) {
        if (entry.bulletPoints[i] && entry.bulletPoints[i].trim().length > 0) {
          if (results[resultIndex] && !results[resultIndex].error) {
            refinements.push({
              index: i,
              original: entry.bulletPoints[i],
              refined: results[resultIndex].refinedText,
            });
          }
          resultIndex++;
        }
      }

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
      const newBulletPoints = [...entries[index].bulletPoints];
      newBulletPoints[bulletIndex] = refinement.refined;
      updateResearch(index, { bulletPoints: newBulletPoints });

      setBatchRefinements((prev) => prev.filter((r) => r.index !== bulletIndex));

      if (batchRefinements.length === 1) {
        setShowRefineAllOverlay(false);
        setBatchRefinements([]);
      }
    }
  };

  const handleDeclineIndividual = (bulletIndex: number) => {
    setBatchRefinements((prev) => prev.filter((r) => r.index !== bulletIndex));

    if (batchRefinements.length === 1) {
      setShowRefineAllOverlay(false);
      setBatchRefinements([]);
    }
  };

  const handleAcceptAll = () => {
    const newBulletPoints = [...entries[index].bulletPoints];
    batchRefinements.forEach((refinement) => {
      newBulletPoints[refinement.index] = refinement.refined;
    });
    updateResearch(index, { bulletPoints: newBulletPoints });

    setShowRefineAllOverlay(false);
    setBatchRefinements([]);
  };

  const handleDeclineAll = () => {
    setShowRefineAllOverlay(false);
    setBatchRefinements([]);
  };

  const handleAddBulletPoint = () => {
    const newBulletPoints = [...entries[index].bulletPoints, ""];
    updateResearch(index, { bulletPoints: newBulletPoints });
  };

  const handleDeleteBulletPoint = (bpIndex: number) => {
    if (entries[index].bulletPoints.length <= 1) return;
    const newBulletPoints = entries[index].bulletPoints.filter(
      (_, i) => i !== bpIndex,
    );
    updateResearch(index, { bulletPoints: newBulletPoints });

    if (previewTexts[bpIndex]) {
      setPreviewTexts((prev) => {
        const updated = { ...prev };
        delete updated[bpIndex];
        const reindexed: Record<number, string> = {};
        Object.keys(updated).forEach((key) => {
          const oldIndex = parseInt(key, 10);
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
    <AccordionItem value={`Research-${index}`}>
      <AccordionTrigger className="text-lg font-semibold no-underline">
        <div className="flex flex-1 items-center justify-between gap-4 pr-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
              Research Entry {index + 1}
            </p>
            <p className="mt-2 text-left text-lg font-semibold text-white">
              {entries[index]?.position || "New research entry"}
            </p>
          </div>
          {entries.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeResearch(index);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2b3242] bg-[#10121a]/70 text-[#6d7895] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
              aria-label="Delete research entry"
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
              id={`research-role-${index}`}
              label="Role"
              placeholder="Research Assistant"
              value={entries[index].position}
              onChange={(e) => {
                updateResearch(index, { position: e.target.value });
              }}
            />
            <CustomTextField
              id={`research-lab-${index}`}
              label="Lab or Institution"
              placeholder="Lab, Department, or Institution"
              value={entries[index].company}
              onChange={(e) => {
                updateResearch(index, { company: e.target.value });
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
                  value={entries[index].startMonth}
                  onChange={(val) =>
                    updateResearch(index, { startMonth: val as string })
                  }
                />
                <Combobox
                  items={years}
                  placeholder="Select year"
                  value={entries[index].startYear}
                  onChange={(val) =>
                    updateResearch(index, { startYear: val as string })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#89a5ff]">
                End date
              </label>
              {!entries[index].isCurrent ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Combobox
                    items={months}
                    placeholder="Select month"
                    value={entries[index].endMonth}
                    onChange={(val) =>
                      updateResearch(index, { endMonth: val as string })
                    }
                  />
                  <Combobox
                    items={years}
                    placeholder="Select year"
                    value={entries[index].endYear}
                    onChange={(val) =>
                      updateResearch(index, { endYear: val as string })
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
                checked={entries[index].isCurrent}
                onChange={(e) => {
                  updateResearch(index, { isCurrent: e.target.checked });
                }}
                className="checkbox border border-[#6F748B] hover:border-white transition"
              />
              <Label className="text-[#cfd3e1]">Current Role</Label>
            </div>
          </div>

          <div className="grid gap-4 rounded-[1.35rem] bg-[#10121a]/58 p-4 ring-1 ring-inset ring-[#2b3242]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#89a5ff]">
                  Bullet points
                </p>
                <p className="mt-2 text-sm text-[#6d7895]">
                  Highlight methodologies, findings, and measurable contributions.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRefineAll}
                disabled={
                  isRefiningAll ||
                  !entries[index].bulletPoints.some(
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
              {entries[index].bulletPoints.map((bp, bpIndex) => (
                <div key={bpIndex} className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#58f5c3]" />
                    <input
                      className="h-12 w-full rounded-2xl border border-[#2b3242] bg-[#10121a]/88 px-4 text-sm text-white placeholder:text-[#6d7895] outline-none transition focus:border-[#4b5a82] focus:bg-[#161b25]"
                      placeholder={`Bullet Point #${bpIndex + 1}`}
                      value={bp}
                      onChange={(e) => {
                        const newBulletPoints = [...entries[index].bulletPoints];
                        newBulletPoints[bpIndex] = e.target.value;
                        updateResearch(index, { bulletPoints: newBulletPoints });
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
                        title: `${entries[index].position} at ${entries[index].company}`,
                      }}
                      isExternalLoading={isRefiningAll}
                    />
                    {entries[index].bulletPoints.length > 1 && (
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
                        const newBulletPoints = [...entries[index].bulletPoints];
                        newBulletPoints[bpIndex] = previewTexts[bpIndex];
                        updateResearch(index, { bulletPoints: newBulletPoints });
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
    </AccordionItem>
  );
};
