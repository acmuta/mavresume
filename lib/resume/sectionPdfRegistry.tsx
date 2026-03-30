import React from "react";
import { Text, View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";

import type {
  CaseStudy,
  CompactListEntry,
  CourseworkCategory,
  Education,
  Experience,
  Project,
  Skills,
  SkillsSectionData,
} from "@/store/useResumeStore";
import { normalizeSectionId } from "@/lib/resume/sections";

type PdfStyleProp = Style | Style[];

interface ResumeDocStyles {
  section: PdfStyleProp;
  sectionTitle: PdfStyleProp;
  bold: PdfStyleProp;
  jobHeader: PdfStyleProp;
  projectHeader: PdfStyleProp;
  smallText: PdfStyleProp;
  bullets: PdfStyleProp;
  bulletPoint: PdfStyleProp;
  bulletSymbol: PdfStyleProp;
  bulletText: PdfStyleProp;
}

export interface PdfSectionRenderContext {
  styles: ResumeDocStyles;
  education: Education[];
  skills: Skills;
  experience: Experience[];
  research: Experience[];
  volunteerWork: Experience[];
  clinicalExperience: Experience[];
  teachingExperience: Experience[];
  leadershipActivities: Experience[];
  certifications: CompactListEntry[];
  awards: CompactListEntry[];
  coursework: CourseworkCategory[];
  caseStudies: CaseStudy[];
  skillsSection: SkillsSectionData;
  projects: Project[];
  relevantCourses?: string[];
}

export type PdfSectionRenderer = (
  context: PdfSectionRenderContext,
) => React.ReactElement;

function formatDate(month?: string, year?: string): string {
  if (!month && !year) return "";
  if (!month) return year ?? "";
  if (!year) return month;
  return `${month} ${year}`;
}

const renderEducationSection: PdfSectionRenderer = ({
  styles,
  education,
  relevantCourses,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Education</Text>
    {education.map((edu, idx) => (
      <View key={idx}>
        <View style={styles.jobHeader}>
          <Text style={styles.bold}>{edu.school || ""}</Text>
          <Text>{formatDate(edu.graduationMonth, edu.graduationYear)}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text>
            {edu.degree}
            {edu.major ? ` in ${edu.major}` : ""}
          </Text>
          <Text>{edu.gpa && `GPA: ${edu.gpa}`}</Text>
        </View>
        <View style={styles.bullets}>
          {idx === 0 && relevantCourses && (
            <View style={styles.bulletPoint}>
              <Text style={styles.bulletSymbol}>•</Text>
              <Text style={styles.bulletText}>
                Relevant Coursework: {relevantCourses.join(", ")}
              </Text>
            </View>
          )}
        </View>
      </View>
    ))}
  </View>
);

const renderTechnicalSkillsSection: PdfSectionRenderer = ({
  styles,
  skills,
}) => {
  const visibleLines =
    skills.visibleSkillLines && skills.visibleSkillLines.length > 0
      ? skills.visibleSkillLines
      : ["languages", "technologies"];
  const customEntry = skills.customSkillEntry;

  const groups = [
    { key: "languages", label: "Languages", values: skills.languagesList },
    {
      key: "technologies",
      label: "Technologies",
      values: skills.technologiesList,
    },
    {
      key: "frameworks",
      label: "Frameworks",
      values: skills.frameworksList,
    },
    { key: "platforms", label: "Platforms", values: skills.platformsList },
    {
      key: "custom",
      label: customEntry?.title?.trim() || "Custom Entry",
      values: customEntry?.values ?? [],
    },
  ].filter((group) => visibleLines.includes(group.key));

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Technical Skills</Text>
      {groups.map((group) => (
        <Text key={group.key} style={styles.smallText}>
          <Text style={styles.bold}>{group.label}: </Text>
          {group.values?.length ? group.values.join(", ") : "None added"}
        </Text>
      ))}
    </View>
  );
};

const renderExperienceSection: PdfSectionRenderer = ({
  styles,
  experience,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Experience</Text>
    {experience.map((job, idx) => (
      <View key={idx} style={{ marginBottom: 5 }}>
        <View style={styles.jobHeader}>
          <Text style={styles.bold}>
            {job.company && `${job.company} -`} {job.position || ""}
          </Text>
          <Text>
            {formatDate(job.startMonth, job.startYear)} –{" "}
            {job.isCurrent ? "Present" : formatDate(job.endMonth, job.endYear)}
          </Text>
        </View>
        <View style={styles.bullets}>
          {job.bulletPoints
            .filter((bp) => bp.trim() !== "")
            .map((bp, i) => (
              <View key={i} style={styles.bulletPoint}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletText}>{bp}</Text>
              </View>
            ))}
        </View>
      </View>
    ))}
  </View>
);

const renderLeadershipActivitiesSection: PdfSectionRenderer = ({
  styles,
  leadershipActivities,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Leadership & Activities</Text>
    {leadershipActivities.map((entry, idx) => (
      <View key={idx} style={{ marginBottom: 5 }}>
        <View style={styles.jobHeader}>
          <Text style={styles.bold}>
            {entry.company && `${entry.company} -`} {entry.position || ""}
          </Text>
          <Text>
            {formatDate(entry.startMonth, entry.startYear)} –{" "}
            {entry.isCurrent
              ? "Present"
              : formatDate(entry.endMonth, entry.endYear)}
          </Text>
        </View>
        <View style={styles.bullets}>
          {entry.bulletPoints
            .filter((bp) => bp.trim() !== "")
            .map((bp, i) => (
              <View key={i} style={styles.bulletPoint}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletText}>{bp}</Text>
              </View>
            ))}
        </View>
      </View>
    ))}
  </View>
);

const renderResearchSection: PdfSectionRenderer = ({ styles, research }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Research</Text>
    {research.map((entry, idx) => (
      <View key={idx} style={{ marginBottom: 5 }}>
        <View style={styles.jobHeader}>
          <Text style={styles.bold}>
            {entry.company && `${entry.company} -`} {entry.position || ""}
          </Text>
          <Text>
            {formatDate(entry.startMonth, entry.startYear)} –{" "}
            {entry.isCurrent
              ? "Present"
              : formatDate(entry.endMonth, entry.endYear)}
          </Text>
        </View>
        <View style={styles.bullets}>
          {entry.bulletPoints
            .filter((bp) => bp.trim() !== "")
            .map((bp, i) => (
              <View key={i} style={styles.bulletPoint}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletText}>{bp}</Text>
              </View>
            ))}
        </View>
      </View>
    ))}
  </View>
);

