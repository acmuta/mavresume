import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * State management for info guides and help widget.
 *
 * This store:
 * - Tracks the currently active section for contextual help
 * - Manages the help widget expanded/collapsed state
 * - Persists to localStorage via zustand/persist middleware
 */

export type SectionId =
  | "personal-info"
  | "education"
  | "technical-skills"
  | "projects"
  | "experience";

export interface GuideState {
  // Help widget state
  isWidgetExpanded: boolean;
  activeWidgetTab: "tips" | "guide";

  // Current section being edited (for contextual help)
  currentSection: SectionId;

  // Actions
  setWidgetExpanded: (expanded: boolean) => void;
  toggleWidget: () => void;
  setActiveWidgetTab: (tab: "tips" | "guide") => void;
  setCurrentSection: (section: SectionId) => void;
}

export const useGuideStore = create<GuideState>()(
  persist(
    (set) => ({
      // Initial state
      isWidgetExpanded: false,
      activeWidgetTab: "tips",
      currentSection: "personal-info",

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
    }),
    {
      name: "guide-storage",
    }
  )
);
