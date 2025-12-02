# MAV Resume

MAV Resume is a guided resume builder focused on undergraduate engineering students. It pairs a conversational onboarding experience with data-backed recommendations (UTA course catalog, curated technology list) so students can produce a polished PDF resume, preview it live, and download it without leaving the browser.

## Highlights

- **Dual-screen builder workflow** – landing page (`/`) introduces the product while `/builder` hosts the editor with a fixed progress header (`BuilderHeaderBar`) and scroll-snapped sections.
- **Guided data entry** – each section (`PersonalInfoSection`, `EducationSection`, `TechnicalSkillsSection`, `ProjectsSection`, `ExperienceSection`) ships with contextual guides surfaced via `CustomSectionTitle` dialogs so users know what to write.
- **Course-aware skill recommendations** – selecting UTA courses populates recommended languages/technologies (`TechnicalSkillsSection`) using the metadata in `data/university-data.tsx`.
- **Live document preview** – `ResumePreview` renders a card-based mock resume that updates with every keystroke thanks to the centralized Zustand store.
- **PDF generation & export** – `ResumeDoc` (powered by `@react-pdf/renderer`) feeds both a modal viewer (`ResumeDocPreview`) and a one-click download button (`ResumeDocDownloadButton`).
- **Local persistence** – `useResumeStore` wraps `zustand/persist`, so in-progress resumes survive refreshes and browser restarts.
- **Accessible UI system** – form primitives (`components/ui`) reuse shadcn/Radix building blocks with Tailwind CSS v4 + DaisyUI theming to keep interactions consistent.

## Screens & Flow

### Landing Page (`app/page.tsx`)
- Hero (`HeroSection`) highlights the core value prop, CTA to open the builder, and marketing imagery (`public/MavResumePlaceholder.png`).
- Sticky `HomeHeaderBar` fades in after leaving the hero, mirroring the lightweight brand navigation.

### Builder Workspace (`app/builder`)
- Layout (`app/builder/layout.tsx`) splits the viewport: form stack on the left, persistent preview & export controls on the right.
- IntersectionObserver-driven `BuilderHeaderBar` tracks the active section so users know where they are in the flow.
- Each section manages:
  - form inputs via `CustomTextField`, `Combobox`, `Checkbox`, `NoteBox`
  - add/remove operations through accordions (`EducationAccordion`, `ProjectAccordion`, `ExperienceAccordion`)
  - “Clear inputs” + “Next” CTA to encourage forward motion.
- The skills section auto-suggests languages/technologies from a curated list (`Technologies` export) filtered by selected coursework.
- Projects & experience forms surface three bullet points by default and allow unlimited entries.

### Preview & Export
- `ResumePreview` stitches together modular preview components under a dashed border artboard so content looks resume-like even before export.
- `ResumeDocPreview` opens an @react-pdf `PDFViewer` inside a Radix dialog for high-fidelity review.
- `ResumeDocDownloadButton` names the PDF after the student (`{Full Name} - Resume.pdf`) to keep downloads organized.

## Architecture Overview

| Area | Details |
| --- | --- |
| Routing | Next.js App Router with two primary routes (`/`, `/builder`). |
| State | `store/useResumeStore.tsx` defines the full resume schema and exposes CRUD helpers; persisted via `zustand/middleware`. |
| Data | `data/university-data.tsx` holds universities, degrees, majors, months, course metadata, and the global technology taxonomy used by forms & recommendations. |
| Components | Organized by intent: `components/sections` (form sections), `components/elements` (shared widgets, accordions, previews, PDF helpers), `components/ui` (shadcn primitives), `components/guides` (content for dialog tips), `components/previews` (live artboard sections). |
| Styling | Tailwind CSS v4 (via `@import "tailwindcss"` in `app/globals.css`), DaisyUI plugin, `react-awesome-reveal` for entrance animations, Google Fonts (Montserrat, Poppins, Geist). |
| PDF generation | `@react-pdf/renderer` Document -> Page -> Text layout replicates a traditional single-column resume. |

## Project Structure

```
app/
├─ page.tsx               # Landing page
├─ layout.tsx             # Root font + theme setup
└─ builder/
   ├─ layout.tsx          # Builder split layout with preview
   └─ page.tsx            # Section orchestrator & scroll logic
components/
├─ elements/              # Headers, accordions, previews, PDF helpers
├─ sections/              # Form sections mapped 1:1 with resume areas
├─ guides/                # Content that powers Info dialogs
├─ previews/              # Building blocks for ResumePreview
└─ ui/                    # Radix/shadcn primitives (accordion, dialog…)
data/
└─ university-data.tsx    # Universities, degree/major lists, tech catalog
store/
└─ useResumeStore.tsx     # Zustand store + persistence middleware
```

## Technology Stack

- **Next.js 15 App Router** with React 19
- **TypeScript** everywhere (strict types for resume schema)
- **Tailwind CSS 4 + DaisyUI + tw-animate-css** for design system tokens and motion
- **shadcn/ui + Radix** for accessible dialogs, accordions, comboboxes, popovers
- **Zustand** (with `persist`) for client-side state management
- **@react-pdf/renderer** for live PDF creation, preview, and download
- **lucide-react & react-icons** for iconography
- **react-awesome-reveal** for intersection-based fade animations

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
   Node 18.18+ (or any Next.js 15-compatible runtime) is recommended.

2. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` for the landing page or `http://localhost:3000/builder` to jump straight into the editor.

3. **Lint & typecheck**
   ```bash
   npm run lint
   ```
   TypeScript is enforced by Next during `next build`.

4. **Create a production build**
   ```bash
   npm run build
   npm start
   ```

## Customization Tips

- **Tune course-to-skill mapping**: edit `utaEngineeringCourses` or `Technologies` in `data/university-data.tsx` to reflect your department’s catalog.
- **Adjust resume layout**: tweak fonts, spacing, or sections inside `components/elements/ResumeDoc.tsx` and mirror major changes in the live preview components for parity.
- **Swap persistence strategy**: the Zustand store currently writes to `localStorage` via `persist`. Replace or extend the middleware to sync with an API, Supabase, etc.
- **Branding**: update fonts/colors in `app/globals.css` and metadata in `app/layout.tsx`.

## Deployment

The app is fully static-client driven, so it deploys cleanly to **Vercel**, **Netlify**, or any platform that supports the Next.js App Router. Configure the production command as:

```
npm install
npm run build
npm start
```

No environment variables are required today.

## Contributing

Issues and PRs are welcome! A few contribution ideas:
- Expand the coursework dataset beyond UTA.
- Add templates or sections (awards, leadership, coursework emphasis).
- Integrate authentication to save multiple resume drafts per student.

Before opening a PR, run `npm run lint` and ensure the builder flow still exports a PDF without console errors.

---

Maintained by ACM @ UTA • Built with ❤️ for aspiring Mavericks.
