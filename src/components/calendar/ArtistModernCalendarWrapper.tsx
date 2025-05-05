'use client';

import React, { useMemo, useCallback } from 'react';
import { ModernCalendar } from 'bndy-ui';
import { 
  BndyCalendarEvent, 
  EventType, 
  getEventColor as getEventColorUtil,
  EventCategory
} from '../../types/calendar';
import CalendarLegend from './CalendarLegend';

export interface ArtistModernCalendarWrapperProps {
  events: BndyCalendarEvent[];
  onSelectEvent?: (event: BndyCalendarEvent) => void;
  onSelectSlot?: (slotInfo: { date: Date; allDay: boolean }) => void;
  defaultView?: 'month' | 'agenda';
  defaultDate?: Date;
  className?: string;
  readOnly?: boolean;
  isDarkMode?: boolean;
  artistId?: string;
  showDayAgenda?: boolean; // Whether to show the day agenda below the month view
}

/**
 * A wrapper around ModernCalendar for the artist/band context
 * Handles event colors and legend items for band events and member events
 */
const ArtistModernCalendarWrapper: React.FC<ArtistModernCalendarWrapperProps> = ({
  events,
  onSelectEvent,
  onSelectSlot,
  defaultView = 'month',
  defaultDate = new Date(),
  className = '',
  readOnly = false,
  isDarkMode = false,
  artistId,
  showDayAgenda = false, // Default to not showing day agenda
}) => {
  // Get event color based on event type and source using centralized utility
  // Memoize the function to prevent unnecessary re-renders
  const getEventColor = useCallback((event: BndyCalendarEvent): string => {
    // If it's a member event (from a band member's personal calendar),
    // use the centralized utility with 'user' context since member events
    // use the same colors as user events (unavailable/tentative)
    if (event.sourceType === 'member') {
      return getEventColorUtil(event.eventType, 'user');
    }

    // For band events, use the centralized utility with 'band' context
    return getEventColorUtil(event.eventType, 'band');
  }, []);

  // Use the centralized CalendarLegend component for artist context
  // Memoize the function to prevent unnecessary re-renders
  const renderLegend = useCallback(() => {
    return <CalendarLegend context="artist" darkMode={isDarkMode} />;
  }, [isDarkMode]);

  // Process events for the calendar view
  const processedEvents = useMemo(() => {
    // Process each event to ensure proper formatting
    return events.map(event => {
      // Make sure all required properties exist and dates are properly formatted
      const startDate = event.start instanceof Date ? event.start : new Date(event.start);
      const endDate = event.end instanceof Date ? event.end : new Date(event.end);
      
      const processedEvent = {
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
      };
      return processedEvent;
    });
  }, [events, getEventColor]);
  
  // Performance tracking for render cycle
  React.useEffect(() => {
    console.log(`[PERF][${new Date().toISOString()}] ArtistModernCalendarWrapper - Rendering with ${processedEvents.length} processed events`);
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

export default ArtistModernCalendarWrapper;
