// src/lib/firebase/events/core-operations.ts
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { getFirebaseFirestore } from '../index';
import { COLLECTIONS } from '../collections';
import { BndyCalendarEvent } from '@/types/calendar';
import { convertToFirestoreEvent, convertToCalendarEvent } from './converters';
import { FirestoreEvent } from './types';

/**
 * Create a new event
 * @param event The calendar event to create
 * @param userId The ID of the user creating the event
 * @returns The ID of the newly created event
 */
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

/**
 * Update an existing event
 * @param eventId The ID of the event to update
 * @param event The partial event data to update
 */
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

/**
 * Delete an event
 * @param eventId The ID of the event to delete
 */
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

/**
 * Get a single event by ID
 * @param eventId The ID of the event to retrieve
 * @returns The calendar event or null if not found
 */
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
