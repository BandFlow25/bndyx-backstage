'use client';

import React, { useState } from 'react';
import { Artist } from 'bndy-types';
import { ChevronDown, ChevronRight } from 'lucide-react';
import DashboardCards from './DashboardCards';
import ArtistCards from './ArtistCards';
import CalendarView from './CalendarView';
import { useTheme } from '@/lib/context/theme-context';
import CalendarHeader from '../calendar/CalendarHeader';

interface CollapsibleSectionProps {
  title: string;
  defaultCollapsed?: boolean;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  defaultCollapsed = false,
  children 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  
  return (
    <div className="mb-4">
      <div 
        className="flex items-center cursor-pointer px-4 py-2"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? 
          <ChevronRight className="h-5 w-5 text-slate-500 mr-2" /> : 
          <ChevronDown className="h-5 w-5 text-slate-500 mr-2" />
        }
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
      </div>
      
      {!isCollapsed && (
        <div className="px-0">
          {children}
        </div>
      )}
    </div>
  );
};

interface MyDashboardProps {
  artists: Artist[];
}

export const MyDashboard = ({ artists }: MyDashboardProps) => {
  const { isDarkMode } = useTheme();
  
  return (
    <>
      {/* Dashboard Header */}
      <CalendarHeader 
        title="My Dashboard" 
        darkMode={isDarkMode}
        backLink=""
      />
      
      {/* Dashboard Cards Section - Collapsed by default */}
      <CollapsibleSection title="My Actions" defaultCollapsed={true}>
        <DashboardCards />
      </CollapsibleSection>
      
      {/* Calendar Agenda Section */}
      <CollapsibleSection title="My Agenda">
        <CalendarView />
      </CollapsibleSection>
      
      {/* Artists/Bands Section - Using the same collapsible pattern for consistency */}
      <div className="mb-4">
        <div className="flex items-center px-4 py-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Bands & Artists</h2>
        </div>
        <ArtistCards artists={artists} />
      </div>
    </>
  );
};

export default MyDashboard;
