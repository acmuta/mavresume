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
  Link,
} from "@react-pdf/renderer";
import { useResumeStore } from "@/store/useResumeStore";


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

const resume = useResumeStore()

export const ResumeDoc = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{resume.personalInfo.name}</Text>
        </View>
        <Text style={styles.contact}>
          {resume.personalInfo.email} • {resume.personalInfo.phone} • <Link src={resume.personalInfo.linkedin}>LinkedIn</Link> • <Link src={resume.personalInfo.github}>Github</Link> 
        </Text> 
      </View>

      {/* Technical Skills */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technical Skills</Text>
        <Text style={styles.skillsLine}>
          <Text style={{ fontWeight: "bold" }}>Languages: </Text>
          {resume.skills.languagesList.join(", ")}
        </Text>
        <Text style={styles.skillsLine}>
          <Text style={{ fontWeight: "bold" }}>Technologies: </Text>
          {resume.skills.technologiesList.join(", ")}
        </Text>
      </View>

      {/* Education */}
      {resume.education.map((edu, index) => (
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        <View style={styles.educationRow}>
          <Text style={styles.school}>
            University of Texas At Arlington — Bachelor of Science in Computer
            Science
          </Text>
          <Text style={styles.degree}>{edu.graduationDate} • {edu.location}</Text>
          <Text style={styles.bullet}>
            {`Relevant Courses: ${edu.relevantCourses?.join(", ")}`}
          </Text>
        </View>
      </View>
      ) )}


      {/* Experience */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>

        {/* Software Developer Intern */}
        <View style={styles.jobBlock}>
          <View style={styles.jobHeader}>
            <Text style={styles.jobTitle}>Software Developer Intern</Text>
            <Text style={styles.jobCompany}>June 2025 – Present</Text>
          </View>
          <Text style={styles.jobCompany}>Clozure Inc. • Austin, Texas</Text>
          <Text style={styles.bullet}>
            • Developed and reviewed production-level code using Flutter,
            Firebase, Python, and Dart, contributing to features deployed to end
            users on a weekly release cycle.
          </Text>
          <Text style={styles.bullet}>
            • Collaborated with senior engineers to debug, test, and optimize
            application functionality, achieving a less than 5% bug rate for new
            feature releases.
          </Text>
          <Text style={styles.bullet}>
            • Leveraged Jira, Figma, and GitHub to coordinate sprints, track
            development progress, and facilitate cross-functional collaboration
            between engineering and design teams.
          </Text>
        </View>

        {/* ACM Create */}
        <View style={styles.jobBlock}>
          <View style={styles.jobHeader}>
            <Text style={styles.jobTitle}>
              General Director, Software Engineering Committee
            </Text>
            <Text style={styles.jobCompany}>August 2025 – Present</Text>
          </View>
          <Text style={styles.jobCompany}>
            ACM Create at UTA • Arlington, Texas
          </Text>
          <Text style={styles.bullet}>
            • Directed 7+ Project Managers and 50+ Student Engineers in
            delivering 10+ Production-Quality Applications with a combined user
            base of 1,000+ students and campus organizations.
          </Text>
          <Text style={styles.bullet}>
            • Mentored 7+ Project Managers in Scoping, Leadership, and
            Technical Execution, resulting in 100% of teams delivering
            production-ready projects each semester.
          </Text>
          <Text style={styles.bullet}>
            • Oversaw delivery of 10+ Full-Stack, Mobile, Backend, and API
            Projects, creating real-world engineering opportunities for 50+
            Students across multiple majors.
          </Text>
        </View>

        {/* Pioneer Investing */}
        <View style={styles.jobBlock}>
          <View style={styles.jobHeader}>
            <Text style={styles.jobTitle}>Full Stack Developer Intern</Text>
            <Text style={styles.jobCompany}>May 2025 – July 2025</Text>
          </View>
          <Text style={styles.jobCompany}>Pioneer Investing Inc. • Dallas, Texas</Text>
          <Text style={styles.bullet}>
            • Built and optimized Full Stack web applications using Next.js,
            TypeScript, and Node.js, delivering features from concept to
            production within weekly sprint cycles.
          </Text>
          <Text style={styles.bullet}>
            • Integrated AWS services (Lambda, S3, DynamoDB) to implement
            scalable backend APIs, improve load times by 30%, and enhance
            application reliability.
          </Text>
          <Text style={styles.bullet}>
            • Applied best practices in CI/CD and cloud deployment, streamlining
            the release process and ensuring high availability for production
            applications.
          </Text>
        </View>

        {/* Freelance */}
        <View style={styles.jobBlock}>
          <View style={styles.jobHeader}>
            <Text style={styles.jobTitle}>Freelance Full Stack Developer</Text>
            <Text style={styles.jobCompany}>January 2025 – June 2025</Text>
          </View>
          <Text style={styles.jobCompany}>Zexu Studio (Freelance) • Dallas, Texas</Text>
          <Text style={styles.bullet}>
            • Designed, developed, and maintained Full Stack websites for local
            churches and small businesses, improving their online visibility and
            increasing user engagement by 40% on average.
          </Text>
          <Text style={styles.bullet}>
            • Integrated third-party tools like Google/Vercel Analytics, Stripe,
            and Mailchimp while developing Mobile-First UIs using Next.js and
            React Native, achieving 100% responsiveness across devices.
          </Text>
          <Text style={styles.bullet}>
            • Optimized websites for local SEO, increasing organic traffic by
            25%+ and improving search visibility on Google Maps and local
            directories.
          </Text>
        </View>
      </View>

      {/* Projects */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projects</Text>

        <View style={{ marginBottom: 6 }}>
          <Text style={styles.projectTitle}>Serenity</Text>
          <Text style={styles.projectLine}>
            Next.js, React.js, Typescript, Tailwind CSS, Supabase •
            August 2025
          </Text>
          <Text style={styles.projectLine}>
            • Developed and deployed a Full-stack Bible study web app enabling
            users to read, highlight, and share scripture interactively.
          </Text>
        </View>

        <View style={{ marginBottom: 6 }}>
          <Text style={styles.projectTitle}>Woven Apparel</Text>
          <Text style={styles.projectLine}>
            Next.js, Typescript, Express.js, PostgreSQL • January 2025
          </Text>
          <Text style={styles.projectLine}>
            • Developed and launched a Full-stack e-commerce platform for
            Christian apparel generating over $1,000+ in revenue in the first
            60 days.
          </Text>
        </View>
      </View>

      {/* Links */}
      <View>
        <Text style={styles.links}>tobiakere50@gmail.com</Text>
        <Text style={styles.links}>https://github.com/tobidevs</Text>
        <Text style={styles.links}>https://linkedin.com/in/tobiakere</Text>
        <Text style={styles.links}>https://serenity-kohl-tau.vercel.app/</Text>
        <Text style={styles.links}>https://woven-ecom.vercel.app/</Text>
      </View>

      {/* small footer toc */}
      <View>
        <Text style={styles.toc}>Technical Skills • Education • Experience • Projects</Text>
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
