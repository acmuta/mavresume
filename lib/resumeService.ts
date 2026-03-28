import { createClient } from "./supabase/client";
import type {
  CaseStudy,
  CompactListEntry,
  CourseworkCategory,
  PersonalInfo,
  Education,
  Project,
  Experience,
  Skills,
  SkillsSectionData,
} from "@/store/useResumeStore";
import {
  DEFAULT_PDF_SETTINGS,
  type PdfSettings,
} from "@/lib/resume/pdfSettings";
import { resumeTemplates } from "@/data/resume-templates";
import {
  buildSectionData,
  RESUME_SCHEMA_VERSION,
} from "@/lib/resume/sectionData";
import { CORE_SECTION_ID, normalizeSectionOrder } from "@/lib/resume/sections";
import { assertTemplateSectionsRegistered } from "@/lib/resume/sectionRuntimeRegistry";

/**
 * Resume Service - Supabase CRUD operations for user resumes.
 *
 * This service handles all database operations for:
 * - user_resumes: Resume metadata (name, template type, timestamps)
 * - resume_data: Actual resume content (personal info, education, projects, etc.)
 *
 * All operations respect Row Level Security (RLS) policies configured in Supabase.
 */

/**
 * Get section order based on template type.
 * - Custom template: Only personal-info (user adds sections manually)
 * - Predefined templates: Use canonical section IDs from template config
 * - Default/unknown: All sections in default order
 */
let hasValidatedTemplateSectionRegistry = false;

function ensureTemplateSectionRegistryIsValid(): void {
  if (
    process.env.NODE_ENV === "production" ||
    hasValidatedTemplateSectionRegistry
  ) {
    return;
  }

  assertTemplateSectionsRegistered(resumeTemplates);
  hasValidatedTemplateSectionRegistry = true;
}

function getSectionOrderForTemplate(templateType?: string): string[] {
  ensureTemplateSectionRegistryIsValid();

  // Custom template starts with only personal-info
  if (templateType === "custom" || !templateType) {
    return [CORE_SECTION_ID];
  }

  const template = resumeTemplates.find(
    (candidate) => candidate.route === templateType,
  );
  if (template) {
    const uniqueKnownSectionIds = normalizeSectionOrder(template.sectionIds);

    // Personal info is a locked core section and must stay first.
    return uniqueKnownSectionIds.includes(CORE_SECTION_ID)
      ? [
          CORE_SECTION_ID,
          ...uniqueKnownSectionIds.filter(
            (sectionId) => sectionId !== CORE_SECTION_ID,
          ),
        ]
      : [CORE_SECTION_ID, ...uniqueKnownSectionIds];
  }

  // Fallback: default section order for unknown templates
  return [
    CORE_SECTION_ID,
    "education",
    "technical-skills",
    "projects",
    "experience",
  ];
}

// Types matching Supabase table schemas

