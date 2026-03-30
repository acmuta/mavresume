export type PdfFontFamily = "serif" | "sans" | "mono";
export type MarginPreset = "compact" | "standard" | "comfortable";
export type SectionSpacingDensity = "tight" | "normal" | "relaxed";

export interface PdfSettings {
  fontFamily: PdfFontFamily;
  baseFontSize: number;
  lineHeight: number;
  sectionHeadingSize: number;
  sectionHeadingWeight: number;
  marginPreset: MarginPreset;
  sectionSpacingDensity: SectionSpacingDensity;
}

export const DEFAULT_PDF_SETTINGS: PdfSettings = {
  fontFamily: "serif",
  baseFontSize: 11,
  lineHeight: 1.4,
  sectionHeadingSize: 13,
  sectionHeadingWeight: 700,
  marginPreset: "standard",
  sectionSpacingDensity: "normal",
};

const MIN_BASE_FONT_SIZE = 10;
const MAX_BASE_FONT_SIZE = 13;
const MIN_LINE_HEIGHT = 1.15;
const MAX_LINE_HEIGHT = 1.8;
const MIN_HEADING_SIZE = 11;
const MAX_HEADING_SIZE = 16;
const MIN_HEADING_WEIGHT = 500;
const MAX_HEADING_WEIGHT = 800;

const MARGIN_PADDING_MAP: Record<MarginPreset, number> = {
  compact: 24,
  standard: 32,
  comfortable: 40,
};

const SECTION_SPACING_MAP: Record<SectionSpacingDensity, number> = {
  tight: 2,
  normal: 3,
  relaxed: 4,
};

const isFontFamily = (value: unknown): value is PdfFontFamily =>
  value === "serif" || value === "sans" || value === "mono";

const isMarginPreset = (value: unknown): value is MarginPreset =>
  value === "compact" || value === "standard" || value === "comfortable";

const isSectionSpacingDensity = (
  value: unknown,
): value is SectionSpacingDensity =>
  value === "tight" || value === "normal" || value === "relaxed";

const toNumber = (value: unknown, fallback: number): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export function normalizePdfSettings(
  value?: Partial<PdfSettings> | null,
): PdfSettings {
  if (!value) {
    return { ...DEFAULT_PDF_SETTINGS };
  }

  return {
    fontFamily: isFontFamily(value.fontFamily)
      ? value.fontFamily
      : DEFAULT_PDF_SETTINGS.fontFamily,
    baseFontSize: clamp(
      toNumber(value.baseFontSize, DEFAULT_PDF_SETTINGS.baseFontSize),
      MIN_BASE_FONT_SIZE,
      MAX_BASE_FONT_SIZE,
    ),
    lineHeight: clamp(
      toNumber(value.lineHeight, DEFAULT_PDF_SETTINGS.lineHeight),
      MIN_LINE_HEIGHT,
      MAX_LINE_HEIGHT,
    ),
    sectionHeadingSize: clamp(
      toNumber(
        value.sectionHeadingSize,
        DEFAULT_PDF_SETTINGS.sectionHeadingSize,
      ),
      MIN_HEADING_SIZE,
      MAX_HEADING_SIZE,
    ),
    sectionHeadingWeight: clamp(
      Math.round(
        toNumber(
          value.sectionHeadingWeight,
          DEFAULT_PDF_SETTINGS.sectionHeadingWeight,
        ),
      ),
      MIN_HEADING_WEIGHT,
      MAX_HEADING_WEIGHT,
    ),
    marginPreset: isMarginPreset(value.marginPreset)
      ? value.marginPreset
      : DEFAULT_PDF_SETTINGS.marginPreset,
    sectionSpacingDensity: isSectionSpacingDensity(value.sectionSpacingDensity)
      ? value.sectionSpacingDensity
      : DEFAULT_PDF_SETTINGS.sectionSpacingDensity,
  };
}

export function resolvePdfMarginPaddingPx(settings: PdfSettings): number {
  return MARGIN_PADDING_MAP[settings.marginPreset];
}

export function resolvePdfSectionSpacingPx(settings: PdfSettings): number {
  return SECTION_SPACING_MAP[settings.sectionSpacingDensity];
}

export function toReactPdfFontFamily(settings: PdfSettings): string {
  if (settings.fontFamily === "sans") return "Helvetica";
  if (settings.fontFamily === "mono") return "Courier";
  return "Times-Roman";
}

export function toPreviewFontFamily(settings: PdfSettings): string {
  if (settings.fontFamily === "sans") {
    return "'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif";
  }

  if (settings.fontFamily === "mono") {
    return "'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
  }

  return "Georgia, 'Times New Roman', Times, serif";
}

export interface PreviewTypography {
  scale: number;
  headingEm: number;
  subheadingEm: number;
  labelEm: number;
  bodyEm: number;
  nameEm: number;
}

export function computePreviewTypography(
  settings: PdfSettings,
): PreviewTypography {
  const PREVIEW_SCALE_TUNING = 0.6;
  const baseScale = settings.baseFontSize / DEFAULT_PDF_SETTINGS.baseFontSize;
  const headingScale =
    settings.sectionHeadingSize / DEFAULT_PDF_SETTINGS.sectionHeadingSize;

  return {
    scale: baseScale * PREVIEW_SCALE_TUNING,
    headingEm: 2 * headingScale,
    subheadingEm: 1.5,
    labelEm: 1.3,
    bodyEm: 1.2,
    nameEm: 2.5,
  };
}
