# MAV Resume

MAV Resume is an AI-powered resume builder designed for undergraduate students. It combines guided data entry, intelligent course-based recommendations, and AI refinement tools to help students transform their academic experiences into recruiter-ready resumes with professional formatting and live PDF export.

## Features

### Core Functionality
- **Guided Builder Interface** – Step-by-step sections (Personal Info, Education, Skills, Projects, Experience) with contextual tips and validation to guide students through resume creation.
- **Live Preview & PDF Export** – Real-time preview updates as users type, with instant PDF generation and download capabilities powered by `@react-pdf/renderer`.
- **AI Bullet Point Refinement** – GPT-4o-mini integration that transforms basic bullet points into impactful, ATS-friendly statements with strong action verbs and metrics.
- **Course-Aware Skill Suggestions** – Auto-populates relevant technologies and languages based on selected UTA coursework using comprehensive course metadata.
- **Section Reordering** – Drag-and-drop interface to customize section order while maintaining personal info as the header.

### User Management
- **Authentication System** – Full-featured auth with Supabase supporting email/password and Google OAuth.
- **Protected Routes** – Middleware-based route protection redirecting unauthenticated users to login while preserving destination URLs.
- **User Dashboard** – Centralized hub for accessing the builder, templates, and managing sessions.

### Templates
- **Major-Specific Templates** – Categorized resume templates (Tech & Engineering, Business & Analytics, Design & Media, Health & Service) with searchable, filterable interface.
- **Custom Template Option** – Ability to create personalized resumes outside predefined templates.

### Technical Highlights
- **State Management** – Zustand stores with localStorage persistence for resume data and reactive session management.
- **Responsive Design** – Split-screen builder layout (forms left, live preview right) with mobile-optimized drawer navigation.
- **Accessibility** – Radix UI primitives ensuring keyboard navigation, ARIA labels, and screen reader support throughout.

## Application Routes

### Public Routes
- **Landing Page (`/`)** – Hero section showcasing the value proposition with animated fade-in effects, feature demonstrations (AI refinement, skill suggestions), and dual CTAs for builder and authentication.
- **Login (`/login`)** – Dual-mode authentication with tabbed sign-in/sign-up, Google OAuth integration, form validation, and rotating resume writing tips sidebar.
- **Templates (`/templates`)** – Gallery of major-specific templates with search, category filtering, and "create your own" template card.
- **Auth Callback (`/auth/callback`)** – OAuth redirect handler for Google sign-in flow with proper session establishment.

### Protected Routes (Require Authentication)
- **Dashboard (`/dashboard`)** – Personalized welcome page displaying user email with cards linking to builder and templates gallery.
- **Builder (`/builder`)** – Full-featured resume editor with split-screen layout:
  - Left panel: Single-section display with fade transitions, breadcrumb navigation with direct section jumping
  - Right panel (fixed): Live preview with controls (border toggle, section reorder, PDF preview/download)

### Builder Sections
1. **Personal Info** – Name, email, phone, GitHub, LinkedIn, custom contact fields
2. **Education** – University combobox, degree/major selection, GPA toggle, graduation date, relevant coursework
3. **Technical Skills** – Course selection triggering auto-suggested languages/technologies from curated course metadata
4. **Projects** – Title, technologies, 3+ bullet points with per-bullet AI refinement
5. **Experience** – Company, position, date range (with "current" toggle), 3+ bullet points with AI refinement

### Key Workflows
- **AI Refinement** – Click magic wand icon → API call to `/api/refine-bullet` → GPT-4o-mini processes with context (title, technologies) → Preview original vs. refined → Accept/decline.
- **Section Reordering** – Drag-and-drop modal interface powered by `@dnd-kit/sortable` with personal info locked as header.
- **Live Preview** – Real-time card-based mock resume updating with every keystroke via Zustand reactive store.
- **PDF Export** – Modal viewer with `@react-pdf/renderer` displaying full-fidelity PDF, plus one-click download with auto-generated filename (`{Name} - Resume.pdf`).

## Architecture

### Routing & Middleware
- **Next.js 15 App Router** with file-system based routing (`app/` directory)
- **Middleware** (`middleware.ts`) handles authentication checks on protected routes, skips public routes to optimize FCP/TTFB
- **API Routes** – `/api/refine-bullet` for AI refinement (authenticated via Supabase session check)

### State Management
- **Resume Store** (`store/useResumeStore.tsx`) – Zustand store with localStorage persistence holding all resume data (personal info, education, skills, projects, experience, section order)
- **Session Store** (`store/useSessionStore.tsx`) – Zustand store for client-side authentication state synced from Supabase cookies

### Data Layer
- **University Data** (`data/university-data.tsx`) – Comprehensive catalog of universities, degrees, majors, UTA engineering courses with associated languages/technologies
- **Template Data** (`data/resume-templates.tsx`) – Major-specific template configurations with category mappings and section definitions

### Component Organization
- **Sections** (`components/sections/`) – Form sections mapped to resume areas (PersonalInfo, Education, TechnicalSkills, Projects, Experience)
- **Elements** (`components/elements/`) – Reusable UI components (headers, accordions, previews, PDF helpers, refinement buttons)
- **Previews** (`components/previews/`) – Modular preview components for each resume section
- **UI** (`components/ui/`) – Radix/shadcn primitives (accordion, dialog, button, input, etc.)
- **Guides** (`components/guides/`) – Contextual help content for section dialogs

### External Services
- **Supabase** – Authentication (email/password + Google OAuth), session management
- **OpenAI** – GPT-4o-mini for AI bullet point refinement (0.7 temperature, 200 max tokens)

## Project Structure

