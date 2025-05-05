'use client';

import React, { useMemo, useCallback } from 'react';
import { ModernCalendar } from 'bndy-ui';
import { 
  BndyCalendarEvent, 
  EventType, 
  getEventColor as getEventColorUtil,
  USER_CALENDAR_BAND_EVENT_COLOR,
  EventCategory
} from '../../types/calendar';
import CalendarLegend from './CalendarLegend';

export interface UserModernCalendarWrapperProps {
  events: BndyCalendarEvent[];
  onSelectEvent?: (event: BndyCalendarEvent) => void;
  onSelectSlot?: (slotInfo: { date: Date; allDay: boolean }) => void;
  defaultView?: 'month' | 'agenda';
  defaultDate?: Date;
  className?: string;
  readOnly?: boolean;
  isDarkMode?: boolean;
  showDayAgenda?: boolean; // Whether to show the day agenda below the month view
}

/**
 * A wrapper around ModernCalendar for the user context
 * Handles event colors and legend items for user events and band events
 */
const UserModernCalendarWrapper: React.FC<UserModernCalendarWrapperProps> = ({
  events,
  onSelectEvent,
  onSelectSlot,
  defaultView = 'month',
  defaultDate = new Date(),
  className = '',
  readOnly = false,
  isDarkMode = false,
  showDayAgenda = false, // Default to not showing day agenda
}) => {
  // Get event color based on event type and source using centralized utility
  // Memoize the function to prevent unnecessary re-renders
  const getEventColor = useCallback((event: BndyCalendarEvent): string => {
    // If it's a band event, always use the centralized band event color for user context
    if (event.sourceType === 'band') {
      return USER_CALENDAR_BAND_EVENT_COLOR; // blue-500
    }

    // For user events, use the centralized utility with 'user' context
    return getEventColorUtil(event.eventType, 'user');
  }, []);

  
  // Use the centralized CalendarLegend component for user context
  // Memoize the function to prevent unnecessary re-renders
  const renderLegend = useCallback(() => {
    return <CalendarLegend context="user" darkMode={isDarkMode} />;
  }, [isDarkMode]);

  // Type assertion to handle the type mismatch between bndy-backstage and bndy-ui
  // Both are using BndyCalendarEvent from bndy-types, but there might be version differences
  // Ensure events have the proper structure for event dots
  // Memoize the event processing to prevent unnecessary recalculations
  const processedEvents = useMemo(() => {
    const startTime = performance.now();
    
    const processed = events.map(event => {
      // Make sure all required properties exist and dates are properly formatted
      const startDate = event.start instanceof Date ? event.start : new Date(event.start);
      const endDate = event.end instanceof Date ? event.end : new Date(event.end);
      
      return {
        ...event,
        id: event.id || `event-${Math.random().toString(36).substr(2, 9)}`,
        title: event.title || 'Untitled Event',
        start: startDate,
        end: endDate,
        allDay: typeof event.allDay === 'boolean' ? event.allDay : false,
        // Set a default eventType if not present
        eventType: event.eventType || 'other',
        // Ensure color property is set for event dots
        color: getEventColor(event)
        // Don't add resource property as it's not in the BndyCalendarEvent type
      };
    });
    
    const endTime = performance.now();
    console.log(`[PERF][${new Date().toISOString()}] UserModernCalendarWrapper - Processed ${processed.length} events in ${(endTime - startTime).toFixed(2)}ms`);
    
    return processed;
  }, [events, getEventColor]); // Only recompute when events or getEventColor changes
  
  // Performance tracking for render cycle
  React.useEffect(() => {
    console.log(`[PERF][${new Date().toISOString()}] UserModernCalendarWrapper - Rendering with ${processedEvents.length} processed events`);
  }, [processedEvents.length]);

  return (
    <ModernCalendar
      events={processedEvents as any} // Type assertion to bypass the type mismatch
      onSelectEvent={onSelectEvent}
      onSelectSlot={onSelectSlot}
      onNavigate={() => {}} // Required prop
      onViewChange={() => {}} // Required prop
      defaultView={defaultView}
      defaultDate={defaultDate}
      className={`bndy-modern-calendar no-padding ${className || ''}`} // Added no-padding class
      readOnly={readOnly}
      theme={isDarkMode ? 'dark' : 'light'}
      weekStartsOn={1} // Monday as default
      showDayAgenda={showDayAgenda} // Pass the showDayAgenda prop
      getEventColor={getEventColor}
      renderLegend={renderLegend}
    />
  );
};

export default UserModernCalendarWrapper;