const renderVolunteerWorkSection: PdfSectionRenderer = ({
  styles,
  volunteerWork,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Volunteer Work</Text>
    {volunteerWork.map((entry, idx) => (
      <View key={idx} style={{ marginBottom: 5 }}>
        <View style={styles.jobHeader}>
          <Text style={styles.bold}>
            {entry.company && `${entry.company} -`} {entry.position || ""}
          </Text>
          <Text>
            {formatDate(entry.startMonth, entry.startYear)} –{" "}
            {entry.isCurrent
              ? "Present"
              : formatDate(entry.endMonth, entry.endYear)}
          </Text>
        </View>
        <View style={styles.bullets}>
          {entry.bulletPoints
            .filter((bp) => bp.trim() !== "")
            .map((bp, i) => (
              <View key={i} style={styles.bulletPoint}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletText}>{bp}</Text>
              </View>
            ))}
        </View>
      </View>
    ))}
  </View>
);

const renderClinicalExperienceSection: PdfSectionRenderer = ({
  styles,
  clinicalExperience,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Clinical Experience</Text>
    {clinicalExperience.map((entry, idx) => (
      <View key={idx} style={{ marginBottom: 5 }}>
        <View style={styles.jobHeader}>
          <Text style={styles.bold}>
            {entry.company && `${entry.company} -`} {entry.position || ""}
          </Text>
          <Text>
            {formatDate(entry.startMonth, entry.startYear)} –{" "}
            {entry.isCurrent
              ? "Present"
              : formatDate(entry.endMonth, entry.endYear)}
          </Text>
        </View>
        <View style={styles.bullets}>
          {entry.bulletPoints
            .filter((bp) => bp.trim() !== "")
            .map((bp, i) => (
              <View key={i} style={styles.bulletPoint}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletText}>{bp}</Text>
              </View>
            ))}
        </View>
      </View>
    ))}
  </View>
);

const renderTeachingExperienceSection: PdfSectionRenderer = ({
  styles,
  teachingExperience,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Teaching Experience</Text>
    {teachingExperience.map((entry, idx) => (
      <View key={idx} style={{ marginBottom: 5 }}>
        <View style={styles.jobHeader}>
          <Text style={styles.bold}>
            {entry.company && `${entry.company} -`} {entry.position || ""}
          </Text>
          <Text>
            {formatDate(entry.startMonth, entry.startYear)} –{" "}
            {entry.isCurrent
              ? "Present"
              : formatDate(entry.endMonth, entry.endYear)}
          </Text>
        </View>
        <View style={styles.bullets}>
          {entry.bulletPoints
            .filter((bp) => bp.trim() !== "")
            .map((bp, i) => (
              <View key={i} style={styles.bulletPoint}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletText}>{bp}</Text>
              </View>
            ))}
        </View>
      </View>
    ))}
  </View>
);

