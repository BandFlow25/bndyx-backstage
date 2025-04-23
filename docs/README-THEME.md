# bndy-core Theming System

## Quick Start Guide

The bndy-core application uses a robust theming system that supports both light and dark modes. This guide will help you understand how to use the theming system and ensure your components are theme-aware.

## How to Use the Theme in Components

### 1. Access the Theme Context

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

### 2. Use Tailwind Dark Mode Classes

```tsx
<div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
  This content will adapt to the current theme
</div>
```

### 3. Use CSS Variables

```tsx
<div style={{ 
  backgroundColor: 'var(--card-bg)',
  color: 'var(--text-primary)',
  borderColor: 'var(--card-border)'
}}>
  This content uses CSS variables
</div>
```

## Theme Checklist for New Components

When creating new UI elements, ensure they are theme-aware by following this checklist:

- [ ] Use Tailwind's `dark:` prefix for all color-related classes
- [ ] Test the component in both light and dark modes
- [ ] Ensure sufficient contrast for text elements in both themes
- [ ] Add `transition-colors duration-300` for smooth theme transitions
- [ ] Use semantic color variables instead of hardcoded colors
- [ ] Check for any theme-related edge cases or special handling

## Common Theme-Aware UI Elements

### Buttons

```tsx
<button className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-300">
  Theme-aware Button
</button>
```

### Cards

```tsx
<div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-lg p-4">
  <h3 className="text-slate-900 dark:text-white font-semibold">Card Title</h3>
  <p className="text-slate-700 dark:text-slate-300">Card content</p>
</div>
```

### Form Inputs

```tsx
<input 
  type="text"
  className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300"
/>
```

### Text Elements

```tsx
<h1 className="text-slate-900 dark:text-white font-bold">Heading</h1>
<p className="text-slate-700 dark:text-slate-300">Paragraph text</p>
<span className="text-slate-500 dark:text-slate-400">Muted text</span>
```

## Handling Edge Cases

If you encounter elements that don't have enough contrast in dark mode, you can add custom CSS classes in `theme.css`:

```css
/* High contrast fixes for dark mode */
.dark .custom-element {
  color: rgba(255, 255, 255, 0.95) !important;
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
  font-weight: 600 !important;
}
```

Then apply the class to your element:

```tsx
<div className="text-slate-800 dark:text-slate-200 custom-element">
  High contrast text
</div>
```

## Theme Variables Reference

Here are the key CSS variables available for theming:

| Variable | Light Mode | Dark Mode | Usage |
|----------|------------|-----------|-------|
| `--background` | `#ffffff` | `#0f172a` | Page backgrounds |
| `--foreground` | `#171717` | `#f8fafc` | Primary content |
| `--card-bg` | `#ffffff` | `#1e293b` | Card backgrounds |
| `--card-border` | `#e2e8f0` | `#334155` | Card borders |
| `--input-bg` | `#f8fafc` | `#1e293b` | Form input backgrounds |
| `--input-border` | `#e2e8f0` | `#475569` | Form input borders |
| `--text-primary` | `#0f172a` | `#f8fafc` | Primary text |
| `--text-secondary` | `#475569` | `#cbd5e1` | Secondary text |
| `--text-muted` | `#94a3b8` | `#94a3b8` | Muted/helper text |

## Further Resources

For more detailed information about the theming system, refer to:

- [Complete Theming Documentation](./THEMING.md)
- [bndy-ui Theming Guidelines](../../bndy-ui/docs/THEMING.md)
- [Tailwind Dark Mode Documentation](https://tailwindcss.com/docs/dark-mode)

## TypeScript Validation

Always run TypeScript validation after making theme-related changes:

```bash
npm run type-check
# or
npx tsc --noEmit
```

This ensures your theme implementations don't introduce any type errors.
