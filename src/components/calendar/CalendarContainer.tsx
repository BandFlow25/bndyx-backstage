'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from 'bndy-ui';
import { BndyCalendarEvent } from '@/types/calendar';
import CalendarLegend from './CalendarLegend';
import BndyCalendarWrapper from './BndyCalendarWrapper';
import ArtistCalendarWrapper from './ArtistCalendarWrapper';

interface CalendarContainerProps {
  events: BndyCalendarEvent[];
  isDarkMode: boolean;
  context: 'user' | 'artist';
  title: string;
  subtitle?: string;
  onSelectEvent: (event: BndyCalendarEvent) => void;
  onSelectSlot: (slotInfo: any) => void;
}

/**
 * A container component for the calendar that includes the legend and calendar
 */
const CalendarContainer: React.FC<CalendarContainerProps> = ({
  events,
  isDarkMode,
  context,
  title,
  subtitle,
  onSelectEvent,
  onSelectSlot
}) => {
  return (
    <Card 
      variant="elevated" 
      padding="md" 
      darkMode={isDarkMode}
      className="overflow-hidden special-calendar-card"
    >
      <CardHeader className="flex justify-between items-center flex-wrap">
        <CardTitle className="text-slate-900 dark:text-white">{title}</CardTitle>
        {subtitle && (
          <p className="text-sm text-slate-700 dark:text-white transition-colors duration-300">
            {subtitle}
          </p>
        )}
      </CardHeader>
      
      <CardContent>
        {/* Calendar Legend */}
        <CalendarLegend context={context} darkMode={isDarkMode} />
        
        {/* Calendar Component */}
        <div className="rounded-lg overflow-hidden mt-4 special-calendar-container rbc-calendar">
          {context === 'user' ? (
            <BndyCalendarWrapper
              events={events}
              isDarkMode={isDarkMode}
              onSelectEvent={onSelectEvent}
              onSelectSlot={onSelectSlot}
            />
          ) : (
            <ArtistCalendarWrapper
              events={events}
              isDarkMode={isDarkMode}
              onSelectEvent={onSelectEvent}
              onSelectSlot={onSelectSlot}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarContainer;
