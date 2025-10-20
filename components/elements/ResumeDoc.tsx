import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  PDFDownloadLink,
  PDFViewer,
} from "@react-pdf/renderer";


const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontSize: 10.5,
    fontFamily: "Helvetica",
    lineHeight: 1.45,
    color: "#111",
    backgroundColor: "#fff",
  },

  // Header
  header: {
    marginBottom: 10,
    width: "100%",
    textAlign: "center",
  },
  nameRow: {
    marginBottom: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  contact: {
    fontSize: 9,
    color: "#444",
  },

  // Sections
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 4,
  },

  // Skill list
  skillsLine: {
    fontSize: 9.5,
    color: "#222",
    marginBottom: 4,
  },

  // Education
  educationRow: {
    marginBottom: 4,
  },
  school: {
    fontSize: 10.5,
    fontWeight: "bold",
  },
  degree: {
    fontSize: 9.5,
    marginBottom: 2,
  },

  // Experience
  jobBlock: {
    marginBottom: 8,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 10,
    fontWeight: "bold",
  },
  jobCompany: {
    fontSize: 9.5,
    color: "#444",
  },
  jobLocation: {
    fontSize: 9,
    color: "#666",
  },
  bullet: {
    fontSize: 9.5,
    marginLeft: 8,
    marginBottom: 3,
  },

  // Projects / Links
  projectTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 3,
  },
  projectLine: {
    fontSize: 9.5,
    marginBottom: 3,
  },

  links: {
    fontSize: 9,
    color: "#0b5394",
    marginTop: 6,
  },

  toc: {
    fontSize: 8.5,
    color: "#777",
    marginTop: 8,
  },
});

export const ResumeDoc = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <Text style={styles.name}></Text>
        </View>
        <Text style={styles.contact}></Text>
      </View>
    </Page>
  </Document>
);

// Example viewer / download usage (in your React app):
export const ResumeDownloadAndPreview = () => (
  <div style={{ display: "flex", gap: 16, height: "100vh" }}>
    <div style={{ flex: 1 }}>
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        <ResumeDoc />
      </PDFViewer>
    </div>
    <div style={{ width: 220, padding: 12 }}>
      <PDFDownloadLink document={<ResumeDoc />} fileName="Tobi_Akere_Resume.pdf">
        {({ loading }) => (loading ? "Preparing…" : "Download Resume PDF")}
      </PDFDownloadLink>
    </div>
  </div>
);
