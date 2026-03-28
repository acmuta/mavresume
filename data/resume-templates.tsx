/**
 * Resume template configuration data.
 *
 * This file defines major-specific resume templates that users can select.
 * Each template is tailored to a specific major with unique section combinations.
 * Templates can be marked as available or coming soon.
 * Available templates include a route parameter for navigation.
 */

export interface ResumeTemplate {
  id: string;
  name: string;
  description?: string;
  available: boolean;
  route?: string; // e.g., "computer-science" for /builder?type=computer-science
  sectionIds: string[]; // Canonical section IDs used by builder/runtime (e.g., ["personal-info", "education", "projects"])
  roles: string[]; // Common roles for this major (e.g., ["Software Engineer", "Data Scientist", "Product Manager"])
}

/**
 * Template categories mapping.
 * Maps category keys to template IDs that belong to each category.
 */
export const templateCategories = {
  "tech-engineering": [
    "computer-science",
    "computer-engineering",
    "data-science",
    "cybersecurity",
    "mechanical-engineering",
  ],
  "business-analytics": [
    "finance",
    "marketing",
    "business-administration",
    "accounting",
  ],
  "design-media": ["graphic-design", "ux-ui-design"],
  "health-service": ["nursing", "pre-med", "education"],
} as const;

export type CategoryKey = keyof typeof templateCategories;

/**
 * Category display names mapping.
 */
export const categoryDisplayNames: Record<CategoryKey, string> = {
  "tech-engineering": "Tech & Engineering",
  "business-analytics": "Business & Analytics",
  "design-media": "Design & Media",
  "health-service": "Health & Service",
};

/**
 * Array of major-specific resume templates.
 *
 * Each template has a unique combination of sections tailored to that major.
 * To add a new template:
 * 1. Add a new object to this array
 * 2. Ensure section combination is unique
 * 3. Set `available: true` when ready to launch
 * 4. Add `route` property for query parameter
 */
