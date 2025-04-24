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
  disableLinks?: boolean; // When true, renders buttons instead of links to avoid nested <a> tags
}

export default function SocialMediaLinks({ 
  socialMedia, 
  size = 'medium',
  className = '',
  disableLinks = false
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
  
  // Helper function to render either a link or a button with the same appearance
  const renderSocialItem = (url: string, label: string, icon: React.ReactNode) => {
    const commonProps = {
      className: `${sizeClasses[size]} rounded-full bg-slate-700 flex items-center justify-center hover:bg-orange-500 transition-colors`,
      'aria-label': label
    };

    if (disableLinks) {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering parent link
            window.open(url, '_blank', 'noopener,noreferrer');
          }}
          {...commonProps}
        >
          {icon}
        </button>
      );
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        {...commonProps}
      >
        {icon}
      </a>
    );
  };

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {instagram && renderSocialItem(
        instagram,
        "Instagram",
        <Instagram size={iconSize[size]} />
      )}
      
      {facebook && renderSocialItem(
        facebook,
        "Facebook",
        <Facebook size={iconSize[size]} />
      )}
      
      {spotify && renderSocialItem(
        spotify,
        "Spotify",
        <Music size={iconSize[size]} />
      )}
      
      {twitter && renderSocialItem(
        twitter,
        "Twitter",
        <Twitter size={iconSize[size]} />
      )}
      
      {youtube && renderSocialItem(
        youtube,
        "YouTube",
        <Youtube size={iconSize[size]} />
      )}
      
      {website && renderSocialItem(
        website,
        "Website",
        <LinkIcon size={iconSize[size]} />
      )}
    </div>
  );
}
