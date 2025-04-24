import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './theme.css';

// Import components
import { AuthProvider } from 'bndy-ui/components/auth';
import { ArtistProvider } from '@/lib/context/artist-context';
import { CalendarProvider } from '@/lib/context/calendar-context';
import { ThemeProvider } from '@/lib/context/theme-context';
import { GoogleMapsProvider } from 'bndy-ui/components/providers/GoogleMapsProvider';
// Use explicit type import to resolve type compatibility issues
import type { ReactNode } from 'react';
// Initialize Firebase
import { initializeFirebase } from '@/lib/firebase';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: 'bndy | Backstage',
  description: 'Backstage management platform for bands, artists, and venues',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Initialize Firebase on the client side
  if (typeof window !== 'undefined') {
    initializeFirebase();
  }
  
  return (
    <html lang="en">
      <head>
        {/* No inline scripts to avoid hydration mismatches */}
      </head>
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <ArtistProvider>
            <CalendarProvider>
              <ThemeProvider>
                {/* The type issue is due to different React versions between packages */}
                <GoogleMapsProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                  <>{children}</>
                </GoogleMapsProvider>
              </ThemeProvider>
            </CalendarProvider>
          </ArtistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
