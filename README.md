# MAV Resume

MAV Resume is a role-based resume platform built for students and reviewers.

It combines a structured resume builder, AI bullet refinement, live PDF output, and an end-to-end review workflow with inline PDF annotations.

## What The App Does

MAV Resume supports two connected workflows:

- Student workflow: create resumes from templates, edit sections, refine bullets with AI, preview/export PDF, and submit for review.
- Reviewer workflow: claim pending submissions, annotate PDFs inline, leave summary feedback, and complete reviews.

## Core Features

### Resume Builder

- Guided section editing with dynamic section management (add, remove, reorder)
- Personal Info locked as the top section
- Major-specific templates and custom template creation
- Section alias normalization for stable ordering (for example, tools -> technical-skills)
- Live PDF preview tied directly to builder state
- PDF settings support through centralized store

### AI Refinement

- Single bullet refinement endpoint
- Batch bullet refinement endpoint (up to 20 bullets per request)
- Context-aware refinement (title, technologies, optional target role context)
- Sanitization and prompt-injection checks
- Cache-backed refinement responses (when Upstash Redis is configured)
- Rate limiting for uncached refinement requests

### Review And Annotation System

- Student review submission flow from dashboard
- Reviewer queue with pending and active review states
- Claim/complete lifecycle for reviewers
- Inline text/area annotations on resume PDFs
- Final reviewer summary feedback attached to completed review
- Role-based access controls on review pages

### Authentication And Authorization

- Supabase authentication (email/password and Google OAuth)
- Middleware-based protected routing
- Role handling for student, reviewer, and admin

## Routes

### Public Routes

- /: marketing and product entry page
- /login: auth page (sign in/up and Google OAuth)
- /auth/callback: OAuth callback
- /faqs: searchable FAQ page
- /features: feature overview page

### Protected Routes

- /dashboard: student dashboard, resume list, and review submission entry
- /builder: resume editing workspace
- /templates: template library and custom template entry
- /review/[id]: review detail page (student/read-only or reviewer/edit mode depending on status/role)
- /reviewer/dashboard: reviewer queue and active reviews

## API Endpoints

### POST /api/refine-bullet

Refines one bullet point.

Request body:

```json
{
  "bulletText": "Built a web app",
  "context": {
    "title": "Project Lead",
    "technologies": ["Next.js", "TypeScript"]
  }
}
```

Success response:

```json
{
  "refinedText": "Led development of a Next.js TypeScript web app, improving usability and delivery speed through structured component architecture.",
  "rateLimit": {
    "limit": 20,
    "remaining": 19,
    "reset": 1743312000000
  }
}
```

### POST /api/refine-bullets-batch

Refines multiple bullets in one request (maximum 20 bullets).

Request body:

```json
{
  "bullets": [
    {
      "text": "Built dashboard",
      "context": {
        "title": "Frontend Developer",
        "technologies": ["React", "Tailwind"]
      }
    }
  ]
}
```

Success response:

```json
{
  "results": [
    {
      "refinedText": "Developed a React/Tailwind dashboard that improved task visibility and reduced manual reporting overhead.",
      "fromCache": false
    }
  ],
  "rateLimit": {
    "limit": 20,
    "remaining": 19,
    "reset": 1743312000000
  }
}
```

### GET /api/rate-limit/status

Returns remaining refinement quota for the authenticated user.

Success response:

```json
{
  "limit": 20,
  "remaining": 15,
  "reset": 1743312000000
}
```

## Tech Stack

- Framework: Next.js 15, React 18, TypeScript 5
- Styling/UI: Tailwind CSS 4, DaisyUI 5, Radix UI, shadcn/ui
- State: Zustand
- PDF: @react-pdf/renderer
- Auth: Supabase
- AI: OpenAI (gpt-4o-mini)
- Caching/Rate Limit: Upstash Redis + @upstash/ratelimit
- Motion/UI: framer-motion, lucide-react

## Project Structure

```text
app/
  api/
    rate-limit/
    refine-bullet/
    refine-bullets-batch/
  auth/callback/
  builder/
  dashboard/
  faqs/
  features/
  login/
  review/[id]/
  reviewer/dashboard/
  templates/

components/
  sections/           # Builder form sections
  previews/           # Resume preview renderers
  review/             # PDF viewer and annotation UI
  elements/           # Reusable feature-specific UI
  ui/                 # Primitive UI components

lib/
  actions/            # Server actions for reviews/annotations
  auth/               # Auth and role helpers
  resume/             # Resume section/PDF/runtime registries
  supabase/           # Supabase clients and middleware helpers
  bulletRefinement.ts # Client-side refinement calls
  refine-cache.ts     # Cache key + Redis cache helpers
  ratelimit.ts        # Refinement quota logic

store/
  useResumeStore.tsx
  useSessionStore.tsx
  useGuideStore.ts
  useRateLimitStore.ts

data/
  resume-templates.tsx
  university-data.tsx
  faqs.ts

docs/
  ai-refinement.md
  pdf-generation.md
  state-management.md
```

## Environment Variables

Create .env.local in the project root.

### Required

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_API_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### Optional

```bash
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
REFINE_RATELIMIT_REQUESTS=20
REFINE_RATELIMIT_WINDOW="30 m"
REFINE_CACHE_TTL_SECONDS=604800
```

Notes:

- Upstash Redis is required for refinement endpoints in the current implementation because rate limiting fails closed when Redis is unavailable.
- OPENAI_API_KEY is required for bullet refinement endpoints.

## Quick Start

### Prerequisites

- Node.js 18.18+
- npm
- Supabase project
- OpenAI API key

### Install And Run

```bash
npm install
npm run dev
```

App runs at http://localhost:3000.

### Build And Validate

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

## Scripts

- npm run dev: start local dev server
- npm run build: production build
- npm run start: run production server
- npm run lint: run ESLint
- npm run typecheck: run TypeScript checks

## Internal Docs

Use these docs for deeper implementation details:

- docs/ai-refinement.md
- docs/state-management.md
- docs/pdf-generation.md

## Contributing

When contributing:

- Keep route behavior and role guards consistent with middleware protections.
- Validate builder + preview + PDF output after section or store changes.
- Validate reviewer flow (pending -> accepted -> completed) after review-related changes.
- Run lint and typecheck before opening a PR.

## License

Maintained by ACM at The University of Texas at Arlington for student use.
