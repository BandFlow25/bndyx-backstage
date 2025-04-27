'use client';

import React from 'react';
import Link from 'next/link';
import { Artist, MusicGenre, ArtistMember } from 'bndy-types';
import { Music, MapPin, Edit, Trash2 } from 'lucide-react';
import SocialMediaLinks from '@/components/artists/SocialMediaLinks';

interface ArtistProfileHeaderProps {
  artist: Artist;
  artistId: string;
  isOwner: boolean;
  onDeleteArtist: () => void;
}

const ArtistProfileHeader: React.FC<ArtistProfileHeaderProps> = ({
  artist,
  artistId,
  isOwner,
  onDeleteArtist
}) => {
  return (
    <div className="relative mb-8">
      <div className="h-48 md:h-64 bg-slate-100 dark:bg-slate-800 rounded-t-lg overflow-hidden">
        {artist.headerImageUrl ? (
          <img 
            src={artist.headerImageUrl} 
            alt={artist.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-orange-500/20 to-cyan-500/20 dark:from-orange-500/30 dark:to-cyan-500/30">
            <Music className="h-16 w-16 text-slate-700 dark:text-slate-400" />
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-b-lg border-t border-slate-200 dark:border-slate-700 p-6 pb-4 shadow-md dark:shadow-none transition-colors duration-300">
        <div className="flex flex-col md:flex-row">
          <div className="flex-shrink-0 -mt-16 md:-mt-20 mb-4 md:mb-0 z-10">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden bg-slate-200 dark:bg-slate-700 shadow-md transition-colors duration-300">
              {artist.avatarUrl ? (
                <img 
                  src={artist.avatarUrl} 
                  alt={artist.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-500">
                  <Music className="h-12 w-12 text-white" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-300">{artist.name}</h1>
                <div className="flex items-center text-[var(--text-secondary)] mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{artist.hometown}</span>
                </div>
              </div>
              
              {isOwner && (
                <div className="flex space-x-3 mt-3 md:mt-0">
                  <Link 
                    href={`/artists/${artistId}/edit`}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-300 flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                  <button 
                    className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-300 flex items-center"
                    onClick={onDeleteArtist}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 my-3">
              {artist && (artist.genres ?? []).map((genre: MusicGenre, index: number) => (
                <span 
                  key={index} 
                  className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white px-2 py-1 rounded-full font-semibold transition-colors duration-300"
                >
                  {genre}
                </span>
              ))}
            </div>
            
            <p className="text-[var(--text-secondary)] mb-4">{artist.description}</p>
            
            <SocialMediaLinks socialMedia={artist.socialMedia ?? {}} size="medium" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfileHeader;
