import type {
  CaseStudy,
  CompactListEntry,
  CourseworkCategory,
  Education,
  Experience,
  PersonalInfo,
  Project,
  Skills,
  SkillsSectionData,
} from "@/store/useResumeStore";

export const RESUME_SCHEMA_VERSION = 2;

export interface SectionDataInput {
  personalInfo: PersonalInfo;
  education: Education[];
  skills: Skills;
  projects: Project[];
  experience: Experience[];
  research: Experience[];
  volunteerWork: Experience[];
  clinicalExperience: Experience[];
  teachingExperience: Experience[];
  certifications: CompactListEntry[];
  awards: CompactListEntry[];
  coursework: CourseworkCategory[];
  caseStudies: CaseStudy[];
  skillsSection: SkillsSectionData;
  leadershipActivities: Experience[];
}

export function buildSectionData({
  personalInfo,
  education,
  skills,
  projects,
  experience,
  research,
  volunteerWork,
  clinicalExperience,
  teachingExperience,
  certifications,
  awards,
  coursework,
  caseStudies,
  skillsSection,
  leadershipActivities,
}: SectionDataInput): Record<string, unknown> {
  return {
    "personal-info": personalInfo,
    education,
    "technical-skills": skills,
    skills: skillsSection,
    projects,
    experience,
    research,
    certifications,
    awards,
    coursework,
    "case-studies": caseStudies,
    "volunteer-work": volunteerWork,
    "clinical-experience": clinicalExperience,
    "teaching-experience": teachingExperience,
    "leadership-activities": leadershipActivities,
  };
}
