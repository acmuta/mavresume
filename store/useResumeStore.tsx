import { create } from "zustand";
import { persist } from "zustand/middleware";
import { utaEngineeringCourses } from "../data/university-data";

/**
 * Centralized state management for resume data using Zustand.
 *
 * This store:
 * - Holds all resume data (personal info, education, projects, experience, skills)
 * - Persists to localStorage via zustand/persist middleware (survives page refreshes)
 * - Provides update functions that trigger reactive re-renders in components
 * - Is consumed by form components (sections), preview components, and PDF generator
 *
 * Data flow: Form input → update function → store state → preview/PDF re-render
 */

interface PersonalInfo {
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  customContacts?: string[];
}

interface Skills {
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

/**
 * Complete resume state interface.
 *
 * Arrays (education, projects, experience) support multiple entries.
 * Update functions use Partial types to allow updating individual fields.
 * All state is automatically persisted to localStorage key "resume-storage".
 */
export interface ResumeState {
  personalInfo: PersonalInfo;
  education: Education[];
  relevantCourses?: string[];
  projects: Project[];
  skills: Skills;
  experience: Experience[];
  sectionOrder: string[];
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


  showBorder?: boolean;
  setShowBorder?: (show: boolean) => void;
}

/**
 * Zustand store with persistence middleware.
 *
 * persist() middleware automatically:
 * - Saves state to localStorage on every update
 * - Restores state from localStorage on app load
 * - Uses key "resume-storage" for localStorage entry
 *
 * Initial state provides empty templates for each section to ensure
 * forms always have at least one entry to edit.
 */
export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      // Initial state: empty templates for each section
      personalInfo: { name: "", email: "", customContacts: [] },
      education: [
        {
          school: "",
          degree: "",
          major: "",
          includeGPA: false,
          graduationMonth: "",
          graduationYear: "",
        },
      ],
      relevantCourses: [],
      projects: [{ title: "", technologies: [], bulletPoints: ["", "", ""] }],
      skills: { 
        languagesList: [], 
        technologiesList: [],
        customLanguages: [],
        customTechnologies: [],
      },
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
      ],
      sectionOrder: [
        "personal-info",
        "education",
        "technical-skills",
        "projects",
        "experience",
      ],


      showBorder: false,
      setShowBorder: (show: boolean) =>
        set(() => ({
          showBorder: show,
        })),

        
      // Update functions merge partial updates with existing state
      // Zustand's set() triggers re-renders in all components using the store
      updatePersonalInfo: (info) =>
        set((state) => ({
          personalInfo: { ...state.personalInfo, ...info },
        })),

      // Add functions append new entries to arrays
      addEducation: (edu) =>
        set((state) => ({
          education: [...state.education, edu],
        })),

      // Skills are merged (not replaced) to allow partial updates
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
        set((state) => {
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
    }),

    {
      // localStorage key where persisted state is stored
      name: "resume-storage",
    }
  )
);
