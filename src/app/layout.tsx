import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './theme.css';

// Import components
import { AuthProvider } from 'bndy-ui/components/auth';
import { ArtistProvider } from '@/lib/context/artist-context';
import { ThemeProvider } from '@/lib/context/theme-context';
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
  children: React.ReactNode;
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
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </ArtistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
