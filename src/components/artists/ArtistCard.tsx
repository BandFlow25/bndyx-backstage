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
    <div className={`bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-orange-500 transition-colors ${className}`}>
      <Link href={`/artists/${artist.id}`} className="block">
        {/* Header Image */}
        <div className="h-32 bg-slate-700 relative">
          {artist.headerImageUrl ? (
            <img 
              src={artist.headerImageUrl} 
              alt={artist.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-orange-500/20 to-cyan-500/20">
              <Music className="h-12 w-12 text-slate-600" />
            </div>
          )}
          
          {/* Avatar */}
          <div className="absolute -bottom-8 left-4">
            <div className="w-16 h-16 rounded-full border-4 border-slate-800 overflow-hidden bg-slate-700">
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
          <h3 className="text-lg font-bold text-white mb-1 truncate">{artist.name}</h3>
          
          {artist.hometown && (
            <div className="flex items-center text-slate-400 text-sm mb-2">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span className="truncate">{artist.hometown}</span>
            </div>
          )}
          
          {artist.description && (
            <p className="text-slate-300 text-sm mb-3 line-clamp-2">{artist.description}</p>
          )}
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center text-slate-400 text-sm">
              <Users className="h-4 w-4 mr-1.5" />
              <span>{artist.members.length} {artist.members.length === 1 ? 'Member' : 'Members'}</span>
            </div>
            
            <SocialMediaLinks socialMedia={artist.socialMedia ?? {}} size="small" />
          </div>
        </div>
      </Link>
    </div>
  );
}
