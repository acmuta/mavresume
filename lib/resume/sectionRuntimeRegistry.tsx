import type { ComponentType } from "react";

import { PersonalInfoSection } from "@/components/sections/personalInfo";
import { TechnicalSkillsSection } from "@/components/sections/technicalSkills";
import { EducationSection } from "@/components/sections/education";
import { ExperienceSection } from "@/components/sections/experience";
import { ProjectsSection } from "@/components/sections/projects";
import { LeadershipActivitiesSection } from "@/components/sections/leadershipActivities";
import { ResearchSection } from "@/components/sections/research";
import { VolunteerWorkSection } from "@/components/sections/volunteerWork";
import { ClinicalExperienceSection } from "@/components/sections/clinicalExperience";
import { TeachingExperienceSection } from "@/components/sections/teachingExperience";
import { SkillsSection } from "@/components/sections/skills";
import { CertificationsSection } from "@/components/sections/certifications";
import { AwardsSection } from "@/components/sections/awards";
import { CourseworkSection } from "@/components/sections/coursework";
import { CaseStudiesSection } from "@/components/sections/caseStudies";
import { PersonalInfoPreview } from "@/components/previews/PersonalInfoPreview";
import { EducationPreview } from "@/components/previews/EducationPreview";
import { TechnicalSkillsPreview } from "@/components/previews/TechnicalSkillsPreview";
import { ProjectsPreview } from "@/components/previews/ProjectsPreview";
import { ExperiencePreview } from "@/components/previews/ExperiencePreview";
import { LeadershipActivitiesPreview } from "@/components/previews/LeadershipActivitiesPreview";
import { ResearchPreview } from "@/components/previews/ResearchPreview";
import { VolunteerWorkPreview } from "@/components/previews/VolunteerWorkPreview";
import { ClinicalExperiencePreview } from "@/components/previews/ClinicalExperiencePreview";
import { TeachingExperiencePreview } from "@/components/previews/TeachingExperiencePreview";
import { SkillsPreview } from "@/components/previews/SkillsPreview";
import { CertificationsPreview } from "@/components/previews/CertificationsPreview";
import { AwardsPreview } from "@/components/previews/AwardsPreview";
import { CourseworkPreview } from "@/components/previews/CourseworkPreview";
import { CaseStudiesPreview } from "@/components/previews/CaseStudiesPreview";
import {
  CORE_SECTION_ID,
  SECTION_DEFINITIONS,
  getSectionLabelById,
  normalizeSectionId,
} from "@/lib/resume/sections";

export interface SectionRuntimeDefinition {
  id: string;
  label: string;
  locked: boolean;
  implemented: boolean;
  builderComponent?: ComponentType;
  previewComponent?: ComponentType;
}

const builderComponentMap: Record<string, ComponentType> = {
  [CORE_SECTION_ID]: PersonalInfoSection,
  education: EducationSection,
  "technical-skills": TechnicalSkillsSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  certifications: CertificationsSection,
  coursework: CourseworkSection,
  experience: ExperienceSection,
  research: ResearchSection,
  awards: AwardsSection,
  "case-studies": CaseStudiesSection,
  "volunteer-work": VolunteerWorkSection,
  "clinical-experience": ClinicalExperienceSection,
  "teaching-experience": TeachingExperienceSection,
  "leadership-activities": LeadershipActivitiesSection,
};

const previewComponentMap: Record<string, ComponentType> = {
  [CORE_SECTION_ID]: PersonalInfoPreview,
  education: EducationPreview,
  "technical-skills": TechnicalSkillsPreview,
  projects: ProjectsPreview,
  skills: SkillsPreview,
  certifications: CertificationsPreview,
  coursework: CourseworkPreview,
  experience: ExperiencePreview,
  research: ResearchPreview,
  awards: AwardsPreview,
  "case-studies": CaseStudiesPreview,
  "volunteer-work": VolunteerWorkPreview,
  "clinical-experience": ClinicalExperiencePreview,
  "teaching-experience": TeachingExperiencePreview,
  "leadership-activities": LeadershipActivitiesPreview,
};

const runtimeRegistry = new Map<string, SectionRuntimeDefinition>(
  SECTION_DEFINITIONS.map((section) => {
    const id = normalizeSectionId(section.id);
    return [
      id,
      {
        id,
        label: getSectionLabelById(id),
        locked: section.locked ?? false,
        implemented: section.implemented ?? false,
        builderComponent: builderComponentMap[id],
        previewComponent: previewComponentMap[id],
      },
    ];
  }),
);

export function getSectionRuntimeDefinition(
  sectionId: string,
): SectionRuntimeDefinition | undefined {
  return runtimeRegistry.get(normalizeSectionId(sectionId));
}

export function getBuilderSectionComponent(
  sectionId: string,
): ComponentType | undefined {
  return getSectionRuntimeDefinition(sectionId)?.builderComponent;
}

export function getPreviewSectionComponent(
  sectionId: string,
): ComponentType | undefined {
  return getSectionRuntimeDefinition(sectionId)?.previewComponent;
}

export function isSectionRuntimeRegistered(sectionId: string): boolean {
  return runtimeRegistry.has(normalizeSectionId(sectionId));
}

export function assertTemplateSectionsRegistered(
  templates: Array<{ id: string; sectionIds: string[] }>,
): void {
  const invalidEntries: Array<{ templateId: string; sectionId: string }> = [];

  templates.forEach((template) => {
    template.sectionIds.forEach((sectionId) => {
      if (!isSectionRuntimeRegistered(sectionId)) {
        invalidEntries.push({ templateId: template.id, sectionId });
      }
    });
  });

  if (invalidEntries.length > 0) {
    const detail = invalidEntries
      .map((entry) => `${entry.templateId}:${entry.sectionId}`)
      .join(", ");
    throw new Error(
      `Template section IDs are missing in runtime registry: ${detail}`,
    );
  }
}
