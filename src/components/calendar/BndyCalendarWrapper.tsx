'use client';

import React from 'react';
import { BndyCalendar, BndyCalendarProps } from 'bndy-ui';
import { BndyCalendarEvent, EventType } from '@/types/calendar';

interface BndyCalendarWrapperProps extends Omit<BndyCalendarProps, 'events'> {
  events: BndyCalendarEvent[];
  showBandEvents?: boolean;
}

/**
 * A wrapper around BndyCalendar that handles band events properly
 * This allows us to modify how events are processed before they're passed to BndyCalendar
 * without modifying the bndy-ui component directly
 */
const BndyCalendarWrapper: React.FC<BndyCalendarWrapperProps> = ({
  events,
  showBandEvents = true,
  ...props
}) => {
  // Filter events based on showBandEvents
  const filteredEvents = showBandEvents 
    ? events 
    : events.filter(event => event.sourceType !== 'band');
  
  // Process events to ensure band events are displayed consistently as blue
  const processedEvents = filteredEvents.map(event => {
    if (event.sourceType === 'band') {
      // For band events in user context, we need to ensure they appear blue
      // The BndyCalendar component uses eventType to determine color
      // Since we can't modify BndyCalendar directly, we need to set eventType to 'meeting'
      // This is a UI-only transformation that ensures consistent styling
      return {
        ...event,
        eventType: 'meeting' as EventType // This will make it appear blue in the calendar
      };
    }
    return event;
  });

  return <BndyCalendar events={processedEvents} {...props} />;
};

export default BndyCalendarWrapper;
