# Code Standards and Best Practices

This document outlines the coding standards and best practices for the bndy platform. Following these guidelines ensures consistency, maintainability, and high-quality code across all projects.

## Table of Contents

1. [Architecture](#architecture)
2. [Type System](#type-system)
3. [Component Structure](#component-structure)
4. [Theming and Styling](#theming-and-styling)
5. [Error Handling](#error-handling)
6. [State Management](#state-management)
7. [Performance Optimization](#performance-optimization)
8. [Testing](#testing)
9. [Documentation](#documentation)
10. [Code Organization](#code-organization)

## Architecture

### Package Structure

The bndy platform consists of multiple packages with clear responsibilities:

- **bndy-types**: Single source of truth for all shared types
- **bndy-ui**: Shared UI components and utilities
- **bndy-core**: Core application functionality
- **bndy-live**: Public-facing website
- **bndy-landing**: Marketing and landing pages

### Dependencies

- Follow a unidirectional dependency flow:
  ```
  bndy-types <- bndy-ui <- (bndy-core, bndy-live, bndy-landing)
  ```
- Never create circular dependencies between packages
- Keep dependencies minimal and explicit

### Import Patterns

- Use absolute imports for external dependencies
- Use relative imports for files within the same module
- Use path aliases for imports across modules
  ```tsx
  // Good
  import { Button } from 'bndy-ui';
  import { EventType } from 'bndy-types';
  import { formatDate } from '@/utils/date';
  import { Card } from '../components/Card';
  
  // Avoid
  import { Button } from '../../../../bndy-ui/src/components/Button';
  ```

## Type System

- Define all shared types in `bndy-types`
- Use TypeScript interfaces for object shapes
- Use TypeScript types for unions, intersections, and aliases
- Always specify explicit return types for functions
- Avoid `any` type; use `unknown` when type is truly unknown

For comprehensive guidelines on types, see [TYPES_GUIDE.md](./TYPES_GUIDE.md).

Example:
```tsx
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

type UserState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: Error };

// Function with explicit return type
function fetchUser(id: string): Promise<User> {
  // ...
}

// Generic component
function List<T>({ items, renderItem }: { 
  items: T[]; 
  renderItem: (item: T) => React.ReactNode 
}): React.ReactElement {
  // ...
}
```

## Component Structure

- One component per file
- Group related components in directories
- Keep components focused and small (under 200 lines)
- Use shared components from `bndy-ui` whenever possible
- Extend shared components rather than creating duplicates

For comprehensive guidelines on components, see [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md).

## Theming and Styling

- Use Tailwind classes for styling
- Support dark mode in all components
- Use Tailwind's dark mode classes (`dark:bg-slate-800`)
- Add transition effects for theme changes
- Use CSS variables for theme colors and values

For comprehensive guidelines on theming, see [THEMING_GUIDE.md](./THEMING_GUIDE.md).

## Error Handling

- Use error boundaries to catch and handle errors
- Place error boundaries at logical component boundaries
- Use try/catch blocks for async operations
- Provide user-friendly error messages
- Implement retry mechanisms for transient errors

For comprehensive guidelines on error handling, see [ERROR_HANDLING.md](./ERROR_HANDLING.md).

## State Management

### Local State

- Use React's `useState` for simple component state
- Use `useReducer` for complex state logic
- Keep state as close as possible to where it's used

### Context API

- Use context for shared state across components
- Create separate contexts for different concerns
- Optimize context to prevent unnecessary re-renders
- Provide clear types for context values and actions

### Form State

- Use React Hook Form for form management
- Implement proper validation with error messages
- Handle form submission with loading and error states

## Performance Optimization

### Rendering Optimization

- Use `React.memo` for pure components
- Use `useCallback` for event handlers passed to child components
- Use `useMemo` for expensive computations
- Avoid unnecessary re-renders

### Code Splitting

- Use dynamic imports for route-level code splitting
- Lazy load components that are not immediately visible
- Use Suspense for loading states

### Data Fetching

- Implement data caching strategies
- Use pagination for large data sets
- Implement optimistic UI updates
- Show loading states during data fetching

## Testing

### Unit Testing

- Write unit tests for utility functions
- Test components in isolation
- Mock external dependencies
- Test edge cases and error scenarios

### Integration Testing

- Test component interactions
- Test form submissions and validations
- Test routing and navigation

### UI Testing

- Test components in both light and dark modes
- Test responsive behavior
- Test accessibility

## Documentation

### Code Comments

- Use JSDoc comments for functions and components
- Document complex logic with inline comments
- Keep comments up-to-date with code changes

### README Files

- Provide clear README files for each package
- Include setup instructions
- Document available scripts
- Explain architecture decisions

### API Documentation

- Document all public APIs
- Include examples of usage
- Document props, parameters, and return values

## Code Organization

### File Structure

- Group files by feature, not by type
- Keep related files close together
- Use consistent naming conventions

Example:
```
/features
  /auth
    /components
      LoginForm.tsx
      SignupForm.tsx
    /hooks
      useAuth.tsx
    /utils
      authUtils.ts
    index.ts
```

### Naming Conventions

- Use PascalCase for components and types
- Use camelCase for variables, functions, and instances
- Use kebab-case for file names
- Use descriptive, intention-revealing names

### Code Formatting

- Use Prettier for consistent formatting
- Use ESLint for code quality
- Run linters before committing code

## Conclusion

Following these standards and best practices ensures a consistent, maintainable, and high-quality codebase. These guidelines should be applied to all new code and used as a reference when refactoring existing code.

Remember that these standards are living guidelines that can evolve as the project and technologies change. Regular reviews and updates to these standards are encouraged to keep them relevant and effective.
