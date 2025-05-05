// Re-export calendar types from bndy-types package
// This file now serves as a compatibility layer during type migration
// See docs/TYPE_MIGRATION.md for details

// Import types and utilities from bndy-types
import { 
  EventType as SharedEventType, 
  EventCategory,
  BndyCalendarEvent as SharedBndyCalendarEvent,
  getEventColor,
  getEventCategoryColor,
  EVENT_CATEGORY_COLORS,
  USER_CALENDAR_BAND_EVENT_COLOR
} from 'bndy-types';

// Re-export everything for backward compatibility
// This ensures existing code continues to work while we transition to using bndy-types directly
export type EventType = SharedEventType;
export type BndyCalendarEvent = SharedBndyCalendarEvent;
export { 
  EventCategory,
  getEventColor,
  getEventCategoryColor,
  EVENT_CATEGORY_COLORS,
  USER_CALENDAR_BAND_EVENT_COLOR
};

// Type validation to ensure compatibility
// This code doesn't run, it's just for TypeScript to verify type compatibility
type _TypeCheck = {
  // Verify EventType includes all required values from EventCategory
  eventTypeCheck: SharedEventType extends 
    | typeof EventCategory.AVAILABLE 
    | typeof EventCategory.UNAVAILABLE 
    | typeof EventCategory.TENTATIVE 
    | typeof EventCategory.GIG 
    | typeof EventCategory.PRACTICE 
    | typeof EventCategory.RECORDING 
    | typeof EventCategory.MEETING 
    | typeof EventCategory.OTHER ? true : never;
  
  // Verify EventCategory enum includes all required values
  eventCategoryCheck: {
    [EventCategory.UNAVAILABLE]: 'unavailable',
    [EventCategory.TENTATIVE]: 'tentative',
    [EventCategory.AVAILABLE]: 'available',
    [EventCategory.OTHER]: 'other',
    [EventCategory.GIG]: 'gig',
    [EventCategory.PRACTICE]: 'practice',
    [EventCategory.RECORDING]: 'recording',
    [EventCategory.MEETING]: 'meeting'
  };
  
  // Verify BndyCalendarEvent has all required properties
  calendarEventCheck: SharedBndyCalendarEvent extends {
    id: string;
    title: string;
    start: Date;
    end: Date;
    eventType: EventType;
    isPublic: boolean;
    allDay?: boolean;
    artistId?: string;
    artistName?: string;
    venueId?: string;
    description?: string;
    color?: string;
    recurring?: boolean;
    recurringPattern?: string;
    // Source information for cross-context events
    sourceType?: 'band' | 'member';
    sourceId?: string;
    sourceName?: string;
  } ? true : never;
  
  // Verify utility functions exist
  utilityCheck: {
    getEventColor: typeof getEventColor,
    getEventCategoryColor: typeof getEventCategoryColor,
    EVENT_CATEGORY_COLORS: typeof EVENT_CATEGORY_COLORS,
    USER_CALENDAR_BAND_EVENT_COLOR: typeof USER_CALENDAR_BAND_EVENT_COLOR
  };
};
