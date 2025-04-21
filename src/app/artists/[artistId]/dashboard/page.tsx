"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  PlusCircle,
  Settings
} from 'lucide-react';

export default function ArtistDashboard() {
  const params = useParams();
  const router = useRouter();
  const { 
    currentArtist, 
    currentUserArtists, 
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
    return <BndyLoadingScreen label="Loading artist dashboard..." />;
  }
  
  // If error or no artist found, show error
  if (artistError || (!artistLoading && !currentArtist)) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-red-800 text-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Error Loading Artist</h2>
            <p className="mb-4">{artistError || "Artist not found or you don't have access to this artist."}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-white text-red-800 rounded-md font-medium"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Artist dashboard features
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
        {/* Artist Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center mb-4 md:mb-0">
            {currentArtist?.avatarUrl ? (
              <img 
                src={currentArtist.avatarUrl} 
                alt={currentArtist.name} 
                className="h-20 w-20 rounded-full mr-6 object-cover border-2 border-orange-500"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-orange-500 flex items-center justify-center mr-6 text-white text-2xl font-bold">
                {currentArtist?.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">{currentArtist?.name}</h1>
              <p className="text-slate-300">
                {currentArtist?.members && currentArtist.members.length > 1 ? 'Band' : 'Solo Artist'}
                {currentArtist?.hometown && ` • ${currentArtist.hometown}`}
              </p>
              {currentArtist?.genres && currentArtist.genres.length > 0 && (
                <div className="flex flex-wrap mt-2">
                  {currentArtist.genres.map(genre => (
                    <span key={genre} className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full mr-2 mb-1">
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <Link
              href={`/artists/${artistId}/events/new`}
              className="flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              <PlusCircle size={16} className="mr-2" />
              Add Event
            </Link>
            <Link
              href={`/artists/${artistId}/settings`}
              className="flex items-center justify-center px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
            >
              <Settings size={16} className="mr-2" />
              Edit Profile
            </Link>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-white font-medium mb-2">Upcoming Events</h3>
            <p className="text-slate-400 text-sm">No upcoming events</p>
            <Link 
              href={`/artists/${artistId}/events/new`}
              className="mt-3 text-orange-400 hover:text-orange-300 text-sm flex items-center"
            >
              <PlusCircle size={14} className="mr-1" />
              Add Event
            </Link>
          </div>
          
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-white font-medium mb-2">Active Songs</h3>
            <p className="text-slate-400 text-sm">No active songs</p>
            <Link 
              href={`/artists/${artistId}/songs`}
              className="mt-3 text-orange-400 hover:text-orange-300 text-sm flex items-center"
            >
              <PlusCircle size={14} className="mr-1" />
              Manage Songs
            </Link>
          </div>
          
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-white font-medium mb-2">Band Members</h3>
            {currentArtist?.members && currentArtist.members.length > 0 ? (
              <p className="text-slate-400 text-sm">{currentArtist.members.length} member{currentArtist.members.length !== 1 ? 's' : ''}</p>
            ) : (
              <p className="text-slate-400 text-sm">No members</p>
            )}
            <Link 
              href={`/artists/${artistId}/members`}
              className="mt-3 text-orange-400 hover:text-orange-300 text-sm flex items-center"
            >
              <PlusCircle size={14} className="mr-1" />
              Manage Members
            </Link>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(feature => (
            <Link 
              key={feature.name}
              href={feature.href}
              className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors flex flex-col items-center text-center"
            >
              {feature.icon}
              <h3 className="mt-4 text-lg font-medium text-white">{feature.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{feature.description}</p>
              {feature.count > 0 && (
                <span className="mt-2 px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs">
                  {feature.count} {feature.name.toLowerCase()}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
