'use client';

import { useAuth } from 'bndy-ui';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BndySpinner } from 'bndy-ui';
import { GoogleMapsProvider } from 'bndy-ui';

type CreateArtistLayoutProps = {
  children: JSX.Element;
};

export default function CreateArtistLayout({
  children,
}: CreateArtistLayoutProps) {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  // Get the Google Maps API key from environment variables
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/auth/login');
    }
  }, [currentUser, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <BndySpinner />
      </div>
    );
  }

  return (
    <>{currentUser ? (
      <GoogleMapsProvider apiKey={googleMapsApiKey}>
        {children}
      </GoogleMapsProvider>
    ) : null}</>
  );
}
