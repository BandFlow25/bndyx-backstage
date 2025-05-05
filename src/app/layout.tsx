import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './theme.css';
import type { ReactNode } from 'react';

// Import the client providers component
import Providers from './providers';

// Initialize Firebase
import { initializeFirebase } from '@/lib/firebase';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: 'bndy | Backstage',
  description: 'Backstage management platform for bands, artists, and venues',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ],
    shortcut: [
      { url: '/favicon.ico' }
    ]
  }
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  // Server component can only do server-side initialization
  // Client-side initialization will be done in the Providers component

  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        {/* Inline script for dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const darkMode = localStorage.getItem('darkMode') === 'true';
                  if (darkMode) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
