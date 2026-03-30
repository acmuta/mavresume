/**
 * Input sanitization and validation for AI refinement endpoints.
 * Defends against prompt injection, token cost attacks, and malformed input.
 */

const MAX_BULLET_LENGTH = 500;
const MAX_TITLE_LENGTH = 100;
const MAX_TARGET_ROLE_LENGTH = 120;
const MAX_TECHNOLOGY_LENGTH = 50;
const MAX_TECHNOLOGIES_COUNT = 20;

/**
 * Strips control characters (except newline and tab) from a string.
 * Prevents injection of special characters that could manipulate LLM behavior.
 */
function stripControlCharacters(input: string): string {
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}

/**
 * Validates that a technology string contains only safe characters.
 * Allows alphanumeric, spaces, hyphens, periods, plus signs, hash, and slashes
 * (e.g., "C++", "Node.js", "C#", "ASP.NET/Core").
 */
function isValidTechnology(tech: string): boolean {
  return /^[a-zA-Z0-9\s\-\.\+#\/()]+$/.test(tech);
}

export interface SanitizedBulletInput {
  bulletText: string;
  context?: {
    title?: string;
    targetRole?: string;
    technologies?: string[];
  };
}

export interface ValidationError {
  error: string;
}

/**
 * Sanitizes and validates a single bullet text input.
 * Returns the sanitized string or null with an error message.
 */
export function sanitizeBulletText(
  bulletText: unknown
): { text: string } | { error: string } {
  if (!bulletText || typeof bulletText !== "string") {
    return { error: "bulletText is required and must be a string" };
  }

  let sanitized = bulletText.trim();
  sanitized = stripControlCharacters(sanitized);

  if (sanitized.length === 0) {
    return { error: "bulletText cannot be empty" };
  }

  if (sanitized.length > MAX_BULLET_LENGTH) {
    return {
      error: `bulletText exceeds maximum length of ${MAX_BULLET_LENGTH} characters`,
    };
  }

  return { text: sanitized };
}

/**
 * Sanitizes and validates context input (title and technologies).
 * Returns sanitized context or null with an error message.
 */
export function sanitizeContext(
  context: unknown
): {
  context: { title?: string; targetRole?: string; technologies?: string[] };
} | { error: string } {
  if (!context || typeof context !== "object") {
    return { context: {} };
  }

  const ctx = context as Record<string, unknown>;
  const sanitized: {
    title?: string;
    targetRole?: string;
    technologies?: string[];
  } = {};

  if (ctx.title !== undefined && ctx.title !== null) {
    if (typeof ctx.title !== "string") {
      return { error: "context.title must be a string" };
    }
    const title = stripControlCharacters(ctx.title.trim());
    if (title.length > MAX_TITLE_LENGTH) {
      return {
        error: `context.title exceeds maximum length of ${MAX_TITLE_LENGTH} characters`,
      };
    }
    if (title.length > 0) {
      sanitized.title = title;
    }
  }

  if (ctx.targetRole !== undefined && ctx.targetRole !== null) {
    if (typeof ctx.targetRole !== "string") {
      return { error: "context.targetRole must be a string" };
    }
    const targetRole = stripControlCharacters(ctx.targetRole.trim());
    if (targetRole.length > MAX_TARGET_ROLE_LENGTH) {
      return {
        error: `context.targetRole exceeds maximum length of ${MAX_TARGET_ROLE_LENGTH} characters`,
      };
    }
    if (targetRole.length > 0) {
      sanitized.targetRole = targetRole;
    }
  }

  if (ctx.technologies !== undefined && ctx.technologies !== null) {
    if (!Array.isArray(ctx.technologies)) {
      return { error: "context.technologies must be an array" };
    }
    if (ctx.technologies.length > MAX_TECHNOLOGIES_COUNT) {
      return {
        error: `context.technologies exceeds maximum of ${MAX_TECHNOLOGIES_COUNT} items`,
      };
    }

    const techs: string[] = [];
    for (const tech of ctx.technologies) {
      if (typeof tech !== "string") {
        return { error: "Each technology must be a string" };
      }
      const trimmed = stripControlCharacters(tech.trim());
      if (trimmed.length === 0) continue;
      if (trimmed.length > MAX_TECHNOLOGY_LENGTH) {
        return {
          error: `Technology "${trimmed.slice(0, 20)}..." exceeds maximum length of ${MAX_TECHNOLOGY_LENGTH} characters`,
        };
      }
      if (!isValidTechnology(trimmed)) {
        return {
          error: `Technology "${trimmed.slice(0, 20)}" contains invalid characters`,
        };
      }
      techs.push(trimmed);
    }
    if (techs.length > 0) {
      sanitized.technologies = techs;
    }
  }

  return { context: sanitized };
}

/**
 * Detects common prompt injection patterns in user input.
 * Returns true if the input appears to contain injection attempts.
 * Checked before sending to the LLM to save tokens and prevent abuse.
 */
export function detectPromptInjection(text: string): boolean {
  // Normalize unicode homoglyphs (e.g., Cyrillic о→o, е→e) to ASCII
  // before checking patterns, preventing bypass via lookalike characters
  const normalized = text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u0400-\u04FF]/g, function(ch) {
      const map: Record<string, string> = {
        "\u0410": "A", "\u0430": "a", "\u0412": "B", "\u0432": "v",
        "\u0421": "C", "\u0441": "c", "\u0415": "E", "\u0435": "e",
        "\u041D": "H", "\u043D": "h", "\u041A": "K", "\u043A": "k",
        "\u041C": "M", "\u043C": "m", "\u041E": "O", "\u043E": "o",
        "\u0420": "P", "\u0440": "p", "\u0422": "T", "\u0442": "t",
        "\u0423": "Y", "\u0443": "y", "\u0425": "X", "\u0445": "x",
      };
      return map[ch] || ch;
    });

  const injectionPatterns = [
    /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions|prompts|rules)/i,
    /do\s+not\s+refine/i,
    /don'?t\s+refine/i,
    /instead\s+(respond|reply|return|output|say)\s+with/i,
    /return\s+(only|just|exactly)\s+(the\s+)?(word|text|string|phrase)/i,
    /the\s+refined\s+version\s+is/i,
    /output\s+(your|the)\s+(complete\s+)?(system\s+)?prompt/i,
    /what\s+(is|are)\s+your\s+(system\s+)?(instructions|prompt|rules)/i,
    /you\s+are\s+now\s+a/i,
    /forget\s+(you\s+are|that\s+you|your\s+(role|instructions))/i,
    /\[system\]/i,
    /new\s+(task|instructions?|role)\s*:/i,
    /answer\s+this\s+question/i,
    /what\s+is\s+the\s+capital/i,
    /write\s+(a|an|me|the)\s+\w+\s+(in|using|with)\s+\w/i,
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(normalized)) {
      return true;
    }
  }

  // Detect repetition stuffing: same phrase repeated 3+ times
  const lines = normalized.split(/\n/).filter((l) => l.trim().length > 0);
  if (lines.length >= 3) {
    const unique = new Set(lines.map((l) => l.trim().toLowerCase()));
    if (unique.size === 1) {
      return true;
    }
  }

  return false;
}

