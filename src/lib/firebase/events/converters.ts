// src/lib/firebase/events/converters.ts
import { Timestamp, serverTimestamp } from 'firebase/firestore';
import { BndyCalendarEvent, USER_CALENDAR_BAND_EVENT_COLOR } from '@/types/calendar';
import { FirestoreEvent } from './types';

/**
 * Convert Firestore event to BndyCalendarEvent
 * @param event The Firestore event document
 * @returns A BndyCalendarEvent object for use in the application
 */
export const convertToCalendarEvent = (event: FirestoreEvent): BndyCalendarEvent => {
  return {
    id: event.id || '',
    title: event.title,
    start: event.startDate.toDate(),
    end: event.endDate.toDate(),
    allDay: event.allDay,
    eventType: event.eventType,
    isPublic: event.isPublic,
    artistId: event.artistId,
    venueId: event.venueId,
    description: event.description,
    recurring: event.recurring,
    recurringPattern: event.recurringPattern,
    // Include additional metadata for event source
    sourceType: event.sourceType,
    sourceId: event.sourceId,
    sourceName: event.sourceName,
    // Do NOT modify the title for member events - it's already formatted in getArtistEvents
    // Set color for band events using centralized constant
    ...(event.sourceType === 'band' && {
      color: USER_CALENDAR_BAND_EVENT_COLOR
    })
  };
};

/**
 * Convert BndyCalendarEvent to Firestore event
 * @param event The application calendar event
 * @param userId The ID of the user creating/updating the event
 * @returns A Firestore event object ready for storage
 */
export const convertToFirestoreEvent = (
  event: BndyCalendarEvent, 
  userId: string
): Omit<FirestoreEvent, 'id'> => {
  // Create base event object without optional fields
  const firestoreEvent: Omit<FirestoreEvent, 'id'> = {
    title: event.title,
    startDate: Timestamp.fromDate(event.start),
    endDate: Timestamp.fromDate(event.end),
    allDay: !!event.allDay,
    eventType: event.eventType,
    isPublic: event.isPublic,
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
    createdBy: userId
  };
  
  // Only add optional fields if they have values (not undefined)
  if (event.artistId) firestoreEvent.artistId = event.artistId;
  if (event.venueId) firestoreEvent.venueId = event.venueId;
  if (event.description) firestoreEvent.description = event.description;
  if (event.recurring !== undefined) firestoreEvent.recurring = event.recurring;
  if (event.recurringPattern) firestoreEvent.recurringPattern = event.recurringPattern;
  
  return firestoreEvent;
};
