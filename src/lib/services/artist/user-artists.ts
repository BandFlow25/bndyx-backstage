// src/lib/services/artist/user-artists.ts
import { 
  collectionGroup,
  getDocs, 
  query, 
  where
} from 'firebase/firestore';
import { firestore } from '../../firebase';
import { Artist } from './types';
import { getArtistById } from './core';

/**
 * Get all artists that a user is a member of
 * @param userId The user ID
 * @returns Array of artists the user is a member of
 */
export async function getArtistsByUserId(userId: string): Promise<Artist[]> {
  const startTime = performance.now();
  console.log(`[PERF][${new Date().toISOString()}] getArtistsByUserId - Starting for user: ${userId}`);
  
  try {
    // Creating collectionGroup query for 'members'
    // First, find all memberships for this user
    const membershipQuery = query(
      collectionGroup(firestore, 'members'),
      where('userId', '==', userId)
    );
    
    // Execute query
    const membershipSnapshot = await getDocs(membershipQuery);
    const queryTime = performance.now();
    console.log(`[PERF][${new Date().toISOString()}] getArtistsByUserId - Query completed in ${(queryTime - startTime).toFixed(2)}ms, got ${membershipSnapshot.docs.length} results`);
    
    const artists: Artist[] = [];
    
    // For each membership, get the parent artist
    for (const memberDoc of membershipSnapshot.docs) {
      // Get the parent path parts to extract the artist ID
      const pathParts = memberDoc.ref.path.split('/');
      const artistId = pathParts[pathParts.length - 3]; // Format: "bndy_artists/{artistId}/members/{memberId}"
      // Get the artist document for this membership
      const artist = await getArtistById(artistId);
      if (artist) {
        artists.push(artist);
      }
    }
    
    const endTime = performance.now();
    console.log(`[PERF][${new Date().toISOString()}] getArtistsByUserId - Found ${artists.length} artists for user in ${(endTime - startTime).toFixed(2)}ms`);
    return artists;
  } catch (error) {
    const errorTime = performance.now();
    console.error(`[PERF][${new Date().toISOString()}] getArtistsByUserId - Error occurred after ${(errorTime - startTime).toFixed(2)}ms:`, error);
    // Return empty array instead of throwing to prevent UI from hanging
    return [];
  }
}
