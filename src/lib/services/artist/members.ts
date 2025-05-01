// src/lib/services/artist/members.ts
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { firestore } from '../../firebase';
import { COLLECTIONS } from '../../firebase/collections';
import { Artist, ArtistMember } from './types';
import { getArtistById } from './core';

/**
 * Add a member to an artist
 * @param artistId The artist ID
 * @param member The new member to add
 * @returns The updated artist
 */
export async function addMember(artistId: string, member: ArtistMember): Promise<Artist> {
  const artistRef = doc(firestore, COLLECTIONS.ARTISTS, artistId);
  const artistDoc = await getDoc(artistRef);
  
  if (!artistDoc.exists()) {
    throw new Error(`Artist with ID ${artistId} not found`);
  }
  
  // Check if the user is already a member in the subcollection
  const membersCollectionRef = collection(firestore, COLLECTIONS.ARTISTS, artistId, 'members');
  const memberDocRef = doc(membersCollectionRef, member.userId);
  const memberDoc = await getDoc(memberDocRef);
  
  if (memberDoc.exists()) {
    throw new Error(`User with ID ${member.userId} is already a member of this artist`);
  }
  
  // Add the new member to the subcollection
  await setDoc(memberDocRef, {
    ...member,
    joinedAt: Timestamp.now()
  });
  
  // Update the artist's updatedAt timestamp
  await updateDoc(artistRef, {
    updatedAt: serverTimestamp()
  });
  
  // Get the updated artist
  return await getArtistById(artistId) as Artist;
}

/**
 * Remove a member from an artist
 * @param artistId The artist ID
 * @param userId The ID of the user to remove
 * @returns The updated artist
 */
export async function removeMember(artistId: string, userId: string): Promise<Artist> {
  const artistRef = doc(firestore, COLLECTIONS.ARTISTS, artistId);
  const artistDoc = await getDoc(artistRef);
  
  if (!artistDoc.exists()) {
    throw new Error(`Artist with ID ${artistId} not found`);
  }
  
  // Check if the user is a member in the subcollection
  const membersCollectionRef = collection(firestore, COLLECTIONS.ARTISTS, artistId, 'members');
  const memberDocRef = doc(membersCollectionRef, userId);
  const memberDoc = await getDoc(memberDocRef);
  
  if (!memberDoc.exists()) {
    throw new Error(`User with ID ${userId} is not a member of this artist`);
  }
  
  // Check if the user is the owner
  const memberData = memberDoc.data() as ArtistMember;
  if (memberData.role === 'owner') {
    throw new Error('Cannot remove the owner from the artist');
  }
  
  // Remove the member from the subcollection
  await deleteDoc(memberDocRef);
  
  // Update the artist's updatedAt timestamp
  await updateDoc(artistRef, {
    updatedAt: serverTimestamp()
  });
  
  // Get the updated artist
  return await getArtistById(artistId) as Artist;
}

/**
 * Update a member's role or other properties
 * @param artistId The artist ID
 * @param userId The ID of the user to update
 * @param updates The updates to apply to the member
 * @returns The updated artist
 */
export async function updateMember(
  artistId: string, 
  userId: string, 
  updates: Partial<Omit<ArtistMember, 'userId'>>
): Promise<Artist> {
  const artistRef = doc(firestore, COLLECTIONS.ARTISTS, artistId);
  const artistDoc = await getDoc(artistRef);
  
  if (!artistDoc.exists()) {
    throw new Error(`Artist with ID ${artistId} not found`);
  }
  
  // Check if the user is a member in the subcollection
  const membersCollectionRef = collection(firestore, COLLECTIONS.ARTISTS, artistId, 'members');
  const memberDocRef = doc(membersCollectionRef, userId);
  const memberDoc = await getDoc(memberDocRef);
  
  if (!memberDoc.exists()) {
    throw new Error(`User with ID ${userId} is not a member of this artist`);
  }
  
  // Get the current member data
  const memberData = memberDoc.data() as ArtistMember;
  
  // Prevent changing the owner's role
  if (memberData.role === 'owner' && updates.role && updates.role !== 'owner') {
    throw new Error('Cannot change the role of the owner');
  }
  
  // Update the member in the subcollection
  await updateDoc(memberDocRef, updates);
  
  // Update the artist's updatedAt timestamp
  await updateDoc(artistRef, {
    updatedAt: serverTimestamp()
  });
  
  // Get the updated artist
  return await getArtistById(artistId) as Artist;
}

/**
 * Get all members of an artist
 * @param artistId The artist ID
 * @returns Array of artist members
 */
export async function getArtistMembers(artistId: string): Promise<ArtistMember[]> {
  const membersCollectionRef = collection(firestore, COLLECTIONS.ARTISTS, artistId, 'members');
  const membersSnapshot = await getDocs(membersCollectionRef);
  
  const members: ArtistMember[] = [];
  membersSnapshot.forEach((memberDoc) => {
    members.push({ ...memberDoc.data(), id: memberDoc.id } as ArtistMember);
  });
  
  return members;
}
