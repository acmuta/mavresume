# AI Bullet Point Refinement

## Overview

The AI refinement feature uses OpenAI's GPT-4o-mini to enhance resume bullet points, making them more impactful, ATS-friendly, and professional. Users can refine individual bullets or batch-refine all bullets for a project/experience entry.

## Architecture

### Components

1. **Single Bullet API** (`app/api/refine-bullet/route.ts`)
   - Next.js API endpoint for single bullet refinement
   - Validates input and constructs prompts with optional context
   - Includes per-bullet caching and rate limiting

2. **Batch API** (`app/api/refine-bullets-batch/route.ts`)
   - Optimized endpoint for "Refine All" operations
   - Processes multiple bullets in a single OpenAI API call
   - Checks cache for each bullet individually (reuses cached results)
   - Caches each refined bullet individually (enables future reuse)
   - Consumes rate limit credits based on uncached bullet count

3. **Client Library** (`lib/bulletRefinement.ts`)
   - `refineBulletPoint()`: Refines a single bullet point
   - `refineBulletPointsBatch()`: Batch refinement with single API call (preferred)
   - `refineBulletPoints()`: Legacy sequential processing (deprecated)
   - Handles network errors and API failures gracefully

4. **UI Components**
   - `BulletRefinementButton`: Button for single bullet refinement
   - `ExperienceAccordionItem`: Includes "Refine All" for experience entries
   - `ProjectAccordionItem`: Includes "Refine All" for project entries
   - `RefineAllOverlay`: Review dialog for batch refinements

## Data Flow

### Single Bullet Refinement

```
User clicks refine button
  ↓
BulletRefinementButton.handleRefine()
  ↓
lib/bulletRefinement.refineBulletPoint()
  ↓
POST /api/refine-bullet
  ↓
Cache check → OpenAI API (if cache miss)
  ↓
Refined text returned
  ↓
onRefinedPreview callback → Preview box shown
  ↓
User accepts → Store updated → Preview re-renders
```

### Batch Refinement ("Refine All")

```
User clicks "Refine All" button
  ↓
handleRefineAll()
  ↓
lib/bulletRefinement.refineBulletPointsBatch()
  ↓
POST /api/refine-bullets-batch
  ↓
Check cache for each bullet individually
  ↓
Single OpenAI call for all uncached bullets
  ↓
Cache each refined bullet individually
  ↓
All results returned (cached + newly refined)
  ↓
RefineAllOverlay displayed → User reviews
  ↓
Accept/Decline → Store updated → Preview re-renders
```

## Context Passing

The refinement system passes context to improve AI output:

- **Experience entries**: `{ title: "Position at Company" }`
- **Project entries**: `{ title: "Project Name", technologies: ["Tech1", "Tech2"] }`

Context is included in the prompt to help the AI generate more relevant refinements.

## Batch Refinement

The batch API (`/api/refine-bullets-batch`) optimizes "Refine All" operations:

1. Accepts array of bullets with shared context
2. Checks cache for each bullet individually
3. Makes **single** OpenAI call with all uncached bullets
4. Returns JSON array with same number of elements as input
5. Caches each refined bullet individually for future reuse
6. Rate limit consumes N credits for N uncached bullets

### Cost Savings

| Scenario | Before (Sequential) | After (Batch) |
|----------|---------------------|---------------|
| 5 bullets, 0 cached | 5 API + 5 OpenAI | 1 API + 1 OpenAI |
| 5 bullets, 2 cached | 5 API + 3 OpenAI | 1 API + 1 OpenAI |
| 5 bullets, 5 cached | 5 API + 0 OpenAI | 1 API + 0 OpenAI |

## Caching

- **Cache key**: SHA-256 hash of (userId, bulletText, context.title, context.technologies)
- **Cache TTL**: 7 days (configurable via `REFINE_CACHE_TTL_SECONDS`)
- **Storage**: Redis (via Upstash)
- Individual caching ensures bullets can be reused across different batch operations

## Rate Limiting

- **Limit**: 20 requests per 30 minutes (configurable)
- **Single refinement**: Consumes 1 credit
- **Batch refinement**: Consumes N credits for N uncached bullets
- **Cache hits**: Do not consume rate limit credits
- **Storage**: Redis (via Upstash)

## Error Handling

- **Empty bullet validation**: Checked before API call
- **API errors**: Caught and displayed in error dialog
- **Network errors**: Handled with user-friendly messages
- **Partial batch failures**: Some bullets may succeed while others fail
- **JSON parse errors**: Falls back to original text with error message

## Configuration

- **Model**: `gpt-4o-mini`
- **Temperature**: `0.7` (balances creativity with consistency)
- **Max tokens**: `200 × bullet_count` for batch operations
- **API Key**: Required via `OPENAI_API_KEY` environment variable
- **Rate limit**: `REFINE_RATELIMIT_REQUESTS` (default 20), `REFINE_RATELIMIT_WINDOW` (default "30 m")
- **Cache TTL**: `REFINE_CACHE_TTL_SECONDS` (default 604800 = 7 days)

## Customization

To modify refinement behavior:

1. **Change AI model**: Edit API route files, `model` parameter
2. **Adjust prompt**: Modify prompt string in API route files
3. **Add context fields**: Extend `RefinementContext` interface and prompt construction
4. **Adjust rate limits**: Set environment variables
5. **Adjust cache TTL**: Set `REFINE_CACHE_TTL_SECONDS` environment variable

## Files

- `app/api/refine-bullet/route.ts` - Single bullet API endpoint
- `app/api/refine-bullets-batch/route.ts` - Batch API endpoint
- `lib/bulletRefinement.ts` - Client-side functions
- `lib/ratelimit.ts` - Rate limiting logic (includes batch support)
- `lib/refine-cache.ts` - Caching logic
- `components/elements/BulletRefinementButton.tsx` - Single bullet UI
- `components/elements/RefineAllOverlay.tsx` - Batch review dialog
- `components/elements/ExperienceAccordionItem.tsx` - Experience batch refinement
- `components/elements/ProjectAccordionItem.tsx` - Project batch refinement






