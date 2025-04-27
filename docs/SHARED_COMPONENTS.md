# Shared Components Guide

This document outlines how to use shared components from the bndy-ui package in the bndy-core application. Following these guidelines ensures consistency across all bndy applications and prevents duplication of code.

## Core Principles

1. **Always use shared components from bndy-ui** instead of creating duplicates in bndy-core
2. **Extend bndy-ui** with new components rather than creating them in bndy-core
3. **Follow theming guidelines** for all components to ensure consistent light/dark mode support

## Available Shared Components

The following components are available from bndy-ui and should be used in bndy-core:

### UI Components

```tsx
import { 
  Button,
  Popover, PopoverTrigger, PopoverContent,
  DatePicker,
  PlaceLookup,
  BndySpinner,
  BndyLoadingScreen,
  Toast
} from 'bndy-ui';
```

### Form Components

```tsx
import {
  Checkbox,
  RadioButton,
  SocialMediaInput
} from 'bndy-ui';
```

### Calendar Components

```tsx
import {
  BndyCalendar,
  BndyDatePicker
} from 'bndy-ui';
```

### Authentication Components

```tsx
import { 
  useAuth,
  AuthProvider
} from 'bndy-ui/components/auth';
```

## Usage Examples

### Button Component

```tsx
import { Button } from 'bndy-ui';

// In your component
<Button 
  variant="primary" 
  size="default"
  darkMode={isDarkMode} // Pass the dark mode state
  onClick={handleClick}
>
  Click Me
</Button>
```

### Calendar Component

```tsx
import { BndyCalendar } from 'bndy-ui';
import { useTheme } from '@/lib/context/theme-context';

// In your component
const { isDarkMode } = useTheme();

<BndyCalendar
  events={events}
  isDarkMode={isDarkMode}
  onSelectEvent={handleSelectEvent}
  onSelectSlot={handleSelectSlot}
/>
```

## Extending bndy-ui

When you need a component that doesn't exist in bndy-ui:

1. First, check if it could be useful across multiple applications
2. If yes, add it to bndy-ui instead of bndy-core
3. Follow the existing patterns and theming guidelines in bndy-ui
4. Export the new component in the bndy-ui index.ts file
5. Use the component in bndy-core by importing from bndy-ui

## Component Refactoring Process

When refactoring components in bndy-core:

1. Identify existing components in bndy-core that could be replaced with bndy-ui components
2. Replace custom implementations with imports from bndy-ui
3. For complex components, create composition components in bndy-core that use bndy-ui primitives
4. Ensure all components properly handle theme changes

## Theme Handling

When using shared components, always pass the theme context:

```tsx
import { Button } from 'bndy-ui';
import { useTheme } from '@/lib/context/theme-context';

// In your component
const { isDarkMode } = useTheme();

<Button 
  variant="primary"
  darkMode={isDarkMode}
>
  Themed Button
</Button>
```

## Best Practices

1. **Don't duplicate** components that already exist in bndy-ui
2. **Don't modify** the behavior of shared components with custom wrappers
3. **Do create** composition components that use bndy-ui primitives
4. **Do contribute** new components to bndy-ui when they could be useful across applications
5. **Do follow** the theming guidelines for all components
