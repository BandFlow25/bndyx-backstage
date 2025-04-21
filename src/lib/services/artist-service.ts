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
  deleteDoc
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

    // Create the artist document
    const artistsRef = collection(firestore, COLLECTIONS.ARTISTS);
    const newArtistRef = doc(artistsRef);
    
    // Create the owner as the first member
    const owner: ArtistMember = {
      userId,
      displayName: userDisplayName,
      role: 'owner',
      joinedAt: Timestamp.now(),
      instruments: []
    };

    const newArtist: Artist = {
      id: newArtistRef.id,
      name: artistName,
      hometown: data.hometown,
      genres: data.genres,
      description: data.description,
      socialMedia: data.socialMedia,
      members: [owner],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    await setDoc(newArtistRef, newArtist);
    return newArtist;
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
    
    return artistDoc.data() as Artist;
  }

  /**
   * Get all artists that a user is a member of
   * @param userId The user ID
   * @returns Array of artists the user is a member of
   */
  static async getArtistsByUserId(userId: string): Promise<Artist[]> {
    // Enable targeted debug logging
    const logDebug = (message: string, ...args: any[]) => {
      console.log(`ARTIST_SERVICE: ${message}`, ...args);
    };
    
    const startTime = Date.now();
    logDebug(`Fetching artists for user: ${userId}`);
    
    try {
      // Check if we have a token in localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('bndyAuthToken') : null;
      if (token) {
        try {
          // Verify the token has the correct user ID
          const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
          if (payload?.uid !== userId) {
            logDebug(`Warning: Token user ID (${payload?.uid}) doesn't match requested user ID (${userId})`);
          }
        } catch (err) {
          // Silent error - just for debugging
        }
      }
      
      // Get all artists and filter client-side for matching members
      const artistsRef = collection(firestore, COLLECTIONS.ARTISTS);
      const querySnapshot = await getDocs(artistsRef);
      
      logDebug(`Retrieved ${querySnapshot.size} artists from Firestore in ${Date.now() - startTime}ms`);
      
      const artists: Artist[] = [];
      
      querySnapshot.forEach((doc) => {
        const artist = { id: doc.id, ...doc.data() } as Artist;
        
        // Check if this user is a member of the artist
        const isMember = artist.members && Array.isArray(artist.members) && 
          artist.members.some(member => member && member.userId === userId);
        
        if (isMember) {
          artists.push(artist);
        }
      });
      
      logDebug(`Found ${artists.length} artists for user (processing time: ${Date.now() - startTime}ms)`);
      return artists;
    } catch (error) {
      logDebug(`Error fetching artists: ${Date.now() - startTime}ms elapsed`);
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
    
    const artist = artistDoc.data() as Artist;
    
    // Check if the user is already a member
    const isMember = artist.members.some(m => m.userId === member.userId);
    
    if (isMember) {
      throw new Error(`User with ID ${member.userId} is already a member of this artist`);
    }
    
    // Add the new member
    const updatedMembers = [...artist.members, member];
    
    await updateDoc(artistRef, {
      members: updatedMembers,
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
    
    const artist = artistDoc.data() as Artist;
    
    // Check if the user is a member
    const memberIndex = artist.members.findIndex(m => m.userId === userId);
    
    if (memberIndex === -1) {
      throw new Error(`User with ID ${userId} is not a member of this artist`);
    }
    
    // Check if the user is the owner
    const isOwner = artist.members[memberIndex].role === 'owner';
    
    if (isOwner) {
      throw new Error(`Cannot remove the owner from the artist`);
    }
    
    // Remove the member
    const updatedMembers = artist.members.filter(m => m.userId !== userId);
    
    await updateDoc(artistRef, {
      members: updatedMembers,
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
    
    const artist = artistDoc.data() as Artist;
    
    // Check if the email is already a member
    const isMember = artist.members.some(m => m.userId === `pending_${inviteData.email}`);
    
    if (isMember) {
      throw new Error(`User with email ${inviteData.email} is already a member of this artist`);
    }
    
    // Create a temporary member record for the invited user
    // This will be updated when they accept the invitation
    const newMember: ArtistMember = {
      userId: `pending_${inviteData.email}`,
      displayName: 'Invited User',
      role: inviteData.role,
      joinedAt: Timestamp.now(),
      instruments: [],
      inviteCode: undefined // or set as needed
    };
    
    // Add the new member to the artist
    const updatedMembers = [...artist.members, newMember];
    
    await updateDoc(artistRef, {
      members: updatedMembers,
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
    
    const artist = artistDoc.data() as Artist;
    
    // Find the member
    const memberIndex = artist.members.findIndex(m => m.userId === userId);
    
    if (memberIndex === -1) {
      throw new Error(`User with ID ${userId} is not a member of this artist`);
    }
    
    // If changing to owner, we need to update the current owner as well
    if (newRole === 'owner') {
      // Find the current owner
      const currentOwnerIndex = artist.members.findIndex(m => m.role === 'owner');
      
      if (currentOwnerIndex !== -1) {
        // Demote the current owner to admin
        artist.members[currentOwnerIndex].role = 'admin';
      }
      
      // Promote the member to owner
      artist.members[memberIndex].role = 'owner';
    } else {
      // Just update the role
      // First check if they're the owner and being demoted
      const isCurrentlyOwner = artist.members[memberIndex].role === 'owner';
      
      if (isCurrentlyOwner) {
        throw new Error(`Cannot demote the owner. Transfer ownership to another member first.`);
      }
      
      // Update the role
      artist.members[memberIndex].role = newRole;
    }
    
    await updateDoc(artistRef, {
      members: artist.members,
      updatedAt: serverTimestamp()
    });
    
    // Get the updated artist
    return await this.getArtistById(artistId) as Artist;
  }
}
