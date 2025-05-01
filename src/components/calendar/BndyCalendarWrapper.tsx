'use client';

import React, { useMemo } from 'react';
import { BndyCalendar } from 'bndy-ui';
import { BndyCalendarEvent } from 'bndy-types';

/**
 * A wrapper around BndyCalendar that handles band events properly
 * This component applies proper styling for band events without modifying the event data
 */
const BndyCalendarWrapper = (props: any) => {
  const { events, showBandEvents = true } = props;
  
  // Filter events based on showBandEvents
  const filteredEvents = useMemo(() => {
    return showBandEvents 
      ? events 
      : events.filter((event: BndyCalendarEvent) => event.sourceType !== 'band');
  }, [events, showBandEvents]);
  
  // Process events to ensure band events have the correct color
  // This preserves the semantic data while ensuring proper styling
  const processedEvents = useMemo(() => {
    return filteredEvents.map((event: BndyCalendarEvent) => {
      // For band events, ensure they have the correct color
      if (event.sourceType === 'band' && !event.color) {
        return {
          ...event,
          color: '#3b82f6' // blue-500
        };
      }
      return event;
    });
  }, [filteredEvents]);
  
  // Pass all props through to BndyCalendar, just replacing the events array
  return <BndyCalendar {...props} events={processedEvents} />;
};

export default BndyCalendarWrapper;
