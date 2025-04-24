'use client';

import React from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Artist } from 'bndy-types';

interface QuickStatsProps {
  artist: Artist;
  artistId: string;
}

export const QuickStats = ({ artist, artistId }: QuickStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-slate-900 dark:text-white font-medium mb-2">Upcoming Events</h3>
        <p className="text-[var(--text-secondary)] text-sm">No upcoming events</p>
        <Link 
          href={`/artists/${artistId}/events/new`}
          className="mt-3 text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-sm flex items-center"
        >
          <PlusCircle size={14} className="mr-1" />
          Add Event
        </Link>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-slate-900 dark:text-white font-medium mb-2">Active Songs</h3>
        <p className="text-[var(--text-secondary)] text-sm">No active songs</p>
        <Link 
          href={`/artists/${artistId}/songs`}
          className="mt-3 text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-sm flex items-center"
        >
          <PlusCircle size={14} className="mr-1" />
          Manage Songs
        </Link>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-slate-900 dark:text-white font-medium mb-2">Band Members</h3>
        {artist?.members && artist.members.length > 0 ? (
          <p className="text-[var(--text-secondary)] text-sm">{artist.members.length} member{artist.members.length !== 1 ? 's' : ''}</p>
        ) : (
          <p className="text-[var(--text-secondary)] text-sm">No members</p>
        )}
        <Link 
          href={`/artists/${artistId}/members`}
          className="mt-3 text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-sm flex items-center"
        >
          <PlusCircle size={14} className="mr-1" />
          Manage Members
        </Link>
      </div>
    </div>
  );
};

export default QuickStats;
