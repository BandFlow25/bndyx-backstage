# Error Handling Guide

This document provides a comprehensive guide to error handling in the bndy platform, including error boundaries, API error handling, and best practices.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Error Boundary Components](#error-boundary-components)
3. [Implementation Strategy](#implementation-strategy)
4. [Dark Mode Support](#dark-mode-support)
5. [API Error Handling](#api-error-handling)
6. [Best Practices](#best-practices)
7. [Examples](#examples)
8. [Troubleshooting](#troubleshooting)

## Core Principles

1. **Graceful Degradation**: Applications should continue functioning even when parts fail
2. **Informative Feedback**: Users should receive clear, actionable error messages
3. **Comprehensive Logging**: Errors should be logged with sufficient context for debugging
4. **Recovery Paths**: Where possible, provide ways to recover from errors
5. **Consistent Patterns**: Use the same error handling patterns throughout the codebase
6. **Dark Mode Support**: All error UIs must respect the application's theme settings

## Error Boundary Components

The bndy platform provides two main error boundary components from the `bndy-ui` package:

### 1. `ErrorBoundary`

A general-purpose error boundary for catching errors in any component tree.

**Location**: `bndy-ui/src/components/error/ErrorBoundary.tsx`

**Props**:
- `children`: React nodes to be rendered inside the error boundary
- `fallback`: Optional custom fallback UI or function that renders fallback UI
- `onError`: Optional callback function called when an error is caught
- `resetKeys`: Optional array of values that, when changed, will reset the error boundary

**Basic Usage**:
```tsx
import { ErrorBoundary } from 'bndy-ui';

<ErrorBoundary>
  <ComponentThatMightError />
</ErrorBoundary>
```

**With Custom Fallback**:
```tsx
<ErrorBoundary 
  fallback={(error, reset) => (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
      <h3 className="font-medium text-red-800 dark:text-red-300">Error</h3>
      <p className="text-red-700 dark:text-red-400">{error.message}</p>
      <button 
        onClick={reset}
        className="mt-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
      >
        Try Again
      </button>
    </div>
  )}
>
  <ComponentThatMightError />
</ErrorBoundary>
```

### 2. `ApiErrorBoundary`

A specialized error boundary for data fetching and API operations.

**Location**: `bndy-ui/src/components/error/ApiErrorBoundary.tsx`

**Props**:
- `children`: React nodes to be rendered inside the error boundary
- `onRetry`: Optional callback function to retry the failed operation
- `darkMode`: Optional boolean to enable dark mode styling

**Basic Usage**:
```tsx
import { ApiErrorBoundary } from 'bndy-ui';
import { useTheme } from '@/lib/context/theme-context';

const { isDarkMode } = useTheme();

<ApiErrorBoundary 
  onRetry={() => fetchData()}
  darkMode={isDarkMode}
>
  <DataFetchingComponent />
</ApiErrorBoundary>
```

## Implementation Strategy

Error boundaries have been implemented at various levels of the application:

### 1. Root Application Level

**Location**: `src/app/layout.tsx`

**Purpose**: Catch any unhandled errors at the application level to prevent the entire app from crashing.

**Implementation**:
```tsx
<html lang="en">
  <body className={`${inter.variable} antialiased`}>
    <ErrorBoundary>
      <AuthProvider>
        <ArtistProvider>
          <CalendarProvider>
            <ThemeProvider>
              <GoogleMapsProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                {children}
              </GoogleMapsProvider>
            </ThemeProvider>
          </CalendarProvider>
        </ArtistProvider>
      </AuthProvider>
    </ErrorBoundary>
  </body>
</html>
```

### 2. Main Layout Level

**Location**: `src/components/layout/MainLayout.tsx`

**Purpose**: Isolate errors in the layout components (sidebar, main content) to prevent layout-related errors from affecting the entire application.

### 3. Page-Level Error Boundaries

**Location**: Various page components (Dashboard, Calendar, Artist Profile, etc.)

**Purpose**: Catch errors specific to each page to prevent page-specific errors from affecting other pages.

**Dashboard Page Example**:
```tsx
<MainLayout>
  <ErrorBoundary>
    <div className="container mx-auto px-4 py-6">
      {/* Page content */}
      <ApiErrorBoundary onRetry={() => refreshArtists()}>
        <MyDashboard artists={currentUserArtists} />
      </ApiErrorBoundary>
    </div>
  </ErrorBoundary>
</MainLayout>
```

### 4. Component-Level Error Boundaries

**Location**: Various complex components (ArtistProfileHeader, QuickLinks, etc.)

**Purpose**: Isolate errors in complex components to prevent component-specific errors from affecting other components.

## Dark Mode Support

All error boundaries must support dark mode to ensure a consistent user experience. Here's how to implement dark mode support in error boundaries:

### 1. Using the `darkMode` prop in `ApiErrorBoundary`

The `ApiErrorBoundary` component accepts a `darkMode` prop that should be set to the current theme state:

```tsx
const { isDarkMode } = useTheme();

<ApiErrorBoundary 
  onRetry={() => fetchData()}
  darkMode={isDarkMode}
>
  <DataFetchingComponent />
</ApiErrorBoundary>
```

### 2. Using Tailwind Dark Mode Classes in Custom Fallbacks

When creating custom fallback UI, use Tailwind's dark mode classes to ensure proper theme support:

```tsx
<ErrorBoundary
  fallback={(error, reset) => (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
      <h3 className="font-medium text-red-800 dark:text-red-300">Error</h3>
      <p className="text-red-700 dark:text-red-400">{error.message}</p>
      <button 
        onClick={reset}
        className="mt-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
      >
        Try Again
      </button>
    </div>
  )}
>
  <ComponentThatMightError />
</ErrorBoundary>
```

### 3. Dark Mode Color Palette for Error States

Use the following color palette for error states in dark mode:

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | bg-red-50 | bg-red-900/20 |
| Border | border-red-200 | border-red-800 |
| Heading Text | text-red-800 | text-red-300 |
| Body Text | text-red-700 | text-red-400 |
| Button Background | bg-red-100 | bg-red-900/30 |
| Button Hover | hover:bg-red-200 | hover:bg-red-900/50 |
| Button Text | text-red-700 | text-red-300 |

## API Error Handling

For handling API and data fetching errors, follow these patterns:

### 1. Try/Catch Blocks for Async Operations

Always wrap async operations in try/catch blocks:

```tsx
const fetchData = async () => {
  try {
    setLoading(true);
    const data = await api.getData();
    setData(data);
  } catch (error) {
    setError(error instanceof Error ? error : new Error('Failed to fetch data'));
  } finally {
    setLoading(false);
  }
};
```

### 2. Typed Error Handling

Use TypeScript to create typed error classes for different error categories:

```tsx
class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class ValidationError extends Error {
  constructor(public fields: Record<string, string>, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Usage
try {
  await submitForm(data);
} catch (error) {
  if (error instanceof ApiError) {
    if (error.statusCode === 401) {
      // Handle unauthorized error
    } else {
      // Handle other API errors
    }
  } else if (error instanceof ValidationError) {
    // Handle validation errors
    setFieldErrors(error.fields);
  } else {
    // Handle unknown errors
    console.error('Unknown error:', error);
  }
}
```

## Best Practices

### 1. Error Boundary Placement

- **DO** place error boundaries at logical component boundaries
- **DO** use more specific error boundaries (like `ApiErrorBoundary`) when appropriate
- **DO NOT** place error boundaries too deeply (at individual component level) as this can lead to excessive nesting
- **DO NOT** place error boundaries too high (at app root only) as this can lead to poor user experience

### 2. Error Handling in Event Handlers

Error boundaries do not catch errors in event handlers. Use try/catch blocks instead:

```tsx
const handleClick = async () => {
  try {
    await someAsyncOperation();
  } catch (error) {
    console.error('Error in click handler:', error);
    setError(error instanceof Error ? error : new Error('Unknown error occurred'));
  }
};
```

### 3. Error Handling in Async Code

Error boundaries do not catch errors in asynchronous code unless the error is thrown during rendering. Use try/catch blocks for async operations.

### 4. Retry Functionality

Always provide retry functionality for API errors:

```tsx
<ApiErrorBoundary 
  onRetry={() => fetchData()}
  darkMode={isDarkMode}
>
  <DataFetchingComponent />
</ApiErrorBoundary>
```

### 5. Error Logging

Log errors for debugging purposes:

```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error('Error caught by error boundary:', error, errorInfo);
    // Send to error reporting service if available
  }}
>
  <ComponentThatMightError />
</ErrorBoundary>
```

## Examples

### Example 1: Basic Error Boundary

```tsx
import { ErrorBoundary } from 'bndy-ui';

const MyComponent = () => {
  return (
    <ErrorBoundary>
      <ComponentThatMightError />
    </ErrorBoundary>
  );
};
```

### Example 2: API Error Boundary with Retry

```tsx
import { ApiErrorBoundary } from 'bndy-ui';
import { useTheme } from '@/lib/context/theme-context';

const MyDataComponent = () => {
  const { isDarkMode } = useTheme();
  const fetchData = async () => {
    // Fetch data implementation
  };
  
  return (
    <ApiErrorBoundary 
      onRetry={fetchData}
      darkMode={isDarkMode}
    >
      <DataDisplay data={data} />
    </ApiErrorBoundary>
  );
};
```

## Troubleshooting

### Common Issues

1. **Error boundaries not catching errors**
   - Error boundaries only catch errors in the render phase, not in event handlers or asynchronous code
   - Solution: Use try/catch blocks for event handlers and async code

2. **Dark mode styles not applied**
   - Make sure to pass the `darkMode` prop to `ApiErrorBoundary`
   - Make sure to use Tailwind's dark mode classes (`dark:bg-red-900/20`) in custom fallback UI

3. **Multiple error boundaries triggering**
   - This can happen when error boundaries are nested too deeply
   - Solution: Place error boundaries at logical component boundaries and avoid excessive nesting

## API Error Handling

For handling API and data fetching errors, follow these patterns:

### Using try/catch with async/await

```tsx
const fetchData = async () => {
  try {
    setLoading(true);
    const data = await api.getData();
    setData(data);
  } catch (error) {
    setError(error instanceof Error ? error : new Error('Unknown error occurred'));
    // Optional: report error to monitoring service
  } finally {
    setLoading(false);
  }
};
```

### Using ApiErrorBoundary

```tsx
const DataComponent = () => {
  return (
    <ApiErrorBoundary>
      <DataFetchingComponent />
    </ApiErrorBoundary>
  );
};
```

## Form Error Handling

For handling form errors, use the following patterns:

### Field-Level Errors

```tsx
// Using the Input component from bndy-ui
<Input
  label="Email"
  error={errors.email?.message}
  {...register('email', {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address',
    },
  })}
/>
```

### Form-Level Errors

```tsx
// Display form-level errors at the top of the form
{formError && (
  <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
    <p className="text-sm text-red-700 dark:text-red-400">{formError}</p>
  </div>
)}
```

## Firebase Error Handling

When working with Firebase, use these patterns:

```tsx
try {
  await firebase.auth().signInWithEmailAndPassword(email, password);
} catch (error) {
  // Map Firebase error codes to user-friendly messages
  switch (error.code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      setError('Invalid email or password');
      break;
    case 'auth/too-many-requests':
      setError('Too many failed login attempts. Please try again later.');
      break;
    default:
      setError('An error occurred during sign in. Please try again.');
  }
  
  // Log the original error for debugging
  console.error('Firebase auth error:', error);
}
```

## Error Logging and Monitoring

For production applications, implement error logging:

```tsx
// Example error logging utility
export const logError = (error: Error, context?: Record<string, any>) => {
  console.error(`[${new Date().toISOString()}] Error:`, error, context);
  
  // In production, send to error monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Example with a hypothetical error monitoring service
    errorMonitoringService.captureException(error, {
      extra: context,
    });
  }
};
```

## Best Practices

1. **Type Your Errors**: Use TypeScript to create typed error classes for different error categories
   ```tsx
   class ApiError extends Error {
     constructor(public statusCode: number, message: string) {
       super(message);
       this.name = 'ApiError';
     }
   }
   ```

2. **Provide Recovery Options**: When possible, give users a way to recover from errors
   ```tsx
   <ErrorMessage error={error} onRetry={fetchData} />
   ```

3. **Centralize Error Handling Logic**: Create utilities for common error handling patterns
   ```tsx
   // Example utility for handling API errors
   export const handleApiError = (error: unknown): string => {
     if (error instanceof ApiError) {
       if (error.statusCode === 401) return 'Please log in to continue';
       if (error.statusCode === 403) return 'You do not have permission to perform this action';
       if (error.statusCode === 404) return 'The requested resource was not found';
       return error.message;
     }
     return 'An unexpected error occurred';
   };
   ```

4. **Use Error States in Components**: Maintain clear loading, error, and success states
   ```tsx
   const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
   const [error, setError] = useState<Error | null>(null);
   ```

5. **Implement Retry Logic**: For transient errors, implement retry logic with exponential backoff
   ```tsx
   const fetchWithRetry = async (url: string, options: RequestInit, maxRetries = 3) => {
     let retries = 0;
     while (retries < maxRetries) {
       try {
         return await fetch(url, options);
       } catch (error) {
         retries++;
         if (retries >= maxRetries) throw error;
         // Exponential backoff
         await new Promise(resolve => setTimeout(resolve, 2 ** retries * 1000));
       }
     }
   };
   ```

## Implementation Checklist

When implementing error handling in a new feature, ensure you:

- [ ] Wrap the feature with an appropriate error boundary
- [ ] Handle all API calls with try/catch or use ApiErrorBoundary
- [ ] Display user-friendly error messages
- [ ] Log errors with sufficient context for debugging
- [ ] Provide recovery options where appropriate
- [ ] Test error scenarios to ensure graceful degradation

## Conclusion

Consistent error handling is crucial for a robust application. By following these guidelines, we ensure that errors are handled gracefully, users receive helpful feedback, and developers can easily debug issues when they occur.
