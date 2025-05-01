// Re-export calendar types from bndy-types package
// This file now serves as a compatibility layer during type migration
// See docs/TYPE_MIGRATION.md for details

// Import types from bndy-types
import { EventType as SharedEventType, BndyCalendarEvent as SharedBndyCalendarEvent } from 'bndy-types';

// Re-export the types directly from bndy-types
// This ensures all existing code continues to work while we transition to using bndy-types directly
export type EventType = SharedEventType;
export type BndyCalendarEvent = SharedBndyCalendarEvent;

// Type validation to ensure compatibility
// This code doesn't run, it's just for TypeScript to verify type compatibility
type _TypeCheck = {
  // Verify EventType includes all required variants
  eventTypeCheck: SharedEventType extends 'available' | 'unavailable' | 'tentative' | 'gig' | 'practice' | 'recording' | 'meeting' | 'other' ? true : never;
  
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
};
