# PDF Generation

## Overview

The PDF generation system uses `@react-pdf/renderer` to create a downloadable resume PDF from the Zustand store data. The PDF is generated client-side and can be previewed in a modal or downloaded directly.

## Architecture

### Core Component

**ResumeDoc** (`components/elements/ResumeDoc.tsx`)
- Main PDF document component
- Reads all resume data from Zustand store
- Renders single-page A4 PDF with traditional resume layout
- Reactive: automatically re-renders when store updates

### Supporting Components

1. **ResumeDocPreview** (`components/elements/ResumeDocPreview.tsx`)
   - Modal dialog with PDF viewer
   - Uses `PDFViewer` from `@react-pdf/renderer` for in-browser preview
   - Triggered by eye icon in builder header

2. **ResumeDocDownloadButton** (`components/elements/ResumeDocDownloadButton.tsx`)
   - Download button (currently commented out)
   - Would use `PDFDownloadLink` to generate downloadable file
   - File name: `{Full Name} - Resume.pdf`

## PDF Structure

The PDF follows a traditional single-column resume layout:

1. **Header**
   - Name (centered, 22pt, bold)
   - Contact info (phone, email, GitHub, LinkedIn) joined with bullet separators

2. **Education**
   - School name and graduation date (space-between layout)
   - Degree and major on one line, GPA on the right
   - Relevant coursework (only for first education entry)

3. **Technical Skills**
   - Languages: comma-separated list
   - Technologies: comma-separated list

4. **Experience**
   - Company/position header with date range
   - "Present" shown for current positions
   - Bullet points (empty bullets filtered out)

5. **Projects**
   - Project title and technologies (space-between layout)
   - Bullet points (empty bullets filtered out)

## Styling

The PDF uses `@react-pdf/renderer` StyleSheet API:

- **Font**: Times-Roman (11pt base, varies by section)
- **Layout**: Flexbox-based (flexDirection, justifyContent, space-between)
- **Sections**: Uppercase titles with bottom border
- **Bullets**: Left margin with bullet symbol (•) and text
- **Spacing**: Consistent margins and padding throughout

Key style patterns:
- Section titles: 13pt, bold, uppercase, bottom border
- Headers: flexDirection row, space-between for dates/names
- Bullet points: flexDirection row with fixed-width symbol column

## Data Mapping

The component maps store data to PDF structure:

```typescript
// Store → PDF
personalInfo.name → Header name
personalInfo.phone/email/github/linkedin → Contact row
education[] → Education section (multiple entries)
relevantCourses → First education entry only
skills.languagesList → Technical Skills languages
skills.technologiesList → Technical Skills technologies
experience[] → Experience section (multiple entries)
projects[] → Projects section (multiple entries)
```

## Data Filtering

The PDF component filters empty data:

- **Empty bullet points**: Filtered before rendering (`.filter((bp) => bp.trim() !== "")`)
- **Empty contact fields**: Filtered from contact row array
- **Optional fields**: GPA, dates, links only shown if present
- **Relevant courses**: Only shown for first education entry (`idx === 0`)

## Date Formatting

The `formatDate()` helper function:
- Handles partial dates (month only, year only)
- Returns empty string if both missing
- Formats as `"Month Year"` when both present

## Reactive Updates

The PDF updates automatically when store changes:

```
Form input → Store update → ResumeDoc re-render → PDF regenerates
```

This means:
- Preview modal shows latest data
- Download generates PDF with current data
- No manual refresh needed

## Usage Flow

### Preview Flow
```
User clicks eye icon
  ↓
ResumeDocPreview opens modal
  ↓
PDFViewer renders ResumeDoc
  ↓
PDF displayed in modal
```

### Download Flow (when enabled)
```
User clicks download icon
  ↓
PDFDownloadLink generates PDF blob
  ↓
Browser downloads file: "{Name} - Resume.pdf"
```

## Customization

To modify PDF layout:

1. **Change styling**: Edit `styles` object in `ResumeDoc.tsx`
2. **Reorder sections**: Change component order in JSX
3. **Add sections**: Add new View/Text components following existing patterns
4. **Change fonts**: Modify `fontFamily` in styles (requires font registration)
5. **Modify layout**: Adjust flexDirection, justifyContent, margins

To customize file naming:
- Edit `ResumeDocDownloadButton.tsx` fileName prop

## Files

- `components/elements/ResumeDoc.tsx` - Main PDF document component
- `components/elements/ResumeDocPreview.tsx` - Preview modal
- `components/elements/ResumeDocDownloadButton.tsx` - Download button

## Dependencies

- `@react-pdf/renderer`: PDF generation library
- `zustand`: State management (store access)




