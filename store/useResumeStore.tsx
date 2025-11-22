import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
}

interface Skills {
  languagesList: string[];
  technologiesList: string[];
}

export interface Education {
  school: string;
  degree: string;
  major: string;
  graduationYear: string;
}

export interface Project {
  title: string;
  technologies: string[];
  bulletPoints: string[];
}

interface ResumeState {
  personalInfo: PersonalInfo;
  education: Education[];
  relevantCourses?: string[];
  projects: Project[];
  skills: Skills;
  experience: any[];
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addEducation: (edu: Education) => void;
  addProject: (proj: Project) => void;
  updateEducation: (index: number, edu: Partial<Education>) => void;
  updateProject: (index: number, proj: Partial<Project>) => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      personalInfo: { name: "", email: "", phone: "" },
      education: [{ school: "", degree: "", major: "", graduationYear: "" }],
      relevantCourses: [],
      projects: [{ title: "", technologies: [], bulletPoints: [] }],
      skills: { languagesList: [], technologiesList: [] },
      experience: [],

      updatePersonalInfo: (info) =>
        set((state) => ({
          personalInfo: { ...state.personalInfo, ...info },
        })),

      addEducation: (edu) =>
        set((state) => ({
          education: [...state.education, edu],
        })),

      addProject: (proj) =>
        set((state) => ({
          projects: [...state.projects, proj],
        })),

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
          const newProjects = [...state.projects];
          newProjects[index] = { ...newProjects[index], ...proj };
          return { projects: newProjects };
        }),
    }),

    {
      name: "resume-storage",
    }
  )
);
