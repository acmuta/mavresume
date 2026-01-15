/**
 * Resume template configuration data.
 *
 * This file defines available resume experience types that users can select.
 * Each template can be marked as available or coming soon.
 * Available templates include a route parameter for navigation.
 */

export interface ResumeTemplate {
  id: string;
  name: string;
  description?: string;
  available: boolean;
  route?: string; // e.g., "engineering" for /builder?type=engineering
  sections: string[]; // Sections included in this template (e.g., ["Education", "Projects", "Technical Skills", "Experience"])
}

/**
 * Array of resume templates.
 *
 * To add a new template:
 * 1. Add a new object to this array
 * 2. Set `available: true` when ready to launch
 * 3. Add `route` property for query parameter
 */
export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "engineering",
    name: "Engineering Resume",
    description: "Perfect for Computer Science, Computer Engineering, Electrical Engineering, Mechanical Engineering, and other engineering majors.",
    available: true,
    route: "engineering",
    sections: ["Education", "Technical Skills", "Projects", "Experience"],
  },
  {
    id: "pre-med",
    name: "Pre-Med Resume",
    description: "Tailored for Pre-Med, Biology, Chemistry, Biochemistry, and other pre-medical track students.",
    available: false,
    sections: ["Education", "Clinical Experience", "Research", "Volunteer Work", "Certifications"],
  },
  {
    id: "business",
    name: "Business Resume",
    description: "Designed for Business Administration, Management, Marketing, Finance, Accounting, and Economics majors.",
    available: false,
    sections: ["Education", "Experience", "Leadership", "Projects", "Skills"],
  },
  {
    id: "nursing",
    name: "Nursing Resume",
    description: "Crafted for Nursing, Health Sciences, and other healthcare-focused majors pursuing clinical careers.",
    available: false,
    sections: ["Education", "Clinical Experience", "Certifications", "Volunteer Work", "Skills"],
  },
  {
    id: "law",
    name: "Law Resume",
    description: "Tailored for Pre-Law, Political Science, Criminal Justice, and other majors pursuing legal careers.",
    available: false,
    sections: ["Education", "Legal Experience", "Research", "Leadership", "Skills"],
  },
  {
    id: "finance",
    name: "Finance Resume",
    description: "Perfect for Finance, Accounting, Economics, and other majors focused on financial analysis and investment.",
    available: false,
    sections: ["Education", "Experience", "Projects", "Skills", "Certifications"],
  },
  {
    id: "marketing",
    name: "Marketing Resume",
    description: "Designed for Marketing, Communications, Advertising, and Public Relations majors.",
    available: false,
    sections: ["Education", "Experience", "Projects", "Skills", "Leadership"],
  },
  {
    id: "data-science",
    name: "Data Science Resume",
    description: "Optimized for Data Science, Statistics, Applied Mathematics, and Analytics-focused majors.",
    available: false,
    sections: ["Education", "Technical Skills", "Projects", "Research", "Experience"],
  },
  {
    id: "design",
    name: "Design Resume",
    description: "Perfect for Graphic Design, UX/UI Design, Industrial Design, and other creative design majors.",
    available: false,
    sections: ["Education", "Portfolio", "Projects", "Skills", "Experience"],
  },
  {
    id: "education",
    name: "Education Resume",
    description: "Crafted for Education, Early Childhood Education, Special Education, and Teaching-focused majors.",
    available: false,
    sections: ["Education", "Teaching Experience", "Certifications", "Volunteer Work", "Skills"],
  },
];
