// src/lib/firebase/events/artist-events.ts
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFirebaseFirestore } from '../index';
import { COLLECTIONS } from '../collections';
import { BndyCalendarEvent } from '@/types/calendar';
import { convertToCalendarEvent } from './converters';
import { FirestoreEvent } from './types';

/**
 * Get all events for an artist, including band members' unavailable/tentative events
 * @param artistId The ID of the artist to get events for
 * @returns Array of calendar events for the artist and their members
 */
export const getArtistEvents = async (artistId: string): Promise<BndyCalendarEvent[]> => {
  // Get the current user for checking if event details should be shown
  const auth = getAuth();
  const currentUser = auth.currentUser;
  try {
    const firestore = getFirebaseFirestore();
    const eventsCollection = collection(firestore, COLLECTIONS.EVENTS);
    const events: BndyCalendarEvent[] = [];
    
    // Get artist events
    const artistEventQuery = query(eventsCollection, where('artistId', '==', artistId));
    const artistQuerySnapshot = await getDocs(artistEventQuery);
    
    artistQuerySnapshot.forEach((doc) => {
      const eventData = doc.data() as FirestoreEvent;
      events.push(convertToCalendarEvent({ ...eventData, id: doc.id }));
    });
    
    // Get band members' unavailable and tentative events
    try {
      const artistDocRef = doc(firestore, COLLECTIONS.ARTISTS, artistId);
      const artistDoc = await getDoc(artistDocRef);
      if (!artistDoc.exists()) {
        console.warn(`Artist with ID ${artistId} not found`);
        return events; // Return just the artist events if artist doc not found
      }
      
      const artistData = artistDoc.data();
      
      // Handle different member structures
      let memberIds: string[] = [];
      
      // Add current user for testing if needed
      const currentUserAuth = getAuth();
      const currentUserData = currentUserAuth.currentUser;
      if (currentUserData && currentUserData.uid) {
        console.log('Adding current user as a member for testing:', currentUserData.uid);
        memberIds.push(currentUserData.uid);
      }
      
      // Fetch members from the subcollection
      const membersCollectionRef = collection(firestore, COLLECTIONS.ARTISTS, artistId, 'members');
      const membersSnapshot = await getDocs(membersCollectionRef);
      
      console.log(`Found ${membersSnapshot.size} members in subcollection for artist ${artistId}`);
      
      // Extract member IDs from the subcollection
      const arrayMembers = membersSnapshot.docs.map(doc => {
        const memberData = doc.data();
        return memberData.userId;
      }).filter(Boolean);
      
      memberIds = [...memberIds, ...arrayMembers];
      
      // Check if members might be in a different field
      if (artistData.userIds) {
        if (Array.isArray(artistData.userIds)) {
          const userIdsMembers = artistData.userIds.filter(Boolean);
          memberIds = [...memberIds, ...userIdsMembers];
        } else if (typeof artistData.userIds === 'object') {
          const userIdsObjectMembers = Object.keys(artistData.userIds);
          memberIds = [...memberIds, ...userIdsObjectMembers];
        }
      }
      
      // Check for owner as a member
      if (artistData.ownerId) {
        memberIds.push(artistData.ownerId);
      }
      
      // Remove duplicates
      memberIds = [...new Set(memberIds)];
      
      // Process each member's events
      for (const memberId of memberIds) {
        try {
          // Get user document to get display name
          const userDocRef = doc(firestore, COLLECTIONS.USERS, memberId);
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            console.warn(`User with ID ${memberId} not found`);
            continue; // Skip this member
          }
          
          const userData = userDoc.data();
          const displayName = userData.displayName || 'Band Member';
          
          // Query for all personal events from this member
          const memberEventQuery = query(
            eventsCollection,
            where('createdBy', '==', memberId)
          );
          
          const memberQuerySnapshot = await getDocs(memberEventQuery);
          
          // Filter for unavailable/tentative events only
          const unavailableEvents = memberQuerySnapshot.docs
            .filter(doc => {
              const data = doc.data() as FirestoreEvent;
              return data.eventType === 'unavailable' || data.eventType === 'tentative';
            });
          
          unavailableEvents.forEach((docSnapshot) => {
            const eventData = docSnapshot.data() as FirestoreEvent;
            
            // Create the formatted title with capitalized event type
            const capitalizedEventType = eventData.eventType.charAt(0).toUpperCase() + eventData.eventType.slice(1);
            const formattedTitle = memberId === currentUser?.uid && eventData.title
              ? `${displayName}: ${eventData.title}` 
              : `${displayName} - ${capitalizedEventType}`;
            
            // Add member info to the event and prefix the title with member name
            const calendarEvent = convertToCalendarEvent({
              ...eventData,
              id: docSnapshot.id,
              // Add metadata to identify this as a member event
              sourceType: 'member',
              sourceId: memberId,
              sourceName: displayName,
              // For member events, we just want to show the member name and event type
              // Only include the actual event title if the current user is this member
              title: formattedTitle
            });
            
            events.push(calendarEvent);
          });
        } catch (memberError) {
          console.error(`Error fetching events for member ${memberId}:`, memberError);
          // Continue with other members even if one fails
        }
      }
    } catch (artistError) {
      console.error(`Error fetching artist data for ${artistId}:`, artistError);
      // Return just the artist events if there's an error with the artist document
    }
    
    return events;
  } catch (error) {
    console.error('Error getting artist events:', error);
    throw error;
  }
};
