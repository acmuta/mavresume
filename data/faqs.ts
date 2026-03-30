export type FAQCategory = "builder" | "review";

export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  keywords: string[];
}

export const builderFaqs: FAQItem[] = [
  {
    id: "builder-role-guidance",
    category: "builder",
    question: "How do I know what my target role is looking for on a resume?",
    answer:
      "Open Resume Help in the bottom-right of the builder, then go to Role and Qualifications. That tab shows required and nice-to-have qualifications based on the role you selected when creating your resume.",
    keywords: ["role", "qualifications", "help", "requirements"],
  },
  {
    id: "builder-template-or-custom",
    category: "builder",
    question: "Can I create a resume from a major template or start fully custom?",
    answer:
      "Yes. The Templates page supports major-specific templates and a fully custom path, so you can choose between a guided starting structure or your own section setup.",
    keywords: ["template", "custom", "start", "major"],
  },
  {
    id: "builder-choose-role",
    category: "builder",
    question: "How do I choose the role my resume is targeting?",
    answer:
      "When you create a new resume from a template, the create modal asks for a target role before you continue. That role is then used to personalize your builder guidance and role-based tips.",
    keywords: ["target role", "create resume", "modal"],
  },
  {
    id: "builder-section-management",
    category: "builder",
    question: "Can I change which sections are included in my resume?",
    answer:
      "Yes. Use Manage Sections to add, remove, and reorder sections at any time. Personal Info is fixed at the top, while the rest can be arranged around your resume strategy.",
    keywords: ["sections", "reorder", "manage sections", "add", "remove"],
  },
  {
    id: "builder-live-preview",
    category: "builder",
    question: "How can I preview what my resume looks like while editing?",
    answer:
      "The builder includes a live preview that updates as you edit your content. On mobile, you can open the same preview using the Preview button in the header drawer.",
    keywords: ["preview", "live", "mobile", "header"],
  },
  {
    id: "builder-format-settings",
    category: "builder",
    question: "Can I adjust formatting like font, spacing, and margins for one resume?",
    answer:
      "Yes. Open Resume Settings from the preview controls to change typography and layout settings for that specific resume. Your changes are applied and saved with that resume only.",
    keywords: ["format", "font", "spacing", "margins", "settings"],
  },
  {
    id: "builder-page-limit",
    category: "builder",
    question: "How do I know if my resume is getting too long for one page?",
    answer:
      "The preview shows a page-fill warning when content gets close to or exceeds the page boundary. Use that signal to trim or reorganize before you download or submit.",
    keywords: ["one page", "overflow", "page fill", "warning"],
  },
  {
    id: "builder-autosave",
    category: "builder",
    question: "Does the builder save my work automatically?",
    answer:
      "Yes. Auto-save runs while you edit and the header shows status updates like Saving, Saved, or Save failed. You can keep working without manually saving between edits.",
    keywords: ["autosave", "saved", "saving", "status"],
  },
  {
    id: "builder-single-refine",
    category: "builder",
    question: "How does AI bullet refinement work for a single bullet?",
    answer:
      "Click Refine beside a bullet to generate a stronger rewrite. You can review the suggestion first and then accept or decline it before replacing your original text.",
    keywords: ["ai", "refine", "bullet", "accept", "decline"],
  },
  {
    id: "builder-refine-all",
    category: "builder",
    question: "Can I refine all bullets in an entry at once?",
    answer:
      "Yes. Refine All batch-processes non-empty bullets and opens a review overlay. You can approve items individually or apply all accepted refinements at once.",
    keywords: ["refine all", "batch", "overlay"],
  },
];

export const reviewFaqs: FAQItem[] = [
  {
    id: "review-rate-limit",
    category: "review",
    question: "Why does AI refinement sometimes stop working or show limits?",
    answer:
      "Refinement requests are rate-limited, and your remaining credits plus reset timing appear in the header. If you reach the limit, wait for reset or continue manual editing until credits return.",
    keywords: ["rate limit", "remaining", "reset", "refinement"],
  },
  {
    id: "review-submit-from-builder",
    category: "review",
    question: "How do I submit my builder resume for review?",
    answer:
      "Click Submit for Review in the builder, set priority, and optionally add notes. The app generates and uploads your current builder PDF before creating the review request.",
    keywords: ["submit", "builder", "priority", "notes", "pdf"],
  },
  {
    id: "review-submit-from-dashboard",
    category: "review",
    question: "Can I submit a review request from the dashboard instead of the builder?",
    answer:
      "Yes. Use New Review on the dashboard to upload a PDF and submit a request with priority and reviewer context.",
    keywords: ["dashboard", "new review", "upload"],
  },
  {
    id: "review-upload-limits",
    category: "review",
    question: "What files can I upload for review requests?",
    answer:
      "Review uploads accept PDF files only, up to 10MB. If the file type or size is invalid, the uploader shows an error so you can retry with a valid file.",
    keywords: ["upload", "pdf", "10mb", "file size"],
  },
  {
    id: "review-track-status",
    category: "review",
    question: "How do I track the status of my submitted review requests?",
    answer:
      "Your dashboard review table shows status labels such as Pending Review, In Review, and Completed. These update as reviewers claim and finish requests.",
    keywords: ["status", "pending", "in review", "completed", "track"],
  },
  {
    id: "review-when-visible",
    category: "review",
    question: "Why can’t I view annotations immediately after submitting a review?",
    answer:
      "Students can access the annotated workspace after the review is completed. Until then, the system keeps the request in progress and withholds annotation visibility.",
    keywords: ["annotations", "visibility", "completed", "student"],
  },
  {
    id: "review-claim-flow",
    category: "review",
    question: "How do reviewers pick up new requests?",
    answer:
      "Reviewers use the Reviewer Dashboard and click Accept Review on pending submissions. Claimed requests move into the reviewer’s active queue for annotation.",
    keywords: ["reviewer", "queue", "accept review", "pending"],
  },
  {
    id: "review-annotation-creation",
    category: "review",
    question: "How do annotations work in the review workspace?",
    answer:
      "Reviewers can select text to annotate or hold Alt and drag to create area comments. Each note is saved and listed in the sidebar so it can be revisited quickly.",
    keywords: ["annotation", "alt", "sidebar", "pdf"],
  },
  {
    id: "review-annotation-editing",
    category: "review",
    question: "Can reviewers edit or remove annotations after creating them?",
    answer:
      "Yes. Annotation popups support editing and deletion for comments created by the reviewer. The sidebar also includes jump links to return to each annotation location.",
    keywords: ["edit", "delete", "annotation popup", "jump"],
  },
  {
    id: "review-complete-and-feedback",
    category: "review",
    question: "How is a review finalized, and where does the student see feedback?",
    answer:
      "Reviewers must provide an overall summary before completing a review. After completion, students can open the review to view the final feedback and annotation results.",
    keywords: ["complete review", "summary", "feedback", "student"],
  },
];

export const allFaqs: FAQItem[] = [...builderFaqs, ...reviewFaqs];
