'use client';

import React from 'react';
import Link from 'next/link';
import { Artist } from 'bndy-types';
import { Music, MapPin, Users } from 'lucide-react';
import SocialMediaLinks from './SocialMediaLinks';

interface ArtistCardProps {
  artist: Artist;
  className?: string;
}

export default function ArtistCard({ artist, className = '' }: ArtistCardProps) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-orange-500 transition-colors ${className}`}>
      {/* Header Image - Inside Link */}
      <Link href={`/artists/${artist.id}`} className="block">
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
      </Link>
      
      {/* Content - Outside Link to avoid nesting <a> tags */}
      <div className="p-4 pt-10">
        <Link href={`/artists/${artist.id}`} className="block">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 truncate transition-colors duration-300">{artist.name}</h3>
          
          {artist.hometown && (
            <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-2 transition-colors duration-300">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span className="truncate">{artist.hometown}</span>
            </div>
          )}
          
          {artist.description && (
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 line-clamp-2 transition-colors duration-300">{artist.description}</p>
          )}
        </Link>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">
            <Users className="h-4 w-4 mr-1.5" />
            <span>{artist.members.length} {artist.members.length === 1 ? 'Member' : 'Members'}</span>
          </div>
          
          {/* Social media links moved outside of Link component to avoid nested <a> tags */}
          <SocialMediaLinks socialMedia={artist.socialMedia ?? {}} size="small" />
        </div>
      </div>
    </div>
  );
}
