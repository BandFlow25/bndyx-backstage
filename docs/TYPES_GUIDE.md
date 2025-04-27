# Types Guide

This document provides a comprehensive guide to the type system in the bndy platform, focusing on shared types, DRY principles, and best practices for type usage across all applications.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Type Architecture](#type-architecture)
3. [Using Shared Types](#using-shared-types)
4. [Type Best Practices](#type-best-practices)
5. [Migration Strategy](#migration-strategy)
6. [Troubleshooting](#troubleshooting)

## Core Principles

1. **Single Source of Truth**: All shared types should be defined in the `bndy-types` package
2. **DRY (Don't Repeat Yourself)**: Never duplicate type definitions across packages
3. **Type Safety**: Leverage TypeScript's type system for maximum safety and developer experience
4. **Explicit Typing**: Always specify explicit return types for functions and explicit types for variables
5. **Compatibility**: Ensure backward compatibility when evolving types

## Type Architecture

The bndy ecosystem follows this type hierarchy:

```
bndy-types (source of truth)
    ↑
    ├── bndy-ui (imports from bndy-types)
    ↑
    └── bndy-core (imports from bndy-types)
```

This unidirectional flow ensures that types are defined once and used consistently across all packages.

## Using Shared Types

### In bndy-types

1. Define all shared types in appropriate files (e.g., `event.ts`, `artist.ts`)
2. Ensure comprehensive documentation for each type
3. Export all types from the package index

Example:
```typescript
// In bndy-types/src/event.ts
export type EventType = 
  'available' | 'unavailable' | 'tentative' | 
  'gig' | 'practice' | 'recording' | 'meeting' | 
  'other';

export interface BndyCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  eventType: EventType;
  isPublic: boolean;
  location?: string;
  description?: string;
  artistId?: string;
}
```

### In bndy-ui

1. Import types directly from bndy-types
2. Never redefine types that exist in bndy-types
3. Define UI-specific types in bndy-ui when they're not needed by other packages

Example:
```typescript
// In bndy-ui/src/components/calendar/BndyCalendar.tsx
import { BndyCalendarEvent, EventType } from 'bndy-types';

interface BndyCalendarProps {
  events: BndyCalendarEvent[];
  onSelectEvent?: (event: BndyCalendarEvent) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  isDarkMode?: boolean;
  readOnly?: boolean;
}
```

### In bndy-core

1. Import types directly from bndy-types
2. Never redefine types that exist in bndy-types
3. Define application-specific types in bndy-core when they're not needed by other packages

Example:
```typescript
// In bndy-core/src/app/calendar/page.tsx
import { BndyCalendarEvent, EventType, Artist } from 'bndy-types';
import { BndyCalendar } from 'bndy-ui';

// Application-specific type
interface CalendarPageState {
  events: BndyCalendarEvent[];
  selectedEvent: BndyCalendarEvent | null;
  isLoading: boolean;
  error: Error | null;
}
```

## Type Best Practices

### Type Definitions

- Use TypeScript interfaces for object shapes
- Use TypeScript types for unions, intersections, and aliases
- Prefer type composition over inheritance
- Export types using `export type`

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

type UserRole = 'admin' | 'member' | 'guest';

interface AdminUser extends User {
  role: 'admin';
  permissions: string[];
}

// Export types
export type { User, UserRole, AdminUser };
```

### Type Usage

- Always specify explicit return types for functions
- Use generics for reusable components and utilities
- Avoid `any` type; use `unknown` when type is truly unknown
- Use discriminated unions for state management

```typescript
// Function with explicit return type
function fetchUser(id: string): Promise<User> {
  // Implementation
}

// Generic function
function filterItems<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}

// Discriminated union for state
type UserState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: Error };
```

### Component Props

- Use TypeScript interfaces for props
- Provide default values for optional props
- Destructure props in function parameters
- Document props with JSDoc comments

```typescript
interface ButtonProps {
  /** The content to display inside the button */
  children: React.ReactNode;
  /** The variant style to apply */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** Click handler */
  onClick?: () => void;
}

const Button = ({
  children,
  variant = 'primary',
  isLoading = false,
  onClick,
}: ButtonProps): React.ReactElement => {
  // Implementation
};
```

## Migration Strategy

When migrating to shared types, follow these steps:

1. **Identify Shared Types**: Identify types that are used across multiple packages
2. **Move to bndy-types**: Move these types to the bndy-types package
3. **Update Imports**: Update imports in all packages to use the shared types
4. **Remove Duplicates**: Remove duplicate type definitions from other packages
5. **Type Check**: Run type checking to ensure compatibility

## Troubleshooting

### Common Issues

#### 1. Type Conflicts

If you encounter type conflicts:

- Check for duplicate type definitions across packages
- Ensure you're importing the correct type from bndy-types
- Check for naming conflicts with local types

#### 2. Missing Properties

If TypeScript reports missing properties:

- Check if the type definition in bndy-types has been updated
- Ensure you're using the latest version of bndy-types
- Update your code to match the current type definition

#### 3. Import Errors

If you encounter import errors:

- Check that the type is properly exported from bndy-types
- Verify the import path is correct
- Check for circular dependencies

### Debugging Tips

1. Use the TypeScript Language Server in your IDE to inspect types
2. Use explicit type annotations to help identify type issues
3. Run `tsc --noEmit` to check for type errors without generating output
4. Use the `--traceResolution` flag with tsc to debug import issues

```bash
npx tsc --noEmit --traceResolution
```