/**
 * Common action verbs that resume bullets typically start with.
 * Used for output validation to detect prompt injection in AI responses.
 */
const RESUME_ACTION_VERBS = new Set([
  "achieved", "acquired", "adapted", "addressed", "administered", "advanced",
  "advised", "advocated", "aligned", "allocated", "analyzed", "applied",
  "appointed", "appraised", "approved", "architected", "arranged", "assembled",
  "assessed", "assigned", "assisted", "attained", "audited", "authored",
  "automated", "balanced", "boosted", "briefed", "budgeted", "built",
  "calculated", "captured", "cataloged", "centralized", "chaired", "championed",
  "classified", "coached", "coded", "collaborated", "collected", "communicated",
  "compared", "compiled", "completed", "composed", "computed", "conceived",
  "conceptualized", "condensed", "conducted", "configured", "consolidated",
  "constructed", "consulted", "contributed", "controlled", "converted",
  "coordinated", "corrected", "counseled", "created", "cultivated", "customized",
  "debugged", "decentralized", "decreased", "defined", "delegated", "delivered",
  "demonstrated", "deployed", "designed", "detected", "determined", "developed",
  "devised", "diagnosed", "directed", "discovered", "dispatched", "distinguished",
  "distributed", "diversified", "documented", "doubled", "drafted", "drove",
  "earned", "edited", "educated", "effected", "elevated", "eliminated",
  "enabled", "encouraged", "enforced", "engineered", "enhanced", "ensured",
  "established", "evaluated", "examined", "exceeded", "executed", "exercised",
  "expanded", "expedited", "experimented", "explained", "explored", "exported",
  "extended", "extracted", "fabricated", "facilitated", "finalized", "fixed",
  "forecasted", "formalized", "formulated", "fortified", "founded", "fulfilled",
  "gained", "gathered", "generated", "governed", "grew", "guided",
  "halved", "handled", "harmonized", "headed", "helped", "hired",
  "identified", "illustrated", "implemented", "improved", "improvised",
  "inaugurated", "incorporated", "increased", "indexed", "influenced", "informed",
  "initiated", "innovated", "inspected", "inspired", "installed", "instituted",
  "instructed", "integrated", "interpreted", "introduced", "invented",
  "investigated", "launched", "led", "leveraged", "liaised", "licensed",
  "lifted", "linked", "logged", "maintained", "managed", "mapped", "marketed",
  "mastered", "maximized", "measured", "mediated", "mentored", "merged",
  "migrated", "minimized", "mobilized", "modeled", "modernized", "modified",
  "monitored", "motivated", "navigated", "negotiated", "netted",
  "obtained", "onboarded", "operated", "optimized", "orchestrated", "ordered",
  "organized", "oriented", "originated", "outlined", "overcame", "overhauled",
  "oversaw", "partnered", "performed", "persuaded", "piloted", "pioneered",
  "planned", "positioned", "prepared", "presented", "presided", "prevented",
  "prioritized", "processed", "procured", "produced", "profiled", "programmed",
  "projected", "promoted", "proposed", "protected", "prototyped", "provided",
  "published", "purchased", "qualified", "quantified",
  "raised", "ranked", "realigned", "realized", "rebuilt", "received",
  "recognized", "recommended", "reconciled", "recruited", "redesigned",
  "reduced", "reengineered", "refined", "reformed", "regenerated", "registered",
  "regulated", "rehabilitated", "reinforced", "reinstated", "released",
  "remediated", "remodeled", "renegotiated", "renovated", "reorganized",
  "repaired", "replaced", "reported", "represented", "reproduced", "requested",
  "researched", "resolved", "responded", "restored", "restructured", "retained",
  "retrieved", "revamped", "reviewed", "revised", "revitalized", "revolutionized",
  "rewrote", "routed", "safeguarded", "saved", "scheduled", "screened",
  "secured", "selected", "served", "shaped", "simplified", "simulated",
  "slashed", "solicited", "solved", "sourced", "spearheaded", "specialized",
  "specified", "sponsored", "stabilized", "staffed", "standardized", "started",
  "steered", "stimulated", "strategized", "streamlined", "strengthened",
  "structured", "studied", "submitted", "succeeded", "summarized", "supervised",
  "supplemented", "supplied", "supported", "surpassed", "surveyed", "sustained",
  "synchronized", "synthesized", "systematized",
  "tabulated", "tailored", "targeted", "taught", "tested", "tracked",
  "traded", "trained", "transcribed", "transferred", "transformed", "translated",
  "transmitted", "tripled", "troubleshot", "turned",
  "uncovered", "underlined", "understudied", "unified", "united", "updated",
  "upgraded", "utilized", "validated", "valued", "verified", "visualized",
  "voiced", "volunteered", "widened", "won", "wrote",
]);

