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
  sections: string[]; // Sections included in this template (e.g., ["Education", "Technical Skills", "Software Projects", "Experience"])
}

/**
 * Template categories mapping.
 * Maps category keys to template IDs that belong to each category.
 */
export const templateCategories = {
  "tech-engineering": ["computer-science", "data-science", "cybersecurity", "mechanical-engineering"],
  "business-analytics": ["finance", "marketing", "business-administration", "accounting"],
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
    name: "CS/CE Resume",
    description: "Perfect for Computer Science and Computer Engineering majors focusing on software development, hardware projects, algorithms, and programming.",
    available: true,
    route: "computer-science",
    sections: ["Education", "Technical Skills", "Projects", "Experience"],
  },
  {
    id: "data-science",
    name: "Data Science Resume",
    description: "Optimized for Data Science, Statistics, Applied Mathematics, and Analytics-focused majors.",
    available: false,
    route: "data-science",
    sections: ["Education", "Technical Skills", "Projects", "Research", "Experience"],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity Resume",
    description: "Tailored for Cybersecurity, Information Security, and Network Security majors.",
    available: false,
    route: "cybersecurity",
    sections: ["Education", "Technical Skills", "Projects", "Certifications", "Experience"],
  },
  {
    id: "mechanical-engineering",
    name: "Mechanical Engineering Resume",
    description: "Crafted for Mechanical Engineering majors focusing on design, manufacturing, and lab work.",
    available: false,
    route: "mechanical-engineering",
    sections: ["Education", "Technical Skills", "Design Projects", "Lab Experience", "Experience"],
  },
  // Business & Analytics
  {
    id: "finance",
    name: "Finance Resume",
    description: "Perfect for Finance, Economics, and Investment-focused majors emphasizing financial analysis.",
    available: false,
    route: "finance",
    sections: ["Education", "Experience", "Projects", "Certifications", "Skills"],
  },
  {
    id: "marketing",
    name: "Marketing Resume",
    description: "Designed for Marketing, Communications, Advertising, and Public Relations majors.",
    available: false,
    route: "marketing",
    sections: ["Education", "Experience", "Campaigns", "Portfolio", "Skills"],
  },
  {
    id: "business-administration",
    name: "Business Administration Resume",
    description: "Tailored for Business Administration, Management, and General Business majors.",
    available: false,
    route: "business-administration",
    sections: ["Education", "Experience", "Leadership", "Projects", "Skills"],
  },
  {
    id: "accounting",
    name: "Accounting Resume",
    description: "Crafted for Accounting majors focusing on financial reporting, auditing, and certifications.",
    available: false,
    route: "accounting",
    sections: ["Education", "Experience", "Projects", "Certifications", "Skills"],
  },
  // Design & Media
  {
    id: "graphic-design",
    name: "Graphic Design Resume",
    description: "Perfect for Graphic Design, Visual Communication, and Creative Design majors.",
    available: false,
    route: "graphic-design",
    sections: ["Education", "Portfolio", "Projects", "Skills", "Experience"],
  },
  {
    id: "ux-ui-design",
    name: "UX/UI Design Resume",
    description: "Optimized for UX/UI Design, Human-Computer Interaction, and User Experience majors.",
    available: false,
    route: "ux-ui-design",
    sections: ["Education", "Portfolio", "Projects", "Case Studies", "Skills"],
  },
  // Health & Service
  {
    id: "nursing",
    name: "Nursing Resume",
    description: "Crafted for Nursing, Health Sciences, and other healthcare-focused majors pursuing clinical careers.",
    available: false,
    route: "nursing",
    sections: ["Education", "Clinical Experience", "Certifications", "Volunteer Work", "Skills"],
  },
  {
    id: "pre-med",
    name: "Pre-Med Resume",
    description: "Tailored for Pre-Med, Biology, Chemistry, Biochemistry, and other pre-medical track students.",
    available: false,
    route: "pre-med",
    sections: ["Education", "Clinical Experience", "Research", "Volunteer Work", "Certifications"],
  },
  {
    id: "education",
    name: "Education Resume",
    description: "Designed for Education, Early Childhood Education, Special Education, and Teaching-focused majors.",
    available: false,
    route: "education",
    sections: ["Education", "Teaching Experience", "Certifications", "Volunteer Work", "Skills"],
  },
];
