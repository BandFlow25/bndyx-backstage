# UI Components Guide

This document provides an overview of the theme-aware UI components available in the bndy-core application. These components are designed to ensure consistent styling and behavior across the application while supporting both light and dark themes.

## Basic Usage

Import components from the UI components package:

```tsx
import { Button, Card, Badge, Input, Select, Checkbox } from '@/components/ui';
```

## Components

### Button

A versatile button component with various styles and states.

```tsx
<Button 
  variant="primary" // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size="md" // 'sm' | 'md' | 'lg'
  isLoading={false}
  leftIcon={<Icon />}
  rightIcon={<Icon />}
  fullWidth={false}
  onClick={() => {}}
>
  Button Text
</Button>
```

### Card

A container component for organizing content with consistent styling.

```tsx
<Card 
  variant="default" // 'default' | 'bordered' | 'elevated'
  padding="md" // 'none' | 'sm' | 'md' | 'lg'
  onClick={() => {}} // Optional click handler
>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Optional description text</CardDescription>
  </CardHeader>
  
  <CardContent>
    Main content goes here
  </CardContent>
  
  <CardFooter>
    Footer content, often actions
  </CardFooter>
</Card>
```

### Badge

A small component for displaying status, tags, or short pieces of information.

```tsx
<Badge 
  variant="default" // 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size="md" // 'sm' | 'md' | 'lg'
  onClick={() => {}} // Optional click handler
>
  Badge Text
</Badge>
```

### Input

A form input component with various states and styles.

```tsx
<Input
  label="Input Label"
  placeholder="Placeholder text"
  helperText="Helper text appears below the input"
  error="Error message if validation fails"
  leftIcon={<Icon />}
  rightIcon={<Icon />}
  size="md" // 'sm' | 'md' | 'lg'
  fullWidth={false}
  disabled={false}
  onChange={(e) => {}}
/>
```

### Select

A dropdown select component for choosing from a list of options.

```tsx
<Select
  label="Select Label"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2', disabled: true },
    { value: 'option3', label: 'Option 3' }
  ]}
  helperText="Helper text appears below the select"
  error="Error message if validation fails"
  size="md" // 'sm' | 'md' | 'lg'
  fullWidth={false}
  disabled={false}
  onChange={(e) => {}}
/>
```

### Checkbox

A checkbox component for boolean selections.

```tsx
<Checkbox
  label="Checkbox Label"
  helperText="Helper text appears below the checkbox"
  error="Error message if validation fails"
  checked={false}
  disabled={false}
  onChange={(e) => {}}
/>
```

## Theming

All components automatically adapt to light and dark themes based on the application's theme context. They include:

- Proper color transitions with `transition-colors duration-300`
- Dark mode classes using Tailwind's `dark:` prefix
- CSS variables for consistent colors using `var(--text-primary)`, `var(--text-secondary)`, etc.

## Best Practices

1. Always use these components instead of creating custom one-off UI elements
2. Maintain consistent spacing and sizing across your layouts
3. Use the appropriate variant for the context (e.g., use `danger` variant for destructive actions)
4. Include proper aria attributes for accessibility
5. Follow the form field patterns for all input components (label, helper text, error handling)

## Extending Components

When extending these components or creating new ones, follow these guidelines:

1. Include proper TypeScript interfaces
2. Support both light and dark themes
3. Add transition effects for theme changes
4. Use Tailwind classes for styling
5. Include appropriate accessibility attributes
6. Document the component in this guide
