export interface InfoGuideSubsection {
  title: string;
  points: string[];
}

export interface InfoGuideSection {
  heading: string;
  points?: string[];
  subsections?: InfoGuideSubsection[];
}

export interface InfoGuideData {
  name: string;
  title: string;
  description: string;
  sections: InfoGuideSection[];
}

export const InfoGuides: InfoGuideData[] = [
  {
    name: "personal information",
    title: "Personal Info Guide",
    description:
      "Your personal info sets your first impression. Keep it clean, professional, and easy to scan.",
    sections: [
      {
        heading: "What to Include",
        points: [
          "Full name (as it appears on official documents)",
          "Professional email address",
          "Phone number with voicemail setup",
          "LinkedIn profile URL (optional but recommended)",
          "GitHub username (if you have public projects)",
          "Portfolio website (if applicable)",
          "City and state (full address not needed)",
        ],
      },
      {
        heading: "Best Practices",
        points: [
          "Use a professional email format: firstname.lastname@domain.com",
          "Ensure your voicemail greeting is professional",
          "Keep LinkedIn profile picture clean and matches your name",
          "Only include GitHub if you have at least 1–2 public projects",
          "Match usernames across LinkedIn/GitHub for consistency",
        ],
      },
      {
        heading: "Pro Tips",
        subsections: [
          {
            title: "Do",
            points: [
              "Put your strongest link first (LinkedIn, Portfolio, or GitHub)",
              "Use a professional email address",
              "Keep contact information up to date",
              "Ensure all links are working and accessible",
            ],
          },
          {
            title: "Don't",
            points: [
              "Use unprofessional email addresses",
              "Include full street address (city & state is enough)",
              "Add social media links unless relevant",
              "Include outdated or broken links",
            ],
          },
        ],
      },
    ],
  },

  {
    name: "education",
    title: "Education Info Guide",
    description:
      "Your Education section establishes your academic foundation, technical depth, and qualifications.",
    sections: [
      {
        heading: "What to Include",
        points: [
          "Degree type, major, and university name",
          "Expected graduation date (Month Year)",
          "GPA if above 3.0",
          "Relevant coursework with technical depth",
          "Academic honors, awards, or Dean's List",
        ],
      },
      {
        heading: "Best Practices",
        points: [
          "List education in reverse chronological order.",
          "Include technical coursework if experience is limited.",
          "Place Education at the top if you're a student or recent grad.",
          "Add relevant minors such as Math, Business, or Data Science.",
        ],
      },
      {
        heading: "Example Format",
        points: [
          "University Name — Graduation Date",
          "Bachelor of Science in Computer Science | GPA: 3.X",
          "Relevant Coursework: Data Structures, Algorithms, OS, Database Systems",
        ],
      },
      {
        heading: "Pro Tips",
        subsections: [
          {
            title: "Do",
            points: [
              "Drop high school once you're in college.",
              "List study abroad if it involved technical coursework.",
              "Include certifications in progress if nearly complete.",
              "Mention major GPA if higher than overall GPA.",
            ],
          },
          {
            title: "Don’t",
            points: [
              "List basic or intro-level courses.",
              "List every course — pick the top 4–6.",
              "Include unrelated coursework unless filling space.",
            ],
          },
        ],
      },
    ],
  },

  {
    name: "projects",
    title: "Projects Info Guide",
    description:
      "Projects prove your ability to build real systems and solve technical problems.",
    sections: [
      {
        heading: "What to Include",
        points: [
          "Project name",
          "Tech stack used",
          "GitHub repo or live demo link",
          "2–4 achievement-focused bullet points",
        ],
      },
      {
        heading: "Best Practices",
        points: [
          "Use the XYZ Method: Accomplished [X], measured by [Y], by doing [Z].",
          "Start bullets with strong technical action verbs.",
          "Quantify everything — users, performance, scale, efficiency.",
          "Highlight the full tech stack for ATS scanning.",
        ],
      },
      {
        heading: "Strong Action Verbs",
        points: [
          "Built, Developed, Engineered, Implemented",
          "Optimized, Refactored, Enhanced, Streamlined",
          "Architected, Designed, Modeled",
          "Deployed, Integrated, Launched",
          "Debugged, Resolved, Automated",
          "Led, Coordinated, Mentored",
        ],
      },
      {
        heading: "Example Project Bullets",
        points: [
          "Built a full-stack forum using React/Node reaching 200+ sign-ups.",
          "Implemented JWT auth securing data for 500+ users.",
          "Optimized MongoDB queries reducing latency by 45%.",
          "Deployed on AWS EC2 with CI/CD using GitHub Actions.",
        ],
      },
      {
        heading: "Metrics to Quantify Impact",
        points: [
          "User metrics: 500+ users, 1000+ DAU, 10k+ downloads",
          "Performance: 40% faster load time, 3× throughput",
          "Scale: Processed 1M+ records, 50k+ requests/day",
          "Efficiency: Reduced execution time by 60%",
          "Code quality: 95% test coverage",
          "Impact: Increased engagement by 35%",
        ],
      },
      {
        heading: "Pro Tips",
        subsections: [
          {
            title: "Do",
            points: [
              "Showcase 2–4 strong projects.",
              "Include hackathon projects if award-winning.",
              "Maintain clean GitHub READMEs.",
            ],
          },
          {
            title: "Don’t",
            points: [
              "Avoid vague descriptions like 'made a website'.",
              "Don’t list abandoned or incomplete projects.",
              "Don’t include trivial school assignments.",
            ],
          },
        ],
      },
    ],
  },

  {
    name: "experience",
    title: "Experience Info Guide",
    description:
      "Your Experience section demonstrates impact, technical ability, and problem-solving at scale.",
    sections: [
      {
        heading: "What to Include",
        points: [
          "Job title, company, location",
          "Employment dates",
          "3–5 metric-driven bullet points",
          "Technologies/tools used",
        ],
      },
      {
        heading: "Best Practices",
        points: [
          "Use Google’s XYZ method for EVERY bullet.",
          "Start bullets with action verbs.",
          "Prioritize results over responsibilities.",
          "Include specific tools, frameworks, languages.",
        ],
      },
      {
        heading: "XYZ Method Breakdown",
        points: [
          "X = What you accomplished",
          "Y = Measured by metrics",
          "Z = How you did it (tools/skills)",
          "Example: 'Developed microservices with Docker + Spring, reducing deploy time 50%'",
        ],
      },
      {
        heading: "Metric Types",
        points: [
          "Performance: +30% efficiency",
          "Financial: Saved $5k annually",
          "Time: Reduced task time from 3 days → 8 hours",
          "Scale: 50k+ requests/day",
          "User Impact: +25% retention",
          "Efficiency: 60% reduction in manual effort",
          "Reliability: 99.9% uptime",
        ],
      },
      {
        heading: "Strong Example Bullets",
        points: [
          "Developed microservices reducing deployment time by 50%.",
          "Optimized SQL + Redis caching cutting latency 65%.",
          "Led monolith → microservices migration reducing downtime 80%.",
          "Implemented CI/CD reducing deployment errors 90%.",
        ],
      },
      {
        heading: "Weak Example Bullets to Avoid",
        points: [
          "Worked on backend development.",
          "Helped team fix bugs.",
          "Participated in code reviews.",
          "Responsible for testing.",
        ],
      },
      {
        heading: "Pro Tips",
        subsections: [
          {
            title: "Do",
            points: [
              "Tailor bullets to each job.",
              "Use past tense for previous roles.",
              "Include internships, research, TA roles.",
            ],
          },
          {
            title: "Don’t",
            points: [
              "Use personal pronouns.",
              "Write paragraphs.",
              "List responsibilities without impact.",
              "Leave bullets without metrics.",
            ],
          },
        ],
      },
    ],
  },

  {
    name: "skills",
    title: "Skills Info Guide",
    description:
      "A strong Skills section improves ATS rankings and reveals your technical breadth.",
    sections: [
      {
        heading: "What to Include",
        points: [
          "Programming languages",
          "Frameworks & libraries",
          "Tools & platforms",
          "Databases",
          "Technical concepts",
          "Soft skills (optional)",
        ],
      },
      {
        heading: "Best Practices",
        points: [
          "Organize into categories.",
          "List 10–30 skills max.",
          "Prioritize skills from job description.",
          "Only list skills you're confident discussing.",
        ],
      },
      {
        heading: "Ordering",
        points: ["1. Relevance", "2. Proficiency", "3. Industry demand"],
      },
      {
        heading: "Example Format",
        points: [
          "Languages: Python, Java, JS/TS, C++, SQL",
          "Frameworks: React, Node, Spring, Flask",
          "Tools: Docker, AWS, Git, Linux",
          "Databases: MongoDB, PostgreSQL, Redis",
        ],
      },
      {
        heading: "ATS Keywords",
        points: [
          "Agile, Scrum, DevOps, CI/CD",
          "Microservices, REST APIs",
          "Docker, Kubernetes, AWS",
          "Testing, Version Control, OOP",
        ],
      },
      {
        heading: "Pro Tips",
        subsections: [
          {
            title: "Do",
            points: [
              "Update per application.",
              "Spell out acronyms.",
              "Include broad and specific terms.",
            ],
          },
          {
            title: "Don’t",
            points: [
              "Add basic skills (Microsoft Office).",
              "Use skill bars.",
              "List outdated skills.",
            ],
          },
        ],
      },
    ],
  },

  {
    name: "leadership",
    title: "Leadership Info Guide",
    description:
      "Leadership roles represent initiative, collaboration, and ownership — all valued by employers.",
    sections: [
      {
        heading: "What to Include",
        points: [
          "Leadership title & organization",
          "Dates of involvement",
          "2–3 bullet points showing measurable impact",
          "Team size managed",
        ],
      },
      {
        heading: "Best Practices",
        points: [
          "Use the XYZ method.",
          "Include orgs, hackathons, TA roles, project leads.",
          "Show collaboration, mentorship, event planning.",
        ],
      },
      {
        heading: "Examples",
        points: [
          "ACM VP — Managed 200+ members; 15+ workshops.",
          "Hackathon Lead — Directed team of 5 to win Best Social Impact Award.",
          "Mentor — Guided 20+ students through interview prep.",
        ],
      },
      {
        heading: "What Counts as Leadership",
        points: [
          "Student org officer roles",
          "Teaching assistant or tutoring",
          "Hackathon captain/organizer",
          "Open-source maintainer",
        ],
      },
      {
        heading: "Soft Skills",
        points: [
          "Communication",
          "Collaboration",
          "Project planning",
          "Mentorship",
          "Decision-making",
        ],
      },
      {
        heading: "Pro Tips",
        subsections: [
          {
            title: "Do",
            points: [
              "Quantify everything.",
              "Show technical + interpersonal skills.",
            ],
          },
          {
            title: "Don’t",
            points: [
              "List passive memberships.",
              "Include unrelated leadership roles.",
            ],
          },
        ],
      },
    ],
  },

  {
    name: "certificates",
    title: "Certificates Info Guide",
    description:
      "Certifications validate technical skills and strengthen your resume when relevant.",
    sections: [
      {
        heading: "What to Include",
        points: [
          "Certificate name",
          "Issuing organization",
          "Issued date",
          "Credential ID (optional)",
          "Expiration date (if applicable)",
        ],
      },
      {
        heading: "Best Practices",
        points: [
          "Include industry-standard certs.",
          "Reverse chronological order.",
          "Include in-progress certs if exam scheduled.",
        ],
      },
      {
        heading: "Certification Categories",
        subsections: [
          {
            title: "Cloud",
            points: [
              "AWS Solutions Architect",
              "AWS Developer Associate",
              "Google Cloud Architect",
              "Azure Fundamentals",
            ],
          },
          {
            title: "Programming Languages",
            points: ["Oracle Java SE Programmer", "Python Institute PCAP/PCEP"],
          },
          {
            title: "Security",
            points: ["CompTIA Security+", "CEH", "CISSP"],
          },
          {
            title: "Data & Databases",
            points: [
              "MongoDB Developer",
              "Google Data Analytics",
              "AWS Database Specialty",
            ],
          },
          {
            title: "DevOps",
            points: [
              "Docker Certified Associate",
              "Kubernetes CKA/CKAD",
              "Terraform Associate",
            ],
          },
        ],
      },
      {
        heading: "Pro Tips",
        subsections: [
          {
            title: "Do",
            points: ["Link to badges", "Group related certs"],
          },
          {
            title: "Don’t",
            points: ["Include outdated certs", "List unrelated certs"],
          },
        ],
      },
      {
        heading: "When to Skip",
        points: [
          "You have senior-level experience.",
          "Your projects/experience already demonstrate skills.",
          "You don’t have relevant certs yet.",
        ],
      },
    ],
  },
];
