# Components Guide

This document provides a comprehensive guide to using shared components from the bndy-ui package across the bndy platform, ensuring consistency and DRY principles in UI development.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Component Architecture](#component-architecture)
3. [Using Shared Components](#using-shared-components)
4. [Component Categories](#component-categories)
5. [Theming Components](#theming-components)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Core Principles

1. **Single Source of Truth**: All shared UI components should be defined in the `bndy-ui` package
2. **DRY (Don't Repeat Yourself)**: Never duplicate components across packages
3. **Consistent Styling**: All components should follow the same design system and theming approach
4. **Accessibility**: All components should be accessible and follow WCAG guidelines
5. **Type Safety**: All components should be fully typed with TypeScript

## Component Architecture

The bndy ecosystem follows this component hierarchy:

```
bndy-ui (source of truth for components)
    ↑
    └── bndy-core (consumes components)
```

This unidirectional flow ensures that components are defined once and used consistently across all applications.

## Using Shared Components

### Importing Components

Import components directly from bndy-ui:

```tsx
import { 
  Button,
  Popover, 
  DatePicker,
  BndyCalendar
} from 'bndy-ui';
```

### Component Props

All components have TypeScript interfaces for their props:

```tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
```

### Basic Usage

```tsx
import { Button } from 'bndy-ui';

function MyComponent() {
  return (
    <Button 
      variant="primary" 
      size="md" 
      onClick={() => console.log('Button clicked')}
    >
      Click Me
    </Button>
  );
}
```

## Component Categories

The bndy-ui package provides several categories of components:

### UI Components

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

### Form Components

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
  TimePicker,
  SocialMediaInput,
  PlaceLookup
} from 'bndy-ui';
```

### Layout Components

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

### Data Display Components

Components for displaying data:

```tsx
import {
  Table,
  List,
  Card,
  Stat,
  Timeline
} from 'bndy-ui';
```

### Feedback Components

Components for user feedback:

```tsx
import {
  Alert,
  Toast,
  Progress,
  Skeleton,
  Spinner,
  ErrorBoundary,
  ApiErrorBoundary
} from 'bndy-ui';
```

### Navigation Components

Components for navigation:

```tsx
import {
  Navbar,
  Sidebar,
  Breadcrumb,
  Pagination,
  Tabs
} from 'bndy-ui';
```

### Calendar Components

Components for calendar functionality:

```tsx
import {
  BndyCalendar,
  BndyDatePicker,
  EventForm,
  EventDetailsModal
} from 'bndy-ui';
```

### Authentication Components

Components for authentication:

```tsx
import {
  AuthProvider,
  useAuth,
  LoginForm,
  SignupForm,
  PasswordResetForm
} from 'bndy-ui';
```

## Theming Components

All components in bndy-ui support theming through:

### 1. Dark Mode Support

Components automatically adapt to dark mode when the `.dark` class is present on the `<html>` element:

```tsx
// Components will automatically use dark mode styles
<div className="bg-white dark:bg-slate-800">
  <Button>Dark Mode Supported Button</Button>
</div>
```

### 2. Theme Context

Some components accept a `darkMode` prop for explicit theme control:

```tsx
import { BndyCalendar } from 'bndy-ui';
import { useTheme } from '@/lib/context/theme-context';

function MyCalendar() {
  const { isDarkMode } = useTheme();
  
  return (
    <BndyCalendar
      events={events}
      isDarkMode={isDarkMode}
    />
  );
}
```

### 3. CSS Variables

Components use CSS variables for theming, which can be customized:

```css
:root {
  --primary: #f97316;
  --primary-foreground: #ffffff;
  --background: #ffffff;
  --foreground: #0f172a;
}

.dark {
  --primary: #f97316;
  --primary-foreground: #ffffff;
  --background: #0f172a;
  --foreground: #f8fafc;
}
```

## Best Practices

### 1. Always Use Shared Components

Always use shared components from bndy-ui instead of creating duplicates:

```tsx
// Good
import { Button } from 'bndy-ui';

function MyComponent() {
  return <Button>Click Me</Button>;
}

// Avoid
function CustomButton({ children }) {
  return <button className="px-4 py-2 bg-blue-500 text-white">{children}</button>;
}
```

### 2. Extend Rather Than Duplicate

If you need to customize a component, extend it rather than duplicating it:

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

### 3. Composition Over Configuration

Use composition to create complex UIs:

```tsx
import { Card, Button, Flex } from 'bndy-ui';

function ProductCard({ product }) {
  return (
    <Card>
      <Card.Header>
        <h3>{product.name}</h3>
      </Card.Header>
      <Card.Body>
        <p>{product.description}</p>
      </Card.Body>
      <Card.Footer>
        <Flex justify="between">
          <span>${product.price}</span>
          <Button>Add to Cart</Button>
        </Flex>
      </Card.Footer>
    </Card>
  );
}
```

### 4. Consistent Props API

Follow consistent patterns for component props:

- Use `onClick`, `onChange`, etc. for event handlers
- Use `isLoading`, `isDisabled`, etc. for boolean states
- Use `variant`, `size`, etc. for appearance options

### 5. Testing Components

Always test components in both light and dark mode:

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from 'bndy-ui';

test('Button renders correctly in light mode', () => {
  render(<Button>Test</Button>);
  expect(screen.getByText('Test')).toBeInTheDocument();
});

test('Button renders correctly in dark mode', () => {
  document.documentElement.classList.add('dark');
  render(<Button>Test</Button>);
  expect(screen.getByText('Test')).toBeInTheDocument();
  document.documentElement.classList.remove('dark');
});
```

## Troubleshooting

### Common Issues

#### 1. Component Styling Inconsistencies

If component styling is inconsistent:

- Check that you're using the latest version of bndy-ui
- Verify that the theme context is properly set up
- Check for CSS conflicts in your application

#### 2. Type Errors

If you encounter type errors:

- Check that you're providing all required props
- Verify that you're using the correct prop types
- Check for version mismatches between packages

#### 3. Dark Mode Issues

If dark mode isn't working correctly:

- Verify that the `.dark` class is being added to the `<html>` element
- Check that you're passing the `darkMode` prop to components that require it
- Inspect the CSS variables to ensure they're being applied correctly

### Debugging Tips

1. Use React DevTools to inspect component props and state
2. Check the browser console for errors
3. Use the `className` prop to add debug classes to components
4. Test components in isolation to identify issues
