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

interface UseContentOverflowResult {
  /** Current fill percentage (0-100+, can exceed 100 if overflowing) */
  fillPercentage: number;
  /** True when content reaches or exceeds the threshold */
  isNearOverflow: boolean;
  /** True when content actually exceeds the single-page content area (>100%) */
  isOverflowing: boolean;
}

/**
 * Custom hook to detect when content is approaching or exceeding the preview's
 * padded single-page content area.
 *
 * The preview uses PDF-scaled page padding, so measuring the actual rendered
 * content block against the page's rendered usable height keeps the warning
 * aligned with what the user sees and with exported single-page fit.
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

  const measureOverflow = useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    const paddedPage = content?.parentElement;

    if (!container || !content || !paddedPage) {
      return;
    }

    const containerHeight = container.clientHeight;
    const contentHeight = content.scrollHeight;
    const paddedPageStyles = window.getComputedStyle(paddedPage);
    const paddingTop = parseFloat(paddedPageStyles.paddingTop) || 0;
    const paddingBottom = parseFloat(paddedPageStyles.paddingBottom) || 0;
    const usableHeight = containerHeight - paddingTop - paddingBottom;

    if (usableHeight <= 0) {
      return;
    }

    const percentage = (contentHeight / usableHeight) * 100;
    setFillPercentage(Math.max(0, Math.round(percentage)));
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
    const paddedPage = content?.parentElement;

    if (!content || !container || !paddedPage) {
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
    resizeObserver.observe(paddedPage);

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
