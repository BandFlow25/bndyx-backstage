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
  const startTime = Date.now();
  console.log(`[DEBUG] getArtistsByUserId - Starting for user: ${userId}`);
  
  try {
    console.log(`[DEBUG] getArtistsByUserId - Creating collectionGroup query for 'members'`);
    // First, find all memberships for this user
    const membershipQuery = query(
      collectionGroup(firestore, 'members'),
      where('userId', '==', userId)
    );
    
    console.log(`[DEBUG] getArtistsByUserId - Executing collectionGroup query`);
    const membershipSnapshot = await getDocs(membershipQuery);
    console.log(`[DEBUG] getArtistsByUserId - Query completed, got ${membershipSnapshot.docs.length} results`);
    
    const artists: Artist[] = [];
    
    // For each membership, get the parent artist
    console.log(`[DEBUG] getArtistsByUserId - Processing membership documents`);
    for (const memberDoc of membershipSnapshot.docs) {
      // Get the parent path parts to extract the artist ID
      const pathParts = memberDoc.ref.path.split('/');
      const artistId = pathParts[pathParts.length - 3]; // Format: "bndy_artists/{artistId}/members/{memberId}"
      console.log(`[DEBUG] getArtistsByUserId - Found membership in artist: ${artistId}, path: ${memberDoc.ref.path}`);
      
      // Get the artist document
      console.log(`[DEBUG] getArtistsByUserId - Fetching artist details for: ${artistId}`);
      const artist = await getArtistById(artistId);
      if (artist) {
        console.log(`[DEBUG] getArtistsByUserId - Successfully retrieved artist: ${artist.name}`);
        artists.push(artist);
      } else {
        console.log(`[DEBUG] getArtistsByUserId - Could not find artist document for ID: ${artistId}`);
      }
    }
    
    console.log(`[DEBUG] getArtistsByUserId - Found ${artists.length} artists for user (processing time: ${Date.now() - startTime}ms)`);
    return artists;
  } catch (error) {
    console.log(`[DEBUG] getArtistsByUserId - Error occurred after ${Date.now() - startTime}ms`);
    console.error('Error fetching artists:', error);
    if (error instanceof Error) {
      console.error(`[DEBUG] getArtistsByUserId - Error details: ${error.message}`);
      console.error(`[DEBUG] getArtistsByUserId - Error stack: ${error.stack}`);
    }
    // Return empty array instead of throwing to prevent UI from hanging
    return [];
  }
}
