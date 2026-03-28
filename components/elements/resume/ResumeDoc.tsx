"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { useResumeStore } from "../../../store/useResumeStore";
import {
  resolvePdfMarginPaddingPx,
  resolvePdfSectionSpacingPx,
  toReactPdfFontFamily,
  type PdfSettings,
} from "@/lib/resume/pdfSettings";
import {
  CORE_SECTION_ID,
  getSectionLabelById,
  normalizeSectionId,
} from "@/lib/resume/sections";
import { getPdfSectionRenderer } from "@/lib/resume/sectionPdfRegistry";

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

const getStyles = (pdfSettings: PdfSettings) =>
  StyleSheet.create({
    page: {
      padding: resolvePdfMarginPaddingPx(pdfSettings),
      fontFamily: toReactPdfFontFamily(pdfSettings),
      fontSize: pdfSettings.baseFontSize,
      lineHeight: pdfSettings.lineHeight,
      color: "#000",
    },

    name: {
      fontSize: Math.round(pdfSettings.baseFontSize * 2),
      fontWeight: 700,
      textAlign: "center",
      marginBottom: 8,
    },

    contactRow: {
      fontSize: Math.max(pdfSettings.baseFontSize - 1, 9),
      textAlign: "center",
      marginBottom: 14,
    },

    section: {
      marginTop: resolvePdfSectionSpacingPx(pdfSettings),
      marginBottom: resolvePdfSectionSpacingPx(pdfSettings),
    },

    sectionTitle: {
      fontSize: pdfSettings.sectionHeadingSize,
      fontWeight: pdfSettings.sectionHeadingWeight,
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
      fontSize: Math.max(pdfSettings.baseFontSize - 1, 9),
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
    skillsSection,
    certifications,
    awards,
    coursework,
    caseStudies,
    experience,
    research,
    volunteerWork,
    clinicalExperience,
    teachingExperience,
    leadershipActivities,
    projects,
    relevantCourses,
    sectionOrder,
    pdfSettings,
  } = useResumeStore();
  const styles = getStyles(pdfSettings);
  const normalizedSectionOrder = sectionOrder.map((id) =>
    normalizeSectionId(id),
  );
  const reorderableSections = normalizedSectionOrder.filter(
    (id) => id !== CORE_SECTION_ID,
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
            ...(personalInfo.customContacts || []).filter(
              (x) => x.trim() !== "",
            ),
          ]
            .filter((x) => x)
            .join("  •  ")}
        </Text>

        {/* Render sections in the order specified by sectionOrder */}
        {reorderableSections.map((sectionId) => {
          const renderSection = getPdfSectionRenderer(sectionId);
          if (!renderSection) {
            return (
              <View key={sectionId} style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {getSectionLabelById(sectionId)}
                </Text>
                <Text style={styles.smallText}>
                  Section content is not implemented yet.
                </Text>
              </View>
            );
          }
          return (
            <React.Fragment key={sectionId}>
              {renderSection({
                styles,
                education,
                skills,
                skillsSection,
                certifications,
                awards,
                coursework,
                caseStudies,
                experience,
                research,
                volunteerWork,
                clinicalExperience,
                teachingExperience,
                leadershipActivities,
                projects,
                relevantCourses,
              })}
            </React.Fragment>
          );
        })}
      </Page>
    </Document>
  );
};
