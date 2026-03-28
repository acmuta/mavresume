import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SectionId } from "./useResumeStore";

/**
 * State management for info guides and help widget.
 *
 * This store:
 * - Tracks the currently active section for contextual help
 * - Manages the help widget expanded/collapsed state
 * - Persists to localStorage via zustand/persist middleware
 */

// Re-export SectionId for backward compatibility
export type { SectionId };

export interface GuideState {
  // Help widget state
  isWidgetExpanded: boolean;
  activeWidgetTab: "tips" | "guide" | "role";

  // Current section being edited (for contextual help)
  currentSection: SectionId;
  currentTemplateType: string | null;
  currentRole: string | null;

  // Actions
  setWidgetExpanded: (expanded: boolean) => void;
  toggleWidget: () => void;
  setActiveWidgetTab: (tab: "tips" | "guide" | "role") => void;
  setCurrentSection: (section: SectionId) => void;
  setCurrentTemplateType: (templateType: string | null) => void;
  setCurrentRole: (role: string | null) => void;
}

export const useGuideStore = create<GuideState>()(
  persist(
    (set) => ({
      // Initial state
      isWidgetExpanded: false,
      activeWidgetTab: "tips",
      currentSection: "personal-info",
      currentTemplateType: null,
      currentRole: null,

      // Widget actions
      setWidgetExpanded: (expanded) =>
        set(() => ({
          isWidgetExpanded: expanded,
        })),

      toggleWidget: () =>
        set((state) => ({
          isWidgetExpanded: !state.isWidgetExpanded,
        })),

      setActiveWidgetTab: (tab) =>
        set(() => ({
          activeWidgetTab: tab,
        })),

      // Section tracking
      setCurrentSection: (section) =>
        set(() => ({
          currentSection: section,
        })),

      setCurrentTemplateType: (templateType) =>
        set(() => ({
          currentTemplateType: templateType,
        })),

      setCurrentRole: (role) =>
        set(() => ({
          currentRole: role,
        })),
    }),
    {
      name: "guide-storage",
    }
  )
);
