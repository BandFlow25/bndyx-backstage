'use client';

import React from 'react';
import { Artist } from 'bndy-types';
import DashboardCards from './DashboardCards';
import ArtistCards from './ArtistCards';
import CalendarView from './CalendarView';

interface MyDashboardProps {
  artists: Artist[];
}

export const MyDashboard = ({ artists }: MyDashboardProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">My Dashboard</h2>
        
        {/* Three cards at the top */}
        <DashboardCards />
        
        {/* Artists/Bands Section */}
        <ArtistCards artists={artists} />
        
        {/* Calendar Section - Not implemented */}
        <CalendarView />
      </div>
    </div>
  );
};

export default MyDashboard;