export const resumeTemplates: ResumeTemplate[] = [
  // Tech & Engineering
  {
    id: "computer-science",
    name: "Computer Science Resume",
    description:
      "Perfect for Computer Science majors focusing on software development, algorithms, data structures, and programming.",
    available: true,
    route: "computer-science",
    sectionIds: [
      "personal-info",
      "education",
      "technical-skills",
      "projects",
      "experience",
    ],
    roles: [
      "Software Engineer",
      "Frontend Engineer",
      "Backend Engineer",
      "Full Stack Engineer",
      "DevOps Engineer",
    ],
  },
  {
    id: "computer-engineering",
    name: "Computer Engineering Resume",
    description:
      "Tailored for Computer Engineering majors focusing on embedded systems, digital logic, hardware-software integration, and systems programming.",
    available: true,
    route: "computer-engineering",
    sectionIds: [
      "personal-info",
      "education",
      "technical-skills",
      "projects",
      "experience",
      "coursework",
    ],
    roles: [
      "Embedded Systems Engineer",
      "Firmware Engineer",
      "Hardware Engineer",
      "Systems Engineer",
    ],
  },
  {
    id: "data-science",
    name: "Data Science Resume",
    description:
      "Optimized for Data Science, Statistics, Applied Mathematics, and Analytics-focused majors.",
    available: true,
    route: "data-science",
    sectionIds: [
      "personal-info",
      "education",
      "technical-skills",
      "projects",
      "research",
      "experience",
    ],
    roles: [
      "Data Analyst",
      "Data Scientist",
      "Machine Learning Engineer",
      "Data Engineer",
    ],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity Resume",
    description:
      "Tailored for Cybersecurity, Information Security, and Network Security majors.",
    available: true,
    route: "cybersecurity",
    sectionIds: [
      "personal-info",
      "education",
      "technical-skills",
      "projects",
      "certifications",
      "experience",
    ],
    roles: [
      "Information Security Analyst",
      "SOC Analyst",
      "Cybersecurity Engineer",
      "Network Security Analyst",
    ],
  },
  {
    id: "mechanical-engineering",
    name: "Mechanical Engineering Resume",
    description:
      "Crafted for Mechanical Engineering majors focusing on design, manufacturing, and lab work.",
    available: true,
    route: "mechanical-engineering",
    sectionIds: [
      "personal-info",
      "education",
      "technical-skills",
      "projects",
      "experience",
      "coursework",
    ],
    roles: [
      "Mechanical Engineer",
      "Design Engineer",
      "Manufacturing Engineer",
      "Aerospace Engineer",
      "Product Development Engineer",
    ],
  },
  // Business & Analytics
  {
    id: "finance",
    name: "Finance Resume",
    description:
      "Perfect for Finance, Economics, and Investment-focused majors emphasizing financial analysis.",
    available: true,
    route: "finance",
    sectionIds: [
      "personal-info",
      "education",
      "experience",
      "projects",
      "skills",
      "leadership-activities",
    ],
    roles: [
      "Financial Analyst",
      "Investment Banking Analyst",
      "Risk Analyst",
      "Corporate Finance Analyst",
      "Financial Advisor",
    ],
  },
  {
    id: "marketing",
    name: "Marketing Resume",
    description:
      "Designed for Marketing, Communications, Advertising, and Public Relations majors.",
    available: true,
    route: "marketing",
    sectionIds: [
      "personal-info",
      "education",
      "experience",
      "projects",
      "skills",
      "leadership-activities",
    ],
    roles: [
      "Marketing Coordinator",
      "Digital Marketing Specialist",
      "Social Media Coordinator",
      "Content Marketing Specialist",
      "Marketing Analyst",
    ],
  },
  {
    id: "business-administration",
    name: "Business Administration Resume",
    description:
      "Tailored for Business Administration, Management, and General Business majors.",
    available: true,
    route: "business-administration",
    sectionIds: [
      "personal-info",
      "education",
      "experience",
      "leadership",
      "projects",
      "skills",
    ],
    roles: [
      "Business Analyst",
      "Operations Analyst",
      "Human Resources Specialist",
      "Sales Representative",
      "Management Trainee",
    ],
  },
  {
    id: "accounting",
    name: "Accounting Resume",
    description:
      "Crafted for Accounting majors focusing on financial reporting, auditing, and certifications.",
    available: true,
    route: "accounting",
    sectionIds: [
      "personal-info",
      "education",
      "experience",
      "skills",
      "certifications",
      "leadership-activities",
    ],
    roles: [
      "Staff Accountant",
      "Audit Associate",
      "Tax Associate",
      "Accounts Payable Analyst",
      "Financial Analyst",
    ],
  },
  // Design & Media
  {
    id: "graphic-design",
    name: "Graphic Design Resume",
    description:
      "Perfect for Graphic Design, Visual Communication, and Creative Design majors.",
    available: true,
    route: "graphic-design",
    sectionIds: [
      "personal-info",
      "education",
      "experience",
      "projects",
      "skills",
      "awards",
    ],
    roles: [
      "Graphic Designer",
      "Brand Designer",
      "Visual Designer",
    ],
  },
  {
    id: "ux-ui-design",
    name: "UX/UI Design Resume",
    description:
      "Optimized for UX/UI Design, Human-Computer Interaction, and User Experience majors.",
    available: true,
    route: "ux-ui-design",
    sectionIds: [
      "personal-info",
      "education",
      "experience",
      "case-studies",
      "skills",
    ],
    roles: [
      "UX Designer",
      "Product Designer",
      "UI Designer",
    ],
  },
  // Health & Service
  {
    id: "nursing",
    name: "Nursing Resume",
    description:
      "Crafted for Nursing, Health Sciences, and other healthcare-focused majors pursuing clinical careers.",
    available: true,
    route: "nursing",
    sectionIds: [
      "personal-info",
      "education",
      "clinical-experience",
      "certifications",
      "volunteer-work",
      "skills",
    ],
    roles: [
      "Registered Nurse",
      "Medical-Surgical Nurse",
      "Critical Care Nurse",
      "Emergency Department Nurse",
      "Pediatric Nurse",
    ],
  },
  {
    id: "pre-med",
    name: "Pre-Med Resume",
    description:
      "Tailored for Pre-Med, Biology, Chemistry, Biochemistry, and other pre-medical track students.",
    available: true,
    route: "pre-med",
    sectionIds: [
      "personal-info",
      "education",
      "clinical-experience",
      "research",
      "volunteer-work",
      "leadership-activities",
    ],
    roles: [
      "Medical Scribe",
      "Clinical Research Coordinator",
      "Research Assistant",
      "Emergency Medical Technician",
      "Patient Care Technician",
    ],
  },
  {
    id: "education",
    name: "Education Resume",
    description:
      "Designed for Education, Early Childhood Education, Special Education, and Teaching-focused majors.",
    available: true,
    route: "education",
    sectionIds: [
      "personal-info",
      "education",
      "teaching-experience",
      "certifications",
      "volunteer-work",
      "skills",
    ],
    roles: [
      "Elementary School Teacher",
      "High School Teacher",
    ],
  },
];
