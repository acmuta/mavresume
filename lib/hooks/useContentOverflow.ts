"use client";

import { RefObject, useEffect, useState, useCallback, useRef } from "react";

/**
 * Default threshold percentage at which the overflow warning is triggered.
 * 90% means the warning appears when content fills 90% of the PDF page.
 */
const DEFAULT_OVERFLOW_THRESHOLD = 90;

/**
 * Debounce delay in milliseconds to prevent layout thrashing during rapid edits.
 */
const DEBOUNCE_DELAY = 100;

/**
 * PDF page dimensions and proportions (based on ResumeDoc.tsx)
 * 
 * A4 page size: 595.28pt x 841.89pt (at 72 DPI)
 * PDF padding: 32pt on all sides
 * Usable content area: 531.28pt x 777.89pt
 * 
 * The usable height ratio determines how much of the page is available
 * for content after accounting for padding.
 */
const PDF_A4_HEIGHT_PT = 841.89;
const PDF_PADDING_PT = 32;
const PDF_USABLE_HEIGHT_PT = PDF_A4_HEIGHT_PT - (PDF_PADDING_PT * 2);
const PDF_USABLE_HEIGHT_RATIO = PDF_USABLE_HEIGHT_PT / PDF_A4_HEIGHT_PT; // ≈ 0.924

interface UseContentOverflowResult {
  /** Current fill percentage (0-100+, can exceed 100 if overflowing) - relative to PDF page */
  fillPercentage: number;
  /** True when content reaches or exceeds the threshold */
  isNearOverflow: boolean;
  /** True when content actually exceeds PDF page bounds (>100%) */
  isOverflowing: boolean;
}

/**
 * Custom hook to detect when content is approaching or exceeding PDF page bounds.
 * 
 * Uses ResizeObserver to efficiently track content size changes and calculates
 * the fill percentage relative to the PDF's usable content area (accounting for
 * the PDF's 32pt padding on A4 pages).
 * 
 * This ensures the percentage shown accurately reflects how full the actual
 * PDF page would be, not just the preview container.
 * 
 * @param containerRef - Ref to the container element (with A4 aspect ratio)
 * @param contentRef - Ref to the content element (the scrollable content inside)
 * @param threshold - Percentage (0-100) at which to trigger the near-overflow warning
 * @returns Object containing fillPercentage, isNearOverflow, and isOverflowing states
 * 
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const contentRef = useRef<HTMLDivElement>(null);
 * const { isNearOverflow, fillPercentage } = useContentOverflow(containerRef, contentRef);
 * ```
 */
export function useContentOverflow(
  containerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  threshold: number = DEFAULT_OVERFLOW_THRESHOLD
): UseContentOverflowResult {
  const [fillPercentage, setFillPercentage] = useState(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Measures the content height relative to the PDF's usable content area.
   * 
   * The calculation accounts for the difference between the preview's padding
   * and the PDF's padding proportions:
   * 
   * 1. Get the container's total height (including its padding)
   * 2. Calculate the PDF-equivalent usable height using the PDF's proportions
   * 3. Get the actual content height (scrollHeight of content div)
   * 4. Calculate percentage: contentHeight / pdfEquivalentUsableHeight
   * 
   * This ensures the percentage reflects actual PDF page fill, not preview fill.
   */
  const measureOverflow = useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) {
      return;
    }

    const containerHeight = container.clientHeight;
    const contentHeight = content.scrollHeight;

    if (containerHeight === 0) {
      return;
    }

    // Calculate the PDF-equivalent usable height
    // This is the height available for content if the preview had PDF's padding proportions
    const pdfEquivalentUsableHeight = containerHeight * PDF_USABLE_HEIGHT_RATIO;

    // Calculate fill percentage relative to PDF's usable area
    const percentage = (contentHeight / pdfEquivalentUsableHeight) * 100;
    setFillPercentage(Math.round(percentage));
  }, [containerRef, contentRef]);

  /**
   * Debounced version of measureOverflow to prevent excessive calculations
   * during rapid content changes (e.g., typing).
   */
  const debouncedMeasure = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      measureOverflow();
    }, DEBOUNCE_DELAY);
  }, [measureOverflow]);

  useEffect(() => {
    // SSR guard - ResizeObserver is not available on server
    if (typeof window === "undefined") {
      return;
    }

    const content = contentRef.current;
    const container = containerRef.current;

    if (!content || !container) {
      return;
    }

    // Initial measurement after mount
    measureOverflow();

    // Create ResizeObserver to track content size changes
    const resizeObserver = new ResizeObserver(() => {
      debouncedMeasure();
    });

    // Observe both container and content for size changes
    // Container observation handles window resize/zoom
    // Content observation handles content changes
    resizeObserver.observe(content);
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [containerRef, contentRef, measureOverflow, debouncedMeasure]);

  return {
    fillPercentage,
    isNearOverflow: fillPercentage >= threshold,
    isOverflowing: fillPercentage > 100,
  };
}
