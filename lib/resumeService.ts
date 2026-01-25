import { createClient } from "./supabase/client";
import type { PersonalInfo, Education, Project, Experience, Skills } from "@/store/useResumeStore";

/**
 * Resume Service - Supabase CRUD operations for user resumes.
 *
 * This service handles all database operations for:
 * - user_resumes: Resume metadata (name, template type, timestamps)
 * - resume_data: Actual resume content (personal info, education, projects, etc.)
 *
 * All operations respect Row Level Security (RLS) policies configured in Supabase.
 */

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
  personal_info: PersonalInfo;
  education: Education[];
  projects: Project[];
  experience: Experience[];
  skills: Skills;
  section_order: string[];
  updated_at: string;
}

export interface ResumeWithData extends ResumeMetadata {
  resume_data: ResumeData | null;
}

// Type for updating resume data (partial, excluding auto-generated fields)
export type ResumeDataUpdate = Partial<
  Omit<ResumeData, "id" | "resume_id" | "updated_at">
>;

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
  templateType?: string
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

  // Create empty resume data linked to the new resume
  const { data: resumeData, error: dataError } = await supabase
    .from("resume_data")
    .insert({
      resume_id: resume.id,
      personal_info: { name: "", email: "", customContacts: [] },
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
      projects: [{ title: "", technologies: [], bulletPoints: ["", "", ""] }],
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
      skills: {
        languagesList: [],
        technologiesList: [],
        customLanguages: [],
        customTechnologies: [],
      },
      section_order: [
        "personal-info",
        "education",
        "technical-skills",
        "projects",
        "experience",
      ],
    })
    .select()
    .single();

  if (dataError) {
    console.error("Error creating resume data:", dataError);
    // Attempt to clean up the orphaned resume record
    await supabase.from("user_resumes").delete().eq("id", resume.id);
    throw new Error(`Failed to create resume data: ${dataError.message}`);
  }

  return { resume: resume as ResumeMetadata, resumeData: resumeData as ResumeData };
}

/**
 * Get all active resumes for a user.
 * Results are ordered by updated_at (most recent first).
 *
 * @param userId - The authenticated user's ID
 * @returns Array of resume metadata records
 */
export async function getUserResumes(userId: string): Promise<ResumeMetadata[]> {
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
  resumeId: string
): Promise<ResumeWithData | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_resumes")
    .select(
      `
      *,
      resume_data (*)
    `
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
    ? data.resume_data[0] ?? null
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
  data: ResumeDataUpdate
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("resume_data")
    .update(data)
    .eq("resume_id", resumeId);

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
  data: Partial<Pick<ResumeMetadata, "name" | "template_type">>
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
