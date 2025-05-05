// src/lib/firebase/events/user-events.ts
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc,
  doc
} from 'firebase/firestore';
import { getFirebaseFirestore } from '../index';
import { COLLECTIONS } from '../collections';
import { BndyCalendarEvent, USER_CALENDAR_BAND_EVENT_COLOR } from '@/types/calendar';
import { convertToCalendarEvent } from './converters';
import { FirestoreEvent } from './types';

/**
 * Get all events for a user (personal events and events for their artists)
 * @param userId The ID of the user to get events for
 * @param artistIds Optional array of artist IDs the user is associated with
 * @returns Array of calendar events for the user and their artists
 */
export const getUserEvents = async (userId: string, artistIds: string[] = []): Promise<BndyCalendarEvent[]> => {
  const startTime = performance.now();
  console.log(`[PERF][${new Date().toISOString()}] getUserEvents started for user ${userId} with ${artistIds.length} artists`);
  try {
    const firestore = getFirebaseFirestore();
    const eventsCollection = collection(firestore, COLLECTIONS.EVENTS);
    const events: BndyCalendarEvent[] = [];
    const bandEvents: BndyCalendarEvent[] = [];
    
    // Get personal events (exclude events with artistId)
    // We need to fetch all events created by the user and then filter out those with artistId
    const personalEventQuery = query(
      eventsCollection, 
      where('createdBy', '==', userId)
    );
    
    const personalQuerySnapshot = await getDocs(personalEventQuery);
    const personalQueryTime = performance.now();
    console.log(`[PERF][${new Date().toISOString()}] Firebase query completed in ${(personalQueryTime - startTime).toFixed(2)}ms - Found ${personalQuerySnapshot.size} events created by user ${userId}`);
    
    // Process personal events - exclude those with artistId as they are band events
    let personalCount = 0;
    let bandCount = 0;
    
    personalQuerySnapshot.forEach((doc) => {
      const eventData = doc.data() as FirestoreEvent;
      
      // If the event has an artistId, it's a band event created by this user
      if (eventData.artistId) {
        // Band event created by user - will be processed later
        bandCount++;
        // Skip for now - we'll get it in the band events query
      } else {
        // This is a true personal event
        personalCount++;
        // Ensure sourceType is undefined for personal events
        events.push(convertToCalendarEvent({ 
          ...eventData, 
          id: doc.id,
          sourceType: undefined // Explicitly set to undefined for personal events
        }));
      }
    });
    
    const personalProcessTime = performance.now();
    console.log(`[PERF][${new Date().toISOString()}] Processed ${personalCount} personal events and identified ${bandCount} band events in ${(personalProcessTime - personalQueryTime).toFixed(2)}ms`);
    
    // If artistIds are provided, get events for those artists too
    if (artistIds.length > 0) {
      console.log(`[PERF][${new Date().toISOString()}] Starting fetch for ${artistIds.length} artists`);
      
      // We need to do separate queries for each artistId
      for (const artistId of artistIds) {
        // First get the artist name
        try {
          const artistDocRef = doc(firestore, COLLECTIONS.ARTISTS, artistId);
          const artistDoc = await getDoc(artistDocRef);
          let artistName = 'Band';
          
          if (artistDoc.exists()) {
            const artistData = artistDoc.data();
            artistName = artistData.name || 'Band';
            console.log(`[PERF][${new Date().toISOString()}] Retrieved artist: ${artistName} (${artistId})`);
          } else {
            console.warn(`Artist document not found for ID: ${artistId}`);
            continue; // Skip this artist if not found
          }
        
          // Get all events for this artist
          const artistEventQuery = query(
            eventsCollection,
            where('artistId', '==', artistId)
          );
          
          const artistQuerySnapshot = await getDocs(artistEventQuery);
          const artistQueryTime = performance.now();
          console.log(`[PERF][${new Date().toISOString()}] Retrieved ${artistQuerySnapshot.size} events for artist ${artistId}`);
          
          // Process each event
          artistQuerySnapshot.forEach((docSnapshot) => {
            const eventData = docSnapshot.data() as FirestoreEvent;
            
            // We need to be more careful about duplicate detection
            // For band events, we should only consider it a duplicate if it has the same ID
            // Otherwise, we want to include it as a band event even if it has the same title/date
            const isDuplicate = events.some(existingEvent => 
              existingEvent.id === docSnapshot.id
            );
            
            if (isDuplicate) {
              // Skip duplicate events
              return;
            }
            
            // Even if there's a similar event with the same title/date, we still want to include it
            // as a band event if it was created by the band
            
            // Create a band event with proper metadata
            // Make sure to set all properties correctly before converting
            const bandEventData: FirestoreEvent = {
              ...eventData,
              id: docSnapshot.id,
              sourceType: 'band',
              sourceId: artistId,
              sourceName: artistName,
              // Explicitly set the title with band name prefix
              title: `${artistName}: ${eventData.title}`
            };
            
            // Convert to calendar event - this will set the color to blue-500
            const bandEvent = convertToCalendarEvent(bandEventData);
            
            // Double-check that the band event has the correct properties
            if (!bandEvent.color || bandEvent.color !== USER_CALENDAR_BAND_EVENT_COLOR) {
              // Ensure consistent color for band events
              bandEvent.color = USER_CALENDAR_BAND_EVENT_COLOR;
            }
            
            // Add band event to the list
            bandEvents.push(bandEvent);
          });
        } catch (error) {
          console.error(`Error processing artist ${artistId}:`, error);
        }
      }
    }
    
    // Combine personal events with band events
    const allEvents = [...events, ...bandEvents];
    
    // Log performance metrics for the entire operation
    const endTime = performance.now();
    console.log(`[PERF][${new Date().toISOString()}] Completed loading ${allEvents.length} events (${events.length} user, ${bandEvents.length} band) in ${(endTime - startTime).toFixed(2)}ms`);
    
    // Return all events with band events properly marked
    return allEvents;
  } catch (error) {
    console.error('Error getting user events:', error);
    throw error;
  }
};
