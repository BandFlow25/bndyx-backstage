# Duplicate UI Components Audit

This document identifies duplicate UI components between bndy-core and bndy-ui, and outlines a plan for consolidation to ensure we maintain a single source of truth for all shared UI components.

## Identified Duplicate Components

| Component | bndy-core Location | bndy-ui Location | Status | Migration Plan |
|-----------|-------------------|-----------------|--------|---------------|
| Badge | src/components/ui/Badge.tsx | src/components/ui/Badge.tsx | ✓ Ready for removal | Remove from bndy-core, use bndy-ui import |
| Button | src/components/ui/Button.tsx | src/components/ui/Button.tsx | ✓ Ready for removal | Remove from bndy-core, use bndy-ui import |
| Card | src/components/ui/Card.tsx | src/components/ui/Card.tsx | ✓ Ready for removal | Remove from bndy-core, use bndy-ui import |
| Checkbox | src/components/ui/Checkbox.tsx | src/components/ui/Checkbox.tsx | Needs verification | Verify API compatibility before removal |
| Input | src/components/ui/Input.tsx | Not found | Keep | Consider moving to bndy-ui |
| Select | src/components/ui/Select.tsx | Not found | Keep | Consider moving to bndy-ui |

## Consolidation Plan

### Phase 1: Remove Unused Duplicates

1. Remove Badge, Button, and Card components from bndy-core as they are duplicates of components in bndy-ui and are not being imported or used in the codebase.

### Phase 2: Verify and Migrate Other Components

1. Compare the Checkbox component in bndy-core with the one in bndy-ui to ensure API compatibility
2. If compatible, remove from bndy-core and use bndy-ui import
3. If not compatible, update the bndy-ui version to support all needed functionality

### Phase 3: Consider Moving Unique Components to bndy-ui

1. Evaluate Input and Select components for potential migration to bndy-ui
2. If these components provide value across applications, migrate them to bndy-ui
3. Update imports in bndy-core to use the shared components

## Implementation Guidelines

When removing duplicate components:

1. Verify no imports exist in the codebase (grep for import statements)
2. Remove the component file from bndy-core
3. Document the removal in the refactoring plan
4. Run TypeScript checks to ensure no type errors are introduced

When migrating unique components to bndy-ui:

1. Move the component to bndy-ui with minimal changes
2. Add proper documentation and examples
3. Export the component from bndy-ui's index.ts
4. Update imports in bndy-core to use the shared component
5. Remove the original component from bndy-core

## Benefits

- **Single Source of Truth**: All UI components will be maintained in one place
- **Consistency**: UI will be consistent across all applications
- **Maintainability**: Changes only need to be made in one place
- **Reduced Bundle Size**: No duplicate code in the bundle
- **Better Developer Experience**: Clear understanding of where components are defined

## Success Criteria

- All duplicate components are removed from bndy-core
- All shared components are properly exported from bndy-ui
- No TypeScript errors or warnings
- No runtime errors or visual regressions
- Clear documentation for all shared components
