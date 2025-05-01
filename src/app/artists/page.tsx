'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from 'bndy-ui';
import { useArtist } from '@/lib/context/artist-context';
import { BndySpinner } from 'bndy-ui';
import ArtistCard from '@/components/artists/ArtistCard';
import { PlusCircle, Music } from 'lucide-react';
import Link from 'next/link';

const ArtistSelectionPage = () => {
  const { currentUser } = useAuth();
  const { currentUserArtists, artistLoading, artistError, refreshArtists } = useArtist();
  const router = useRouter();

  // Refresh artists when the component mounts
  useEffect(() => {
    if (currentUser) {
      refreshArtists();
    }
  }, [currentUser, refreshArtists]);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">My Artists</h1>
          <Link 
            href="/artists/create" 
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-center transition-colors font-medium shadow-md flex items-center"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Create Artist
          </Link>
        </div>

        {artistLoading ? (
          <div className="flex justify-center items-center h-64">
            <BndySpinner />
          </div>
        ) : artistError ? (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg transition-colors duration-300">
            <p>{artistError}</p>
          </div>
        ) : currentUserArtists.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center transition-colors duration-300 border border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
              <Music className="h-8 w-8 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">No Artists Yet</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6 transition-colors duration-300">
              You haven't created or joined any artists/bands yet. Create your first artist to get started!
            </p>
            <Link 
              href="/artists/create" 
              className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg text-center transition-colors font-medium shadow-md inline-flex items-center"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Artist
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentUserArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ArtistSelectionPage;
