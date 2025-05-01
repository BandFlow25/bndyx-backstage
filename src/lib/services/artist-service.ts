// src/lib/services/artist-service.ts
// DEPRECATED: This file is kept for backward compatibility.
// Please import directly from '@/lib/services/artist' for new code.

import * as ArtistModules from './artist';
import type { Artist, CreateArtistData, ArtistMember, ArtistUpdateData } from './artist/types';

/**
 * Service for managing artist data in Firebase
 * @deprecated Use the modular functions from '@/lib/services/artist' instead
 */
export class ArtistService {
  /**
   * Check if an artist name is already taken
   * @param name The artist name to check
   * @returns True if the name is available, false if it's already taken
   */
  static async isNameAvailable(name: string): Promise<boolean> {
    return ArtistModules.isNameAvailable(name);
  }

  /**
   * Generate a unique artist name by appending the hometown
   * @param name The original artist name
   * @param hometown The artist's hometown
   * @returns A unique artist name
   */
  static async generateUniqueName(name: string, hometown: string): Promise<string> {
    return ArtistModules.generateUniqueName(name, hometown);
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
    return ArtistModules.createArtist(data, userId, userDisplayName, userEmail);
  }

  /**
   * Get an artist by ID
   * @param artistId The artist ID
   * @returns The artist or null if not found
   */
  static async getArtistById(artistId: string): Promise<Artist | null> {
    return ArtistModules.getArtistById(artistId);
  }

  /**
   * Get all artists that a user is a member of
   * @param userId The user ID
   * @returns Array of artists the user is a member of
   */
  static async getArtistsByUserId(userId: string): Promise<Artist[]> {
    return ArtistModules.getArtistsByUserId(userId);
  }

  /**
   * Update an artist's profile
   * @param artistId The artist ID
   * @param data The updated artist data
   * @returns The updated artist
   */
  static async updateArtist(
    artistId: string,
    data: ArtistUpdateData
  ): Promise<Artist> {
    return ArtistModules.updateArtist(artistId, data);
  }

  /**
   * Upload an artist avatar image
   * @param artistId The artist ID
   * @param file The image file
   * @returns The URL of the uploaded image
   */
  static async uploadAvatarImage(artistId: string, file: File): Promise<string> {
    return ArtistModules.uploadAvatarImage(artistId, file);
  }

  /**
   * Upload an artist header image
   * @param artistId The artist ID
   * @param file The image file
   * @returns The URL of the uploaded image
   */
  static async uploadHeaderImage(artistId: string, file: File): Promise<string> {
    return ArtistModules.uploadHeaderImage(artistId, file);
  }

  /**
   * Add a member to an artist
   * @param artistId The artist ID
   * @param member The new member to add
   * @returns The updated artist
   */
  static async addMember(artistId: string, member: ArtistMember): Promise<Artist> {
    return ArtistModules.addMember(artistId, member);
  }

  /**
   * Remove a member from an artist
   * @param artistId The artist ID
   * @param userId The ID of the user to remove
   * @returns The updated artist
   */
  static async removeMember(artistId: string, userId: string): Promise<Artist> {
    return ArtistModules.removeMember(artistId, userId);
  }

  /**
   * Update a member's role or other properties
   * @param artistId The artist ID
   * @param userId The ID of the user to update
   * @param updates The updates to apply to the member
   * @returns The updated artist
   */
  static async updateMember(
    artistId: string, 
    userId: string, 
    updates: Partial<Omit<ArtistMember, 'userId'>>
  ): Promise<Artist> {
    return ArtistModules.updateMember(artistId, userId, updates);
  }

  /**
   * Get all members of an artist
   * @param artistId The artist ID
   * @returns Array of artist members
   */
  static async getArtistMembers(artistId: string): Promise<ArtistMember[]> {
    return ArtistModules.getArtistMembers(artistId);
  }

  /**
   * Invite a new member to an artist
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
    return ArtistModules.inviteMember(artistId, inviteData);
  }

  /**
   * Delete an artist
   * @param artistId The artist ID
   */
  static async deleteArtist(artistId: string): Promise<void> {
    // This is a placeholder - the actual implementation would be added in the appropriate module
    throw new Error('Not implemented');
  }

  /**
   * Delete an artist image from storage
   * @param imageUrl The URL of the image to delete
   */
  static async deleteArtistImage(imageUrl: string): Promise<void> {
    return ArtistModules.deleteArtistImage(imageUrl);
  }
}
