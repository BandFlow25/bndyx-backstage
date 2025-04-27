# bndy Platform Documentation

This directory contains comprehensive documentation for the bndy platform, covering coding standards, component usage, type system, theming, and error handling.

## Core Documentation

| Document | Description |
|----------|-------------|
| [CODE_STANDARDS.md](./CODE_STANDARDS.md) | Overall coding standards and best practices |
| [TYPES_GUIDE.md](./TYPES_GUIDE.md) | Comprehensive guide to the type system and DRY principles |
| [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md) | Guide to using shared components from bndy-ui |
| [THEMING_GUIDE.md](./THEMING_GUIDE.md) | Guide to the theming system and dark mode support |
| [ERROR_HANDLING.md](./ERROR_HANDLING.md) | Guide to error handling and error boundaries |

## Package Architecture

The bndy platform consists of multiple packages with clear responsibilities:

```
bndy-types (shared types)
    ↑
    ├── bndy-ui (shared UI components)
    ↑
    └── bndy-core (core application)
```

## Key Principles

1. **Single Source of Truth**
   - Types: All shared types should be defined in `bndy-types`
   - Components: All shared UI components should be defined in `bndy-ui`

2. **DRY (Don't Repeat Yourself)**
   - Never duplicate types or components across packages
   - Use imports from the source packages

3. **Consistent Theming**
   - All components should support both light and dark modes
   - Use Tailwind's dark mode classes or the theme context

4. **Type Safety**
   - All components and functions should be fully typed
   - Always specify explicit return types for functions

5. **Error Handling**
   - Use error boundaries at logical component boundaries
   - Implement proper error handling for async operations

## Getting Started

If you're new to the bndy platform, start with these guides:

1. Read [CODE_STANDARDS.md](./CODE_STANDARDS.md) for an overview of coding standards
2. Review [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md) to understand how to use shared components
3. Check [THEMING_GUIDE.md](./THEMING_GUIDE.md) to learn about the theming system
4. Study [TYPES_GUIDE.md](./TYPES_GUIDE.md) to understand the type system
5. Read [ERROR_HANDLING.md](./ERROR_HANDLING.md) to learn about error handling

## Additional Resources

- [CODEBASE_ASSESSMENT.md](./CODEBASE_ASSESSMENT.md): Assessment of the current codebase
- [PRD.md](./PRD.md): Product requirements document
- [TODO.md](./TODO.md): Pending tasks and improvements
