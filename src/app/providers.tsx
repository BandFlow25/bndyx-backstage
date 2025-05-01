'use client';

// This file contains all client-side providers and context wrapped as a Client Component
import React, { useEffect, ReactNode } from 'react';
import { AuthProvider } from 'bndy-ui';
import { ArtistProvider } from '@/lib/context/artist-context';
import { CalendarProvider } from '@/lib/context/calendar-context';
import { ThemeProvider } from '@/lib/context/theme-context';
import { GoogleMapsProvider } from 'bndy-ui';
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

  // Get Google Maps API key from environment variables
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  
  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please try refreshing the page.</div>}>
      <ThemeProvider>
        <AuthProvider>
          {mapsApiKey ? (
            // Only render GoogleMapsProvider when API key is available
            <GoogleMapsProvider apiKey={mapsApiKey}>
              <ArtistProvider>
                <CalendarProvider>
                  {children}
                </CalendarProvider>
              </ArtistProvider>
            </GoogleMapsProvider>
          ) : (
            // Skip the GoogleMapsProvider when no API key is available
            <ArtistProvider>
              <CalendarProvider>
                {children}
              </CalendarProvider>
            </ArtistProvider>
          )}
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}