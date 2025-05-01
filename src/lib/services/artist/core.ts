// src/lib/services/artist/core.ts
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import { firestore } from '../../firebase';
import { COLLECTIONS } from '../../firebase/collections';
import { Artist, CreateArtistData, ArtistMember, ArtistUpdateData } from './types';

/**
 * Check if an artist name is already taken
 * @param name The artist name to check
 * @returns True if the name is available, false if it's already taken
 */
export async function isNameAvailable(name: string): Promise<boolean> {
  const artistsRef = collection(firestore, COLLECTIONS.ARTISTS);
  const q = query(artistsRef, where('name', '==', name));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
}

/**
 * Generate a unique artist name by appending the hometown
 * @param name The original artist name
 * @param hometown The artist's hometown
 * @returns A unique artist name
 */
export async function generateUniqueName(name: string, hometown: string): Promise<string> {
  // First check if the original name is available
  if (await isNameAvailable(name)) {
    return name;
  }

  // If not, try appending the hometown
  const nameWithHometown = `${name} (${hometown})`;
  if (await isNameAvailable(nameWithHometown)) {
    return nameWithHometown;
  }

  // If that's still not unique, add a random number
  let uniqueName = '';
  let isUnique = false;
  
  while (!isUnique) {
    const randomNum = Math.floor(Math.random() * 1000);
    uniqueName = `${name} (${hometown} ${randomNum})`;
    isUnique = await isNameAvailable(uniqueName);
  }

  return uniqueName;
}

/**
 * Create a new artist
 * @param data The artist data
 * @param userId The ID of the user creating the artist
 * @param userDisplayName The display name of the user creating the artist
 * @param userEmail The email of the user creating the artist
 * @returns The created artist
 */
export async function createArtist(
  data: CreateArtistData,
  userId: string,
  userDisplayName: string,
  userEmail: string
): Promise<Artist> {
  // Check if the name is available
  const isAvailable = await isNameAvailable(data.name);
  
  // If not, generate a unique name
  const artistName = isAvailable 
    ? data.name 
    : await generateUniqueName(data.name, data.hometown || '');

  // Create the artist document (without members field)
  const artistsRef = collection(firestore, COLLECTIONS.ARTISTS);
  const newArtistRef = doc(artistsRef);
  
  const newArtist: Omit<Artist, 'members'> = {
    id: newArtistRef.id,
    name: artistName,
    hometown: data.hometown,
    genres: data.genres,
    description: data.description,
    socialMedia: data.socialMedia,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  await setDoc(newArtistRef, newArtist);
  
  // Create the owner as the first member in the members subcollection
  const owner: ArtistMember = {
    userId,
    displayName: userDisplayName,
    role: 'owner',
    joinedAt: Timestamp.now(),
    instruments: []
  };
  
  const membersCollectionRef = collection(firestore, COLLECTIONS.ARTISTS, newArtistRef.id, 'members');
  const memberDocRef = doc(membersCollectionRef, userId);
  await setDoc(memberDocRef, owner);
  
  // Return the artist with members attached
  const artistWithMembers = {
    ...newArtist,
    members: [owner]
  } as Artist;
  
  return artistWithMembers;
}

/**
 * Get an artist by ID
 * @param artistId The artist ID
 * @returns The artist or null if not found
 */
export async function getArtistById(artistId: string): Promise<Artist | null> {
  const artistRef = doc(firestore, COLLECTIONS.ARTISTS, artistId);
  const artistDoc = await getDoc(artistRef);
  
  if (!artistDoc.exists()) {
    return null;
  }
  
  const artistData = artistDoc.data();
  
  // Fetch members from subcollection
  const membersCollectionRef = collection(firestore, COLLECTIONS.ARTISTS, artistId, 'members');
  const membersSnapshot = await getDocs(membersCollectionRef);
  
  const members: ArtistMember[] = [];
  membersSnapshot.forEach((memberDoc) => {
    members.push({ ...memberDoc.data(), id: memberDoc.id } as ArtistMember);
  });
  
  // Return the artist with members attached
  return {
    ...artistData,
    members
  } as Artist;
}

/**
 * Update an artist's profile
 * @param artistId The artist ID
 * @param data The updated artist data
 * @returns The updated artist
 */
export async function updateArtist(
  artistId: string,
  data: ArtistUpdateData
): Promise<Artist> {
  const artistRef = doc(firestore, COLLECTIONS.ARTISTS, artistId);
  
  // Update the artist document
  await updateDoc(artistRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
  
  // Get the updated artist
  const updatedArtist = await getArtistById(artistId);
  
  if (!updatedArtist) {
    throw new Error(`Artist with ID ${artistId} not found after update`);
  }
  
  return updatedArtist;
}
