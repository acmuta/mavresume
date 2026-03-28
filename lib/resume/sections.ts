export interface SectionDefinition {
  id: string;
  label: string;
  locked?: boolean;
  implemented?: boolean;
}

export const CORE_SECTION_ID = "personal-info";

export const SECTION_DEFINITIONS: SectionDefinition[] = [
  {
    id: CORE_SECTION_ID,
    label: "Personal Info",
    locked: true,
    implemented: true,
  },
  { id: "education", label: "Education", implemented: true },
  { id: "technical-skills", label: "Technical Skills", implemented: true },
  { id: "projects", label: "Projects", implemented: true },
  { id: "experience", label: "Experience", implemented: true },
  { id: "skills", label: "Skills", implemented: true },
  { id: "research", label: "Research", implemented: true },
  { id: "certifications", label: "Certifications", implemented: true },
  { id: "coursework", label: "Coursework", implemented: true },
  {
    id: "leadership-activities",
    label: "Leadership & Activities",
    implemented: true,
  },
  { id: "leadership", label: "Leadership", implemented: false },
  { id: "awards", label: "Awards", implemented: true },
  { id: "case-studies", label: "Case Studies", implemented: true },
  { id: "tools", label: "Tools", implemented: true },
  {
    id: "clinical-experience",
    label: "Clinical Experience",
    implemented: true,
  },
  { id: "volunteer-work", label: "Volunteer Work", implemented: true },
  {
    id: "teaching-experience",
    label: "Teaching Experience",
    implemented: true,
  },
];

// Legacy and template aliases that should resolve to canonical runtime section IDs.
const SECTION_ID_ALIASES: Record<string, string> = {
  tools: "technical-skills",
  leadership: "leadership-activities",
};

const sectionLabelMap = new Map(
  SECTION_DEFINITIONS.map((section) => [section.id, section.label]),
);

const knownSectionIds = new Set(
  SECTION_DEFINITIONS.map((section) => section.id),
);

export const ADDABLE_SECTION_IDS = Array.from(
  new Set(
    SECTION_DEFINITIONS.filter((section) => !section.locked).map((section) =>
      normalizeSectionId(section.id),
    ),
  ),
);

export function normalizeSectionId(sectionId: string): string {
  return SECTION_ID_ALIASES[sectionId] ?? sectionId;
}

export function normalizeSectionOrder(sectionIds: string[]): string[] {
  const normalized = sectionIds
    .map((id) => normalizeSectionId(id))
    .filter((id) => isKnownSectionId(id));

  return Array.from(new Set(normalized));
}

export function getSectionLabelById(sectionId: string): string {
  const normalizedId = normalizeSectionId(sectionId);
  return sectionLabelMap.get(normalizedId) ?? normalizedId;
}

export function isKnownSectionId(sectionId: string): boolean {
  return knownSectionIds.has(normalizeSectionId(sectionId));
}
