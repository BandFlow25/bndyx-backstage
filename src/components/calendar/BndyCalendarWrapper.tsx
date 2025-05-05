'use client';

import React, { useMemo } from 'react';
import { ModernCalendar } from 'bndy-ui';
import { BndyCalendarEvent, USER_CALENDAR_BAND_EVENT_COLOR, getEventColor as getEventColorUtil } from '@/types/calendar';
import CalendarLegend from './CalendarLegend';

/**
 * A wrapper around ModernCalendar that handles band events properly
 * This component applies proper styling for band events without modifying the event data
 */
interface BndyCalendarWrapperProps {
  events: BndyCalendarEvent[];
  showBandEvents?: boolean;
  onSelectEvent?: (event: BndyCalendarEvent) => void;
  onSelectSlot?: (slotInfo: { date: Date; allDay: boolean }) => void;
  defaultView?: 'month' | 'agenda';
  defaultDate?: Date;
  className?: string;
  readOnly?: boolean;
  isDarkMode?: boolean;
}

const BndyCalendarWrapper = (props: BndyCalendarWrapperProps) => {
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
          color: USER_CALENDAR_BAND_EVENT_COLOR
        };
      }
      return event;
    });
  }, [filteredEvents]);
  
  // Define a custom getEventColor function for this wrapper
  const getEventColor = (event: BndyCalendarEvent): string => {
    if (event.sourceType === 'band') {
      return USER_CALENDAR_BAND_EVENT_COLOR;
    }
    return getEventColorUtil(event.eventType, 'user');
  };

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
    renderLegend={() => <CalendarLegend context="user" darkMode={props.isDarkMode} showBandEvents={showBandEvents} />}
    onSelectEvent={props.onSelectEvent}
    onSelectSlot={props.onSelectSlot}
  />;
};

export default BndyCalendarWrapper;
