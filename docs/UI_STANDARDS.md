# BNDY UI Standards Guide

This document provides a comprehensive guide to UI standards across the BNDY platform, including theming, component usage, layout patterns, and best practices for ensuring consistency across all applications.

## Table of Contents

1. [Layout Standards](#layout-standards)
   - [Container Structure](#container-structure)
   - [Section Headers](#section-headers)
   - [Content Padding](#content-padding)
   - [Component Structure](#component-structure)
2. [Theming System](#theming-system)
   - [Architecture](#architecture)
   - [Theme Context](#theme-context)
   - [CSS Variables](#css-variables)
   - [Tailwind Integration](#tailwind-integration)
   - [Dark Mode Support](#dark-mode-support)
3. [Component Usage](#component-usage)
   - [Core Principles](#core-principles)
   - [Component Categories](#component-categories)
   - [Using Shared Components](#using-shared-components)
4. [Best Practices](#best-practices)
   - [Layout Best Practices](#layout-best-practices)
   - [Theming Best Practices](#theming-best-practices)
   - [Component Best Practices](#component-best-practices)
5. [Troubleshooting](#troubleshooting)

## Layout Standards

### Container Structure

- All page content should be wrapped in a container with the following class: 
  `container mx-auto px-0 py-3 bg-white dark:bg-slate-900 transition-colors duration-300`
- Do NOT add additional container wrappers that might introduce double padding
- Page components should return fragments (`<>...</>`) rather than container divs to avoid unnecessary nesting

### Section Headers

- Section headers should use the following pattern:
  ```tsx
  <div className="flex items-center px-4 py-2">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
  </div>
  ```
- For collapsible sections, use the `CollapsibleSection` component from `MyDashboard.tsx`
- Page titles should use the `CalendarHeader` component for consistency

### Content Padding

- Apply padding at the section level, not at the component level
- Use `px-4` for horizontal padding of content sections
- Avoid nested padding containers that create excessive indentation
- For card grids and similar components, do not add padding within the component itself
- Content sections should have consistent vertical spacing with `mb-4`

### Component Structure

The following structure should be used for consistent layouts:

```tsx
// Page component
export default function PageName() {
  return (
    <>
      {/* Page Header */}
      <CalendarHeader 
        title="Page Title" 
        darkMode={isDarkMode}
        backLink="/previous-page"
      />
      
      {/* Content Sections */}
      <div className="mb-4">
        <div className="flex items-center px-4 py-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Section Title</h2>
        </div>
        <div className="px-4">
          <ContentComponent />
        </div>
      </div>
    </>
  );
}
```

## Theming System

### Architecture

The theming system consists of several key components:

1. **Theme Context**: A React context that manages the theme state and provides toggle functionality
2. **CSS Variables**: Global CSS variables that define colors for both light and dark modes
3. **Tailwind Configuration**: Integration with Tailwind CSS for utility classes
4. **Theme Utilities**: Helper functions for applying themes and handling transitions

This architecture ensures a consistent theme experience across the entire application while maintaining good performance and developer experience.

### Theme Context

The theme context is defined in `src/lib/context/theme-context.tsx` and provides:

- `isDarkMode`: A boolean indicating whether dark mode is active
- `toggleTheme`: A function to toggle between light and dark modes
- `isLoaded`: A boolean indicating whether the theme has been fully loaded

#### Usage

```tsx
import { useTheme } from '@/lib/context/theme-context';

function MyComponent() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {isDarkMode ? 'Dark' : 'Light'}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

#### Provider Setup

The ThemeProvider should be set up at the root of your application:

```tsx
import { ThemeProvider } from '@/lib/context/theme-context';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### CSS Variables

The theming system uses CSS variables to define colors and other theme values. These variables are defined in the `:root` selector and updated when the theme changes.

#### Core Variables

```css
:root {
  /* Light mode (default) */
  --background: #ffffff;
  --foreground: #0f172a;
  --primary: #f97316;
  --primary-foreground: #ffffff;
  --secondary: #f1f5f9;
  --secondary-foreground: #0f172a;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  --accent: #f1f5f9;
  --accent-foreground: #0f172a;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: #f97316;
  --radius: 0.5rem;
}

.dark {
  /* Dark mode */
  --background: #0f172a;
  --foreground: #f8fafc;
  --primary: #f97316;
  --primary-foreground: #ffffff;
  --secondary: #1e293b;
  --secondary-foreground: #f8fafc;
  --muted: #1e293b;
  --muted-foreground: #94a3b8;
  --accent: #1e293b;
  --accent-foreground: #f8fafc;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #1e293b;
  --input: #1e293b;
  --ring: #f97316;
}
```

### Tailwind Integration

The theming system integrates with Tailwind CSS to provide utility classes for theme colors.

#### Tailwind Configuration

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Theme colors can be referenced here
      }
    }
  }
}
```

#### Dark Mode Classes

Tailwind's dark mode is configured to use the `class` strategy, which means dark mode styles are applied when the `.dark` class is present on the `<html>` element.

```tsx
<div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
  Dark mode supported content
</div>
```

### Dark Mode Support

All components must support dark mode to ensure a consistent user experience.

#### Color Palette for Dark Mode

Use the following color palette for dark mode:

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | bg-white | bg-slate-800 |
| Text | text-slate-900 | text-white |
| Secondary Text | text-slate-600 | text-slate-300 |
| Borders | border-slate-200 | border-slate-700 |
| Inputs | bg-white | bg-slate-700 |
| Primary Button | bg-orange-500 | bg-orange-600 |
| Secondary Button | bg-slate-200 | bg-slate-700 |

## Component Usage

### Core Principles

1. **Single Source of Truth**: All shared UI components should be defined in the `bndy-ui` package
2. **DRY (Don't Repeat Yourself)**: Never duplicate components across packages
3. **Consistent Styling**: All components should follow the same design system and theming approach
4. **Accessibility**: All components should be accessible and follow WCAG guidelines
5. **Type Safety**: All components should be fully typed with TypeScript

### Component Categories

The bndy-ui package provides several categories of components:

#### UI Components

Basic UI building blocks:

```tsx
import { 
  Button,
  Card,
  Popover, PopoverTrigger, PopoverContent,
  Dialog, DialogTrigger, DialogContent,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Avatar,
  Badge,
  Tooltip
} from 'bndy-ui';
```

#### Form Components

Components for building forms:

```tsx
import {
  Input,
  Textarea,
  Checkbox,
  RadioGroup, RadioButton,
  Select, SelectItem,
  Switch,
  Slider,
  DatePicker,
  TimePicker
} from 'bndy-ui';
```

#### Layout Components

Components for page layout:

```tsx
import {
  Container,
  Grid,
  Flex,
  Box,
  Divider,
  Spacer
} from 'bndy-ui';
```

#### Calendar Components

Components for calendar functionality:

```tsx
import {
  BndyCalendar,
  BndyDatePicker,
  EventForm,
  EventDetailsModal
} from 'bndy-ui';
```

### Using Shared Components

#### Importing Components

Import components directly from bndy-ui:

```tsx
import { 
  Button,
  Popover, 
  DatePicker,
  BndyCalendar
} from 'bndy-ui';
```

## Best Practices

### Layout Best Practices

1. **Consistent Container Structure**: Use the standard container structure for all pages
2. **Proper Padding Hierarchy**: Apply padding at the section level, not at the component level
3. **Avoid Nested Containers**: Don't nest containers that each apply padding
4. **Use Fragments**: Use fragments instead of unnecessary div wrappers
5. **Consistent Spacing**: Use consistent margin and padding values across the application
6. **Responsive Design**: Ensure layouts work well on all screen sizes
7. **Test Edge Cases**: Test layouts with long content, different screen sizes, and both themes

### Theming Best Practices

1. **Consistent Theme Transitions**: Add transition effects for a smooth experience when switching themes
   ```tsx
   <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors duration-300">
     Content with smooth theme transition
   </div>
   ```

2. **Test in Both Themes**: Always test components in both light and dark mode to ensure they look good in both themes

3. **Use Semantic Color Names**: Use semantic color names in your CSS variables

4. **Avoid Hardcoded Colors**: Avoid hardcoding colors in your components
   ```tsx
   // Good
   <div className="bg-white dark:bg-slate-800">

   // Avoid
   <div style={{ backgroundColor: '#ffffff' }}>
   ```

5. **Use Color Contrast Tools**: Ensure sufficient color contrast for accessibility in both themes

### Component Best Practices

1. **Always Use Shared Components**: Use shared components from bndy-ui instead of creating duplicates

2. **Extend Rather Than Duplicate**: If you need to customize a component, extend it rather than duplicating it
   ```tsx
   import { Button } from 'bndy-ui';

   function CustomButton({ children, ...props }) {
     return (
       <Button 
         {...props}
         className="custom-button-class"
       >
         {children}
       </Button>
     );
   }
   ```

3. **Composition Over Configuration**: Use composition to create complex UIs

4. **Consistent Props API**: Follow consistent patterns for component props
   - Use `onClick`, `onChange`, etc. for event handlers
   - Use `isLoading`, `isDisabled`, etc. for boolean states
   - Use `variant`, `size`, etc. for appearance options

5. **Testing Components**: Always test components in both light and dark mode

## Troubleshooting

### Layout Issues

1. **Double Padding**: If elements appear to have too much padding, check for nested containers that both apply padding
2. **Inconsistent Alignment**: Ensure all section headers use the same padding values
3. **Responsive Issues**: Test on different screen sizes and ensure proper breakpoint handling
4. **Overflow Issues**: Check for content that might overflow containers on smaller screens

### Theme Issues

1. **Theme Not Applied Correctly**: Check that the theme context is properly set up and the component is within the ThemeProvider
2. **Hydration Mismatches**: Ensure server-rendered content matches client-rendered content
3. **Inconsistent Theme Application**: Verify that all components use the same theming approach
4. **Poor Contrast in Dark Mode**: Use accessibility tools to ensure sufficient contrast in both themes

### Component Issues

1. **Prop Type Errors**: Check that you're passing the correct props to components
2. **Styling Inconsistencies**: Ensure components use the standard Tailwind classes for styling
3. **Accessibility Issues**: Test components with screen readers and keyboard navigation
4. **Performance Issues**: Check for unnecessary re-renders or heavy components
