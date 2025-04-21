'use client';

import React from 'react';
// SocialMediaLinks type now comes from Artist.socialMedia in 'bndy-types'.
// import { Artist } from 'bndy-types';
import { Instagram, Facebook, Twitter, Youtube, Music, Link as LinkIcon } from 'lucide-react';

interface SocialMediaLinksProps {
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    spotify?: string;
    website?: string;
  };
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function SocialMediaLinks({ 
  socialMedia, 
  size = 'medium',
  className = ''
}: SocialMediaLinksProps) {
  if (!socialMedia) return null;
  
  const { instagram, facebook, spotify, twitter, youtube, website } = socialMedia;
  
  // If no social media links are provided, don't render anything
  if (!instagram && !facebook && !spotify && !twitter && !youtube && !website) {
    return null;
  }
  
  // Determine size classes
  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-10 h-10 text-base',
    large: 'w-12 h-12 text-lg'
  };
  
  const iconSize = {
    small: 16,
    medium: 20,
    large: 24
  };
  
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {instagram && (
        <a 
          href={instagram} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`${sizeClasses[size]} rounded-full bg-slate-700 flex items-center justify-center hover:bg-orange-500 transition-colors`}
          aria-label="Instagram"
        >
          <Instagram size={iconSize[size]} />
        </a>
      )}
      
      {facebook && (
        <a 
          href={facebook} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`${sizeClasses[size]} rounded-full bg-slate-700 flex items-center justify-center hover:bg-orange-500 transition-colors`}
          aria-label="Facebook"
        >
          <Facebook size={iconSize[size]} />
        </a>
      )}
      
      {spotify && (
        <a 
          href={spotify} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`${sizeClasses[size]} rounded-full bg-slate-700 flex items-center justify-center hover:bg-orange-500 transition-colors`}
          aria-label="Spotify"
        >
          <Music size={iconSize[size]} />
        </a>
      )}
      
      {twitter && (
        <a 
          href={twitter} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`${sizeClasses[size]} rounded-full bg-slate-700 flex items-center justify-center hover:bg-orange-500 transition-colors`}
          aria-label="Twitter"
        >
          <Twitter size={iconSize[size]} />
        </a>
      )}
      
      {youtube && (
        <a 
          href={youtube} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`${sizeClasses[size]} rounded-full bg-slate-700 flex items-center justify-center hover:bg-orange-500 transition-colors`}
          aria-label="YouTube"
        >
          <Youtube size={iconSize[size]} />
        </a>
      )}
      
      {website && (
        <a 
          href={website} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`${sizeClasses[size]} rounded-full bg-slate-700 flex items-center justify-center hover:bg-orange-500 transition-colors`}
          aria-label="Website"
        >
          <LinkIcon size={iconSize[size]} />
        </a>
      )}
    </div>
  );
}