/**
 * Validates that an AI response looks like a legitimate resume bullet point.
 * Returns true if the response passes heuristic checks, false if it appears
 * to be a prompt injection result.
 *
 * Checks:
 * 1. Minimum length (at least 5 words)
 * 2. Starts with a common resume action verb (case-insensitive)
 * 3. Not a single word or short phrase that looks like injected output
 */
export function isValidBulletOutput(text: string): boolean {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/);

  // Too short to be a real bullet — likely injected single word/phrase
  if (words.length < 4) {
    return false;
  }

  // Check if first word is a common resume action verb
  const firstWord = words[0].replace(/[^a-zA-Z]/g, "").toLowerCase();
  if (!RESUME_ACTION_VERBS.has(firstWord)) {
    return false;
  }

  return true;
}

/**
 * Builds the user-facing prompt with XML delimiters to structurally separate
 * user data from instructions, mitigating prompt injection attacks.
 */
export function buildSafePrompt(
  bulletText: string,
  context?: { title?: string; targetRole?: string; technologies?: string[] }
): string {
  let contextBlock = "";
  if (context) {
    if (context.title) {
      contextBlock += `<context_title>${context.title}</context_title>\n`;
    }
    if (context.targetRole) {
      contextBlock += `<target_role>${context.targetRole}</target_role>\n`;
    }
    if (context.technologies && context.technologies.length > 0) {
      contextBlock += `<context_technologies>${context.technologies.join(", ")}</context_technologies>\n`;
    }
  }

  const roleTailoringInstruction = context?.targetRole
    ? "Use <target_role> to tailor wording and role-relevant keywords while staying truthful to the original achievement."
    : "";

  return `${contextBlock ? `Context:\n${contextBlock}\n` : ""}Original bullet point:
<user_input>${bulletText}</user_input>

Refine this bullet point and return ONLY the refined text.${roleTailoringInstruction ? `\n${roleTailoringInstruction}` : ""}`;
}

