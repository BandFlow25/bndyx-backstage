// src/lib/firebase/events/dashboard-events.ts
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc,
  doc,
  Timestamp,
  orderBy,
  limit as firestoreLimit
} from 'firebase/firestore';
import { getFirebaseFirestore } from '../index';
import { COLLECTIONS } from '../collections';
import { BndyCalendarEvent } from '@/types/calendar';
import { convertToCalendarEvent } from './converters';
import { FirestoreEvent } from './types';

/**
 * Get upcoming events for the user dashboard
 * @param userId The ID of the user to get events for
 * @param artistIds Array of artist IDs the user is associated with
 * @param limit Maximum number of events to return
 * @returns Array of upcoming calendar events for the dashboard
 */
export const getUpcomingEventsForDashboard = async (
  userId: string, 
  artistIds: string[] = [], 
  limit: number = 2
): Promise<BndyCalendarEvent[]> => {
  try {
    const firestore = getFirebaseFirestore();
    const eventsCollection = collection(firestore, COLLECTIONS.EVENTS);
    const now = new Date();
    const events: BndyCalendarEvent[] = [];
    
    // Only get events from the user's bands
    if (artistIds.length === 0) {
      return [];
    }
    
    // Get events for all the user's bands that are in the future
    const artistEventsQuery = query(
      eventsCollection,
      where('artistId', 'in', artistIds),
      where('startDate', '>=', Timestamp.fromDate(now)),
      orderBy('startDate', 'asc'),
      firestoreLimit(limit)
    );
    
    const artistEventsSnapshot = await getDocs(artistEventsQuery);
    
    // Convert to calendar events and add artist names
    const artistsMap = new Map<string, string>();
    
    // First, fetch all artist names
    for (const artistId of artistIds) {
      try {
        const artistDoc = await getDoc(doc(firestore, COLLECTIONS.ARTISTS, artistId));
        if (artistDoc.exists()) {
          const artistData = artistDoc.data();
          artistsMap.set(artistId, artistData.name || 'Unknown Artist');
        }
      } catch (err) {
        console.error(`Error fetching artist name for ${artistId}:`, err);
      }
    }
    
    // Then add events with artist names
    artistEventsSnapshot.forEach((doc) => {
      const eventData = doc.data() as FirestoreEvent;
      const artistName = artistsMap.get(eventData.artistId || '') || 'Unknown Artist';
      
      // Create the event data with ID
      const eventWithId = { ...eventData, id: doc.id };
      
      // Convert to calendar event
      const calendarEvent = convertToCalendarEvent(eventWithId);
      
      // Add the artist name to the calendar event
      calendarEvent.artistName = artistName;
      
      // Add to events list
      events.push(calendarEvent);
    });
    
    return events;
  } catch (error) {
    console.error('Error getting upcoming events for dashboard:', error);
    return [];
  }
};
