import { create } from "zustand";

/**
 * Centralized state management for resume data using Zustand.
 *
 * This store:
 * - Holds all resume data (personal info, education, projects, experience, skills)
 * - Syncs with Supabase database via the auto-save hook
 * - Provides update functions that trigger reactive re-renders in components
 * - Is consumed by form components (sections), preview components, and PDF generator
 * - Tracks save status for UI feedback
 *
 * Data flow: Form input → update function → store state → auto-save → Supabase
 */

export interface PersonalInfo {
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  customContacts?: string[];
}

export interface Skills {
  languagesList: string[];
  technologiesList: string[];
  customLanguages?: string[];
  customTechnologies?: string[];
}

export interface Education {
  school: string;
  degree: string;
  major: string;
  includeGPA: boolean;
  gpa?: string;
  graduationMonth: string;
  graduationYear: string;
}

export interface Project {
  title: string;
  technologies: string[];
  bulletPoints: string[];
}

export interface Experience {
  company: string;
  position: string;
  startMonth: string;
  startYear: string;
  endMonth?: string;
  endYear?: string;
  isCurrent: boolean;
  bulletPoints: string[];
}

// Type for save status indicator
export type SaveStatus = "idle" | "saving" | "saved" | "error";

// Available sections that can be added to a resume (excluding personal-info which is always present)
export const AVAILABLE_SECTIONS = [
  { id: "education", label: "Education" },
  { id: "technical-skills", label: "Technical Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
] as const;

// Section IDs type
export type SectionId = "personal-info" | "education" | "technical-skills" | "projects" | "experience";

// Type for database resume data (used by setResumeFromDatabase)
export interface DatabaseResumeData {
  personal_info?: PersonalInfo;
  education?: Education[];
  projects?: Project[];
  experience?: Experience[];
  skills?: Skills;
  section_order?: string[];
}

/**
 * Complete resume state interface.
 *
 * Arrays (education, projects, experience) support multiple entries.
 * Update functions use Partial types to allow updating individual fields.
 * State syncs with Supabase via auto-save hook when currentResumeId is set.
 */
export interface ResumeState {
  // Database tracking
  currentResumeId: string | null;
  saveStatus: SaveStatus;
  lastSavedAt: Date | null;

  // Resume data
  personalInfo: PersonalInfo;
  education: Education[];
  relevantCourses?: string[];
  projects: Project[];
  skills: Skills;
  experience: Experience[];
  sectionOrder: string[];

  // UI state
  showBorder?: boolean;

  // Database sync actions
  setCurrentResumeId: (id: string | null) => void;
  setSaveStatus: (status: SaveStatus) => void;
  setLastSavedAt: (date: Date | null) => void;
  setResumeFromDatabase: (data: DatabaseResumeData) => void;
  resetResume: () => void;

  // UI actions
  setShowBorder?: (show: boolean) => void;

  // Resume data actions
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addEducation: (edu: Education) => void;
  addSkills: (skills: Skills) => void;
  addProject: (proj: Project) => void;
  addExperience: (exp: Experience) => void;
  updateEducation: (index: number, edu: Partial<Education>) => void;
  updateProject: (index: number, proj: Partial<Project>) => void;
  updateExperience: (index: number, exp: Partial<Experience>) => void;
  removeEducation: (index: number) => void;
  removeProject: (index: number) => void;
  removeExperience: (index: number) => void;
  updateSectionOrder: (order: string[]) => void;
  addSection: (sectionId: string) => void;
  removeSection: (sectionId: string) => void;
}

// Default initial state for a new/reset resume
const initialResumeState = {
  personalInfo: { name: "", email: "", customContacts: [] } as PersonalInfo,
  education: [
    {
      school: "",
      degree: "",
      major: "",
      includeGPA: false,
      graduationMonth: "",
      graduationYear: "",
    },
  ] as Education[],
  relevantCourses: [] as string[],
  projects: [
    { title: "", technologies: [], bulletPoints: ["", "", ""] },
  ] as Project[],
  skills: {
    languagesList: [],
    technologiesList: [],
    customLanguages: [],
    customTechnologies: [],
  } as Skills,
  experience: [
    {
      company: "",
      position: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      isCurrent: false,
      bulletPoints: ["", "", ""],
    },
  ] as Experience[],
  sectionOrder: [
    "personal-info",
    "education",
    "technical-skills",
    "projects",
    "experience",
  ],
};

/**
 * Zustand store for resume data.
 *
 * No longer uses localStorage persistence - data syncs with Supabase instead.
 * The auto-save hook watches for state changes and persists to the database.
 */
export const useResumeStore = create<ResumeState>()((set) => ({
  // Database tracking state
  currentResumeId: null,
  saveStatus: "idle",
  lastSavedAt: null,

  // Initial resume data state
  ...initialResumeState,

  // UI state
  showBorder: false,

  // Database sync actions
  setCurrentResumeId: (id) =>
    set(() => ({
      currentResumeId: id,
      // Reset save status when switching resumes
      saveStatus: "idle",
      lastSavedAt: null,
    })),

  setSaveStatus: (status) =>
    set(() => ({
      saveStatus: status,
    })),

  setLastSavedAt: (date) =>
    set(() => ({
      lastSavedAt: date,
    })),

  /**
   * Hydrate the store with data loaded from the database.
   * Used when opening an existing resume from the dashboard.
   */
  setResumeFromDatabase: (data) =>
    set(() => ({
      personalInfo: data.personal_info ?? initialResumeState.personalInfo,
      education:
        data.education && data.education.length > 0
          ? data.education
          : initialResumeState.education,
      projects:
        data.projects && data.projects.length > 0
          ? data.projects
          : initialResumeState.projects,
      experience:
        data.experience && data.experience.length > 0
          ? data.experience
          : initialResumeState.experience,
      skills: data.skills ?? initialResumeState.skills,
      sectionOrder: data.section_order ?? initialResumeState.sectionOrder,
      // Reset save status after loading
      saveStatus: "idle",
    })),

  /**
   * Reset the store to initial empty state.
   * Used when creating a new resume or signing out.
   */
  resetResume: () =>
    set(() => ({
      currentResumeId: null,
      saveStatus: "idle",
      lastSavedAt: null,
      ...initialResumeState,
    })),

  // UI actions
  setShowBorder: (show: boolean) =>
    set(() => ({
      showBorder: show,
    })),

  // Resume data update actions
  // These trigger reactive re-renders and will be auto-saved via the hook

  updatePersonalInfo: (info) =>
    set((state) => ({
      personalInfo: { ...state.personalInfo, ...info },
    })),

  addEducation: (edu) =>
    set((state) => ({
      education: [...state.education, edu],
    })),

  addSkills: (skills) =>
    set((state) => ({
      skills: { ...state.skills, ...skills },
    })),

  addProject: (proj) =>
    set((state) => ({
      projects: [...state.projects, proj],
    })),

  addExperience: (exp) =>
    set((state) => ({
      experience: [...state.experience, exp],
    })),

  // Update functions for array items: create new array, update item at index
  // This ensures React detects the change and re-renders dependent components
  updateEducation: (index, updated) =>
    set((state) => {
      const newList = [...state.education];
      newList[index] = {
        ...newList[index],
        ...updated,
      };
      return { education: newList };
    }),

  updateProject: (index, proj) =>
    set((state) => {
      const newList = [...state.projects];
      newList[index] = {
        ...newList[index],
        ...proj,
      };
      return { projects: newList };
    }),

  updateExperience: (index, exp) =>
    set((state) => {
      const newList = [...state.experience];
      newList[index] = {
        ...newList[index],
        ...exp,
      };
      return { experience: newList };
    }),

  // Remove functions: filter out item at index, but ensure at least one item remains
  removeEducation: (index) =>
    set((state) => {
      if (state.education.length <= 1) {
        return state; // Don't delete if only one item exists
      }
      return {
        education: state.education.filter((_, i) => i !== index),
      };
    }),

  removeProject: (index) =>
    set((state) => {
      if (state.projects.length <= 1) {
        return state; // Don't delete if only one item exists
      }
      return {
        projects: state.projects.filter((_, i) => i !== index),
      };
    }),

  removeExperience: (index) =>
    set((state) => {
      if (state.experience.length <= 1) {
        return state; // Don't delete if only one item exists
      }
      return {
        experience: state.experience.filter((_, i) => i !== index),
      };
    }),

  updateSectionOrder: (order) =>
    set(() => {
      // Ensure personal-info is always first if present
      const validOrder = order.filter(
        (id) =>
          id === "personal-info" ||
          id === "education" ||
          id === "technical-skills" ||
          id === "projects" ||
          id === "experience"
      );
      const personalInfoFirst = validOrder.includes("personal-info")
        ? ["personal-info", ...validOrder.filter((id) => id !== "personal-info")]
        : validOrder;
      return { sectionOrder: personalInfoFirst };
    }),

  /**
   * Add a section to the resume.
   * Section is added at the end of the list (after personal-info).
   */
  addSection: (sectionId) =>
    set((state) => {
      // Don't add if section already exists or is invalid
      const validIds = ["education", "technical-skills", "projects", "experience"];
      if (!validIds.includes(sectionId) || state.sectionOrder.includes(sectionId)) {
        return state;
      }
      // Ensure personal-info stays first
      const newOrder = state.sectionOrder.includes("personal-info")
        ? [...state.sectionOrder, sectionId]
        : ["personal-info", ...state.sectionOrder, sectionId];
      return { sectionOrder: newOrder };
    }),

  /**
   * Remove a section from the resume.
   * Cannot remove personal-info.
   */
  removeSection: (sectionId) =>
    set((state) => {
      // Don't allow removing personal-info
      if (sectionId === "personal-info") {
        return state;
      }
      return {
        sectionOrder: state.sectionOrder.filter((id) => id !== sectionId),
      };
    }),
}));
