'use client';

import React from 'react';
import { Calendar, Music, MessageCircle, AlertTriangle } from 'lucide-react';

// Function to render the pink exclamation mark for unimplemented features
const NotImplementedMark = () => (
  <div className="absolute top-4 right-4">
    <AlertTriangle className="h-6 w-6 text-pink-500" />
  </div>
);

export const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Upcoming Events Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 relative">
        <Calendar className="h-8 w-8 text-orange-500 mb-3" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Upcoming Events</h3>
        <p className="text-[var(--text-secondary)] text-sm">
          No upcoming events from your bands/artists
        </p>
      </div>
      
      {/* Song Actions Card - Not implemented */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 relative">
        <Music className="h-8 w-8 text-orange-500 mb-3" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Song Actions</h3>
        <p className="text-[var(--text-secondary)] text-sm">
          No pending song actions
        </p>
        <NotImplementedMark />
      </div>
      
      {/* Message Hub Card - Not implemented */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 relative">
        <MessageCircle className="h-8 w-8 text-orange-500 mb-3" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Message Hub</h3>
        <p className="text-[var(--text-secondary)] text-sm">
          No new messages
        </p>
        <NotImplementedMark />
      </div>
    </div>
  );
};

export default DashboardCards;
