# Theming Guide

This document provides a comprehensive guide to the theming system in the bndy platform, including dark mode support, CSS variables, and best practices for consistent theme implementation.

## Table of Contents

1. [Architecture](#architecture)
2. [Theme Context](#theme-context)
3. [CSS Variables](#css-variables)
4. [Tailwind Integration](#tailwind-integration)
5. [Component Implementation](#component-implementation)
6. [Dark Mode Support](#dark-mode-support)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

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

### Provider Setup

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

## CSS Variables

The theming system uses CSS variables to define colors and other theme values. These variables are defined in the `:root` selector and updated when the theme changes.

### Core Variables

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

### Using CSS Variables

```tsx
// In CSS
.button {
  background-color: var(--primary);
  color: var(--primary-foreground);
}

// In Tailwind
<button className="bg-[var(--primary)] text-[var(--primary-foreground)]">
  Click Me
</button>
```

## Tailwind Integration

The theming system integrates with Tailwind CSS to provide utility classes for theme colors.

### Tailwind Configuration

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

### Dark Mode Classes

Tailwind's dark mode is configured to use the `class` strategy, which means dark mode styles are applied when the `.dark` class is present on the `<html>` element.

```tsx
<div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
  Dark mode supported content
</div>
```

## Component Implementation

When implementing components, follow these guidelines to ensure proper theme support:

### 1. Use Theme Context for Dynamic Theme Values

```tsx
import { useTheme } from '@/lib/context/theme-context';

function ThemeAwareComponent() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={isDarkMode ? 'dark-theme-class' : 'light-theme-class'}>
      Theme-aware content
    </div>
  );
}
```

### 2. Use Tailwind Dark Mode Classes

```tsx
function Component() {
  return (
    <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <h2 className="text-slate-900 dark:text-white">Heading</h2>
      <p className="text-slate-600 dark:text-slate-300">Content</p>
    </div>
  );
}
```

### 3. Use CSS Variables for Custom Styling

```tsx
function CustomStyledComponent() {
  return (
    <div style={{ 
      backgroundColor: 'var(--background)',
      color: 'var(--foreground)',
      borderColor: 'var(--border)'
    }}>
      Custom styled content
    </div>
  );
}
```

## Dark Mode Support

All components must support dark mode to ensure a consistent user experience. Here's how to implement dark mode support:

### 1. Component Props for Dark Mode

For components that need explicit dark mode awareness, include a `darkMode` prop:

```tsx
interface ButtonProps {
  children: React.ReactNode;
  darkMode?: boolean;
  // other props
}

function Button({ children, darkMode = false, ...props }: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded";
  const themeClasses = darkMode 
    ? "bg-slate-700 text-white hover:bg-slate-600" 
    : "bg-white text-slate-900 hover:bg-slate-100";
  
  return (
    <button className={`${baseClasses} ${themeClasses}`} {...props}>
      {children}
    </button>
  );
}
```

### 2. Using the Theme Context

For components that need to be theme-aware:

```tsx
import { useTheme } from '@/lib/context/theme-context';

function ThemeAwareComponent() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`
      p-4 rounded-lg
      ${isDarkMode 
        ? 'bg-slate-800 text-white' 
        : 'bg-white text-slate-900'}
    `}>
      Theme-aware content
    </div>
  );
}
```

### 3. Tailwind Dark Mode Classes

For most components, use Tailwind's dark mode classes:

```tsx
function Component() {
  return (
    <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
      <h2 className="font-bold text-slate-900 dark:text-white">Heading</h2>
      <p className="text-slate-600 dark:text-slate-300">Content</p>
      <button className="bg-orange-500 dark:bg-orange-600 text-white">
        Button
      </button>
    </div>
  );
}
```

### 4. Color Palette for Dark Mode

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

## Best Practices

### 1. Consistent Theme Transitions

Add transition effects for a smooth experience when switching themes:

```tsx
<div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors duration-300">
  Content with smooth theme transition
</div>
```

### 2. Test in Both Themes

Always test components in both light and dark mode to ensure they look good in both themes.

### 3. Use Semantic Color Names

Use semantic color names in your CSS variables:

```css
:root {
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --background-primary: #ffffff;
  --background-secondary: #f1f5f9;
}

.dark {
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --background-primary: #0f172a;
  --background-secondary: #1e293b;
}
```

### 4. Avoid Hardcoded Colors

Avoid hardcoding colors in your components:

```tsx
// Good
<div className="bg-white dark:bg-slate-800">

// Avoid
<div style={{ backgroundColor: '#ffffff' }}>
```

### 5. Use Color Contrast Tools

Ensure sufficient color contrast for accessibility in both themes.

## Troubleshooting

### Common Issues

#### 1. Theme Not Applied Correctly

If the theme is not applied correctly:

- Check that the `ThemeProvider` is properly set up at the root of your application
- Verify that the `dark` class is being added to the `html` element when dark mode is active
- Check that you're using the correct CSS variables or Tailwind classes

#### 2. Flickering on Theme Change

If there's flickering when changing themes:

- Add transition effects to smooth the change: `transition-colors duration-300`
- Use the `isLoaded` property from the theme context to avoid rendering until the theme is loaded

#### 3. Inconsistent Theme Application

If theme changes aren't applied consistently:

- Check that you're using the theme context correctly
- Verify that your components are wrapped in the `ThemeProvider`
- Ensure all components use either Tailwind dark mode classes or the theme context

#### 4. Third-Party Components Not Themed

For third-party components that don't support theming:

- Create a wrapper component that applies theme-specific styles
- Use the `isDarkMode` value from the theme context to apply appropriate styles

### Debugging Tips

1. Use browser dev tools to inspect the applied classes and CSS variables
2. Check if the `dark` class is present on the `html` element in dark mode
3. Test with the theme toggler to verify theme changes are working
4. Use the React DevTools to inspect the theme context values