```
app/
├─ page.tsx                    # Landing page
├─ login/page.tsx              # Authentication page
├─ dashboard/page.tsx          # User dashboard (protected)
├─ templates/page.tsx          # Template gallery
├─ builder/
│  ├─ layout.tsx               # Split-screen layout
│  └─ page.tsx                 # Section orchestrator
├─ auth/callback/route.ts      # OAuth callback handler
└─ api/refine-bullet/route.ts  # AI refinement endpoint

components/
├─ sections/                   # Form sections (personalInfo, education, etc.)
├─ elements/                   # Shared components (accordions, previews, PDF)
├─ previews/                   # Live preview building blocks
├─ guides/                     # Contextual help content
├─ contexts/                   # React contexts (PreviewContext)
└─ ui/                         # Radix/shadcn primitives

store/
├─ useResumeStore.tsx          # Resume data state + persistence
└─ useSessionStore.tsx         # Authentication state

data/
├─ university-data.tsx         # Universities, courses, skills catalog
└─ resume-templates.tsx        # Template configurations

lib/
├─ auth.ts                     # Auth helper functions
├─ bulletRefinement.ts         # AI refinement client functions
├─ hooks/useSessionSync.ts     # Session sync hook
└─ supabase/                   # Supabase client configuration
```

## Technology Stack

### Frontend
- **Next.js 15.5** with App Router and React 19
- **TypeScript 5** with strict type checking
- **Tailwind CSS 4** with `@tailwindcss/postcss`
- **DaisyUI 5** for design tokens
- **Radix UI** + **shadcn/ui** for accessible components
- **Zustand 5** for state management with persist middleware

### UI & Animation
- **lucide-react** for icons
- **react-awesome-reveal** for intersection-based animations
- **@dnd-kit** for drag-and-drop section reordering
- **vaul** for mobile drawer navigation

### PDF Generation
- **@react-pdf/renderer 4** for PDF creation and preview

### Backend & Services
- **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`) for authentication
- **OpenAI 4** for GPT-4o-mini integration
- **Vercel Analytics** + **Speed Insights** for monitoring

### Development
- **ESLint 9** with Next.js config
- **tw-animate-css** for Tailwind animation utilities

## Getting Started

### Prerequisites
- Node.js 18.18+ or compatible Next.js 15 runtime
- Supabase project with Google OAuth configured (optional for auth features)
- OpenAI API key (optional for AI refinement features)

### Environment Variables
Create a `.env.local` file with:
```bash
# Supabase (required for authentication)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI (required for AI refinement)
OPENAI_API_KEY=your_openai_api_key
```

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd mavresume
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` for the landing page.

3. **Lint and typecheck**
   ```bash
   npm run lint
   ```

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Key Features Explained

### AI Bullet Point Refinement
- Uses OpenAI's GPT-4o-mini model with temperature 0.7 for balanced creativity
- Sends context (project/experience title, technologies) for relevant refinements
- Prompts specifically for ATS-friendly language, action verbs, and quantifiable metrics
- Preview-before-accept flow prevents unwanted changes
- Sequential processing with 500ms delays to respect rate limits

### Course-Aware Skill Recommendations
- UTA engineering courses mapped to specific languages and technologies
- Selecting courses in Education section auto-populates Technical Skills suggestions
- Comprehensive course catalog covering CSE, MAE, EE, and general engineering courses
- Custom skill additions supported for flexibility

### State Persistence
- All resume data automatically saved to localStorage via Zustand persist middleware
- Survives page refreshes, browser crashes, and navigation
- Session state synced from Supabase cookies via `useSessionSync` hook
- Resume store key: `resume-storage`, persists full schema including section order

### Authentication Flow
1. User accesses protected route → Middleware checks Supabase session
2. No session → Redirect to `/login?redirect=/original-path`
3. Login with email/password or Google OAuth
4. Successful auth → Redirect to original destination or `/dashboard`
5. Session synced to client store via `useSessionSync` for reactive UI updates

## Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Add environment variables in project settings
3. Deploy (automatic builds on push)

### Other Platforms
Works on any platform supporting Next.js App Router:
- Netlify
- Cloudflare Pages
- Railway
- Self-hosted with Node.js

**Production Build:**
```bash
npm install
npm run build
npm start
```

## Customization

### Course-to-Skill Mapping
Edit `utaEngineeringCourses` in `data/university-data.tsx`:
```typescript
{
  name: "CSE 1310",
  value: "Introduction to Computers & Programming",
  languages: ["Python", "Java", "C++"],
  tools: [],
}
```

### Resume Layout
Modify `components/elements/ResumeDoc.tsx` for PDF styling:
- Update `styles` object for fonts, spacing, margins
- Mirror changes in preview components for consistency

### Templates
Add new templates in `data/resume-templates.tsx`:
```typescript
{
  id: "new-template",
  name: "Template Name",
  description: "Description here",
  available: true,
  route: "new-template",
  sections: ["Education", "Skills", "Projects"],
}
```

### Branding
- Update colors in `app/globals.css` (Tailwind custom properties)
- Modify fonts in `app/layout.tsx` metadata
- Replace logo/images in `public/` directory

## Contributing

Contributions are welcome! Focus areas:
- Expand coursework dataset beyond UTA
- Add resume templates for other majors/industries
- Improve AI refinement prompts for specific domains
- Enhance mobile experience
- Add multi-resume management per user

**Before submitting PRs:**
1. Run `npm run lint` to ensure code quality
2. Test builder flow end-to-end (data entry → preview → PDF download)
3. Verify authentication works (sign-up, sign-in, OAuth)
4. Check for console errors and TypeScript issues

## License

This project is maintained by ACM @ UTA for the benefit of UTA students.

---

**Built with ❤️ for aspiring Mavericks** • Maintained by ACM @ The University of Texas at Arlington
