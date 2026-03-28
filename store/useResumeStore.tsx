import { create } from "zustand";
import {
  DEFAULT_PDF_SETTINGS,
  normalizePdfSettings,
  type PdfSettings,
} from "@/lib/resume/pdfSettings";
import {
  ADDABLE_SECTION_IDS,
  CORE_SECTION_ID,
  SECTION_DEFINITIONS,
  getSectionLabelById,
  normalizeSectionId,
  normalizeSectionOrder,
} from "@/lib/resume/sections";

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
  frameworksList: string[];
  toolsList: string[];
  platformsList: string[];
  customLanguages?: string[];
  customTechnologies?: string[];
  customFrameworks?: string[];
  customTools?: string[];
  customPlatforms?: string[];
}

export interface CompactListEntry {
  title: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface CourseworkCategory {
  category: string;
  courses: string[];
}

export interface CaseStudy {
  title: string;
  problem: string;
  approach: string;
  outcome: string;
}

export interface SkillsSectionData {
  coreSkills: string[];
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
export const AVAILABLE_SECTIONS = SECTION_DEFINITIONS.filter(
  (section) => !section.locked,
)
  .map((section) => {
    const id = normalizeSectionId(section.id);
    return { id, label: getSectionLabelById(id) };
  })
  .filter(
    (section, index, allSections) =>
      allSections.findIndex((candidate) => candidate.id === section.id) ===
      index,
  );

// Section IDs type
export type SectionId = string;

// Type for database resume data (used by setResumeFromDatabase)
export interface DatabaseResumeData {
  role?: string | null;
  personal_info?: PersonalInfo;
  education?: Education[];
  projects?: Project[];
  experience?: Experience[];
  research?: Experience[];
  volunteer_work?: Experience[];
  clinical_experience?: Experience[];
  teaching_experience?: Experience[];
  certifications?: CompactListEntry[];
  awards?: CompactListEntry[];
  coursework?: CourseworkCategory[];
  case_studies?: CaseStudy[];
  leadership_activities?: Experience[];
  skills?: Skills;
  section_order?: string[];
  section_data?: Record<string, unknown> | null;
  schema_version?: number | null;
  pdf_settings?: Partial<PdfSettings> | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeSkills(skills: Partial<Skills> | undefined): Skills {
  const safeSkills = skills ?? {};
  const technologiesList = safeSkills.technologiesList ?? [];

  return {
    languagesList: safeSkills.languagesList ?? [],
    technologiesList,
    frameworksList: safeSkills.frameworksList ?? [],
    toolsList: safeSkills.toolsList ?? technologiesList,
    platformsList: safeSkills.platformsList ?? [],
    customLanguages: safeSkills.customLanguages ?? [],
    customTechnologies: safeSkills.customTechnologies ?? [],
    customFrameworks: safeSkills.customFrameworks ?? [],
    customTools: safeSkills.customTools ?? [],
    customPlatforms: safeSkills.customPlatforms ?? [],
  };
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
  skillsSection: SkillsSectionData;
  certifications: CompactListEntry[];
  awards: CompactListEntry[];
  coursework: CourseworkCategory[];
  caseStudies: CaseStudy[];
  experience: Experience[];
  research: Experience[];
  volunteerWork: Experience[];
  clinicalExperience: Experience[];
  teachingExperience: Experience[];
  leadershipActivities: Experience[];
  sectionOrder: string[];
  pdfSettings: PdfSettings;

  // UI state
  showBorder?: boolean;
  isResumeSettingsOpen: boolean;

  // Database sync actions
  setCurrentResumeId: (id: string | null) => void;
  setSaveStatus: (status: SaveStatus) => void;
  setLastSavedAt: (date: Date | null) => void;
  setResumeFromDatabase: (data: DatabaseResumeData) => void;
  resetResume: () => void;

  // UI actions
  setShowBorder?: (show: boolean) => void;
  setIsResumeSettingsOpen: (open: boolean) => void;

  // Resume data actions
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addEducation: (edu: Education) => void;
  addSkills: (skills: Skills) => void;
  addProject: (proj: Project) => void;
  addExperience: (exp: Experience) => void;
  addResearch: (entry: Experience) => void;
  addVolunteerWork: (entry: Experience) => void;
  addClinicalExperience: (entry: Experience) => void;
  addTeachingExperience: (entry: Experience) => void;
  addLeadershipActivity: (entry: Experience) => void;
  addCertification: (entry: CompactListEntry) => void;
  addAward: (entry: CompactListEntry) => void;
  addCourseworkCategory: (entry: CourseworkCategory) => void;
  addCaseStudy: (entry: CaseStudy) => void;
  updateEducation: (index: number, edu: Partial<Education>) => void;
  updateProject: (index: number, proj: Partial<Project>) => void;
  updateExperience: (index: number, exp: Partial<Experience>) => void;
  updateResearch: (index: number, entry: Partial<Experience>) => void;
  updateVolunteerWork: (index: number, entry: Partial<Experience>) => void;
  updateClinicalExperience: (index: number, entry: Partial<Experience>) => void;
  updateTeachingExperience: (index: number, entry: Partial<Experience>) => void;
  updateLeadershipActivity: (index: number, entry: Partial<Experience>) => void;
  updateCertification: (
    index: number,
    entry: Partial<CompactListEntry>,
  ) => void;
  updateAward: (index: number, entry: Partial<CompactListEntry>) => void;
  updateCourseworkCategory: (
    index: number,
    entry: Partial<CourseworkCategory>,
  ) => void;
  updateCaseStudy: (index: number, entry: Partial<CaseStudy>) => void;
  updateSkillsSection: (entry: Partial<SkillsSectionData>) => void;
  removeEducation: (index: number) => void;
  removeProject: (index: number) => void;
  removeExperience: (index: number) => void;
  removeResearch: (index: number) => void;
  removeVolunteerWork: (index: number) => void;
  removeClinicalExperience: (index: number) => void;
  removeTeachingExperience: (index: number) => void;
  removeLeadershipActivity: (index: number) => void;
  removeCertification: (index: number) => void;
  removeAward: (index: number) => void;
  removeCourseworkCategory: (index: number) => void;
  removeCaseStudy: (index: number) => void;
  updateSectionOrder: (order: string[]) => void;
  addSection: (sectionId: string) => void;
  removeSection: (sectionId: string) => void;
  setPdfSettings: (settings: Partial<PdfSettings> | null | undefined) => void;
  updatePdfSettings: (settings: Partial<PdfSettings>) => void;
  resetPdfSettings: () => void;
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
    frameworksList: [],
    toolsList: [],
    platformsList: [],
    customLanguages: [],
    customTechnologies: [],
    customFrameworks: [],
    customTools: [],
    customPlatforms: [],
  } as Skills,
  skillsSection: {
    coreSkills: [],
  } as SkillsSectionData,
  certifications: [
    {
      title: "",
      issuer: "",
      date: "",
      link: "",
    },
  ] as CompactListEntry[],
  awards: [
    {
      title: "",
      issuer: "",
      date: "",
      link: "",
    },
  ] as CompactListEntry[],
  coursework: [
    {
      category: "",
      courses: [],
    },
  ] as CourseworkCategory[],
  caseStudies: [
    {
      title: "",
      problem: "",
      approach: "",
      outcome: "",
    },
  ] as CaseStudy[],
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
  research: [
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
  volunteerWork: [
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
  clinicalExperience: [
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
  teachingExperience: [
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
  leadershipActivities: [
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
  pdfSettings: { ...DEFAULT_PDF_SETTINGS },
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
  isResumeSettingsOpen: false,

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
    set(() => {
      const sectionData = isRecord(data.section_data)
        ? data.section_data
        : null;

      const sectionPersonalInfo = sectionData?.["personal-info"];
      const sectionEducation = sectionData?.education;
      const sectionProjects = sectionData?.projects;
      const sectionExperience = sectionData?.experience;
      const sectionResearch = sectionData?.research;
      const sectionCertifications = sectionData?.certifications;
      const sectionAwards = sectionData?.awards;
      const sectionCoursework = sectionData?.coursework;
      const sectionCaseStudies = sectionData?.["case-studies"];
      const sectionSkillsModel = sectionData?.skills;
      const sectionVolunteerWork = sectionData?.["volunteer-work"];
      const sectionClinicalExperience = sectionData?.["clinical-experience"];
      const sectionTeachingExperience = sectionData?.["teaching-experience"];
      const sectionLeadershipActivities =
        sectionData?.["leadership-activities"];
      const sectionSkills = sectionData?.["technical-skills"];

      const personalInfo = isRecord(sectionPersonalInfo)
        ? (sectionPersonalInfo as unknown as PersonalInfo)
        : (data.personal_info ?? initialResumeState.personalInfo);

      const education =
        Array.isArray(sectionEducation) && sectionEducation.length > 0
          ? (sectionEducation as Education[])
          : data.education && data.education.length > 0
            ? data.education
            : initialResumeState.education;

      const projects =
        Array.isArray(sectionProjects) && sectionProjects.length > 0
          ? (sectionProjects as Project[])
          : data.projects && data.projects.length > 0
            ? data.projects
            : initialResumeState.projects;

      const experience =
        Array.isArray(sectionExperience) && sectionExperience.length > 0
          ? (sectionExperience as Experience[])
          : data.experience && data.experience.length > 0
            ? data.experience
            : initialResumeState.experience;

      const leadershipActivities =
        Array.isArray(sectionLeadershipActivities) &&
        sectionLeadershipActivities.length > 0
          ? (sectionLeadershipActivities as Experience[])
          : data.leadership_activities && data.leadership_activities.length > 0
            ? data.leadership_activities
            : initialResumeState.leadershipActivities;

      const research =
        Array.isArray(sectionResearch) && sectionResearch.length > 0
          ? (sectionResearch as Experience[])
          : data.research && data.research.length > 0
            ? data.research
            : initialResumeState.research;

      const volunteerWork =
        Array.isArray(sectionVolunteerWork) && sectionVolunteerWork.length > 0
          ? (sectionVolunteerWork as Experience[])
          : data.volunteer_work && data.volunteer_work.length > 0
            ? data.volunteer_work
            : initialResumeState.volunteerWork;

      const clinicalExperience =
        Array.isArray(sectionClinicalExperience) &&
        sectionClinicalExperience.length > 0
          ? (sectionClinicalExperience as Experience[])
          : data.clinical_experience && data.clinical_experience.length > 0
            ? data.clinical_experience
            : initialResumeState.clinicalExperience;

      const teachingExperience =
        Array.isArray(sectionTeachingExperience) &&
        sectionTeachingExperience.length > 0
          ? (sectionTeachingExperience as Experience[])
          : data.teaching_experience && data.teaching_experience.length > 0
            ? data.teaching_experience
            : initialResumeState.teachingExperience;

      const skills = isRecord(sectionSkills)
        ? normalizeSkills(sectionSkills as unknown as Partial<Skills>)
        : normalizeSkills(data.skills ?? initialResumeState.skills);

      const certifications =
        Array.isArray(sectionCertifications) && sectionCertifications.length > 0
          ? (sectionCertifications as CompactListEntry[])
          : data.certifications && data.certifications.length > 0
            ? data.certifications
            : initialResumeState.certifications;

      const awards =
        Array.isArray(sectionAwards) && sectionAwards.length > 0
          ? (sectionAwards as CompactListEntry[])
          : data.awards && data.awards.length > 0
            ? data.awards
            : initialResumeState.awards;

      const coursework =
        Array.isArray(sectionCoursework) && sectionCoursework.length > 0
          ? (sectionCoursework as CourseworkCategory[])
          : data.coursework && data.coursework.length > 0
            ? data.coursework
            : initialResumeState.coursework;

      const caseStudies =
        Array.isArray(sectionCaseStudies) && sectionCaseStudies.length > 0
          ? (sectionCaseStudies as CaseStudy[])
          : data.case_studies && data.case_studies.length > 0
            ? data.case_studies
            : initialResumeState.caseStudies;

      const skillsSection = isRecord(sectionSkillsModel)
        ? {
            coreSkills: Array.isArray(sectionSkillsModel.coreSkills)
              ? (sectionSkillsModel.coreSkills as string[])
              : [],
          }
        : {
            coreSkills: [],
          };

      const normalizedOrder = normalizeSectionOrder(
        data.section_order ?? initialResumeState.sectionOrder,
      );
      const sectionOrder = normalizedOrder.includes(CORE_SECTION_ID)
        ? [
            CORE_SECTION_ID,
            ...normalizedOrder.filter((id) => id !== CORE_SECTION_ID),
          ]
        : [CORE_SECTION_ID, ...normalizedOrder];

      return {
        personalInfo,
        education,
        projects,
        certifications,
        awards,
        coursework,
        caseStudies,
        skillsSection,
        experience,
        research,
        volunteerWork,
        clinicalExperience,
        teachingExperience,
        leadershipActivities,
        skills,
        sectionOrder,
        pdfSettings: normalizePdfSettings(data.pdf_settings),
        // Reset save status after loading
        saveStatus: "idle",
      };
    }),

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
      pdfSettings: { ...DEFAULT_PDF_SETTINGS },
    })),

  // UI actions
  setShowBorder: (show: boolean) =>
    set(() => ({
      showBorder: show,
    })),

  setIsResumeSettingsOpen: (open: boolean) =>
    set(() => ({
      isResumeSettingsOpen: open,
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
      skills: normalizeSkills({ ...state.skills, ...skills }),
    })),

  updateSkillsSection: (entry) =>
    set((state) => {
      const merged = {
        ...state.skillsSection,
        ...entry,
      };

      return {
        skillsSection: {
          coreSkills: merged.coreSkills ?? [],
        },
      };
    }),

  addProject: (proj) =>
    set((state) => ({
      projects: [...state.projects, proj],
    })),

  addExperience: (exp) =>
    set((state) => ({
      experience: [...state.experience, exp],
    })),

  addResearch: (entry) =>
    set((state) => ({
      research: [...state.research, entry],
    })),

  addVolunteerWork: (entry) =>
    set((state) => ({
      volunteerWork: [...state.volunteerWork, entry],
    })),

  addClinicalExperience: (entry) =>
    set((state) => ({
      clinicalExperience: [...state.clinicalExperience, entry],
    })),

  addTeachingExperience: (entry) =>
    set((state) => ({
      teachingExperience: [...state.teachingExperience, entry],
    })),

  addLeadershipActivity: (entry) =>
    set((state) => ({
      leadershipActivities: [...state.leadershipActivities, entry],
    })),

  addCertification: (entry) =>
    set((state) => ({
      certifications: [...state.certifications, entry],
    })),

  addAward: (entry) =>
    set((state) => ({
      awards: [...state.awards, entry],
    })),

  addCourseworkCategory: (entry) =>
    set((state) => ({
      coursework: [...state.coursework, entry],
    })),

  addCaseStudy: (entry) =>
    set((state) => ({
      caseStudies: [...state.caseStudies, entry],
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

  updateResearch: (index, entry) =>
    set((state) => {
      const newList = [...state.research];
      newList[index] = {
        ...newList[index],
        ...entry,
      };
      return { research: newList };
    }),

  updateVolunteerWork: (index, entry) =>
    set((state) => {
      const newList = [...state.volunteerWork];
      newList[index] = {
        ...newList[index],
        ...entry,
      };
      return { volunteerWork: newList };
    }),

  updateClinicalExperience: (index, entry) =>
    set((state) => {
      const newList = [...state.clinicalExperience];
      newList[index] = {
        ...newList[index],
        ...entry,
      };
      return { clinicalExperience: newList };
    }),

  updateTeachingExperience: (index, entry) =>
    set((state) => {
      const newList = [...state.teachingExperience];
      newList[index] = {
        ...newList[index],
        ...entry,
      };
      return { teachingExperience: newList };
    }),

  updateLeadershipActivity: (index, entry) =>
    set((state) => {
      const newList = [...state.leadershipActivities];
      newList[index] = {
        ...newList[index],
        ...entry,
      };
      return { leadershipActivities: newList };
    }),

  updateCertification: (index, entry) =>
    set((state) => {
      const newList = [...state.certifications];
      newList[index] = {
        ...newList[index],
        ...entry,
      };
      return { certifications: newList };
    }),

  updateAward: (index, entry) =>
    set((state) => {
      const newList = [...state.awards];
      newList[index] = {
        ...newList[index],
        ...entry,
      };
      return { awards: newList };
    }),

  updateCourseworkCategory: (index, entry) =>
    set((state) => {
      const newList = [...state.coursework];
      newList[index] = {
        ...newList[index],
        ...entry,
      };
      return { coursework: newList };
    }),

  updateCaseStudy: (index, entry) =>
    set((state) => {
      const newList = [...state.caseStudies];
      newList[index] = {
        ...newList[index],
        ...entry,
      };
      return { caseStudies: newList };
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

  removeResearch: (index) =>
    set((state) => {
      if (state.research.length <= 1) {
        return state;
      }
      return {
        research: state.research.filter((_, i) => i !== index),
      };
    }),

  removeVolunteerWork: (index) =>
    set((state) => {
      if (state.volunteerWork.length <= 1) {
        return state;
      }
      return {
        volunteerWork: state.volunteerWork.filter((_, i) => i !== index),
      };
    }),

  removeClinicalExperience: (index) =>
    set((state) => {
      if (state.clinicalExperience.length <= 1) {
        return state;
      }
      return {
        clinicalExperience: state.clinicalExperience.filter(
          (_, i) => i !== index,
        ),
      };
    }),

  removeTeachingExperience: (index) =>
    set((state) => {
      if (state.teachingExperience.length <= 1) {
        return state;
      }
      return {
        teachingExperience: state.teachingExperience.filter(
          (_, i) => i !== index,
        ),
      };
    }),

  removeLeadershipActivity: (index) =>
    set((state) => {
      if (state.leadershipActivities.length <= 1) {
        return state; // Don't delete if only one item exists
      }
      return {
        leadershipActivities: state.leadershipActivities.filter(
          (_, i) => i !== index,
        ),
      };
    }),

  removeCertification: (index) =>
    set((state) => {
      if (state.certifications.length <= 1) {
        return state;
      }
      return {
        certifications: state.certifications.filter((_, i) => i !== index),
      };
    }),

  removeAward: (index) =>
    set((state) => {
      if (state.awards.length <= 1) {
        return state;
      }
      return {
        awards: state.awards.filter((_, i) => i !== index),
      };
    }),

  removeCourseworkCategory: (index) =>
    set((state) => {
      if (state.coursework.length <= 1) {
        return state;
      }
      return {
        coursework: state.coursework.filter((_, i) => i !== index),
      };
    }),

  removeCaseStudy: (index) =>
    set((state) => {
      if (state.caseStudies.length <= 1) {
        return state;
      }
      return {
        caseStudies: state.caseStudies.filter((_, i) => i !== index),
      };
    }),

  updateSectionOrder: (order) =>
    set(() => {
      // Ensure personal-info is always first if present
      const validOrder = normalizeSectionOrder(order);
      const personalInfoFirst = validOrder.includes(CORE_SECTION_ID)
        ? [
            CORE_SECTION_ID,
            ...validOrder.filter((id) => id !== CORE_SECTION_ID),
          ]
        : [CORE_SECTION_ID, ...validOrder];
      return { sectionOrder: personalInfoFirst };
    }),

  /**
   * Add a section to the resume.
   * Section is added at the end of the list (after personal-info).
   */
  addSection: (sectionId) =>
    set((state) => {
      const normalizedSectionId = normalizeSectionId(sectionId);
      // Don't add if section already exists or is invalid
      if (
        !ADDABLE_SECTION_IDS.includes(normalizedSectionId) ||
        state.sectionOrder.includes(normalizedSectionId)
      ) {
        return state;
      }
      // Ensure personal-info stays first
      const newOrder = state.sectionOrder.includes(CORE_SECTION_ID)
        ? [...state.sectionOrder, normalizedSectionId]
        : [CORE_SECTION_ID, ...state.sectionOrder, normalizedSectionId];
      return { sectionOrder: newOrder };
    }),

  /**
   * Remove a section from the resume.
   * Cannot remove personal-info.
   */
  removeSection: (sectionId) =>
    set((state) => {
      const normalizedSectionId = normalizeSectionId(sectionId);
      // Don't allow removing personal-info
      if (normalizedSectionId === CORE_SECTION_ID) {
        return state;
      }
      return {
        sectionOrder: state.sectionOrder.filter(
          (id) => id !== normalizedSectionId,
        ),
      };
    }),

  setPdfSettings: (settings) =>
    set(() => ({
      pdfSettings: normalizePdfSettings(settings),
    })),

  updatePdfSettings: (settings) =>
    set((state) => ({
      pdfSettings: normalizePdfSettings({
        ...state.pdfSettings,
        ...settings,
      }),
    })),

  resetPdfSettings: () =>
    set(() => ({
      pdfSettings: { ...DEFAULT_PDF_SETTINGS },
    })),
}));
