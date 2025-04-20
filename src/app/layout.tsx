import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './theme.css';

// Import AuthProvider from bndy-ui
import { AuthProvider } from 'bndy-ui/components/auth';

// Initialize Firebase if needed
// import { initFirebase } from 'bndy-ui';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: 'bndy-core | BAV Management Platform',
  description: 'Backstage management platform for bands, artists, and venues',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-slate-900 text-white`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
