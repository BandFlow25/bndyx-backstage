'use client';

import React from 'react';
import { BndyCalendar, BndyCalendarProps } from 'bndy-ui';
import { BndyCalendarEvent } from '@/types/calendar';

interface ArtistCalendarWrapperProps extends Omit<BndyCalendarProps, 'events'> {
  events: BndyCalendarEvent[];
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

  return <BndyCalendar events={processedEvents} {...props} />;
};

export default ArtistCalendarWrapper;