export interface ResumeMetadata {
  id: string;
  user_id: string;
  name: string;
  template_type: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface ResumeData {
  id: string;
  resume_id: string;
  role?: string | null;
  personal_info: PersonalInfo;
  education: Education[];
  projects: Project[];
  experience: Experience[];
  leadership_activities?: Experience[];
  skills: Skills;
  section_order: string[];
  section_data?: Record<string, unknown> | null;
  schema_version?: number | null;
  pdf_settings: PdfSettings | null;
  updated_at: string;
}

export interface ResumeWithData extends ResumeMetadata {
  resume_data: ResumeData | null;
}

// Type for updating resume data (partial, excluding auto-generated fields)
export type ResumeDataUpdate = Partial<
  Omit<ResumeData, "id" | "resume_id" | "updated_at">
>;

function hasMissingColumnError(
  error: { message?: string } | null,
  column: string,
): boolean {
  return Boolean(
    error?.message?.includes(`'${column}'`) || error?.message?.includes(column),
  );
}

/**
 * Create a new resume for a user.
 * Creates both the metadata record (user_resumes) and data record (resume_data).
 *
 * @param userId - The authenticated user's ID
 * @param name - Display name for the resume
 * @param templateType - Optional template type (e.g., 'computer-science')
 * @returns The created resume metadata and data records
 */
export async function createResume(
  userId: string,
  name: string = "Untitled Resume",
  templateType?: string,
  role?: string,
): Promise<{ resume: ResumeMetadata; resumeData: ResumeData }> {
  const supabase = createClient();

  // Create resume metadata
  const { data: resume, error: resumeError } = await supabase
    .from("user_resumes")
    .insert({
      user_id: userId,
      name,
      template_type: templateType ?? null,
    })
    .select()
    .single();

  if (resumeError) {
    console.error("Error creating resume:", resumeError);
    throw new Error(`Failed to create resume: ${resumeError.message}`);
  }

  // Get section order based on template type
  const sectionOrder = getSectionOrderForTemplate(templateType);

  const defaultPersonalInfo: PersonalInfo = {
    name: "",
    email: "",
    customContacts: [],
  };
  const defaultEducation: Education[] = [
    {
      school: "",
      degree: "",
      major: "",
      includeGPA: false,
      graduationMonth: "",
      graduationYear: "",
    },
  ];
  const defaultProjects: Project[] = [
    { title: "", technologies: [], bulletPoints: ["", "", ""] },
  ];
  const defaultExperience: Experience[] = [
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
  ];
  const defaultLeadershipActivities: Experience[] = [
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
  ];
  const defaultResearch: Experience[] = [
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
  ];
  const defaultVolunteerWork: Experience[] = [
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
  ];
  const defaultClinicalExperience: Experience[] = [
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
  ];
  const defaultTeachingExperience: Experience[] = [
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
  ];
  const defaultSkills: Skills = {
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
  };
  const defaultSkillsSection: SkillsSectionData = {
    coreSkills: [],
  };
  const defaultCertifications: CompactListEntry[] = [
    { title: "", issuer: "", date: "", link: "" },
  ];
  const defaultAwards: CompactListEntry[] = [
    { title: "", issuer: "", date: "", link: "" },
  ];
  const defaultCoursework: CourseworkCategory[] = [
    { category: "", courses: [] },
  ];
  const defaultCaseStudies: CaseStudy[] = [
    { title: "", problem: "", approach: "", outcome: "" },
  ];

  const sectionData = buildSectionData({
    personalInfo: defaultPersonalInfo,
    education: defaultEducation,
    skills: defaultSkills,
    skillsSection: defaultSkillsSection,
    projects: defaultProjects,
    certifications: defaultCertifications,
    awards: defaultAwards,
    coursework: defaultCoursework,
    caseStudies: defaultCaseStudies,
    experience: defaultExperience,
    research: defaultResearch,
    volunteerWork: defaultVolunteerWork,
    clinicalExperience: defaultClinicalExperience,
    teachingExperience: defaultTeachingExperience,
    leadershipActivities: defaultLeadershipActivities,
  });

  const insertPayload = {
    resume_id: resume.id,
    role: role ?? null,
    personal_info: defaultPersonalInfo,
    education: defaultEducation,
    projects: defaultProjects,
    experience: defaultExperience,
    leadership_activities: defaultLeadershipActivities,
    skills: defaultSkills,
    section_order: sectionOrder,
    section_data: sectionData,
    schema_version: RESUME_SCHEMA_VERSION,
    pdf_settings: DEFAULT_PDF_SETTINGS,
  };

  // Create empty resume data linked to the new resume
  let { data: resumeData, error: dataError } = await supabase
    .from("resume_data")
    .insert(insertPayload)
    .select()
    .single();

  // Fallback: retry with only unavailable columns removed from the payload.
  if (dataError) {
    const retryPayload = { ...insertPayload } as typeof insertPayload;
    let shouldRetry = false;

    if (hasMissingColumnError(dataError, "leadership_activities")) {
      delete (retryPayload as { leadership_activities?: unknown })
        .leadership_activities;
      shouldRetry = true;
    }
    if (hasMissingColumnError(dataError, "role")) {
      delete (retryPayload as { role?: unknown }).role;
      shouldRetry = true;
    }
    if (hasMissingColumnError(dataError, "section_data")) {
      delete (retryPayload as { section_data?: unknown }).section_data;
      shouldRetry = true;
    }
    if (hasMissingColumnError(dataError, "schema_version")) {
      delete (retryPayload as { schema_version?: unknown }).schema_version;
      shouldRetry = true;
    }

    if (shouldRetry) {
      const fallbackResult = await supabase
        .from("resume_data")
        .insert(retryPayload)
        .select()
        .single();

      resumeData = fallbackResult.data;
      dataError = fallbackResult.error;
    }
  }

  if (dataError) {
    console.error("Error creating resume data:", dataError);
    // Attempt to clean up the orphaned resume record
    await supabase.from("user_resumes").delete().eq("id", resume.id);
    throw new Error(`Failed to create resume data: ${dataError.message}`);
  }

  return {
    resume: resume as ResumeMetadata,
    resumeData: resumeData as ResumeData,
  };
}

/**
 * Get all active resumes for a user.
 * Results are ordered by updated_at (most recent first).
 *
 * @param userId - The authenticated user's ID
 * @returns Array of resume metadata records
 */
export async function getUserResumes(
  userId: string,
): Promise<ResumeMetadata[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_resumes")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching user resumes:", error);
    throw new Error(`Failed to fetch resumes: ${error.message}`);
  }

  return data as ResumeMetadata[];
}

