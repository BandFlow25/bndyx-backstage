'use client';

import React from 'react';
import { ModernCalendar } from 'bndy-ui';
import { BndyCalendarEvent, getEventColor, EventCategory } from '@/types/calendar';
import CalendarLegend from './CalendarLegend';

// Define our own props interface
interface ArtistCalendarWrapperProps {  
  events: BndyCalendarEvent[];
  onSelectEvent?: (event: BndyCalendarEvent) => void;
  onSelectSlot?: (slotInfo: { date: Date; allDay: boolean }) => void;
  defaultView?: 'month' | 'agenda';
  defaultDate?: Date;
  className?: string;
  readOnly?: boolean;
  isDarkMode?: boolean;
  artistId?: string;
}

/**
 * A wrapper around BndyCalendar for the artist/band calendar that ensures
 * member events (unavailable/tentative) are displayed correctly
 */
const ArtistCalendarWrapper: React.FC<ArtistCalendarWrapperProps> = ({
  events,
  ...props
}) => {
  // Log the raw event data for debugging
  console.log('[DEBUG] Raw events received by ArtistCalendarWrapper:', 
    events.map(e => ({
      id: e.id,
      title: e.title,
      eventType: e.eventType,
      sourceType: e.sourceType
    })));
  // Log the incoming events for debugging
  console.log('ArtistCalendarWrapper received events:', events.length);
  console.log('Events by sourceType:', events.reduce((acc, event) => {
    const type = event.sourceType || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>));

  // Add detailed logging of raw events
  events.forEach((event, index) => {
    if (event.sourceType === 'member') {
      console.log(`[DEBUG] Raw member event ${index}:`, {
        title: event.title,
        eventType: event.eventType,
        sourceName: event.sourceName,
        sourceType: event.sourceType
      });
    }
  });

  // Process events to ensure member events are displayed correctly
  const processedEvents = events.map(event => {
    // If it's a member event (from a band member's personal calendar),
    // we need to ensure it uses the correct color based on the event type
    if (event.sourceType === 'member') {
      // Don't modify the title at all, just log what we're receiving
      console.log('Processing member event:', event.title, event.eventType);
      
      const processedEvent = {
        ...event,
        // Keep the original eventType (unavailable or tentative)
        // This ensures the correct color is used in the BndyCalendar component
        eventType: event.eventType,
        // Don't modify the title at all
        // Add a special property to make these events stand out 
        isMemberEvent: true
      };
      
      console.log(`[DEBUG] Processed member event ${event.id}:`, {
        title: processedEvent.title,
        eventType: processedEvent.eventType
      });
      
      return processedEvent;
    }
    return event;
  });
  
  // Log the processed events by type for debugging
  const eventsByType = processedEvents.reduce((acc, event) => {
    const type = event.eventType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  console.log('Events by event type:', eventsByType);
  
  console.log('Processed events:', processedEvents.length);

  // Use ModernCalendar instead of the legacy BndyCalendar
  return <ModernCalendar 
    events={processedEvents as any} // Type assertion to bypass type mismatch
    onNavigate={() => {}} // Required prop
    onViewChange={() => {}} // Required prop
    defaultView={props.defaultView || 'month'}
    defaultDate={props.defaultDate || new Date()}
    className={`bndy-modern-calendar ${props.className || ''}`}
    readOnly={props.readOnly || false}
    theme={props.isDarkMode ? 'dark' : 'light'}
    weekStartsOn={1} // Monday as default
    getEventColor={getEventColor}
    renderLegend={() => <CalendarLegend context="artist" darkMode={props.isDarkMode} />}
    onSelectEvent={props.onSelectEvent}
    onSelectSlot={props.onSelectSlot}
  />;
};

export default ArtistCalendarWrapper;
