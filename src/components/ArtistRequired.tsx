"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useArtist } from '@/lib/context/artist-context';
import { BndyLoadingScreen } from 'bndy-ui';

interface ArtistRequiredProps {
  children: React.ReactNode;
}

/**
 * Higher-order component that requires an active artist to be selected
 * Redirects to dashboard if no artist is selected
 */
const ArtistRequired: React.FC<ArtistRequiredProps> = ({ children }) => {
  const router = useRouter();
  const { hasActiveArtist, artistLoading, currentUserArtists } = useArtist();

  useEffect(() => {
    // Only redirect after loading completes and we're sure there's no active artist
    if (!artistLoading && !hasActiveArtist) {
      // No active artist selected, redirecting to dashboard
      
      // If user has artists but none selected, redirect to dashboard to select one
      if (currentUserArtists.length > 0) {
        router.replace('/dashboard');
      } else {
        // If user has no artists at all, redirect to create artist page
        router.replace('/artists/new');
      }
    }
  }, [hasActiveArtist, artistLoading, currentUserArtists.length, router]);

  // Show loading while checking artist status or during redirect
  if (artistLoading) {
    return <BndyLoadingScreen label="Checking artist access..." />;
  }

  // If no active artist and not loading, show nothing (will redirect)
  if (!hasActiveArtist && !artistLoading) {
    return <BndyLoadingScreen label="Redirecting to dashboard..." />;
  }

  // If there is an active artist, render the children
  return <>{children}</>;
};

export default ArtistRequired;
