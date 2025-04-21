import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './theme.css';

// Import AuthProvider from bndy-ui
import { AuthProvider } from 'bndy-ui/components/auth';
// Import ArtistProvider
import { ArtistProvider } from '@/lib/context/artist-context';
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
      <body className={`${inter.variable} antialiased bg-slate-900 text-white`}>
        <AuthProvider>
          <ArtistProvider>
            {children}
          </ArtistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
