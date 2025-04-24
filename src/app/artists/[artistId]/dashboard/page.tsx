"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useArtist } from '@/lib/context/artist-context';
import { BndyLoadingScreen } from 'bndy-ui';
import { 
  BookOpen, 
  ListMusic, 
  FileMusic, 
  Calendar, 
  Theater, 
  Users, 
  Search,
  Settings
} from 'lucide-react';

// Import backstage components
import ArtistHeader from '@/components/artists/backstage/ArtistHeader';
import QuickStats from '@/components/artists/backstage/QuickStats';
import FeatureCard from '@/components/artists/backstage/FeatureCard';

export default function ArtistBackstage() {
  const params = useParams();
  const router = useRouter();
  const { 
    currentArtist, 
    artistLoading, 
    artistError,
    setCurrentArtistById 
  } = useArtist();
  
  const artistId = params.artistId as string;
  
  // Set the current artist based on the URL parameter
  useEffect(() => {
    if (artistId && (!currentArtist || currentArtist.id !== artistId)) {
      setCurrentArtistById(artistId);
    }
  }, [artistId, currentArtist, setCurrentArtistById]);
  
  // If loading, show loading screen
  if (artistLoading) {
    return <BndyLoadingScreen label="Loading backstage area..." />;
  }
  
  // If error or no artist found, show error
  if (artistError || (!artistLoading && !currentArtist)) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-white p-6 rounded-lg border border-red-200 dark:border-red-700">
            <h2 className="text-xl font-bold mb-2">Error Loading Artist</h2>
            <p className="mb-4">{artistError || "Artist not found or you don't have access to this artist."}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-white dark:bg-red-700 text-red-800 dark:text-white rounded-md font-medium hover:bg-red-50 dark:hover:bg-red-600 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Check if a feature is implemented
  const isFeatureImplemented = (featureName: string) => {
    // For now, only the dashboard and settings are implemented
    return featureName === 'Settings';
  };
  
  // Artist backstage features
  const features = [
    {
      name: 'Playbook',
      description: 'Manage your active songs and repertoire',
      icon: <BookOpen className="h-8 w-8 text-orange-500" />,
      href: `/artists/${artistId}/playbook`,
      count: 0
    },
    {
      name: 'Setlists',
      description: 'Create and manage your performance setlists',
      icon: <ListMusic className="h-8 w-8 text-orange-500" />,
      href: `/artists/${artistId}/setlists`,
      count: 0
    },
    {
      name: 'Songs',
      description: 'Manage your song pipeline and practice list',
      icon: <FileMusic className="h-8 w-8 text-orange-500" />,
      href: `/artists/${artistId}/songs`,
      count: 0
    },
    {
      name: 'Calendar',
      description: 'View and manage your upcoming events',
      icon: <Calendar className="h-8 w-8 text-orange-500" />,
      href: `/artists/${artistId}/calendar`,
      count: 0
    },
    {
      name: 'Events',
      description: 'Create and manage your gigs and events',
      icon: <Theater className="h-8 w-8 text-orange-500" />,
      href: `/artists/${artistId}/events`,
      count: 0
    },
    {
      name: 'Members',
      description: 'Manage your band members and roles',
      icon: <Users className="h-8 w-8 text-orange-500" />,
      href: `/artists/${artistId}/members`,
      count: currentArtist?.members?.length || 0
    },
    {
      name: 'Vacancies',
      description: 'Post and manage vacancies for your band',
      icon: <Search className="h-8 w-8 text-orange-500" />,
      href: `/artists/${artistId}/vacancies`,
      count: 0
    },
    {
      name: 'Settings',
      description: 'Manage your artist profile and settings',
      icon: <Settings className="h-8 w-8 text-orange-500" />,
      href: `/artists/${artistId}/settings`,
      count: 0
    }
  ];
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Artist Header with Back Button */}
        {currentArtist && (
          <ArtistHeader artist={currentArtist} artistId={artistId} />
        )}
        
        {/* Quick Stats */}
        {currentArtist && (
          <QuickStats artist={currentArtist} artistId={artistId} />
        )}
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(feature => (
            <FeatureCard
              key={feature.name}
              name={feature.name}
              description={feature.description}
              icon={feature.icon}
              href={feature.href}
              count={feature.count}
              isImplemented={isFeatureImplemented(feature.name)}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
