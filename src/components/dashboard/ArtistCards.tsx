'use client';

import React from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Artist } from 'bndy-types';

// Import the individual parts of the ArtistCard to avoid nested <a> tags
import { Artist as ArtistType } from 'bndy-types';
import { Music, MapPin, Users } from 'lucide-react';
import SocialMediaLinks from '../artists/SocialMediaLinks';

// Create Artist Card component
const CreateArtistCard = () => (
  <Link href="/artists/new" className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-orange-500 transition-colors">
    <div className="h-32 bg-slate-100 dark:bg-slate-700 relative transition-colors duration-300 flex items-center justify-center">
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-orange-500/10 to-cyan-500/10 dark:from-orange-500/20 dark:to-cyan-500/20">
        <PlusCircle className="h-12 w-12 text-orange-500" />
      </div>
    </div>
    <div className="p-4 flex-1 flex flex-col justify-center items-center">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 text-center">Create New</h3>
      <p className="text-slate-600 dark:text-slate-300 text-sm text-center">Add a new band or artist profile</p>
    </div>
  </Link>
);

// Custom ArtistCard component to avoid nested <a> tags
const ArtistCardCustom = ({ artist }: { artist: ArtistType }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-orange-500 transition-colors">
      {/* Header Image */}
      <div className="h-32 bg-slate-100 dark:bg-slate-700 relative transition-colors duration-300">
        {artist.headerImageUrl ? (
          <img 
            src={artist.headerImageUrl} 
            alt={artist.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-orange-500/10 to-cyan-500/10 dark:from-orange-500/20 dark:to-cyan-500/20">
            <Music className="h-12 w-12 text-slate-400 dark:text-slate-600" />
          </div>
        )}
        
        {/* Avatar */}
        <div className="absolute -bottom-8 left-4">
          <div className="w-16 h-16 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-700 transition-colors duration-300">
            {artist.avatarUrl ? (
              <img 
                src={artist.avatarUrl} 
                alt={artist.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-orange-500">
                <Music className="h-8 w-8 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 pt-10">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 truncate transition-colors duration-300">{artist.name}</h3>
        
        {artist.hometown && (
          <div className="flex items-center text-[var(--text-secondary)] text-sm mb-2 transition-colors duration-300">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span className="truncate">{artist.hometown}</span>
          </div>
        )}
        
        {artist.description && (
          <p className="text-[var(--text-secondary)] text-sm mb-3 line-clamp-2 transition-colors duration-300">{artist.description}</p>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-[var(--text-secondary)] text-sm transition-colors duration-300">
            <Users className="h-4 w-4 mr-1.5" />
            <span>{artist.members.length} {artist.members.length === 1 ? 'Member' : 'Members'}</span>
          </div>
          
          <SocialMediaLinks socialMedia={artist.socialMedia ?? {}} size="small" disableLinks={true} />
        </div>
      </div>
    </div>
  );
};

interface ArtistCardsProps {
  artists: Artist[];
}

export const ArtistCards = ({ artists }: ArtistCardsProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">My Bands & Artists</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Existing Artist Cards */}
        {artists.map(artist => (
          <Link key={artist.id} href={`/artists/${artist.id}/dashboard`}>
            <ArtistCardCustom artist={artist} />
          </Link>
        ))}
        
        {/* Create New Artist Card - Moved to the end */}
        <CreateArtistCard />
      </div>
    </div>
  );
};

export default ArtistCards;
