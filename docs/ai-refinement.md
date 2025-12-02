# AI Bullet Point Refinement

## Overview

The AI refinement feature uses OpenAI's GPT-4o-mini to enhance resume bullet points, making them more impactful, ATS-friendly, and professional. Users can refine individual bullets or batch-refine all bullets for a project/experience entry.

## Architecture

### Components

1. **API Route** (`app/api/refine-bullet/route.ts`)
   - Next.js API endpoint that proxies requests to OpenAI
   - Validates input and constructs prompts with optional context
   - Handles errors and returns refined text

2. **Client Library** (`lib/bulletRefinement.ts`)
   - `refineBulletPoint()`: Refines a single bullet point
   - `refineBulletPoints()`: Batch refinement with sequential processing
   - Handles network errors and API failures gracefully

3. **UI Components**
   - `BulletRefinementButton`: Button for single bullet refinement
   - `ExperienceAccordionItem`: Includes "Refine All" for experience entries
   - `ProjectAccordionItem`: Includes "Refine All" for project entries

## Data Flow

```
User clicks refine button
  ↓
BulletRefinementButton.handleRefine()
  ↓
lib/bulletRefinement.refineBulletPoint()
  ↓
POST /api/refine-bullet
  ↓
OpenAI API (GPT-4o-mini)
  ↓
Refined text returned
  ↓
onRefined callback → Parent component updates store
  ↓
Preview/PDF re-renders with new text
```

## Context Passing

The refinement system passes context to improve AI output:

- **Experience entries**: `{ title: "Position at Company" }`
- **Project entries**: `{ title: "Project Name", technologies: ["Tech1", "Tech2"] }`

Context is included in the prompt to help the AI generate more relevant refinements.

## Batch Refinement

When refining multiple bullets (via "Refine All" button):

1. Non-empty bullets are filtered from the array
2. Each bullet is refined sequentially (not in parallel) to avoid rate limits
3. 500ms delay between requests to be respectful to the API
4. Refined results are mapped back to original array positions (preserving empty slots)
5. Store is updated, triggering preview re-render

## Error Handling

- **Empty bullet validation**: Checked before API call
- **API errors**: Caught and displayed in error dialog
- **Network errors**: Handled with user-friendly messages
- **Partial batch failures**: Some bullets may succeed while others fail

## Configuration

- **Model**: `gpt-4o-mini`
- **Temperature**: `0.7` (balances creativity with consistency)
- **Max tokens**: `200` (limits response to typical bullet point length)
- **API Key**: Required via `OPENAI_API_KEY` environment variable

## Customization

To modify refinement behavior:

1. **Change AI model**: Edit `app/api/refine-bullet/route.ts` line 45
2. **Adjust prompt**: Modify prompt string in same file (lines 40-42)
3. **Change batch delay**: Edit `lib/bulletRefinement.ts` line 80
4. **Add context fields**: Extend `RefinementContext` interface and prompt construction

## Files

- `app/api/refine-bullet/route.ts` - API endpoint
- `lib/bulletRefinement.ts` - Client-side functions
- `components/elements/BulletRefinementButton.tsx` - Single bullet UI
- `components/elements/ExperienceAccordionItem.tsx` - Experience batch refinement
- `components/elements/ProjectAccordionItem.tsx` - Project batch refinement

