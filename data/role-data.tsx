import { resumeTemplates } from "./resume-templates";

// ─────────────────────────────────────────────────────────────────
//  roleData.ts
//  Qualifications for every role defined in resumeTemplates.
//  Each qualification is tagged as "required" or "nice-to-have".
// ─────────────────────────────────────────────────────────────────

export type Qualification = {
  skill: string;
  importance: "required" | "nice-to-have";
};

export type RoleData = {
  /** Unique identifier — kebab-case of the role title */
  id: string;
  /** Display title (matches the value in resumeTemplates[].roles[]) */
  title: string;
  /** ID of the template this role belongs to */
  templateId: string;
  qualifications: Qualification[];
};

function resolveTemplateId(templateKey: string): string | null {
  const template = resumeTemplates.find(
    (candidate) => candidate.id === templateKey || candidate.route === templateKey,
  );

  return template?.id ?? null;
}

export const roleData: RoleData[] = [
  // ─────────────────────────────────────────────────────────────
  //  TEMPLATE: computer-science
  // ─────────────────────────────────────────────────────────────
  {
    id: "software-engineer",
    title: "Software Engineer",
    templateId: "computer-science",
    qualifications: [
      { skill: "Data Structures & Algorithms", importance: "required" },
      { skill: "Proficiency in Python, Java, or C++", importance: "required" },
      { skill: "Object-Oriented Programming (OOP)", importance: "required" },
      { skill: "Version Control with Git", importance: "required" },
      { skill: "REST API design & consumption", importance: "required" },
      { skill: "System Design fundamentals", importance: "nice-to-have" },
      { skill: "Cloud basics (AWS / GCP / Azure)", importance: "nice-to-have" },
      { skill: "CI/CD pipeline awareness", importance: "nice-to-have" },
      { skill: "Agile / Scrum methodology", importance: "nice-to-have" },
    ],
  },
  {
    id: "frontend-engineer",
    title: "Frontend Engineer",
    templateId: "computer-science",
    qualifications: [
      { skill: "HTML, CSS, JavaScript (ES6+)", importance: "required" },
      { skill: "React (or Vue / Angular)", importance: "required" },
      { skill: "Responsive & accessible design", importance: "required" },
      { skill: "Version Control with Git", importance: "required" },
      { skill: "Browser DevTools & debugging", importance: "required" },
      { skill: "TypeScript", importance: "nice-to-have" },
      { skill: "REST API integration", importance: "nice-to-have" },
      { skill: "Testing (Jest / Cypress)", importance: "nice-to-have" },
      { skill: "Web performance optimization", importance: "nice-to-have" },
    ],
  },
  {
    id: "backend-engineer",
    title: "Backend Engineer",
    templateId: "computer-science",
    qualifications: [
      {
        skill: "Server-side language (Python / Java / Node.js / Go)",
        importance: "required",
      },
      { skill: "REST API design & development", importance: "required" },
      {
        skill: "SQL databases (PostgreSQL / MySQL)",
        importance: "required",
      },
      { skill: "Data Structures & Algorithms", importance: "required" },
      { skill: "Version Control with Git", importance: "required" },
      {
        skill: "NoSQL databases (MongoDB / Redis)",
        importance: "nice-to-have",
      },
      {
        skill: "Authentication & authorization (OAuth, JWT)",
        importance: "nice-to-have",
      },
      { skill: "Docker / containerization basics", importance: "nice-to-have" },
      { skill: "System Design fundamentals", importance: "nice-to-have" },
    ],
  },
  {
    id: "full-stack-engineer",
    title: "Full Stack Engineer",
    templateId: "computer-science",
    qualifications: [
      { skill: "HTML, CSS, JavaScript (ES6+)", importance: "required" },
      { skill: "React or similar frontend framework", importance: "required" },
      { skill: "Node.js or server-side language", importance: "required" },
      { skill: "SQL databases & ORM usage", importance: "required" },
      { skill: "REST API design & integration", importance: "required" },
      { skill: "Version Control with Git", importance: "required" },
      { skill: "TypeScript", importance: "nice-to-have" },
      { skill: "Docker basics", importance: "nice-to-have" },
      { skill: "Cloud deployment (Vercel / AWS / GCP)", importance: "nice-to-have" },
    ],
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    templateId: "computer-science",
    qualifications: [
      { skill: "Linux / Unix administration", importance: "required" },
      {
        skill: "CI/CD pipelines (GitHub Actions / Jenkins / GitLab CI)",
        importance: "required",
      },
      { skill: "Docker & containerization", importance: "required" },
      { skill: "Scripting (Python / Bash)", importance: "required" },
      { skill: "Version Control with Git", importance: "required" },
      { skill: "Kubernetes orchestration", importance: "nice-to-have" },
      {
        skill: "Infrastructure as Code (Terraform / Ansible)",
        importance: "nice-to-have",
      },
      {
        skill: "Cloud platforms (AWS / Azure / GCP)",
        importance: "nice-to-have",
      },
      {
        skill: "Monitoring & logging (Prometheus / Grafana / ELK)",
        importance: "nice-to-have",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  //  TEMPLATE: computer-engineering
  // ─────────────────────────────────────────────────────────────
  {
    id: "embedded-systems-engineer",
    title: "Embedded Systems Engineer",
    templateId: "computer-engineering",
    qualifications: [
      { skill: "C / C++ programming", importance: "required" },
      {
        skill: "Microcontroller architecture (ARM / AVR)",
        importance: "required",
      },
      { skill: "Real-Time Operating Systems (RTOS)", importance: "required" },
      {
        skill: "Hardware debugging (oscilloscope, logic analyzer)",
        importance: "required",
      },
      { skill: "Digital logic & circuit fundamentals", importance: "required" },
      { skill: "Assembly language basics", importance: "nice-to-have" },
      {
        skill: "Communication protocols (SPI / I2C / UART / CAN)",
        importance: "nice-to-have",
      },
      { skill: "PCB schematic reading", importance: "nice-to-have" },
      { skill: "Version Control with Git", importance: "nice-to-have" },
    ],
  },
  {
    id: "firmware-engineer",
    title: "Firmware Engineer",
    templateId: "computer-engineering",
    qualifications: [
      { skill: "C / C++ (embedded programming)", importance: "required" },
      {
        skill: "Microcontroller & microprocessor knowledge",
        importance: "required",
      },
      {
        skill: "Real-Time Operating Systems (FreeRTOS / RTX)",
        importance: "required",
      },
      {
        skill: "Communication protocols (SPI / I2C / UART / CAN)",
        importance: "required",
      },
      {
        skill: "Hardware debugging (JTAG / oscilloscope / emulators)",
        importance: "required",
      },
      { skill: "Assembly language", importance: "nice-to-have" },
      { skill: "Embedded Linux", importance: "nice-to-have" },
      { skill: "Python for scripting & test automation", importance: "nice-to-have" },
      { skill: "Version Control with Git / SVN", importance: "nice-to-have" },
    ],
  },
  {
    id: "hardware-engineer",
    title: "Hardware Engineer",
    templateId: "computer-engineering",
    qualifications: [
      { skill: "Circuit design fundamentals", importance: "required" },
      {
        skill: "PCB design tools (Altium / KiCad / Eagle)",
        importance: "required",
      },
      { skill: "Digital & analog electronics", importance: "required" },
      {
        skill: "Test equipment (oscilloscope, logic analyzer, multimeter)",
        importance: "required",
      },
      { skill: "Schematic & BOM creation", importance: "required" },
      {
        skill: "FPGA design (VHDL / Verilog)",
        importance: "nice-to-have",
      },
      { skill: "Signal integrity concepts", importance: "nice-to-have" },
      { skill: "Lab prototyping & bring-up", importance: "nice-to-have" },
      { skill: "C / Python for hardware testing", importance: "nice-to-have" },
    ],
  },
  {
    id: "systems-engineer",
    title: "Systems Engineer",
    templateId: "computer-engineering",
    qualifications: [
      { skill: "System architecture & design", importance: "required" },
      { skill: "C / C++ or Python", importance: "required" },
      { skill: "Linux OS fundamentals", importance: "required" },
      { skill: "Technical documentation & specs", importance: "required" },
      { skill: "Data Structures & Algorithms", importance: "required" },
      { skill: "Embedded / real-time systems awareness", importance: "nice-to-have" },
      { skill: "Network protocols (TCP/IP)", importance: "nice-to-have" },
      { skill: "Requirements analysis (SysML / UML)", importance: "nice-to-have" },
      { skill: "Version Control with Git", importance: "nice-to-have" },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  //  TEMPLATE: data-science
  // ─────────────────────────────────────────────────────────────
  {
    id: "data-analyst",
    title: "Data Analyst",
    templateId: "data-science",
    qualifications: [
      { skill: "SQL (querying, joins, aggregations)", importance: "required" },
      { skill: "Excel / Google Sheets (pivot tables, vlookup)", importance: "required" },
      {
        skill: "Data visualization (Tableau / Power BI)",
        importance: "required",
      },
      { skill: "Python (pandas, NumPy) or R", importance: "required" },
      { skill: "Statistical analysis fundamentals", importance: "required" },
      { skill: "Machine learning basics", importance: "nice-to-have" },
      { skill: "ETL / data pipeline awareness", importance: "nice-to-have" },
      { skill: "Storytelling with data / presentations", importance: "nice-to-have" },
    ],
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    templateId: "data-science",
    qualifications: [
      {
        skill: "Python (pandas / NumPy / scikit-learn)",
        importance: "required",
      },
      { skill: "SQL", importance: "required" },
      { skill: "Statistics & probability", importance: "required" },
      {
        skill: "Machine learning algorithms (regression, classification, clustering)",
        importance: "required",
      },
      { skill: "Data visualization & reporting", importance: "required" },
      {
        skill: "Deep learning (TensorFlow / PyTorch)",
        importance: "nice-to-have",
      },
      { skill: "A/B testing & experimental design", importance: "nice-to-have" },
      { skill: "Feature engineering", importance: "nice-to-have" },
      { skill: "Big data tools (Spark / Hadoop)", importance: "nice-to-have" },
    ],
  },
  {
    id: "machine-learning-engineer",
    title: "Machine Learning Engineer",
    templateId: "data-science",
    qualifications: [
      {
        skill: "Python (NumPy / pandas / scikit-learn)",
        importance: "required",
      },
      {
        skill: "ML algorithms (supervised & unsupervised)",
        importance: "required",
      },
      { skill: "Linear algebra & statistics", importance: "required" },
      { skill: "Model training, evaluation & tuning", importance: "required" },
      { skill: "SQL & data wrangling", importance: "required" },
      {
        skill: "Deep learning (PyTorch / TensorFlow)",
        importance: "nice-to-have",
      },
      {
        skill: "MLOps & model deployment tools",
        importance: "nice-to-have",
      },
      {
        skill: "Cloud ML platforms (SageMaker / Vertex AI)",
        importance: "nice-to-have",
      },
      { skill: "Docker / containerization", importance: "nice-to-have" },
    ],
  },
  {
    id: "data-engineer",
    title: "Data Engineer",
    templateId: "data-science",
    qualifications: [
      { skill: "SQL (advanced querying & optimization)", importance: "required" },
      { skill: "Python (data pipelines & ETL)", importance: "required" },
      {
        skill: "Cloud data platforms (Snowflake / BigQuery / Redshift)",
        importance: "required",
      },
      { skill: "Data warehousing concepts", importance: "required" },
      { skill: "Data modeling & schema design", importance: "required" },
      { skill: "Apache Spark / distributed computing", importance: "nice-to-have" },
      { skill: "Workflow orchestration (Airflow / dbt)", importance: "nice-to-have" },
      { skill: "Docker / containerization", importance: "nice-to-have" },
      { skill: "Streaming data (Kafka / Kinesis)", importance: "nice-to-have" },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  //  TEMPLATE: cybersecurity
  // ─────────────────────────────────────────────────────────────
  {
    id: "information-security-analyst",
    title: "Information Security Analyst",
    templateId: "cybersecurity",
    qualifications: [
      {
        skill: "Network fundamentals (TCP/IP, DNS, firewalls)",
        importance: "required",
      },
      { skill: "OS security (Windows & Linux)", importance: "required" },
      {
        skill: "Security frameworks (NIST CSF / ISO 27001)",
        importance: "required",
      },
      { skill: "SIEM tools (Splunk / Microsoft Sentinel)", importance: "required" },
      { skill: "Vulnerability assessment & management", importance: "required" },
      {
        skill: "CompTIA Security+ certification",
        importance: "nice-to-have",
      },
      { skill: "Scripting (Python / Bash)", importance: "nice-to-have" },
      { skill: "Incident response procedures", importance: "nice-to-have" },
      { skill: "Cloud security basics", importance: "nice-to-have" },
    ],
  },
  {
    id: "soc-analyst",
    title: "SOC Analyst",
    templateId: "cybersecurity",
    qualifications: [
      {
        skill: "SIEM tools (Splunk / Microsoft Sentinel)",
        importance: "required",
      },
      { skill: "Log analysis & correlation", importance: "required" },
      { skill: "Threat detection & alert triage", importance: "required" },
      { skill: "Network protocols & traffic analysis", importance: "required" },
      { skill: "Incident response fundamentals", importance: "required" },
      {
        skill: "CompTIA Security+ or CySA+",
        importance: "nice-to-have",
      },
      {
        skill: "MITRE ATT&CK framework",
        importance: "nice-to-have",
      },
      { skill: "Malware analysis basics", importance: "nice-to-have" },
      { skill: "Scripting (Python / PowerShell)", importance: "nice-to-have" },
    ],
  },
  {
    id: "cybersecurity-engineer",
    title: "Cybersecurity Engineer",
    templateId: "cybersecurity",
    qualifications: [
      {
        skill: "Network security (firewalls / IDS / IPS)",
        importance: "required",
      },
      { skill: "Scripting & automation (Python / Bash)", importance: "required" },
      { skill: "Security architecture concepts", importance: "required" },
      { skill: "Vulnerability management & patching", importance: "required" },
      { skill: "Linux / Unix administration", importance: "required" },
      {
        skill: "Cloud security (AWS / Azure security services)",
        importance: "nice-to-have",
      },
      { skill: "Penetration testing basics", importance: "nice-to-have" },
      { skill: "CISSP / CEH certification", importance: "nice-to-have" },
      { skill: "DevSecOps concepts", importance: "nice-to-have" },
    ],
  },
  {
    id: "network-security-analyst",
    title: "Network Security Analyst",
    templateId: "cybersecurity",
    qualifications: [
      {
        skill: "Network protocols (TCP/IP, DNS, HTTP/S)",
        importance: "required",
      },
      { skill: "Firewall & VPN configuration", importance: "required" },
      {
        skill: "Packet analysis (Wireshark)",
        importance: "required",
      },
      { skill: "Intrusion detection systems (IDS / IPS)", importance: "required" },
      { skill: "Security monitoring & alerting", importance: "required" },
      {
        skill: "CompTIA Network+ / Security+",
        importance: "nice-to-have",
      },
      { skill: "SIEM tools", importance: "nice-to-have" },
      { skill: "Zero trust network concepts", importance: "nice-to-have" },
      { skill: "Cloud networking security", importance: "nice-to-have" },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  //  TEMPLATE: mechanical-engineering
  // ─────────────────────────────────────────────────────────────
  {
    id: "mechanical-engineer",
    title: "Mechanical Engineer",
    templateId: "mechanical-engineering",
    qualifications: [
      {
        skill: "CAD software (SolidWorks / AutoCAD / CATIA)",
        importance: "required",
      },
      {
        skill: "Engineering mechanics (statics & dynamics)",
        importance: "required",
      },
      { skill: "Materials science & selection", importance: "required" },
      {
        skill: "GD&T (Geometric Dimensioning & Tolerancing)",
        importance: "required",
      },
      { skill: "Technical drawing & documentation", importance: "required" },
      {
        skill: "FEA / simulation (ANSYS / Abaqus)",
        importance: "nice-to-have",
      },
      { skill: "Manufacturing process knowledge", importance: "nice-to-have" },
      { skill: "MATLAB for engineering calculations", importance: "nice-to-have" },
      { skill: "Thermodynamics & heat transfer", importance: "nice-to-have" },
    ],
  },
  {
    id: "design-engineer",
    title: "Design Engineer",
    templateId: "mechanical-engineering",
    qualifications: [
      {
        skill: "3D CAD software (SolidWorks / CATIA / Creo)",
        importance: "required",
      },
      { skill: "Product design principles & DFM", importance: "required" },
      { skill: "GD&T & engineering tolerancing", importance: "required" },
      { skill: "Engineering calculations & analysis", importance: "required" },
      { skill: "Technical documentation & BOM creation", importance: "required" },
      { skill: "FEA simulation (ANSYS / SolidWorks Simulation)", importance: "nice-to-have" },
      { skill: "Rapid prototyping / 3D printing", importance: "nice-to-have" },
      { skill: "FMEA (Failure Mode & Effects Analysis)", importance: "nice-to-have" },
      { skill: "MATLAB / Python for design scripting", importance: "nice-to-have" },
    ],
  },
  {
    id: "manufacturing-engineer",
    title: "Manufacturing Engineer",
    templateId: "mechanical-engineering",
    qualifications: [
      {
        skill: "Manufacturing processes (machining, casting, injection molding)",
        importance: "required",
      },
      { skill: "CAD software for design review", importance: "required" },
      { skill: "Lean & Six Sigma fundamentals", importance: "required" },
      {
        skill: "Quality control (GD&T, SPC, inspection)",
        importance: "required",
      },
      { skill: "Process documentation & SOPs", importance: "required" },
      { skill: "CNC programming basics", importance: "nice-to-have" },
      { skill: "ERP systems (SAP / Oracle)", importance: "nice-to-have" },
      { skill: "DFMEA & root cause analysis", importance: "nice-to-have" },
      { skill: "OSHA & workplace safety compliance", importance: "nice-to-have" },
    ],
  },
  {
    id: "aerospace-engineer",
    title: "Aerospace Engineer",
    templateId: "mechanical-engineering",
    qualifications: [
      {
        skill: "Aerospace fundamentals (aerodynamics, propulsion, structures)",
        importance: "required",
      },
      {
        skill: "CAD / CAE tools (CATIA / SolidWorks / NASTRAN)",
        importance: "required",
      },
      { skill: "Structural & stress analysis", importance: "required" },
      { skill: "MATLAB / Simulink", importance: "required" },
      { skill: "Engineering documentation & standards", importance: "required" },
      {
        skill: "FEA / CFD simulation",
        importance: "nice-to-have",
      },
      { skill: "Systems engineering (model-based)", importance: "nice-to-have" },
      {
        skill: "FAA / DO-178 regulatory awareness",
        importance: "nice-to-have",
      },
      { skill: "Python for data analysis & scripting", importance: "nice-to-have" },
    ],
  },
  {
    id: "product-development-engineer",
    title: "Product Development Engineer",
    templateId: "mechanical-engineering",
    qualifications: [
      { skill: "CAD software & 3D modeling", importance: "required" },
      { skill: "Product lifecycle management (PLM)", importance: "required" },
      { skill: "Prototyping, testing & iteration", importance: "required" },
      { skill: "Cross-functional team collaboration", importance: "required" },
      { skill: "Requirements management & traceability", importance: "required" },
      { skill: "DFM / DFA (design for manufacture / assembly)", importance: "nice-to-have" },
      { skill: "Rapid prototyping / 3D printing", importance: "nice-to-have" },
      { skill: "FMEA & risk analysis", importance: "nice-to-have" },
      { skill: "Agile product development practices", importance: "nice-to-have" },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  //  TEMPLATE: finance
  // ─────────────────────────────────────────────────────────────
  {
    id: "financial-analyst",
    title: "Financial Analyst",
    templateId: "finance",
    qualifications: [
      {
        skill: "Excel (financial modeling, pivot tables, VLOOKUP)",
        importance: "required",
      },
      {
        skill: "Financial statements (income statement, balance sheet, cash flow)",
        importance: "required",
      },
      { skill: "Accounting principles (GAAP)", importance: "required" },
      { skill: "Variance analysis & forecasting", importance: "required" },
      { skill: "PowerPoint / executive reporting", importance: "required" },
      {
        skill: "Bloomberg / FactSet terminal basics",
        importance: "nice-to-have",
      },
      { skill: "SQL for financial data queries", importance: "nice-to-have" },
      { skill: "CFA Level 1 (in progress)", importance: "nice-to-have" },
      { skill: "Python / R for financial analysis", importance: "nice-to-have" },
    ],
  },
  {
    id: "investment-banking-analyst",
    title: "Investment Banking Analyst",
    templateId: "finance",
    qualifications: [
      {
        skill: "Financial modeling (DCF, LBO, Comparable Companies)",
        importance: "required",
      },
      {
        skill: "Valuation techniques (EV/EBITDA, P/E, precedent transactions)",
        importance: "required",
      },
      {
        skill: "Excel (advanced — sensitivity tables, scenarios)",
        importance: "required",
      },
      { skill: "Financial statement analysis", importance: "required" },
      { skill: "PowerPoint pitch deck creation", importance: "required" },
      { skill: "Bloomberg Terminal", importance: "nice-to-have" },
      { skill: "CFA Level 1 (in progress)", importance: "nice-to-have" },
      {
        skill: "M&A / capital markets transaction knowledge",
        importance: "nice-to-have",
      },
      { skill: "Networking & deal sourcing fundamentals", importance: "nice-to-have" },
    ],
  },
  {
    id: "risk-analyst",
    title: "Risk Analyst",
    templateId: "finance",
    qualifications: [
      { skill: "Statistical analysis & probability", importance: "required" },
      {
        skill: "Excel (scenario analysis, Monte Carlo basics)",
        importance: "required",
      },
      { skill: "Financial modeling", importance: "required" },
      { skill: "Risk frameworks (VaR, stress testing)", importance: "required" },
      {
        skill: "Regulatory knowledge (Basel III / Dodd-Frank awareness)",
        importance: "required",
      },
      { skill: "Python or R for quantitative modeling", importance: "nice-to-have" },
      {
        skill: "FRM (Financial Risk Manager) certification pursuit",
        importance: "nice-to-have",
      },
      { skill: "SQL for data extraction", importance: "nice-to-have" },
      { skill: "Credit risk or market risk specialization", importance: "nice-to-have" },
    ],
  },
  {
    id: "corporate-finance-analyst",
    title: "Corporate Finance Analyst",
    templateId: "finance",
    qualifications: [
      { skill: "Financial modeling & forecasting", importance: "required" },
      {
        skill: "Excel (advanced — financial models & dashboards)",
        importance: "required",
      },
      { skill: "GAAP accounting principles", importance: "required" },
      { skill: "Budgeting & variance analysis", importance: "required" },
      { skill: "Financial reporting & presentations", importance: "required" },
      {
        skill: "ERP systems (SAP / Oracle / NetSuite)",
        importance: "nice-to-have",
      },
      { skill: "SQL for data queries", importance: "nice-to-have" },
      {
        skill: "CPA or CMA (in progress)",
        importance: "nice-to-have",
      },
      { skill: "Power BI / Tableau for financial dashboards", importance: "nice-to-have" },
    ],
  },
  {
    id: "financial-advisor",
    title: "Financial Advisor",
    templateId: "finance",
    qualifications: [
      {
        skill: "Financial planning concepts (budgeting, investing, retirement)",
        importance: "required",
      },
      {
        skill: "Investment products (stocks, bonds, mutual funds, ETFs)",
        importance: "required",
      },
      { skill: "Client communication & relationship management", importance: "required" },
      { skill: "Excel for financial projections", importance: "required" },
      {
        skill: "FINRA Series 7 / Series 66 licensing knowledge",
        importance: "required",
      },
      {
        skill: "CFP (Certified Financial Planner) coursework",
        importance: "nice-to-have",
      },
      { skill: "CRM software (Salesforce / Redtail)", importance: "nice-to-have" },
      { skill: "Tax planning basics", importance: "nice-to-have" },
      { skill: "Portfolio management tools", importance: "nice-to-have" },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  //  TEMPLATE: marketing
  // ─────────────────────────────────────────────────────────────
  {
    id: "marketing-coordinator",
    title: "Marketing Coordinator",
    templateId: "marketing",
    qualifications: [
      { skill: "Social media platforms (Instagram, LinkedIn, TikTok, X)", importance: "required" },
      { skill: "Content creation & copywriting", importance: "required" },
      { skill: "Email marketing tools (Mailchimp / HubSpot)", importance: "required" },
      { skill: "Microsoft Office & Google Suite", importance: "required" },
      { skill: "Project management & organization", importance: "required" },
      { skill: "Adobe Creative Suite basics / Canva", importance: "nice-to-have" },
      { skill: "Google Analytics basics", importance: "nice-to-have" },
      { skill: "SEO fundamentals", importance: "nice-to-have" },
      { skill: "CRM tools (HubSpot / Salesforce)", importance: "nice-to-have" },
    ],
  },
  {
    id: "digital-marketing-specialist",
    title: "Digital Marketing Specialist",
    templateId: "marketing",
    qualifications: [
      { skill: "Google Analytics 4 (GA4)", importance: "required" },
      { skill: "SEO / SEM fundamentals", importance: "required" },
      {
        skill: "Paid advertising (Meta Ads / Google Ads)",
        importance: "required",
      },
      { skill: "Content marketing strategy", importance: "required" },
      { skill: "Email marketing & automation", importance: "required" },
      { skill: "PPC campaign management & optimization", importance: "nice-to-have" },
      { skill: "HubSpot or Salesforce CRM", importance: "nice-to-have" },
      { skill: "A/B testing & conversion optimization", importance: "nice-to-have" },
      { skill: "HTML / CSS basics", importance: "nice-to-have" },
    ],
  },
  {
    id: "social-media-coordinator",
    title: "Social Media Coordinator",
    templateId: "marketing",
    qualifications: [
      {
        skill: "Social media platforms & algorithm awareness",
        importance: "required",
      },
      { skill: "Content creation & short-form copywriting", importance: "required" },
      { skill: "Scheduling tools (Buffer / Hootsuite / Later)", importance: "required" },
      { skill: "Analytics & performance reporting", importance: "required" },
      { skill: "Brand voice & consistency", importance: "required" },
      { skill: "Graphic design (Canva / Adobe Express)", importance: "nice-to-have" },
      { skill: "Short-form video editing (CapCut / Premiere)", importance: "nice-to-have" },
      { skill: "Influencer outreach basics", importance: "nice-to-have" },
      { skill: "Social listening tools (Brandwatch / Sprout)", importance: "nice-to-have" },
    ],
  },
  {
    id: "content-marketing-specialist",
    title: "Content Marketing Specialist",
    templateId: "marketing",
    qualifications: [
      { skill: "Writing & long-form copywriting", importance: "required" },
      { skill: "SEO & keyword research (Ahrefs / Semrush)", importance: "required" },
      {
        skill: "Content Management Systems (WordPress / Webflow)",
        importance: "required",
      },
      { skill: "Google Analytics & content performance metrics", importance: "required" },
      { skill: "Content calendar planning & management", importance: "required" },
      { skill: "HTML basics for CMS formatting", importance: "nice-to-have" },
      { skill: "Email automation (HubSpot / Klaviyo)", importance: "nice-to-have" },
      { skill: "Video / podcast production basics", importance: "nice-to-have" },
      { skill: "A/B testing content variations", importance: "nice-to-have" },
    ],
  },
  {
    id: "marketing-analyst",
    title: "Marketing Analyst",
    templateId: "marketing",
    qualifications: [
      { skill: "Data analysis (Excel / Google Sheets)", importance: "required" },
      { skill: "Google Analytics 4 (GA4)", importance: "required" },
      { skill: "Marketing KPIs & attribution models", importance: "required" },
      { skill: "SQL for data queries", importance: "required" },
      { skill: "Dashboard creation & reporting", importance: "required" },
      { skill: "Tableau / Power BI", importance: "nice-to-have" },
      { skill: "A/B testing methodology", importance: "nice-to-have" },
      { skill: "Python / R for marketing analytics", importance: "nice-to-have" },
      { skill: "CRM & marketing automation platforms", importance: "nice-to-have" },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  //  TEMPLATE: business-administration
  // ─────────────────────────────────────────────────────────────
  {
    id: "business-analyst",
    title: "Business Analyst",
    templateId: "business-administration",
    qualifications: [
      {
        skill: "Requirements gathering & documentation",
        importance: "required",
      },
      { skill: "Excel (advanced data analysis & modeling)", importance: "required" },
      { skill: "Process mapping (flowcharts / swimlane diagrams)", importance: "required" },
      { skill: "SQL basics for data querying", importance: "required" },
      {
        skill: "Stakeholder communication & presentation",
        importance: "required",
      },
      {
        skill: "Project management tools (JIRA / Confluence / Asana)",
        importance: "nice-to-have",
      },
      { skill: "Business intelligence tools (Power BI / Tableau)", importance: "nice-to-have" },
      { skill: "Agile / Scrum methodology", importance: "nice-to-have" },
      { skill: "Visio / Lucidchart for process diagrams", importance: "nice-to-have" },
    ],
  },
  {
    id: "operations-analyst",
    title: "Operations Analyst",
    templateId: "business-administration",
    qualifications: [
      {
        skill: "Data analysis (Excel / Google Sheets / SQL)",
        importance: "required",
      },
      { skill: "Process improvement & documentation", importance: "required" },
      { skill: "Operations metrics & KPIs", importance: "required" },
      { skill: "Project coordination & scheduling", importance: "required" },
      { skill: "Reporting & executive summaries", importance: "required" },
      { skill: "Lean / Six Sigma basics", importance: "nice-to-have" },
      { skill: "ERP systems (SAP / Oracle)", importance: "nice-to-have" },
      { skill: "Power BI / Tableau dashboards", importance: "nice-to-have" },
      { skill: "Project management certification (PMP / CAPM)", importance: "nice-to-have" },
    ],
  },
  {
    id: "human-resources-specialist",
    title: "Human Resources Specialist",
    templateId: "business-administration",
    qualifications: [
      {
        skill: "HR fundamentals (recruiting, onboarding, employee relations)",
        importance: "required",
      },
      {
        skill: "HRIS systems (Workday / ADP / BambooHR)",
        importance: "required",
      },
      { skill: "Employment law basics (FLSA, FMLA, EEO)", importance: "required" },
      { skill: "Communication & interpersonal skills", importance: "required" },
      { skill: "Microsoft Office / Google Suite", importance: "required" },
      {
        skill: "PHR certification (in progress)",
        importance: "nice-to-have",
      },
      {
        skill: "Applicant Tracking Systems (Greenhouse / Lever)",
        importance: "nice-to-have",
      },
      { skill: "Compensation & benefits administration", importance: "nice-to-have" },
      { skill: "Labor relations awareness", importance: "nice-to-have" },
    ],
  },
  {
    id: "sales-representative",
    title: "Sales Representative",
    templateId: "business-administration",
    qualifications: [
      {
        skill: "Customer relationship management & communication",
        importance: "required",
      },
      { skill: "Prospecting & outreach (cold calling / email)", importance: "required" },
      { skill: "CRM software (Salesforce basics)", importance: "required" },
      { skill: "Negotiation & closing skills", importance: "required" },
      { skill: "Product knowledge & value proposition", importance: "required" },
      {
        skill: "Sales methodologies (SPIN / Challenger / MEDDIC)",
        importance: "nice-to-have",
      },
      { skill: "HubSpot CRM & email automation", importance: "nice-to-have" },
      { skill: "B2B vs B2C sales experience", importance: "nice-to-have" },
      { skill: "LinkedIn Sales Navigator", importance: "nice-to-have" },
    ],
  },
  {
    id: "management-trainee",
    title: "Management Trainee",
    templateId: "business-administration",
    qualifications: [
      { skill: "Leadership potential & initiative", importance: "required" },
      { skill: "Communication & interpersonal skills", importance: "required" },
      { skill: "Problem-solving & critical thinking", importance: "required" },
      { skill: "Business fundamentals & operations awareness", importance: "required" },
      { skill: "Adaptability & learning agility", importance: "required" },
      { skill: "Project management basics", importance: "nice-to-have" },
      { skill: "Data analysis (Excel / basic SQL)", importance: "nice-to-have" },
      { skill: "Customer service experience", importance: "nice-to-have" },
      { skill: "Industry-specific knowledge", importance: "nice-to-have" },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  //  TEMPLATE: accounting
  // ─────────────────────────────────────────────────────────────
  {
    id: "staff-accountant",
    title: "Staff Accountant",
    templateId: "accounting",
    qualifications: [
      { skill: "GAAP & accounting principles", importance: "required" },
      { skill: "Excel (formulas, pivot tables, reconciliations)", importance: "required" },
      {
        skill: "Accounts payable & receivable processing",
        importance: "required",
      },
      { skill: "Financial statement preparation", importance: "required" },
      { skill: "Bank & GL reconciliations", importance: "required" },
      { skill: "CPA exam (in progress)", importance: "nice-to-have" },
      {
        skill: "Accounting software (QuickBooks / NetSuite / SAP)",
        importance: "nice-to-have",
      },
      { skill: "Tax preparation basics", importance: "nice-to-have" },
      { skill: "Audit support experience", importance: "nice-to-have" },
    ],
  },
  {
    id: "audit-associate",
    title: "Audit Associate",
    templateId: "accounting",
    qualifications: [
      { skill: "GAAP & auditing standards (GAAS / PCAOB)", importance: "required" },
      { skill: "Financial statement analysis", importance: "required" },
      { skill: "Excel for audit workpapers", importance: "required" },
      { skill: "Attention to detail & accuracy", importance: "required" },
      { skill: "Risk assessment & internal controls awareness", importance: "required" },
      { skill: "CPA exam (in progress)", importance: "nice-to-have" },
      { skill: "Public accounting internship experience", importance: "nice-to-have" },
      {
        skill: "Audit analytics software (ACL / IDEA / Alteryx)",
        importance: "nice-to-have",
      },
      { skill: "SOX compliance basics", importance: "nice-to-have" },
    ],
  },
  {
    id: "tax-associate",
    title: "Tax Associate",
    templateId: "accounting",
    qualifications: [
      { skill: "Federal & state tax law fundamentals", importance: "required" },
      {
        skill: "Tax preparation software (ProConnect / UltraTax / CCH)",
        importance: "required",
      },
      { skill: "Excel for tax schedules & analysis", importance: "required" },
      { skill: "GAAP accounting principles", importance: "required" },
      { skill: "Attention to detail & deadline management", importance: "required" },
      { skill: "CPA exam (in progress)", importance: "nice-to-have" },
      { skill: "Corporate / partnership tax knowledge", importance: "nice-to-have" },
      { skill: "International tax basics", importance: "nice-to-have" },
      { skill: "Tax research skills (BNA / RIA Checkpoint)", importance: "nice-to-have" },
    ],
  },
  {
    id: "accounts-payable-analyst",
    title: "Accounts Payable Analyst",
    templateId: "accounting",
    qualifications: [
      { skill: "Accounts payable processes & workflows", importance: "required" },
      { skill: "Excel (data entry, reconciliations, formulas)", importance: "required" },
      {
        skill: "ERP / accounting software (SAP / Oracle / QuickBooks)",
        importance: "required",
      },
      { skill: "Invoice processing & 3-way matching", importance: "required" },
      { skill: "Account reconciliations", importance: "required" },
      { skill: "AP automation tools (Concur / Coupa)", importance: "nice-to-have" },
      { skill: "Month-end close support", importance: "nice-to-have" },
      { skill: "Vendor relationship management", importance: "nice-to-have" },
      { skill: "GAAP basics", importance: "nice-to-have" },
    ],
  },
  {
    id: "financial-analyst-accounting",
    title: "Financial Analyst",
    templateId: "accounting",
    qualifications: [
      {
        skill: "Excel (financial modeling, pivot tables, VLOOKUP)",
        importance: "required",
      },
      {
        skill: "Financial statements & accounting fundamentals (GAAP)",
        importance: "required",
      },
      { skill: "Budgeting, forecasting & variance analysis", importance: "required" },
      { skill: "Financial reporting & executive presentations", importance: "required" },
      { skill: "Data analysis & attention to detail", importance: "required" },
      { skill: "CPA or CMA (in progress)", importance: "nice-to-have" },
      {
        skill: "ERP systems (SAP / Oracle / NetSuite)",
        importance: "nice-to-have",
      },
      { skill: "SQL for financial data queries", importance: "nice-to-have" },
      { skill: "Power BI / Tableau for financial dashboards", importance: "nice-to-have" },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  //  TEMPLATE: graphic-design
  // ─────────────────────────────────────────────────────────────
  {
    id: "graphic-designer",
    title: "Graphic Designer",
    templateId: "graphic-design",
    qualifications: [
      {
        skill: "Adobe Creative Suite (Photoshop / Illustrator / InDesign)",
        importance: "required",
      },
      { skill: "Typography & color theory", importance: "required" },
      { skill: "Brand identity & logo design", importance: "required" },
      { skill: "Layout & visual composition", importance: "required" },
      { skill: "Portfolio of design work", importance: "required" },
      { skill: "Figma / Sketch for digital design", importance: "nice-to-have" },
      {
        skill: "Motion graphics (After Effects / Premiere)",
        importance: "nice-to-have",
      },
      { skill: "Print production & pre-press knowledge", importance: "nice-to-have" },
      { skill: "UX / UI design basics", importance: "nice-to-have" },
    ],
  },
  {
    id: "brand-designer",
    title: "Brand Designer",
    templateId: "graphic-design",
    qualifications: [
      {
        skill: "Adobe Creative Suite (Illustrator / Photoshop / InDesign)",
        importance: "required",
      },
      { skill: "Brand identity systems & style guides", importance: "required" },
      { skill: "Typography & color theory", importance: "required" },
      { skill: "Logo design & visual identity", importance: "required" },
      { skill: "Portfolio of brand projects", importance: "required" },
      { skill: "Figma for digital brand assets", importance: "nice-to-have" },
      { skill: "Motion & animated brand assets", importance: "nice-to-have" },
      { skill: "Market & competitor research", importance: "nice-to-have" },
      { skill: "Print production & packaging awareness", importance: "nice-to-have" },
    ],
  },
  {
    id: "visual-designer",
    title: "Visual Designer",
    templateId: "graphic-design",
    qualifications: [
      {
        skill: "Adobe Creative Suite (Photoshop / Illustrator)",
        importance: "required",
      },
      {
        skill: "Design principles (composition, hierarchy, color, contrast)",
        importance: "required",
      },
      { skill: "Digital asset creation (web & social media)", importance: "required" },
      { skill: "Attention to detail & pixel-perfect accuracy", importance: "required" },
      { skill: "Portfolio of visual work", importance: "required" },
      { skill: "Figma / Sketch", importance: "nice-to-have" },
      { skill: "Motion graphics (After Effects basics)", importance: "nice-to-have" },
      { skill: "UI / UX basics", importance: "nice-to-have" },
      { skill: "Photography / photo editing", importance: "nice-to-have" },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  //  TEMPLATE: ux-ui-design
  // ─────────────────────────────────────────────────────────────
  {
    id: "ux-designer",
    title: "UX Designer",
    templateId: "ux-ui-design",
    qualifications: [
      {
        skill: "User research methods (interviews, surveys, contextual inquiry)",
        importance: "required",
      },
      {
        skill: "Wireframing & prototyping (Figma)",
        importance: "required",
      },
      { skill: "Usability testing & analysis", importance: "required" },
      { skill: "Information architecture & user flows", importance: "required" },
      { skill: "Portfolio with UX case studies", importance: "required" },
      { skill: "HTML / CSS basics", importance: "nice-to-have" },
      {
        skill: "Design systems & component libraries",
        importance: "nice-to-have",
      },
      { skill: "Accessibility (WCAG 2.1 standards)", importance: "nice-to-have" },
      { skill: "Quantitative data analysis", importance: "nice-to-have" },
    ],
  },
  {
    id: "product-designer",
    title: "Product Designer",
    templateId: "ux-ui-design",
    qualifications: [
      {
        skill: "Figma (end-to-end product design & prototyping)",
        importance: "required",
      },
      { skill: "User research & usability testing", importance: "required" },
      { skill: "Interaction design & micro-animations", importance: "required" },
      {
        skill: "Cross-functional collaboration (with engineering & PM)",
        importance: "required",
      },
      { skill: "Portfolio with product design case studies", importance: "required" },
      {
        skill: "Design systems & token-based design",
        importance: "nice-to-have",
      },
      { skill: "Motion / transition design", importance: "nice-to-have" },
      { skill: "SQL / analytics basics (Mixpanel / Amplitude)", importance: "nice-to-have" },
      { skill: "Accessibility design standards", importance: "nice-to-have" },
    ],
  },
  {
    id: "ui-designer",
    title: "UI Designer",
    templateId: "ux-ui-design",
    qualifications: [
      { skill: "Figma or Sketch (UI design & components)", importance: "required" },
      {
        skill: "Visual design principles (hierarchy, spacing, color, typography)",
        importance: "required",
      },
      {
        skill: "Component & design system creation",
        importance: "required",
      },
      { skill: "Responsive & mobile-first design", importance: "required" },
      { skill: "Portfolio of UI work", importance: "required" },
      { skill: "HTML / CSS basics", importance: "nice-to-have" },
      { skill: "Motion / micro-interaction design", importance: "nice-to-have" },
      { skill: "Accessibility (WCAG) compliance", importance: "nice-to-have" },
      { skill: "User testing for visual iterations", importance: "nice-to-have" },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  //  TEMPLATE: nursing
  // ─────────────────────────────────────────────────────────────
  {
    id: "registered-nurse",
    title: "Registered Nurse",
    templateId: "nursing",
    qualifications: [
      { skill: "NCLEX-RN license", importance: "required" },
      { skill: "Patient assessment & vital signs monitoring", importance: "required" },
      { skill: "Medication administration & safety (5 rights)", importance: "required" },
      { skill: "Electronic Health Records (EHR — Epic / Cerner)", importance: "required" },
      { skill: "BLS / CPR certification", importance: "required" },
      { skill: "ACLS certification", importance: "nice-to-have" },
      { skill: "Clinical specialty exposure (med-surg, ICU, etc.)", importance: "nice-to-have" },
      { skill: "IV therapy & venipuncture", importance: "nice-to-have" },
      { skill: "Patient & family education", importance: "nice-to-have" },
    ],
  },
  {
    id: "medical-surgical-nurse",
    title: "Medical-Surgical Nurse",
    templateId: "nursing",
    qualifications: [
      { skill: "NCLEX-RN license", importance: "required" },
      { skill: "Post-operative & surgical patient care", importance: "required" },
      { skill: "Medication administration & reconciliation", importance: "required" },
      { skill: "Patient assessment (head-to-toe)", importance: "required" },
      { skill: "EHR documentation (Epic / Meditech)", importance: "required" },
      { skill: "Med-Surg Certification (CMSRN)", importance: "nice-to-have" },
      { skill: "IV / central line management", importance: "nice-to-have" },
      { skill: "Wound care & drain management", importance: "nice-to-have" },
      { skill: "BLS / ACLS certification", importance: "nice-to-have" },
    ],
  },
  {
    id: "critical-care-nurse",
    title: "Critical Care Nurse",
    templateId: "nursing",
    qualifications: [
      { skill: "NCLEX-RN license", importance: "required" },
      { skill: "ACLS certification", importance: "required" },
      { skill: "Hemodynamic monitoring (arterial lines, Swan-Ganz)", importance: "required" },
      { skill: "Mechanical ventilator management basics", importance: "required" },
      { skill: "Critical patient assessment & rapid response", importance: "required" },
      {
        skill: "CCRN certification (in progress)",
        importance: "nice-to-have",
      },
      { skill: "Vasopressor & drip management", importance: "nice-to-have" },
      { skill: "CRRT / dialysis awareness", importance: "nice-to-have" },
      { skill: "BLS instructor certification", importance: "nice-to-have" },
    ],
  },
  {
    id: "emergency-department-nurse",
    title: "Emergency Department Nurse",
    templateId: "nursing",
    qualifications: [
      { skill: "NCLEX-RN license", importance: "required" },
      { skill: "Triage assessment & priority setting", importance: "required" },
      { skill: "ACLS & TNCC (Trauma Nursing Core Course)", importance: "required" },
      {
        skill: "Fast-paced clinical decision-making",
        importance: "required",
      },
      { skill: "EHR documentation under time pressure", importance: "required" },
      {
        skill: "CEN (Certified Emergency Nurse) certification",
        importance: "nice-to-have",
      },
      { skill: "PALS (Pediatric Advanced Life Support)", importance: "nice-to-have" },
      { skill: "Trauma & mass casualty response", importance: "nice-to-have" },
      { skill: "Bilingual / Spanish language", importance: "nice-to-have" },
    ],
  },
  {
    id: "pediatric-nurse",
    title: "Pediatric Nurse",
    templateId: "nursing",
    qualifications: [
      { skill: "NCLEX-RN license", importance: "required" },
      {
        skill: "Pediatric patient assessment & age-specific care",
        importance: "required",
      },
      { skill: "Child developmental milestones knowledge", importance: "required" },
      { skill: "Family-centered care approach", importance: "required" },
      { skill: "EHR documentation (Epic / Cerner)", importance: "required" },
      {
        skill: "CPN (Certified Pediatric Nurse) certification",
        importance: "nice-to-have",
      },
      { skill: "PALS certification", importance: "nice-to-have" },
      { skill: "Weight-based pediatric medication calculation", importance: "nice-to-have" },
      { skill: "Child life specialist collaboration", importance: "nice-to-have" },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  //  TEMPLATE: pre-med
  // ─────────────────────────────────────────────────────────────
  {
    id: "medical-scribe",
    title: "Medical Scribe",
    templateId: "pre-med",
    qualifications: [
      { skill: "Medical terminology & abbreviations", importance: "required" },
      {
        skill: "EHR documentation (Epic / Dragon / eClinicalWorks)",
        importance: "required",
      },
      { skill: "Physician shadowing & clinical exposure", importance: "required" },
      { skill: "HIPAA compliance & patient privacy", importance: "required" },
      { skill: "Typing speed & accuracy (50+ WPM)", importance: "required" },
      { skill: "Strong pre-med GPA", importance: "nice-to-have" },
      { skill: "Anatomy & physiology coursework", importance: "nice-to-have" },
      { skill: "ICD-10 / CPT medical coding basics", importance: "nice-to-have" },
      { skill: "Spanish / bilingual communication", importance: "nice-to-have" },
    ],
  },
  {
    id: "clinical-research-coordinator",
    title: "Clinical Research Coordinator",
    templateId: "pre-med",
    qualifications: [
      {
        skill: "GCP (Good Clinical Practice) training",
        importance: "required",
      },
      {
        skill: "Clinical trial protocol compliance & SOP adherence",
        importance: "required",
      },
      { skill: "Data collection, entry & source document verification", importance: "required" },
      { skill: "IRB & regulatory documentation", importance: "required" },
      { skill: "Patient recruitment & informed consent", importance: "required" },
      {
        skill: "CCRP certification (in progress)",
        importance: "nice-to-have",
      },
      {
        skill: "REDCap / clinical database tools",
        importance: "nice-to-have",
      },
      { skill: "Biostatistics basics", importance: "nice-to-have" },
      { skill: "Pre-med / health sciences coursework", importance: "nice-to-have" },
    ],
  },
  {
    id: "research-assistant",
    title: "Research Assistant",
    templateId: "pre-med",
    qualifications: [
      {
        skill: "Lab techniques (pipetting, PCR, cell culture, gel electrophoresis)",
        importance: "required",
      },
      { skill: "Data collection, recording & integrity", importance: "required" },
      { skill: "Lab safety & chemical handling protocols", importance: "required" },
      { skill: "Scientific writing & note-taking", importance: "required" },
      { skill: "Attention to detail & reproducibility", importance: "required" },
      {
        skill: "Statistical analysis (R / SPSS / GraphPad)",
        importance: "nice-to-have",
      },
      { skill: "Literature review & PubMed searches", importance: "nice-to-have" },
      { skill: "Conference poster / presentation experience", importance: "nice-to-have" },
      { skill: "Grant writing support basics", importance: "nice-to-have" },
    ],
  },
  {
    id: "emergency-medical-technician",
    title: "Emergency Medical Technician",
    templateId: "pre-med",
    qualifications: [
      { skill: "NREMT-B (EMT-Basic) certification", importance: "required" },
      { skill: "CPR / BLS certification", importance: "required" },
      { skill: "Patient assessment (primary & secondary survey)", importance: "required" },
      { skill: "Emergency protocols & protocols compliance", importance: "required" },
      { skill: "Team communication & radio procedures", importance: "required" },
      {
        skill: "AEMT or Paramedic coursework (in progress)",
        importance: "nice-to-have",
      },
      { skill: "Trauma management & splinting", importance: "nice-to-have" },
      { skill: "Physical fitness & ability to lift patients", importance: "nice-to-have" },
      { skill: "Spanish / bilingual communication", importance: "nice-to-have" },
    ],
  },
  {
    id: "patient-care-technician",
    title: "Patient Care Technician",
    templateId: "pre-med",
    qualifications: [
      { skill: "CPR / BLS certification", importance: "required" },
      { skill: "Vital signs monitoring & documentation", importance: "required" },
      { skill: "Patient hygiene, mobility & positioning assistance", importance: "required" },
      { skill: "EHR documentation basics", importance: "required" },
      { skill: "HIPAA compliance & patient confidentiality", importance: "required" },
      { skill: "CNA (Certified Nursing Assistant) certification", importance: "nice-to-have" },
      { skill: "Phlebotomy basics", importance: "nice-to-have" },
      { skill: "EKG / telemetry monitoring", importance: "nice-to-have" },
      { skill: "Prior inpatient hospital experience", importance: "nice-to-have" },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  //  TEMPLATE: education
  // ─────────────────────────────────────────────────────────────
  {
    id: "elementary-school-teacher",
    title: "Elementary School Teacher",
    templateId: "education",
    qualifications: [
      {
        skill: "State teaching license / certification (Elementary Ed)",
        importance: "required",
      },
      { skill: "Lesson planning & curriculum alignment", importance: "required" },
      { skill: "Classroom management strategies", importance: "required" },
      { skill: "Child development knowledge (K–5)", importance: "required" },
      {
        skill: "Differentiated instruction for diverse learners",
        importance: "required",
      },
      {
        skill: "EdTech tools (Google Classroom / Seesaw / Canvas)",
        importance: "nice-to-have",
      },
      {
        skill: "Special education / IEP collaboration basics",
        importance: "nice-to-have",
      },
      { skill: "Parent communication & family engagement", importance: "nice-to-have" },
      { skill: "Bilingual / ESL instruction", importance: "nice-to-have" },
    ],
  },
  {
    id: "high-school-teacher",
    title: "High School Teacher",
    templateId: "education",
    qualifications: [
      {
        skill: "State teaching license / subject-area certification",
        importance: "required",
      },
      {
        skill: "Curriculum development & standards alignment",
        importance: "required",
      },
      { skill: "Classroom management (9–12)", importance: "required" },
      { skill: "Subject matter expertise", importance: "required" },
      { skill: "Assessment design & grading", importance: "required" },
      {
        skill: "Advanced coursework facilitation (AP / IB / Dual Enrollment)",
        importance: "nice-to-have",
      },
      {
        skill: "EdTech integration (Google Classroom / Canvas / Schoology)",
        importance: "nice-to-have",
      },
      { skill: "Social-emotional learning (SEL) practices", importance: "nice-to-have" },
      { skill: "Coaching / extracurricular leadership", importance: "nice-to-have" },
    ],
  },
];

export function getRoleData(
  templateKey: string | null | undefined,
  roleTitle: string | null | undefined,
): RoleData | undefined {
  if (!templateKey || !roleTitle) {
    return undefined;
  }

  const templateId = resolveTemplateId(templateKey);
  if (!templateId) {
    return undefined;
  }

  return roleData.find(
    (role) => role.templateId === templateId && role.title === roleTitle,
  );
}

export function getRoleQualificationsByImportance(
  qualifications: Qualification[],
) {
  return {
    required: qualifications.filter(
      (qualification) => qualification.importance === "required",
    ),
    niceToHave: qualifications.filter(
      (qualification) => qualification.importance === "nice-to-have",
    ),
  };
}
