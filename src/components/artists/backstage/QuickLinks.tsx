'use client';

import React from 'react';
import Link from 'next/link';
import { Music, Calendar, Users, FileText } from 'lucide-react';

interface QuickLinksProps {
  artistId: string;
}

const QuickLinks: React.FC<QuickLinksProps> = ({ artistId }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm md:col-span-2 transition-colors duration-300">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-300">Manage Your Band</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link 
          href={`/artists/${artistId}/songs`}
          className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-4 rounded-lg transition-colors duration-300 group"
        >
          <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 group-hover:bg-orange-500/10 dark:group-hover:bg-orange-500/20 flex items-center justify-center mb-3 transition-colors duration-300">
            <Music className="h-6 w-6 text-orange-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1 transition-colors duration-300">Songs</h3>
          <p className="text-[var(--text-secondary)] text-sm">Manage your song library</p>
        </Link>
        
        <Link 
          href={`/artists/${artistId}/events`}
          className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-4 rounded-lg transition-colors duration-300 group"
        >
          <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 group-hover:bg-orange-500/10 dark:group-hover:bg-orange-500/20 flex items-center justify-center mb-3 transition-colors duration-300">
            <Calendar className="h-6 w-6 text-orange-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1 transition-colors duration-300">Events</h3>
          <p className="text-[var(--text-secondary)] text-sm">Schedule gigs and practices</p>
        </Link>
        
        <Link 
          href={`/artists/${artistId}/members`}
          className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-4 rounded-lg transition-colors duration-300 group"
        >
          <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 group-hover:bg-orange-500/10 dark:group-hover:bg-orange-500/20 flex items-center justify-center mb-3 transition-colors duration-300">
            <Users className="h-6 w-6 text-orange-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1 transition-colors duration-300">Members</h3>
          <p className="text-[var(--text-secondary)] text-sm">Manage band members</p>
        </Link>
        
        <Link 
          href={`/artists/${artistId}/setlist`}
          className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-4 rounded-lg transition-colors duration-300 group"
        >
          <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 group-hover:bg-orange-500/10 dark:group-hover:bg-orange-500/20 flex items-center justify-center mb-3 transition-colors duration-300">
            <FileText className="h-6 w-6 text-orange-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1 transition-colors duration-300">Setlists</h3>
          <p className="text-[var(--text-secondary)] text-sm">Create and manage setlists</p>
        </Link>
      </div>
    </div>
  );
};

export default QuickLinks;
