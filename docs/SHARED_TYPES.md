# Shared Types Guide

This document outlines the proper use of shared types across the bndy ecosystem to ensure type consistency and maintainability.

## Core Principles

1. **Single Source of Truth**: All shared types should be defined in the `bndy-types` package
2. **Compatibility Layers**: Use compatibility layers for transition periods
3. **Direct Imports**: Eventually move to direct imports from `bndy-types`

## Type Architecture

The bndy ecosystem follows this type hierarchy:

```
bndy-types (source of truth)
    ↑
    ├── bndy-ui (imports from bndy-types)
    ↑
    └── bndy-core (imports from bndy-types)
```

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
  // ...other properties
}
```

### In bndy-ui

1. Import types directly from bndy-types
2. Use reference paths if needed for compiled output
3. Re-export types using `export type` for backward compatibility

Example:
```typescript
// In bndy-ui/src/types/calendar.ts
/// <reference path="../../../bndy-types/lib/event.d.ts" />

import type { EventType, BndyCalendarEvent } from '../../../bndy-types/lib/event';
export type { EventType, BndyCalendarEvent };

// Add any UI-specific types here
export interface BndyCalendarProps {
  events: BndyCalendarEvent[];
  // ...other properties
}
```

### In bndy-core

1. Create compatibility layers in `src/types/` that import from bndy-types
2. Components should import from these compatibility layers
3. Eventually transition to direct imports from bndy-types

Example:
```typescript
// In bndy-core/src/types/calendar.ts
import { EventType as SharedEventType, BndyCalendarEvent as SharedBndyCalendarEvent } from 'bndy-types';

export type EventType = SharedEventType;
export type BndyCalendarEvent = SharedBndyCalendarEvent;
```

## Type Migration Process

When migrating types to bndy-types:

1. **Audit**: Identify all instances of the type across projects
2. **Consolidate**: Move the canonical definition to bndy-types
3. **Verify**: Ensure the shared type includes all needed properties
4. **Compatibility**: Create compatibility layers in each project
5. **Transition**: Gradually update imports to use the shared types

## Best Practices

1. **Never duplicate** type definitions across projects
2. **Always add validation** in compatibility layers to ensure type compatibility
3. **Document changes** to shared types in release notes
4. **Run TypeScript checks** after any type changes
5. **Use type aliases** rather than interface extensions when possible
6. **Prefer composition** over inheritance for complex types

## Common Issues and Solutions

### Type Import Errors

If you encounter errors importing from bndy-types:

```
Cannot find module 'bndy-types' or its corresponding type declarations
```

Solutions:
1. Ensure bndy-types is properly built (`npm run build` in bndy-types)
2. Use reference paths with relative imports from the compiled output
3. Check tsconfig.json paths configuration

### Type Compatibility Issues

If you encounter type compatibility errors:

```
Type 'X' is not assignable to type 'Y'
```

Solutions:
1. Update the shared type to include all needed properties
2. Add type validation in the compatibility layer
3. Use type assertions only as a last resort

## Linting Rules

We enforce these type patterns with the following linting rules:

1. No duplicate type definitions across projects
2. No direct imports from another project's internal types
3. Always use `import type` and `export type` for type-only imports/exports

## Future Improvements

1. Implement automated type validation in CI/CD
2. Create a type migration tool to assist with transitions
3. Establish a type versioning strategy for breaking changes
