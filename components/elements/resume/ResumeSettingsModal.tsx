"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  DEFAULT_PDF_SETTINGS,
  type MarginPreset,
  type PdfFontFamily,
  type PdfSettings,
  type SectionSpacingDensity,
} from "@/lib/resume/pdfSettings";
import { useResumeStore } from "@/store/useResumeStore";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";

const FONT_FAMILY_OPTIONS: Array<{ label: string; value: PdfFontFamily }> = [
  { label: "Serif", value: "serif" },
  { label: "Sans", value: "sans" },
  { label: "Mono", value: "mono" },
];

const MARGIN_OPTIONS: Array<{ label: string; value: MarginPreset }> = [
  { label: "Compact", value: "compact" },
  { label: "Standard", value: "standard" },
  { label: "Comfortable", value: "comfortable" },
];

const SPACING_OPTIONS: Array<{ label: string; value: SectionSpacingDensity }> =
  [
    { label: "Tight", value: "tight" },
    { label: "Normal", value: "normal" },
    { label: "Relaxed", value: "relaxed" },
  ];

const HEADING_WEIGHT_OPTIONS = [600, 700, 800] as const;

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const parseNumberish = (value: string, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

interface ResumeSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResumeSettingsModal: React.FC<ResumeSettingsModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { pdfSettings, updatePdfSettings } = useResumeStore();
  const [draftSettings, setDraftSettings] = useState<PdfSettings>(pdfSettings);

  useEffect(() => {
    if (open) {
      setDraftSettings(pdfSettings);
    }
  }, [open, pdfSettings]);

  const sectionHeadingRatio = useMemo(() => {
    const ratio = draftSettings.sectionHeadingSize / draftSettings.baseFontSize;
    return ratio.toFixed(2);
  }, [draftSettings.sectionHeadingSize, draftSettings.baseFontSize]);

  const setNumericField = (
    key: "baseFontSize" | "lineHeight" | "sectionHeadingSize",
    rawValue: string,
  ) => {
    setDraftSettings((prev) => ({
      ...prev,
      [key]: parseNumberish(rawValue, prev[key]),
    }));
  };

  const handleApply = () => {
    updatePdfSettings(draftSettings);
    onOpenChange(false);
  };

  const handleReset = () => {
    setDraftSettings({ ...DEFAULT_PDF_SETTINGS });
  };

  const handleCancel = () => {
    setDraftSettings(pdfSettings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[94vw] max-w-3xl rounded-4xl border border-[#2b3242] bg-[radial-gradient(circle_at_top,rgba(39,76,188,0.16),transparent_40%),linear-gradient(180deg,rgba(17,19,25,0.96),rgba(11,12,16,0.98))] text-white shadow-[0_30px_80px_rgba(3,4,7,0.45)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight text-white">
            Resume settings
          </DialogTitle>
          <DialogDescription className="max-w-2xl text-sm leading-relaxed text-[#a4a7b5]">
            Update formatting for this resume only. Changes are saved with this
            resume after you apply them.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-2 md:grid-cols-2">
          <div className="rounded-3xl border border-[#2b3242] bg-[#10121a]/65 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
              Typography
            </p>

            <div className="mt-4 flex flex-col gap-4">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a4a7b5]">
                  Font family
                </Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {FONT_FAMILY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setDraftSettings((prev) => ({
                          ...prev,
                          fontFamily: option.value,
                        }))
                      }
                      className={`inline-flex h-9 items-center rounded-full border px-3 text-xs font-medium transition-all ${
                        draftSettings.fontFamily === option.value
                          ? "border-[#4b5a82] bg-[#274cbc] text-white"
                          : "border-[#2b3242] bg-[#10121a]/70 text-[#cfd3e1] hover:border-[#4b5a82] hover:bg-[#161b25]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="baseFontSize"
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a4a7b5]"
                >
                  Base font size: {clamp(Math.round(draftSettings.baseFontSize), 10, 13)}
                </Label>
                <Input
                  id="baseFontSize"
                  type="range"
                  min={10}
                  max={13}
                  step={1}
                  value={clamp(draftSettings.baseFontSize, 10, 13)}
                  onChange={(event) =>
                    setNumericField("baseFontSize", event.target.value)
                  }
                  className="mt-2 h-8 border-[#2b3242] bg-[#0f1117]/70"
                />
              </div>

              <div>
                <Label
                  htmlFor="lineHeight"
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a4a7b5]"
                >
                  Line spacing
                </Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    id="lineHeight"
                    type="range"
                    min={1.15}
                    max={1.8}
                    step={0.05}
                    value={clamp(draftSettings.lineHeight, 1.15, 1.8)}
                    onChange={(event) =>
                      setNumericField("lineHeight", event.target.value)
                    }
                    className="h-8 border-[#2b3242] bg-[#0f1117]/70"
                  />
                  <Input
                    type="number"
                    min={1.15}
                    max={1.8}
                    step={0.05}
                    value={Number(draftSettings.lineHeight.toFixed(2))}
                    onChange={(event) =>
                      setNumericField("lineHeight", event.target.value)
                    }
                    className="w-20 border-[#2b3242] bg-[#0f1117]/70 text-[#cfd3e1]"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="headingSize"
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a4a7b5]"
                >
                  Section heading size: {clamp(Math.round(draftSettings.sectionHeadingSize), 11, 16)}
                </Label>
                <Input
                  id="headingSize"
                  type="range"
                  min={11}
                  max={16}
                  step={1}
                  value={clamp(draftSettings.sectionHeadingSize, 11, 16)}
                  onChange={(event) =>
                    setNumericField("sectionHeadingSize", event.target.value)
                  }
                  className="mt-2 h-8 border-[#2b3242] bg-[#0f1117]/70"
                />
                <p className="mt-1 text-xs text-[#6d7895]">
                  Heading ratio to body: {sectionHeadingRatio}x
                </p>
              </div>

              <div>
                <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a4a7b5]">
                  Section heading weight
                </Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {HEADING_WEIGHT_OPTIONS.map((weight) => (
                    <button
                      key={weight}
                      type="button"
                      onClick={() =>
                        setDraftSettings((prev) => ({
                          ...prev,
                          sectionHeadingWeight: weight,
                        }))
                      }
                      className={`inline-flex h-9 items-center rounded-full border px-3 text-xs font-medium transition-all ${
                        draftSettings.sectionHeadingWeight === weight
                          ? "border-[#4b5a82] bg-[#274cbc] text-white"
                          : "border-[#2b3242] bg-[#10121a]/70 text-[#cfd3e1] hover:border-[#4b5a82] hover:bg-[#161b25]"
                      }`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#2b3242] bg-[#10121a]/65 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
              Layout
            </p>

            <div className="mt-4 flex flex-col gap-4">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a4a7b5]">
                  Margin preset
                </Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {MARGIN_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setDraftSettings((prev) => ({
                          ...prev,
                          marginPreset: option.value,
                        }))
                      }
                      className={`inline-flex h-9 items-center rounded-full border px-3 text-xs font-medium transition-all ${
                        draftSettings.marginPreset === option.value
                          ? "border-[#4b5a82] bg-[#274cbc] text-white"
                          : "border-[#2b3242] bg-[#10121a]/70 text-[#cfd3e1] hover:border-[#4b5a82] hover:bg-[#161b25]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a4a7b5]">
                  Section spacing density
                </Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SPACING_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setDraftSettings((prev) => ({
                          ...prev,
                          sectionSpacingDensity: option.value,
                        }))
                      }
                      className={`inline-flex h-9 items-center rounded-full border px-3 text-xs font-medium transition-all ${
                        draftSettings.sectionSpacingDensity === option.value
                          ? "border-[#4b5a82] bg-[#274cbc] text-white"
                          : "border-[#2b3242] bg-[#10121a]/70 text-[#cfd3e1] hover:border-[#4b5a82] hover:bg-[#161b25]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="h-10 rounded-full border-[#2b3242] bg-[#10121a]/70 px-4 text-sm text-[#cfd3e1] shadow-none hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
          >
            Reset to defaults
          </Button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="h-10 rounded-full border-[#2b3242] bg-[#10121a]/70 px-4 text-sm text-[#cfd3e1] shadow-none hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              className="h-10 rounded-full bg-[#274cbc] px-5 text-sm font-semibold text-white hover:bg-[#315be1]"
            >
              Apply settings
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
