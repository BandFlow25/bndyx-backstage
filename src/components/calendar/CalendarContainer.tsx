'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, BndySpinner } from 'bndy-ui';
import { BndyCalendarEvent } from '@/types/calendar';
import UserModernCalendarWrapper from './UserModernCalendarWrapper';
import ArtistModernCalendarWrapper from './ArtistModernCalendarWrapper';
import SkeletonCalendar from './SkeletonCalendar';
import { useCalendar } from '@/lib/context/calendar-context';

interface CalendarContainerProps {
  events: BndyCalendarEvent[];
  isDarkMode: boolean;
  context: 'user' | 'artist';
  title?: string;
  subtitle?: string;
  onSelectEvent: (event: BndyCalendarEvent) => void;
  onSelectSlot: (slotInfo: any) => void;
  readOnly?: boolean;
  artistId?: string;
  showDayAgenda?: boolean; // Whether to show the day agenda below the month view
  // Aliases for backward compatibility
  darkMode?: boolean;
  calendarContext?: 'user' | 'artist';
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
  onSelectSlot,
  readOnly = false,
  artistId,
  showDayAgenda = false, // Default to not showing day agenda
  // Support both naming conventions
  darkMode,
  calendarContext
}) => {
  // Use the original prop names, but fall back to the new ones if provided
  const effectiveDarkMode = isDarkMode ?? darkMode ?? false;
  const effectiveContext = context ?? calendarContext ?? 'user';
  
  // Get loading state from calendar context
  const { isLoading } = useCalendar();
  
  // Performance tracking for renders
  const renderStartTime = performance.now();
  console.log(`[PERF][${new Date().toISOString()}] CalendarContainer - Rendering with context=${effectiveContext}, events=${events.length}, isLoading=${isLoading}`);
  
  const result = (
    <div className="w-full overflow-hidden rounded-none">
      {/* Only show header if there's a title */}
      {(title || subtitle) && (
        <div className="flex justify-between items-center flex-wrap p-2">
          {title && <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      )}

      <div className="p-0">
        {/* Render the appropriate calendar based on context */}
        <div className="calendar-container">
          {isLoading ? (
            <div>
              <div className="flex justify-center mb-4">
                <BndySpinner size={40} label="Loading calendar data..." />
              </div>
              <SkeletonCalendar />
            </div>
          ) : effectiveContext === 'user' ? (
            <UserModernCalendarWrapper
              events={events}
              onSelectEvent={onSelectEvent}
              onSelectSlot={onSelectSlot}
              isDarkMode={effectiveDarkMode}
              readOnly={readOnly}
              showDayAgenda={showDayAgenda}
            />
          ) : (
            <ArtistModernCalendarWrapper
              events={events}
              onSelectEvent={onSelectEvent}
              onSelectSlot={onSelectSlot}
              isDarkMode={effectiveDarkMode}
              artistId={artistId}
              showDayAgenda={showDayAgenda}
            />
          )}
        </div>
      </div>
    </div>
  );
  
  // Log render completion time
  const renderEndTime = performance.now();
  console.log(`[PERF][${new Date().toISOString()}] CalendarContainer - Render completed in ${(renderEndTime - renderStartTime).toFixed(2)}ms`);
  
  return result;
};

export default CalendarContainer;
