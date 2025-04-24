'use client';

import React from 'react';
import Link from 'next/link';
import { Music, PlusCircle } from 'lucide-react';

export const EmptyArtistState = () => {
  return (
    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 mb-8 transition-colors duration-300">
      <Music className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
      <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">No artists yet</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Get started by creating your first artist profile.
      </p>
      <div className="mt-6">
        <Link
          href="/artists/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Create Artist
        </Link>
      </div>
    </div>
  );
};

export default EmptyArtistState;
