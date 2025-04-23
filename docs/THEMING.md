# Theming System Documentation

## Overview

The bndy-core application uses a comprehensive theming system that supports both light and dark modes. This document outlines how the theming system works, how to use it in your components, and best practices for ensuring theme consistency across the application.

## Table of Contents

1. [Architecture](#architecture)
2. [Theme Context](#theme-context)
3. [CSS Variables](#css-variables)
4. [Tailwind Integration](#tailwind-integration)
5. [Component Implementation](#component-implementation)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Architecture

The theming system consists of several key components:

1. **Theme Context**: A React context that manages the theme state and provides toggle functionality
2. **CSS Variables**: Global CSS variables that define colors for both light and dark modes
3. **Tailwind Configuration**: Integration with Tailwind CSS for utility classes
4. **Theme Utilities**: Helper functions for applying themes and handling transitions

This architecture ensures a consistent theme experience across the entire application while maintaining good performance and developer experience.

## Theme Context

The theme context is defined in `src/lib/context/theme-context.tsx` and provides:

- `isDarkMode`: A boolean indicating whether dark mode is active
- `toggleTheme`: A function to toggle between light and dark modes
- `isLoaded`: A boolean indicating whether the theme has been fully loaded

### Usage

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

The theme context handles:
- Reading user preferences from localStorage
- Detecting system color scheme preferences
- Applying the appropriate theme classes to the HTML element
- Persisting theme choices between sessions

## CSS Variables

CSS variables are defined in `src/app/globals.css` and provide a consistent color palette for both light and dark modes.

### Key Variables

```css
:root {
  /* Light mode variables (default) */
  --background: #ffffff;
  --foreground: #171717;
  --card-bg: #ffffff;
  --card-border: #e2e8f0;
  /* ... other variables ... */
}

.dark {
  /* Dark mode variables */
  --background: #0f172a;
  --foreground: #f8fafc;
  --card-bg: #1e293b;
  --card-border: #334155;
  /* ... other variables ... */
}
```

These variables should be used instead of hardcoded color values to ensure theme consistency.

## Tailwind Integration

The theming system integrates with Tailwind CSS through the `tailwind.config.js` file, which maps CSS variables to Tailwind color utilities.

### Configuration

```js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // ... other color mappings ...
      }
    }
  }
}
```

This allows you to use Tailwind classes like `bg-background` and `text-foreground` that will automatically adapt to the current theme.

## Component Implementation

When implementing theme-aware components, you have two main approaches:

### 1. Tailwind Dark Mode Classes

```tsx
<div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
  This div will have a white background and dark text in light mode,
  and a dark slate background with white text in dark mode.
</div>
```

### 2. CSS Variables

```tsx
<div style={{ 
  backgroundColor: 'var(--card-bg)',
  color: 'var(--foreground)'
}}>
  This div uses CSS variables directly.
</div>
```

### 3. Dynamic Styles Based on Theme Context

```tsx
const { isDarkMode } = useTheme();

<div style={{ 
  backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
  color: isDarkMode ? '#ffffff' : '#0f172a'
}}>
  This div changes styles based on the theme context.
</div>
```

## Best Practices

1. **Always use theme variables or Tailwind dark mode classes** instead of hardcoded colors
2. **Test all components in both light and dark modes** before committing
3. **Use the `transition-colors` class** for smooth theme transitions
4. **Ensure sufficient contrast** in both light and dark modes
5. **Use semantic color variables** (e.g., `--card-bg` instead of `--slate-800`)
6. **Add custom CSS classes for edge cases** where Tailwind classes don't provide enough specificity
7. **Avoid direct DOM manipulation** for theme changes; use the theme context instead

## Troubleshooting

### Hydration Mismatches

If you encounter hydration mismatches, ensure:
1. You're not manipulating theme classes directly in `useEffect` hooks
2. The initial state in your components matches the server-rendered state
3. You're checking for `typeof window !== 'undefined'` before accessing browser APIs

### Inconsistent Theme Application

If theme changes aren't applied consistently:
1. Check that you're using the theme context correctly
2. Verify that your components are wrapped in the `ThemeProvider`
3. Ensure CSS variables are being applied to the correct elements
4. Check for CSS specificity issues that might be overriding theme styles

### Poor Contrast in Dark Mode

If text or elements have poor contrast in dark mode:
1. Use the `.dark` selector with higher specificity CSS rules
2. Add custom CSS classes with `!important` for critical elements
3. Use text shadows to improve readability against dark backgrounds
4. Test with accessibility tools to ensure sufficient contrast ratios
