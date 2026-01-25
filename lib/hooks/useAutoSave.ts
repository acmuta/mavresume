import { useEffect, useRef, useCallback } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { updateResumeData } from "@/lib/resumeService";

/**
 * Auto-save hook for persisting resume changes to Supabase.
 *
 * This hook:
 * - Watches for changes in the resume store state
 * - Debounces saves to prevent excessive API calls
 * - Updates saveStatus in the store for UI feedback
 * - Only activates when currentResumeId is set
 * - Cleans up pending saves on unmount
 *
 * @param enabled - Whether auto-save is enabled (default: true)
 * @param debounceMs - Milliseconds to wait after last change before saving (default: 2000)
 */
export function useAutoSave(
  enabled: boolean = true,
  debounceMs: number = 2000
): void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Get state and actions from the store
  const {
    currentResumeId,
    personalInfo,
    education,
    projects,
    experience,
    skills,
    sectionOrder,
    setSaveStatus,
    setLastSavedAt,
  } = useResumeStore();

  // Memoized save function
  const saveToDatabase = useCallback(async () => {
    if (!currentResumeId) return;

    // Set saving status
    setSaveStatus("saving");

    try {
      await updateResumeData(currentResumeId, {
        personal_info: personalInfo,
        education,
        projects,
        experience,
        skills,
        section_order: sectionOrder,
      });

      // Only update status if component is still mounted
      if (isMountedRef.current) {
        setSaveStatus("saved");
        setLastSavedAt(new Date());

        // Reset to idle after a short delay to show "Saved" feedback
        setTimeout(() => {
          if (isMountedRef.current) {
            setSaveStatus("idle");
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Auto-save failed:", error);

      if (isMountedRef.current) {
        setSaveStatus("error");

        // Reset error status after a delay
        setTimeout(() => {
          if (isMountedRef.current) {
            setSaveStatus("idle");
          }
        }, 5000);
      }
    }
  }, [
    currentResumeId,
    personalInfo,
    education,
    projects,
    experience,
    skills,
    sectionOrder,
    setSaveStatus,
    setLastSavedAt,
  ]);

  // Effect to handle debounced saving
  useEffect(() => {
    // Don't save if disabled or no resume is loaded
    if (!enabled || !currentResumeId) {
      return;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new debounced save
    timeoutRef.current = setTimeout(() => {
      saveToDatabase();
    }, debounceMs);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    enabled,
    currentResumeId,
    personalInfo,
    education,
    projects,
    experience,
    skills,
    sectionOrder,
    debounceMs,
    saveToDatabase,
  ]);

  // Track mounted state for async operations
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);
}

/**
 * Hook to manually trigger a save (bypassing debounce).
 * Useful for save buttons or before navigation.
 *
 * @returns Function to trigger immediate save
 */
export function useManualSave(): () => Promise<void> {
  const {
    currentResumeId,
    personalInfo,
    education,
    projects,
    experience,
    skills,
    sectionOrder,
    setSaveStatus,
    setLastSavedAt,
  } = useResumeStore();

  const save = useCallback(async () => {
    if (!currentResumeId) {
      console.warn("Cannot save: no resume ID set");
      return;
    }

    setSaveStatus("saving");

    try {
      await updateResumeData(currentResumeId, {
        personal_info: personalInfo,
        education,
        projects,
        experience,
        skills,
        section_order: sectionOrder,
      });

      setSaveStatus("saved");
      setLastSavedAt(new Date());

      // Reset to idle after feedback delay
      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Manual save failed:", error);
      setSaveStatus("error");

      // Reset error status after delay
      setTimeout(() => {
        setSaveStatus("idle");
      }, 5000);

      throw error; // Re-throw for caller to handle if needed
    }
  }, [
    currentResumeId,
    personalInfo,
    education,
    projects,
    experience,
    skills,
    sectionOrder,
    setSaveStatus,
    setLastSavedAt,
  ]);

  return save;
}
