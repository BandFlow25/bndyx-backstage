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
  // Log the incoming events for debugging
  console.log('ArtistCalendarWrapper received events:', events.length);
  console.log('Events by sourceType:', events.reduce((acc, event) => {
    const type = event.sourceType || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>));

  // Process events to ensure member events are displayed correctly
  const processedEvents = events.map(event => {
    // If it's a member event (from a band member's personal calendar),
    // we need to ensure it uses the correct color based on the event type
    if (event.sourceType === 'member') {
      console.log('Processing member event:', event.title, event.eventType);
      return {
        ...event,
        // Keep the original eventType (unavailable or tentative)
        // This ensures the correct color is used in the BndyCalendar component
        eventType: event.eventType,
        // Title is already prefixed with member name in getArtistEvents
      };
    }
    return event;
  });
  
  console.log('Processed events:', processedEvents.length);

  return <BndyCalendar events={processedEvents} {...props} />;
};

export default ArtistCalendarWrapper;
