# State Management

## Overview

The application uses Zustand for centralized state management with automatic persistence to localStorage. All resume data is stored in a single store that components read from and update.

## Store Structure

The `useResumeStore` (`store/useResumeStore.tsx`) contains:

- **personalInfo**: Name, email, phone, LinkedIn, GitHub
- **education**: Array of education entries (school, degree, major, GPA, dates)
- **relevantCourses**: Array of course names (shown only for first education entry)
- **projects**: Array of project entries (title, technologies, bullet points)
- **skills**: Languages and technologies lists
- **experience**: Array of experience entries (company, position, dates, bullet points)

## Data Model

### Interfaces

```typescript
interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
}

interface Education {
  school: string;
  degree: string;
  major: string;
  includeGPA: boolean;
  gpa?: string;
  graduationMonth: string;
  graduationYear: string;
}

interface Project {
  title: string;
  technologies: string[];
  bulletPoints: string[];
}

interface Experience {
  company: string;
  position: string;
  startMonth: string;
  startYear: string;
  endMonth?: string;
  endYear?: string;
  isCurrent: boolean;
  bulletPoints: string[];
}
```

## Persistence

The store uses Zustand's `persist` middleware to automatically:

1. **Save to localStorage** on every state update
2. **Restore from localStorage** on app load
3. **Key**: `"resume-storage"` (stored in browser's localStorage)

This means:
- Resume data survives page refreshes
- Resume data persists across browser sessions
- No manual save/load logic needed

## Update Functions

The store provides two types of update functions:

### Add Functions
- `addEducation(edu)`: Appends new education entry
- `addProject(proj)`: Appends new project entry
- `addExperience(exp)`: Appends new experience entry
- `addSkills(skills)`: Merges skills (not replaces)

### Update Functions
- `updatePersonalInfo(info)`: Merges partial personal info
- `updateEducation(index, edu)`: Updates education at index
- `updateProject(index, proj)`: Updates project at index
- `updateExperience(index, exp)`: Updates experience at index

All update functions:
- Use immutable updates (create new arrays/objects)
- Trigger reactive re-renders in components using the store
- Automatically persist to localStorage

## Data Flow

### Form Input → Store Update

```
User types in form field
  ↓
onChange handler calls update function
  ↓
Zustand store state updates
  ↓
Persistence middleware saves to localStorage
  ↓
Components using store re-render
  ↓
Preview/PDF updates automatically
```

### Component Usage

**Reading from store:**
```typescript
const { personalInfo, projects } = useResumeStore();
```

**Updating store:**
```typescript
const { updateProject } = useResumeStore();
updateProject(0, { title: "New Title" });
```

**Selective subscriptions:**
```typescript
// Only re-render when personalInfo changes
const personalInfo = useResumeStore((state) => state.personalInfo);
```

## Initial State

The store initializes with empty templates:

- One empty education entry
- One empty project entry (with 3 empty bullet points)
- One empty experience entry (with 3 empty bullet points)
- Empty personal info, skills, and courses

This ensures forms always have at least one entry to edit.

## Array Update Pattern

When updating array items, the store:

1. Creates a new array (spread operator)
2. Updates the item at the specified index
3. Returns the new array

This ensures React detects the change and re-renders dependent components.

Example:
```typescript
updateProject: (index, proj) =>
  set((state) => {
    const newList = [...state.projects];  // New array
    newList[index] = {                    // Update item
      ...newList[index],
      ...proj,
    };
    return { projects: newList };          // Return new array
  })
```

## Components Using Store

- **Form sections**: Read and update store via form inputs
- **Preview components**: Read store to display live preview
- **PDF generator**: Reads store to generate PDF document
- **AI refinement**: Updates store after refining bullets

## Customization

To modify the store:

1. **Add new fields**: Extend `ResumeState` interface and initial state
2. **Change persistence key**: Edit `persist` config (line 138)
3. **Add new update functions**: Add to store definition
4. **Change persistence strategy**: Replace `persist` middleware with custom solution

## Files

- `store/useResumeStore.tsx` - Store definition and persistence

