// src/lib/firebase/events.ts
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  getDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { getFirebaseFirestore } from './index';
import { COLLECTIONS } from './collections';
import { BndyCalendarEvent, EventType } from '@/types/calendar';

// Type for Firestore event document
export interface FirestoreEvent {
  id?: string;
  title: string;
  startDate: Timestamp;
  endDate: Timestamp;
  allDay: boolean;
  eventType: EventType;
  isPublic: boolean;
  artistId?: string;
  venueId?: string;
  description?: string;
  recurring?: boolean;
  recurringPattern?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  createdBy: string;
}

// Convert Firestore event to BndyCalendarEvent
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
    recurringPattern: event.recurringPattern
  };
};

// Convert BndyCalendarEvent to Firestore event
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

// Create a new event
export const createEvent = async (
  event: BndyCalendarEvent, 
  userId: string
): Promise<string> => {
  try {
    const firestore = getFirebaseFirestore();
    const eventsCollection = collection(firestore, COLLECTIONS.EVENTS);
    const firestoreEvent = convertToFirestoreEvent(event, userId);
    const docRef = await addDoc(eventsCollection, firestoreEvent);
    return docRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Update an existing event
export const updateEvent = async (
  eventId: string, 
  event: Partial<BndyCalendarEvent>
): Promise<void> => {
  try {
    const firestore = getFirebaseFirestore();
    const eventRef = doc(firestore, COLLECTIONS.EVENTS, eventId);
    
    // Convert dates to Firestore Timestamps if they exist
    const updates: Record<string, any> = {
      updatedAt: serverTimestamp()
    };
    
    if (event.title) updates.title = event.title;
    if (event.description) updates.description = event.description;
    if (event.start) updates.startDate = Timestamp.fromDate(event.start);
    if (event.end) updates.endDate = Timestamp.fromDate(event.end);
    if (event.allDay !== undefined) updates.allDay = event.allDay;
    if (event.eventType) updates.eventType = event.eventType;
    if (event.isPublic !== undefined) updates.isPublic = event.isPublic;
    if (event.artistId) updates.artistId = event.artistId;
    if (event.venueId) updates.venueId = event.venueId;
    if (event.recurring !== undefined) updates.recurring = event.recurring;
    if (event.recurringPattern) updates.recurringPattern = event.recurringPattern;
    
    await updateDoc(eventRef, updates);
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const firestore = getFirebaseFirestore();
    const eventRef = doc(firestore, COLLECTIONS.EVENTS, eventId);
    await deleteDoc(eventRef);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Get a single event by ID
export const getEventById = async (eventId: string): Promise<BndyCalendarEvent | null> => {
  try {
    const firestore = getFirebaseFirestore();
    const eventRef = doc(firestore, COLLECTIONS.EVENTS, eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (eventSnap.exists()) {
      const eventData = eventSnap.data() as FirestoreEvent;
      return convertToCalendarEvent({ ...eventData, id: eventSnap.id });
    }
    
    return null;
  } catch (error) {
    console.error('Error getting event:', error);
    throw error;
  }
};

// Get all events for a user (personal events and events for their artists)
export const getUserEvents = async (userId: string, artistIds: string[] = []): Promise<BndyCalendarEvent[]> => {
  try {
    const firestore = getFirebaseFirestore();
    const eventsCollection = collection(firestore, COLLECTIONS.EVENTS);
    let eventQuery;
    
    if (artistIds.length > 0) {
      // Get both personal events and events for user's artists
      eventQuery = query(
        eventsCollection, 
        where('createdBy', '==', userId)
      );
      
      // TODO: Add a more complex query to include artist events
      // This would require a composite query or multiple queries
    } else {
      // Just get personal events
      eventQuery = query(
        eventsCollection, 
        where('createdBy', '==', userId)
      );
    }
    
    const querySnapshot = await getDocs(eventQuery);
    const events: BndyCalendarEvent[] = [];
    
    querySnapshot.forEach((doc) => {
      const eventData = doc.data() as FirestoreEvent;
      events.push(convertToCalendarEvent({ ...eventData, id: doc.id }));
    });
    
    return events;
  } catch (error) {
    console.error('Error getting user events:', error);
    throw error;
  }
};

// Get all events for an artist
export const getArtistEvents = async (artistId: string): Promise<BndyCalendarEvent[]> => {
  try {
    const firestore = getFirebaseFirestore();
    const eventsCollection = collection(firestore, COLLECTIONS.EVENTS);
    const eventQuery = query(
      eventsCollection, 
      where('artistId', '==', artistId)
    );
    
    const querySnapshot = await getDocs(eventQuery);
    const events: BndyCalendarEvent[] = [];
    
    querySnapshot.forEach((doc) => {
      const eventData = doc.data() as FirestoreEvent;
      events.push(convertToCalendarEvent({ ...eventData, id: doc.id }));
    });
    
    return events;
  } catch (error) {
    console.error('Error getting artist events:', error);
    throw error;
  }
};

// Get public events (for bndy.live)
export const getPublicEvents = async (): Promise<BndyCalendarEvent[]> => {
  try {
    const firestore = getFirebaseFirestore();
    const eventsCollection = collection(firestore, COLLECTIONS.EVENTS);
    const eventQuery = query(
      eventsCollection, 
      where('isPublic', '==', true),
      where('eventType', '==', 'gig')
    );
    
    const querySnapshot = await getDocs(eventQuery);
    const events: BndyCalendarEvent[] = [];
    
    querySnapshot.forEach((doc) => {
      const eventData = doc.data() as FirestoreEvent;
      events.push(convertToCalendarEvent({ ...eventData, id: doc.id }));
    });
    
    return events;
  } catch (error) {
    console.error('Error getting public events:', error);
    throw error;
  }
};