const renderProjectsSection: PdfSectionRenderer = ({ styles, projects }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Projects</Text>
    {projects.map((project, idx) => (
      <View key={idx} style={{ marginBottom: 5 }}>
        <View style={styles.projectHeader}>
          <Text style={styles.bold}>{project.title}</Text>
          <Text>{project.technologies?.join(", ")}</Text>
        </View>
        <View style={styles.bullets}>
          {project.bulletPoints
            ?.filter((bp) => bp && bp.trim() !== "")
            .map((bp, i) => (
              <View key={i} style={styles.bulletPoint}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletText}>{bp}</Text>
              </View>
            ))}
        </View>
      </View>
    ))}
  </View>
);

const renderSkillsSection: PdfSectionRenderer = ({ styles, skillsSection }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Skills</Text>
    {skillsSection.coreSkills.length > 0 && (
      <Text style={styles.smallText}>
        {skillsSection.coreSkills.join(", ")}
      </Text>
    )}
    {skillsSection.coreSkills.length === 0 && (
      <Text style={styles.smallText}>No skills added</Text>
    )}
  </View>
);

const renderCertificationsSection: PdfSectionRenderer = ({
  styles,
  certifications,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Certifications</Text>
    {certifications.map((entry, index) => (
      <View key={index} style={styles.bulletPoint}>
        <Text style={styles.bulletSymbol}>•</Text>
        <Text style={styles.bulletText}>
          {entry.title}
          {entry.issuer ? `, ${entry.issuer}` : ""}
          {entry.date ? ` (${entry.date})` : ""}
        </Text>
      </View>
    ))}
  </View>
);

const renderAwardsSection: PdfSectionRenderer = ({ styles, awards }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Awards</Text>
    {awards.map((entry, index) => (
      <View key={index} style={styles.bulletPoint}>
        <Text style={styles.bulletSymbol}>•</Text>
        <Text style={styles.bulletText}>
          {entry.title}
          {entry.issuer ? `, ${entry.issuer}` : ""}
          {entry.date ? ` (${entry.date})` : ""}
        </Text>
      </View>
    ))}
  </View>
);

const renderCourseworkSection: PdfSectionRenderer = ({
  styles,
  coursework,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Coursework</Text>
    {coursework.map((group, index) => (
      <View key={index} style={{ marginBottom: 3 }}>
        <Text style={styles.bold}>{group.category}</Text>
        <Text style={styles.smallText}>{group.courses.join(", ")}</Text>
      </View>
    ))}
  </View>
);

const renderCaseStudiesSection: PdfSectionRenderer = ({
  styles,
  caseStudies,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Case Studies</Text>
    {caseStudies.map((entry, index) => (
      <View key={index} style={{ marginBottom: 4 }}>
        <Text style={styles.bold}>{entry.title}</Text>
        <View style={styles.bullets}>
          <View style={styles.bulletPoint}>
            <Text style={styles.bulletSymbol}>•</Text>
            <Text style={styles.bulletText}>Problem: {entry.problem}</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bulletSymbol}>•</Text>
            <Text style={styles.bulletText}>Approach: {entry.approach}</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bulletSymbol}>•</Text>
            <Text style={styles.bulletText}>Outcome: {entry.outcome}</Text>
          </View>
        </View>
      </View>
    ))}
  </View>
);

const pdfRendererMap: Record<string, PdfSectionRenderer> = {
  education: renderEducationSection,
  "technical-skills": renderTechnicalSkillsSection,
  skills: renderSkillsSection,
  certifications: renderCertificationsSection,
  awards: renderAwardsSection,
  coursework: renderCourseworkSection,
  "case-studies": renderCaseStudiesSection,
  experience: renderExperienceSection,
  research: renderResearchSection,
  "volunteer-work": renderVolunteerWorkSection,
  "clinical-experience": renderClinicalExperienceSection,
  "teaching-experience": renderTeachingExperienceSection,
  "leadership-activities": renderLeadershipActivitiesSection,
  projects: renderProjectsSection,
};

export function getPdfSectionRenderer(
  sectionId: string,
): PdfSectionRenderer | undefined {
  return pdfRendererMap[normalizeSectionId(sectionId)];
}
