# Theme-Aware UI Development Guidelines

## Core Principles

When developing new UI components or features for the bndy platform, follow these principles to ensure theme consistency:

1. **Theme-First Design**: Consider both light and dark themes from the beginning of development
2. **Consistent Contrast**: Maintain WCAG AA contrast ratios (4.5:1 for normal text) in both themes
3. **Smooth Transitions**: Include transition effects for all theme-dependent properties
4. **Reuse Existing Patterns**: Build on established theming patterns rather than creating new ones
5. **Test in Both Modes**: Always verify your UI in both light and dark modes before committing

## Implementation Checklist

For every new UI element:

- [ ] Use CSS variables or Tailwind dark mode classes for all color properties
- [ ] Add `transition-colors duration-300` to elements that change color with theme
- [ ] Test with system dark mode and manual theme toggle
- [ ] Verify text readability and element contrast in both themes
- [ ] Check for any unwanted flashes during theme transitions
- [ ] Ensure consistent appearance with surrounding UI elements

## Code Standards

### Tailwind Usage

```tsx
// RECOMMENDED
<div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
  Theme-aware content
</div>

// AVOID
<div className="bg-white text-slate-900">
  Non-theme-aware content
</div>
```

### CSS Variables

```css
/* RECOMMENDED */
.my-component {
  background-color: var(--card-bg);
  color: var(--text-primary);
  border-color: var(--card-border);
}

/* AVOID */
.my-component {
  background-color: #ffffff;
  color: #0f172a;
  border-color: #e2e8f0;
}
```

### Dynamic Styles

```tsx
// RECOMMENDED
const { isDarkMode } = useTheme();

<div style={{ 
  boxShadow: isDarkMode 
    ? '0 4px 6px rgba(0, 0, 0, 0.5)' 
    : '0 1px 3px rgba(0, 0, 0, 0.1)'
}}>
  Content with theme-aware shadow
</div>

// AVOID
<div style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
  Content with fixed shadow
</div>
```

## Common UI Elements

### Buttons

```tsx
<button className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-300">
  Theme-aware Button
</button>
```

### Cards

```tsx
<div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-lg p-4 transition-colors duration-300">
  <h3 className="text-slate-900 dark:text-white font-semibold">Card Title</h3>
  <p className="text-slate-700 dark:text-slate-300">Card content</p>
</div>
```

### Form Elements

```tsx
<label className="block text-slate-700 dark:text-slate-300 mb-2">
  Field Label
</label>
<input 
  type="text"
  className="w-full bg-input-bg border border-input-border rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300"
/>
<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
  Helper text
</p>
```

### Icons

```tsx
<svg 
  className="w-5 h-5 text-slate-700 dark:text-slate-300 transition-colors duration-300"
  fill="currentColor" 
  viewBox="0 0 20 20"
>
  <!-- Icon paths -->
</svg>
```

## Edge Cases and Solutions

### High Contrast Text

For text that needs extra contrast in dark mode:

```css
/* In theme.css */
.dark .high-contrast-text {
  color: rgba(255, 255, 255, 0.95) !important;
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
  font-weight: 600 !important;
}
```

### Images and Media

For images that need different versions in dark mode:

```tsx
const { isDarkMode } = useTheme();

<img 
  src={isDarkMode ? '/images/logo-dark.png' : '/images/logo-light.png'}
  alt="Logo"
  className="transition-opacity duration-300"
/>
```

### Complex UI Components

For complex components with multiple theme-dependent elements:

```tsx
<div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden transition-colors duration-300">
  <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 border-b border-slate-200 dark:border-slate-600 transition-colors duration-300">
    <h3 className="text-slate-900 dark:text-white font-semibold">Component Header</h3>
  </div>
  <div className="p-4">
    <p className="text-slate-700 dark:text-slate-300">Component content</p>
  </div>
  <div className="bg-slate-50 dark:bg-slate-700 px-4 py-2 border-t border-slate-200 dark:border-slate-600 transition-colors duration-300">
    <button className="text-orange-500 hover:text-orange-600 transition-colors duration-300">
      Action
    </button>
  </div>
</div>
```

## Testing and Validation

Before submitting new UI components:

1. Toggle between light and dark modes multiple times to check transitions
2. Verify all text meets contrast requirements in both themes
3. Check for any elements that don't change appropriately with theme
4. Test with system preference changes
5. Validate that no theme-related console errors occur
6. Run TypeScript validation to ensure no type errors

## Resources

- [Complete Theming Documentation](./THEMING.md)
- [Theme-Aware Component Template](../src/components/templates/ThemeAwareComponent.tsx)
- [Tailwind Dark Mode Documentation](https://tailwindcss.com/docs/dark-mode)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

By following these guidelines, we can ensure a consistent and accessible theming experience across the entire bndy platform.
