// src/lib/services/artist-service.ts
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
  updateDoc,
  deleteDoc,
  collectionGroup
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { firestore, storage } from '../firebase';
import { COLLECTIONS } from '../firebase/collections';
import { Artist, CreateArtistData, ArtistMember } from 'bndy-types';

/**
 * Service for managing artist data in Firebase
 */
export class ArtistService {
  /**
   * Check if an artist name is already taken
   * @param name The artist name to check
   * @returns True if the name is available, false if it's already taken
   */
  static async isNameAvailable(name: string): Promise<boolean> {
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
  static async generateUniqueName(name: string, hometown: string): Promise<string> {
    // First check if the original name is available
    if (await this.isNameAvailable(name)) {
      return name;
    }

    // If not, try appending the hometown
    const nameWithHometown = `${name} (${hometown})`;
    if (await this.isNameAvailable(nameWithHometown)) {
      return nameWithHometown;
    }

    // If that's still not unique, add a random number
    let uniqueName = '';
    let isUnique = false;
    
    while (!isUnique) {
      const randomNum = Math.floor(Math.random() * 1000);
      uniqueName = `${name} (${hometown} ${randomNum})`;
      isUnique = await this.isNameAvailable(uniqueName);
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
  static async createArtist(
    data: CreateArtistData,
    userId: string,
    userDisplayName: string,
    userEmail: string
  ): Promise<Artist> {
    // Check if the name is available
    const isAvailable = await this.isNameAvailable(data.name);
    
    // If not, generate a unique name
    const artistName = isAvailable 
      ? data.name 
      : await this.generateUniqueName(data.name, data.hometown || '');

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
  static async getArtistById(artistId: string): Promise<Artist | null> {
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
   * Get all artists that a user is a member of
   * @param userId The user ID
   * @returns Array of artists the user is a member of
   */
  static async getArtistsByUserId(userId: string): Promise<Artist[]> {
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
        const artist = await this.getArtistById(artistId);
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

  /**
   * Update an artist's profile
   * @param artistId The artist ID
   * @param data The updated artist data
   * @returns The updated artist
   */
  static async updateArtist(
    artistId: string,
    data: Partial<Omit<Artist, 'id' | 'createdAt' | 'members'>>
  ): Promise<Artist> {
    const artistRef = doc(firestore, COLLECTIONS.ARTISTS, artistId);
    
    // Update the artist document
    await updateDoc(artistRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    // Get the updated artist
    const updatedArtist = await this.getArtistById(artistId);
    
    if (!updatedArtist) {
      throw new Error(`Artist with ID ${artistId} not found after update`);
    }
    
    return updatedArtist;
  }

  /**
   * Upload an artist avatar image
   * @param artistId The artist ID
   * @param file The image file
   * @returns The URL of the uploaded image
   */
  static async uploadAvatarImage(artistId: string, file: File): Promise<string> {
    const fileExtension = file.name.split('.').pop();
    const fileName = `avatar_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `artists/${artistId}/images/${fileName}`);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadUrl = await getDownloadURL(storageRef);
    
    // Update the artist document with the new avatar URL
    const artistRef = doc(firestore, COLLECTIONS.ARTISTS, artistId);
    await updateDoc(artistRef, {
      avatarUrl: downloadUrl,
      updatedAt: serverTimestamp()
    });
    
    return downloadUrl;
  }

  /**
   * Upload an artist header image
   * @param artistId The artist ID
   * @param file The image file
   * @returns The URL of the uploaded image
   */
  static async uploadHeaderImage(artistId: string, file: File): Promise<string> {
    const fileExtension = file.name.split('.').pop();
    const fileName = `header_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `artists/${artistId}/images/${fileName}`);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadUrl = await getDownloadURL(storageRef);
    
    // Update the artist document with the new header image URL
    const artistRef = doc(firestore, COLLECTIONS.ARTISTS, artistId);
    await updateDoc(artistRef, {
      headerImageUrl: downloadUrl,
      updatedAt: serverTimestamp()
    });
    
    return downloadUrl;
  }

  /**
   * Add a member to an artist
   * @param artistId The artist ID
   * @param member The new member to add
   * @returns The updated artist
   */
  static async addMember(artistId: string, member: ArtistMember): Promise<Artist> {
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
    await setDoc(memberDocRef, member);
    
    // Update the artist's updatedAt timestamp
    await updateDoc(artistRef, {
      updatedAt: serverTimestamp()
    });
    
    // Get the updated artist
    return await this.getArtistById(artistId) as Artist;
  }

  /**
   * Remove a member from an artist
   * @param artistId The artist ID
   * @param userId The ID of the user to remove
   * @returns The updated artist
   */
  static async removeMember(artistId: string, userId: string): Promise<Artist> {
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
    
    const memberData = memberDoc.data() as ArtistMember;
    
    // Check if the user is the owner
    if (memberData.role === 'owner') {
      throw new Error(`Cannot remove the owner from the artist`);
    }
    
    // Remove the member from the subcollection
    await deleteDoc(memberDocRef);
    
    // Update the artist's updatedAt timestamp
    await updateDoc(artistRef, {
      updatedAt: serverTimestamp()
    });
    
    // Get the updated artist
    return await this.getArtistById(artistId) as Artist;
  }

  /**
   * Delete an artist
   * @param artistId The artist ID
   */
  static async deleteArtist(artistId: string): Promise<void> {
    // First, delete all members in the subcollection
    const membersCollectionRef = collection(firestore, COLLECTIONS.ARTISTS, artistId, 'members');
    const membersSnapshot = await getDocs(membersCollectionRef);
    
    const deletePromises = membersSnapshot.docs.map(memberDoc => 
      deleteDoc(memberDoc.ref)
    );
    
    await Promise.all(deletePromises);
    
    // Then delete the artist document
    const artistRef = doc(firestore, COLLECTIONS.ARTISTS, artistId);
    await deleteDoc(artistRef);
  }

  /**
   * Invite a new member to an artist/band
   * @param artistId The artist ID
   * @param inviteData The invitation data
   * @returns The updated artist
   */
  static async inviteMember(artistId: string, inviteData: {
    email: string;
    role: 'member' | 'admin';
    invitedBy: string;
    invitedAt: string;
  }): Promise<Artist> {
    const artistRef = doc(firestore, COLLECTIONS.ARTISTS, artistId);
    const artistDoc = await getDoc(artistRef);
    
    if (!artistDoc.exists()) {
      throw new Error(`Artist with ID ${artistId} not found`);
    }
    
    // Check if the email is already a member in the subcollection
    const pendingUserId = `pending_${inviteData.email}`;
    const membersCollectionRef = collection(firestore, COLLECTIONS.ARTISTS, artistId, 'members');
    const memberDocRef = doc(membersCollectionRef, pendingUserId);
    const memberDoc = await getDoc(memberDocRef);
    
    if (memberDoc.exists()) {
      throw new Error(`User with email ${inviteData.email} is already a member of this artist`);
    }
    
    // Create a temporary member record for the invited user
    // This will be updated when they accept the invitation
    const newMember: ArtistMember = {
      userId: pendingUserId,
      displayName: 'Invited User',
      role: inviteData.role,
      joinedAt: Timestamp.now(),
      instruments: [],
      inviteCode: undefined // or set as needed
    };
    
    // Add the new member to the subcollection
    await setDoc(memberDocRef, newMember);
    
    // Update the artist's updatedAt timestamp
    await updateDoc(artistRef, {
      updatedAt: serverTimestamp()
    });
    
    // Get the updated artist
    return await this.getArtistById(artistId) as Artist;
  }

  /**
   * Update a member's role in an artist/band
   * @param artistId The artist ID
   * @param userId The user ID of the member
   * @param newRole The new role for the member
   * @returns The updated artist
   */
  static async updateMemberRole(
    artistId: string, 
    userId: string, 
    newRole: 'owner' | 'admin' | 'member'
  ): Promise<Artist> {
    const artistRef = doc(firestore, COLLECTIONS.ARTISTS, artistId);
    const artistDoc = await getDoc(artistRef);
    
    if (!artistDoc.exists()) {
      throw new Error(`Artist with ID ${artistId} not found`);
    }
    
    // Get the members subcollection
    const membersCollectionRef = collection(firestore, COLLECTIONS.ARTISTS, artistId, 'members');
    
    // Find the member to update
    const memberDocRef = doc(membersCollectionRef, userId);
    const memberDoc = await getDoc(memberDocRef);
    
    if (!memberDoc.exists()) {
      throw new Error(`User with ID ${userId} is not a member of this artist`);
    }
    
    const memberData = memberDoc.data() as ArtistMember;
    
    // If changing to owner, we need to update the current owner as well
    if (newRole === 'owner') {
      // Find the current owner
      const ownerQuery = query(membersCollectionRef, where('role', '==', 'owner'));
      const ownerSnapshot = await getDocs(ownerQuery);
      
      if (!ownerSnapshot.empty) {
        // Demote the current owner to admin
        const currentOwnerDoc = ownerSnapshot.docs[0];
        const currentOwnerData = currentOwnerDoc.data() as ArtistMember;
        await updateDoc(doc(membersCollectionRef, currentOwnerData.userId), {
          role: 'admin'
        });
      }
      
      // Promote the member to owner
      await updateDoc(memberDocRef, {
        role: 'owner'
      });
    } else {
      // Just update the role
      // First check if they're the owner and being demoted
      if (memberData.role === 'owner') {
        throw new Error(`Cannot demote the owner. Transfer ownership to another member first.`);
      }
      
      // Update the role
      await updateDoc(memberDocRef, {
        role: newRole
      });
    }
    
    // Update the artist's updatedAt timestamp
    await updateDoc(artistRef, {
      updatedAt: serverTimestamp()
    });
    
    // Get the updated artist
    return await this.getArtistById(artistId) as Artist;
  }
}
