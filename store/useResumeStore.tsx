import { create } from "zustand";

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
}

interface Education {
  school: string;
  degree: string;
  graduationDate: string;
  gpa?: string;
}

interface Project {
  title: string;
  description: string;
  technologies: string[];
}

interface ResumeState {
  personalInfo: PersonalInfo;
  education: Education[];
  projects: Project[];
  skills: string[];
  experience: any[];
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addEducation: (edu: Education) => void;
  updateProject: (index: number, proj: Partial<Project>) => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  personalInfo: { name: "", email: "", phone: "" },
  education: [],
  projects: [],
  skills: [],
  experience: [],

  updatePersonalInfo: (info) =>
    set((state) => ({ personalInfo: { ...state.personalInfo, ...info } })),

  addEducation: (edu) =>
    set((state) => ({ education: [...state.education, edu] })),

  updateProject: (index, proj) =>
    set((state) => {
      const newProjects = [...state.projects];
      newProjects[index] = { ...newProjects[index], ...proj };
      return { projects: newProjects };
    }),
}));
