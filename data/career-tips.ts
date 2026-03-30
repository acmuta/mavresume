export type CareerTipCategory =
  | "Resume Strategy"
  | "Interview Strategy"
  | "Career Positioning"
  | "Recruiting Mechanics"
  | "Networking Tactics";

export interface CareerTip {
  id: string;
  category: CareerTipCategory;
  tip: string;
  explanation: string;
  source: string;
  sourceUrl: string;
}

export const careerTips: CareerTip[] = [
  {
    id: "paired-credentials",
    category: "Resume Strategy",
    tip: "Mirror both credential formats (for example, \"Registered Nurse\" and \"RN\") in high-value sections.",
    explanation:
      "Some recruiter searches and ATS filters use one form or the other. Including both valid variants improves discoverability without changing meaning.",
    source: "Jobscan",
    sourceUrl: "https://www.jobscan.co/blog/jazzhr-ats-what-job-seekers-need-to-know/",
  },
  {
    id: "non-flattened-pdf",
    category: "Recruiting Mechanics",
    tip: "Use text-readable PDF or DOCX resumes, not flattened image-style PDFs.",
    explanation:
      "Flattened files can break parsing in some applicant systems, which means your content may be partially unreadable before a recruiter reviews it.",
    source: "Jobscan",
    sourceUrl: "https://www.jobscan.co/blog/jazzhr-ats-what-job-seekers-need-to-know/",
  },
  {
    id: "knockout-gates",
    category: "Recruiting Mechanics",
    tip: "Treat knockout questions as hard eligibility gates before you apply.",
    explanation:
      "Some workflows route candidates to non-advancing stages based on these responses. Pre-validating requirements saves time and protects your application quality.",
    source: "Jobscan",
    sourceUrl: "https://www.jobscan.co/blog/jazzhr-ats-what-job-seekers-need-to-know/",
  },
  {
    id: "employer-alignment-over-template",
    category: "Resume Strategy",
    tip: "Optimize to the target employer's workflow, not just generic resume best practices.",
    explanation:
      "A technically clean resume can still underperform if it is weakly aligned to role signals and tooling used by that specific hiring team.",
    source: "Jobscan",
    sourceUrl: "https://www.jobscan.co/blog/employer-centric-resume-coaching/",
  },
  {
    id: "signal-priority",
    category: "Resume Strategy",
    tip: "Prioritize high-weight job signals first, not every requirement equally.",
    explanation:
      "Some requirements influence screening and decision-making more than others. Leading with those high-priority signals improves relevance quickly.",
    source: "Jobscan",
    sourceUrl: "https://www.jobscan.co/blog/employer-centric-resume-coaching/",
  },
  {
    id: "single-storyline",
    category: "Career Positioning",
    tip: "Build one coherent expertise storyline instead of a broad list of everything you've touched.",
    explanation:
      "Algorithmic sourcing and recruiters both reward clarity. A focused capability narrative is easier to classify and trust than scattered skill piles.",
    source: "Jobscan",
    sourceUrl: "https://www.jobscan.co/blog/ai-changed-hidden-job-market/",
  },
  {
    id: "visibility-signals",
    category: "Career Positioning",
    tip: "Keep your profile \"warm\" with periodic proof-of-work updates, even when not applying.",
    explanation:
      "Recent achievements, projects, or certifications act as activity signals in sourcing systems and can improve your chance of being surfaced.",
    source: "Jobscan",
    sourceUrl: "https://www.jobscan.co/blog/ai-changed-hidden-job-market/",
  },
  {
    id: "evidence-over-title",
    category: "Resume Strategy",
    tip: "Use measurable evidence to support role claims instead of relying on title prestige.",
    explanation:
      "Modern screening and structured interviews increasingly favor demonstrated outcomes over status labels alone.",
    source: "Jobscan",
    sourceUrl: "https://www.jobscan.co/blog/ai-changed-hidden-job-market/",
  },
  {
    id: "semantic-alignment",
    category: "Resume Strategy",
    tip: "Match the role's semantic language patterns, not just isolated keywords.",
    explanation:
      "When job descriptions and resumes use aligned terminology and structure, both machine matching and recruiter interpretation become cleaner.",
    source: "Jobscan",
    sourceUrl: "https://www.jobscan.co/blog/ai-changed-hidden-job-market/",
  },
  {
    id: "referral-proof",
    category: "Networking Tactics",
    tip: "Pair referrals with role-specific evidence; referrals no longer bypass fit checks by default.",
    explanation:
      "Referred candidates are still evaluated for alignment. A strong referral works best when your materials clearly support the target role requirements.",
    source: "Jobscan",
    sourceUrl: "https://www.jobscan.co/blog/ai-changed-hidden-job-market/",
  },
  {
    id: "internal-okay-vs-great",
    category: "Interview Strategy",
    tip: "In internal interviews, ask what separates \"okay\" performance from \"great\" performance.",
    explanation:
      "This reveals hidden standards and helps you position examples toward the exact impact level the team values.",
    source: "Ask a Manager",
    sourceUrl: "https://www.askamanager.org/2025/11/what-questions-should-i-ask-in-an-internal-interview-with-people-i-already-work-with.html",
  },
  {
    id: "internal-six-month-impact",
    category: "Interview Strategy",
    tip: "Ask for the role's top six-month outcomes in internal moves.",
    explanation:
      "Teams often hire for near-term pain points. Knowing those priorities lets you reframe your examples around immediate business value.",
    source: "Ask a Manager",
    sourceUrl: "https://www.askamanager.org/2025/11/what-questions-should-i-ask-in-an-internal-interview-with-people-i-already-work-with.html",
  },
  {
    id: "internal-explicit-evidence",
    category: "Interview Strategy",
    tip: "In internal interviews, present your achievements explicitly as if interviewers do not know your work.",
    explanation:
      "Interview panels may forget details, have incomplete context, or be constrained to what is documented in the interview process.",
    source: "Ask a Manager",
    sourceUrl: "https://www.askamanager.org/2025/11/what-questions-should-i-ask-in-an-internal-interview-with-people-i-already-work-with.html",
  },
  {
    id: "transition-risk-questions",
    category: "Interview Strategy",
    tip: "For internal moves, ask transition-risk questions (handoff timing, KPI changes, process shifts).",
    explanation:
      "These details can materially affect success in the first 90 days and show strategic thinking beyond title progression.",
    source: "Ask a Manager",
    sourceUrl: "https://www.askamanager.org/2025/11/what-questions-should-i-ask-in-an-internal-interview-with-people-i-already-work-with.html",
  },
  {
    id: "lived-experience-prompts",
    category: "Interview Strategy",
    tip: "Steer answers toward lived-experience detail: what you did, why, tradeoffs, and what changed after.",
    explanation:
      "Highly polished generic responses are easier to produce than concrete decision stories. Nuance and tradeoffs signal authentic depth.",
    source: "Greenhouse",
    sourceUrl: "https://www.greenhouse.com/blog/interviewing-in-the-age-of-ai",
  },
  {
    id: "outcomes-over-delivery",
    category: "Interview Strategy",
    tip: "In interviews, optimize for outcome proof, role scope, and stakeholder complexity before delivery polish.",
    explanation:
      "Strong delivery helps, but structured evaluation tends to favor evidence of impact, decision quality, and collaboration footprint.",
    source: "Greenhouse",
    sourceUrl: "https://www.greenhouse.com/blog/interviewing-in-the-age-of-ai",
  },
  {
    id: "collaboration-micro-signals",
    category: "Interview Strategy",
    tip: "Use clarifying questions during interviews to show collaborative reasoning in real time.",
    explanation:
      "Adaptation in conversation is a high-signal behavior that demonstrates how you will partner cross-functionally under ambiguity.",
    source: "Greenhouse",
    sourceUrl: "https://www.greenhouse.com/blog/interviewing-in-the-age-of-ai",
  },
  {
    id: "ai-boundaries",
    category: "Interview Strategy",
    tip: "Use AI for preparation, but avoid dependence during live responses.",
    explanation:
      "Interview processes increasingly look for authenticity and judgment signals that come through unscripted, role-specific reasoning.",
    source: "Greenhouse",
    sourceUrl: "https://www.greenhouse.com/blog/interviewing-in-the-age-of-ai",
  },
  {
    id: "headline-metadata",
    category: "Career Positioning",
    tip: "Treat your LinkedIn headline as searchable metadata, not a status update.",
    explanation:
      "Role, specialty, and impact terms in headline space can improve discoverability in recruiter searches more than generic language.",
    source: "Jobscan",
    sourceUrl: "https://www.jobscan.co/blog/impactful-linkedin-headline-examples/",
  },
  {
    id: "avoid-empty-headline-terms",
    category: "Career Positioning",
    tip: "Remove low-signal headline terms like \"hard worker\" and replace them with role-specific value claims.",
    explanation:
      "Generic descriptors rarely differentiate candidates. Concrete role language and outcomes communicate value with higher precision.",
    source: "Jobscan",
    sourceUrl: "https://www.jobscan.co/blog/impactful-linkedin-headline-examples/",
  },
  {
    id: "cross-platform-consistency",
    category: "Career Positioning",
    tip: "Keep your resume and LinkedIn positioning consistent to reduce fit ambiguity.",
    explanation:
      "Mixed positioning signals can lower confidence in your target role readiness. Consistency strengthens your professional narrative.",
    source: "Jobscan",
    sourceUrl: "https://www.jobscan.co/blog/ai-changed-hidden-job-market/",
  },
  {
    id: "career-pivot-bridge",
    category: "Career Positioning",
    tip: "For pivots, lead with bridge logic: translate past-domain wins into target-role outcomes.",
    explanation:
      "Hiring teams respond better to transferable value framing than to disconnected chronology when evaluating career transitions.",
    source: "The Muse",
    sourceUrl: "https://www.themuse.com/advice/interview-questions-and-answers",
  },
  {
    id: "vertical-specialization-frontload",
    category: "Resume Strategy",
    tip: "Front-load your strongest vertical specialization early in profile and resume summaries.",
    explanation:
      "Early clarity helps both machine ranking and human triage by making your primary fit visible in seconds.",
    source: "Jobscan",
    sourceUrl: "https://www.jobscan.co/blog/ai-changed-hidden-job-market/",
  },
  {
    id: "claim-proof-pairing",
    category: "Resume Strategy",
    tip: "Pair every major capability claim with a compact proof marker (scope, metric, or business consequence).",
    explanation:
      "Claim-plus-proof writing lowers skepticism and improves signal quality during fast recruiter review and structured interview follow-up.",
    source: "Greenhouse",
    sourceUrl: "https://www.greenhouse.com/blog/interviewing-in-the-age-of-ai",
  },
  {
    id: "future-state-questions",
    category: "Interview Strategy",
    tip: "Ask future-state questions (roadmap changes, upcoming constraints) instead of only current-state duties.",
    explanation:
      "Future-focused questions expose strategic context and show that you are evaluating long-term role effectiveness, not just task fit.",
    source: "Ask a Manager",
    sourceUrl: "https://www.askamanager.org/2025/11/what-questions-should-i-ask-in-an-internal-interview-with-people-i-already-work-with.html",
  },
];
