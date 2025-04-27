'use client';

import React from 'react';
import { Badge } from 'bndy-ui';
import { useTheme } from '@/lib/context/theme-context';

interface CalendarLegendProps {
  context: 'user' | 'artist';
  darkMode?: boolean;
}

const CalendarLegend: React.FC<CalendarLegendProps> = ({ context, darkMode }) => {
  const { isDarkMode: contextDarkMode } = useTheme();
  // Use prop value if provided, otherwise use context
  const isDarkMode = darkMode !== undefined ? darkMode : contextDarkMode;
  return (
    <div className="flex flex-wrap gap-4 mb-4 special-calendar-legend">
      {context === 'user' ? (
        // User Context Legend
        <>
          {/* Removed 'Available' option as requested */}
          <div className="flex items-center">
            <Badge variant="danger" size="sm" darkMode={isDarkMode} className="mr-2 w-16">Unavailable</Badge>
          </div>
          <div className="flex items-center">
            <Badge variant="warning" size="sm" darkMode={isDarkMode} className="mr-2 w-16">Tentative</Badge>
          </div>
          <div className="flex items-center">
            <Badge variant="default" size="sm" darkMode={isDarkMode} className="mr-2 w-16">Other</Badge>
          </div>
          {/* Band events are shown in blue but don't need a separate legend entry */}
        </>
      ) : (
        // Artist Context Legend
        <>
          <div className="flex items-center">
            <Badge variant="primary" size="sm" darkMode={isDarkMode} className="mr-2 w-16">Gig</Badge>
          </div>
          <div className="flex items-center">
            <Badge variant="info" size="sm" darkMode={isDarkMode} className="mr-2 w-16">Practice</Badge>
          </div>
          <div className="flex items-center">
            <Badge variant="warning" size="sm" darkMode={isDarkMode} className="mr-2 w-16">Recording</Badge>
          </div>
          <div className="flex items-center">
            <Badge variant="secondary" size="sm" darkMode={isDarkMode} className="mr-2 w-16">Meeting</Badge>
          </div>
          <div className="flex items-center">
            <Badge variant="default" size="sm" darkMode={isDarkMode} className="mr-2 w-16">Other</Badge>
          </div>
          {/* Member unavailability is shown directly on the calendar with member names */}
        </>
      )}
    </div>
  );
};

export default CalendarLegend;
