'use client';

import React from 'react';
import Link from 'next/link';
import { PlusCircle, Home } from 'lucide-react';
import { Artist } from 'bndy-types';
import ManageButton from './ManageButton';

interface ArtistHeaderProps {
  artist: Artist;
  artistId: string;
}

export const ArtistHeader = ({ artist, artistId }: ArtistHeaderProps) => {
  return (
    <>
      {/* Back to Dashboard Link */}
      <div className="mb-4">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors"
        >
          <Home className="mr-1 h-4 w-4" />
          <span>Back to My Dashboard</span>
        </Link>
      </div>

      {/* Artist Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-8 bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center mb-4 md:mb-0">
          {artist?.avatarUrl ? (
            <img 
              src={artist.avatarUrl} 
              alt={artist.name} 
              className="h-20 w-20 rounded-full mr-6 object-cover border-2 border-orange-500"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-orange-500 flex items-center justify-center mr-6 text-white text-2xl font-bold">
              {artist?.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {artist?.name}
            </h1>
            <p className="text-[var(--text-secondary)]">
              {artist?.members && artist.members.length > 1 ? 'Band' : 'Solo Artist'}
              {artist?.hometown && ` • ${artist.hometown}`}
            </p>
            {artist?.genres && artist.genres.length > 0 && (
              <div className="flex flex-wrap mt-2">
                {artist.genres.map(genre => (
                  <span key={genre} className="text-xs bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300 px-2 py-1 rounded-full mr-2 mb-1">
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
          <ManageButton artistId={artistId} />
        </div>
      </div>
    </>
  );
};

export default ArtistHeader;