/**
 * Get a single resume with its full data.
 * Uses Supabase's nested select to join user_resumes with resume_data.
 *
 * @param resumeId - The resume's UUID
 * @returns Resume metadata with nested resume_data, or null if not found
 */
export async function getResumeWithData(
  resumeId: string,
): Promise<ResumeWithData | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_resumes")
    .select(
      `
      *,
      resume_data (*)
    `,
    )
    .eq("id", resumeId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Record not found
      return null;
    }
    console.error("Error fetching resume with data:", error);
    throw new Error(`Failed to fetch resume: ${error.message}`);
  }

  // Supabase returns resume_data as an array due to the relationship
  // Since we have a unique constraint, we take the first item
  const resumeData = Array.isArray(data.resume_data)
    ? (data.resume_data[0] ?? null)
    : data.resume_data;

  return {
    ...data,
    resume_data: resumeData,
  } as ResumeWithData;
}

/**
 * Update resume data (content).
 * Used by the auto-save hook to persist changes.
 *
 * @param resumeId - The resume's UUID
 * @param data - Partial resume data to update
 */
export async function updateResumeData(
  resumeId: string,
  data: ResumeDataUpdate,
): Promise<void> {
  const supabase = createClient();

  let { error } = await supabase
    .from("resume_data")
    .update(data)
    .eq("resume_id", resumeId);

  // Fallback: retry while removing only columns missing in this schema.
  if (error) {
    const retryData = { ...data } as ResumeDataUpdate;
    let shouldRetry = false;

    if (hasMissingColumnError(error, "leadership_activities")) {
      delete (retryData as { leadership_activities?: unknown })
        .leadership_activities;
      shouldRetry = true;
    }
    if (hasMissingColumnError(error, "role")) {
      delete (retryData as { role?: unknown }).role;
      shouldRetry = true;
    }
    if (hasMissingColumnError(error, "section_data")) {
      delete (retryData as { section_data?: unknown }).section_data;
      shouldRetry = true;
    }
    if (hasMissingColumnError(error, "schema_version")) {
      delete (retryData as { schema_version?: unknown }).schema_version;
      shouldRetry = true;
    }

    if (shouldRetry) {
      const fallback = await supabase
        .from("resume_data")
        .update(retryData)
        .eq("resume_id", resumeId);

      error = fallback.error;
    }
  }

  if (error) {
    console.error("Error updating resume data:", error);
    throw new Error(`Failed to update resume data: ${error.message}`);
  }
}

/**
 * Update resume metadata (name, template type).
 *
 * @param resumeId - The resume's UUID
 * @param data - Partial metadata to update
 */
export async function updateResumeMetadata(
  resumeId: string,
  data: Partial<Pick<ResumeMetadata, "name" | "template_type">>,
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_resumes")
    .update(data)
    .eq("id", resumeId);

  if (error) {
    console.error("Error updating resume metadata:", error);
    throw new Error(`Failed to update resume metadata: ${error.message}`);
  }
}

/**
 * Soft delete a resume.
 * Sets is_active to false rather than permanently deleting.
 *
 * @param resumeId - The resume's UUID
 */
export async function deleteResume(resumeId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_resumes")
    .update({ is_active: false })
    .eq("id", resumeId);

  if (error) {
    console.error("Error deleting resume:", error);
    throw new Error(`Failed to delete resume: ${error.message}`);
  }
}

/**
 * Permanently delete a resume and its data.
 * Use with caution - this cannot be undone.
 *
 * @param resumeId - The resume's UUID
 */
export async function hardDeleteResume(resumeId: string): Promise<void> {
  const supabase = createClient();

  // Due to CASCADE on foreign key, deleting user_resumes will also delete resume_data
  const { error } = await supabase
    .from("user_resumes")
    .delete()
    .eq("id", resumeId);

  if (error) {
    console.error("Error permanently deleting resume:", error);
    throw new Error(`Failed to permanently delete resume: ${error.message}`);
  }
}
