// src/lib/firebase/events/public-events.ts
import { 
  collection, 
  query, 
  where, 
  getDocs
} from 'firebase/firestore';
import { getFirebaseFirestore } from '../index';
import { COLLECTIONS } from '../collections';
import { BndyCalendarEvent } from '@/types/calendar';
import { convertToCalendarEvent } from './converters';
import { FirestoreEvent } from './types';

/**
 * Get public events (for bndy.live)
 * @returns Array of public calendar events
 */
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
