'use client';

// This file contains all client-side providers and context wrapped as a Client Component
import React, { useEffect, ReactNode } from 'react';
import { AuthProvider } from 'bndy-ui';
import { ArtistProvider } from '@/lib/context/artist-context';
import { CalendarProvider } from '@/lib/context/calendar-context';
import { ThemeProvider } from '@/lib/context/theme-context';
// GoogleMapsProvider removed - now using LazyPlaceLookup component instead
import { ErrorBoundary } from 'bndy-ui';
import { initializeFirebase } from '@/lib/firebase';

// Export the props interface for better TypeScript support
export interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  // Client-side initialization code
  useEffect(() => {
    initializeFirebase();
  }, []);

  // Google Maps API key is now handled by the LazyPlaceLookup component
  
  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please try refreshing the page.</div>}>
      <ThemeProvider>
        <AuthProvider>
          <ArtistProvider>
            <CalendarProvider>
              {children}
            </CalendarProvider>
          </ArtistProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}