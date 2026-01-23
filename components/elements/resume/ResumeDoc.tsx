"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { useResumeStore } from "../../../store/useResumeStore";

/**
 * PDF document component using @react-pdf/renderer.
 *
 * This component:
 * - Reads all resume data from Zustand store (reactive - updates when store changes)
 * - Renders a single-page A4 PDF with traditional resume layout
 * - Maps store data to PDF structure (personal info → education → skills → experience → projects)
 * - Filters empty bullet points and handles optional fields (GPA, dates, links)
 *
 * Used by:
 * - ResumeDocPreview: Renders PDF in a modal viewer
 * - ResumeDocDownloadButton: Generates downloadable PDF file
 *
 * Data flow: Store update → component re-render → PDF re-generation
 */

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: "Times-Roman",
    fontSize: 11,
    lineHeight: 1.4,
    color: "#000",
  },

  name: {
    fontSize: 22,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 8,
  },

  contactRow: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 14,
  },

  section: {
    marginTop: 3,
    marginBottom: 3,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 4,
    textTransform: "uppercase",
    borderBottom: "1px solid #000",
    paddingBottom: 2,
  },

  bold: {
    fontWeight: 700,
  },

  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },

  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },

  smallText: {
    fontSize: 10,
  },

  bullets: {
    marginLeft: 12,
    marginTop: 2,
  },

  bulletPoint: {
    flexDirection: "row",
    marginBottom: 2,
  },

  bulletSymbol: {
    width: 10,
  },

  bulletText: {
    flex: 1,
  },
});

/**
 * Formats month and year into a readable date string.
 * Handles partial dates (month only, year only) and empty values.
 */
const formatDate = (month?: string, year?: string) => {
  if (!month && !year) return "";
  if (!month) return year;
  if (!year) return month;
  return `${month} ${year}`;
};

/**
 * Main PDF document component.
 *
 * Structure:
 * 1. Header: Name (centered, large) + contact info (phone, email, GitHub, LinkedIn)
 * 2. Sections rendered dynamically based on sectionOrder from store:
 *    - Education: School, degree, major, GPA, graduation date + relevant courses (first entry only)
 *    - Technical Skills: Languages and technologies as comma-separated lists
 *    - Experience: Company, position, date range, bullet points (filtered for empty)
 *    - Projects: Title, technologies, bullet points (filtered for empty)
 *
 * All sections use consistent styling: uppercase section titles with bottom border,
 * bullet points with left margin, and flexible layouts for headers (space-between).
 */
export const ResumeDoc = () => {
  const {
    personalInfo,
    education,
    skills,
    experience,
    projects,
    relevantCourses,
    sectionOrder,
  } = useResumeStore();

  // Helper function to render Education section
  const renderEducationSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Education</Text>
      {education.map((edu, idx) => (
        <View key={idx}>
          <View style={styles.jobHeader}>
            <Text style={styles.bold}>{edu.school || ""}</Text>
            <Text>{formatDate(edu.graduationMonth, edu.graduationYear)}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>
              {edu.degree}
              {edu.major ? ` in ${edu.major}` : ""}
            </Text>
            <Text>{edu.gpa && `GPA: ${edu.gpa}`}</Text>
          </View>
          {/* Relevant courses only shown for first education entry */}
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

  // Helper function to render Technical Skills section
  const renderTechnicalSkillsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Technical Skills</Text>
      <Text style={styles.smallText}>
        <Text style={styles.bold}>Languages: </Text>
        {skills.languagesList?.length
          ? skills.languagesList.join(", ")
          : "None added"}
      </Text>
      <Text style={styles.smallText}>
        <Text style={styles.bold}>Technologies: </Text>
        {skills.technologiesList?.length
          ? skills.technologiesList.join(", ")
          : "None added"}
      </Text>
    </View>
  );

  // Helper function to render Experience section
  const renderExperienceSection = () => (
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

  // Helper function to render Projects section
  const renderProjectsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Projects</Text>
      {projects.map((p, idx) => (
        <View key={idx} style={{ marginBottom: 5 }}>
          <View style={styles.projectHeader}>
            <Text style={styles.bold}>{p.title}</Text>
            <Text>{p.technologies?.join(", ")}</Text>
          </View>
          <View style={styles.bullets}>
            {p.bulletPoints
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

  // Map section IDs to their render functions
  const sectionRenderMap: Record<string, () => React.ReactElement> = {
    "education": renderEducationSection,
    "technical-skills": renderTechnicalSkillsSection,
    "experience": renderExperienceSection,
    "projects": renderProjectsSection,
  };

  // Get reorderable sections (excluding personal-info which is always first)
  const reorderableSections = sectionOrder.filter(
    (id) => id !== "personal-info"
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{personalInfo.name || ""}</Text>

        {/* Contact info: filters empty values and joins with bullet separators */}
        <Text style={styles.contactRow}>
          {[
            personalInfo.phone || "",
            personalInfo.email || "",
            personalInfo.github ? `github.com/${personalInfo.github}` : "",
            personalInfo.linkedin
              ? `linkedin.com/in/${personalInfo.linkedin}`
              : "",
            ...(personalInfo.customContacts || []).filter((x) => x.trim() !== ""),
          ]
            .filter((x) => x)
            .join("  •  ")}
        </Text>

        {/* Render sections in the order specified by sectionOrder */}
        {reorderableSections.map((sectionId) => {
          const renderSection = sectionRenderMap[sectionId];
          if (!renderSection) return null;
          return <React.Fragment key={sectionId}>{renderSection()}</React.Fragment>;
        })}
      </Page>
    </Document>
  );
};
