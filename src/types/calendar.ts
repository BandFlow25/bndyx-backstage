// Local copy of calendar types
// This should be kept in sync with bndy-types/src/event.ts and bndy-ui/src/types/calendar.ts

// Calendar event types
// User context event types: available, unavailable, tentative, other
// Band context event types: gig, practice, recording, meeting, other
export type EventType = 
  // User context
  'available' | 'unavailable' | 'tentative' | 
  // Band context
  'gig' | 'practice' | 'recording' | 'meeting' | 
  // Both contexts
  'other';

/**
 * BndyCalendarEvent - Used for the calendar component
 * This extends the basic Event interface with additional properties needed for calendar display
 */
export interface BndyCalendarEvent {
  id: string;
  title: string;           // Display title for the event
  start: Date;             // Start date/time
  end: Date;               // End date/time
  allDay?: boolean;        // Whether this is an all-day event
  eventType: EventType;    // Type of event (gig, practice, etc.)
  isPublic: boolean;       // Whether this event is public (shown on bndy.live)
  
  // References
  artistId?: string;       // Associated artist/band ID (if applicable)
  artistName?: string;     // Artist/band name for display
  venueId?: string;        // Associated venue ID (required for gigs)
  
  // Additional details
  description?: string;    // Event description
  color?: string;          // Optional custom color override
  recurring?: boolean;     // Whether this is a recurring event
  recurringPattern?: string; // Pattern for recurring events
}