/**
 * Builds the batch prompt with XML delimiters for multiple bullets.
 */
export function buildSafeBatchPrompt(
  bullets: Array<{
    text: string;
    context?: { title?: string; targetRole?: string; technologies?: string[] };
  }>,
  sharedContext?: {
    title?: string;
    targetRole?: string;
    technologies?: string[];
  }
): string {
  let contextBlock = "";
  if (sharedContext) {
    if (sharedContext.title) {
      contextBlock += `<context_title>${sharedContext.title}</context_title>\n`;
    }
    if (sharedContext.targetRole) {
      contextBlock += `<target_role>${sharedContext.targetRole}</target_role>\n`;
    }
    if (sharedContext.technologies && sharedContext.technologies.length > 0) {
      contextBlock += `<context_technologies>${sharedContext.technologies.join(", ")}</context_technologies>\n`;
    }
  }

  const bulletList = bullets
    .map((b, idx) => `${idx + 1}. <user_input>${b.text}</user_input>`)
    .join("\n");

  const roleTailoringInstruction = sharedContext?.targetRole
    ? "Use <target_role> to tailor wording and role-relevant keywords for each bullet while staying truthful to the provided accomplishments."
    : "";

  return `Refine these resume bullet points to be more impactful and professional.

${contextBlock ? `Context:\n${contextBlock}\n` : ""}Input bullet points:
${bulletList}

Return a JSON object with a "results" key containing an array of exactly ${bullets.length} refined bullet strings.${roleTailoringInstruction ? `\n${roleTailoringInstruction}` : ""}`;
}
