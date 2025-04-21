// src/types/artist.ts
import { Timestamp } from 'firebase/firestore';

/**
 * Represents a music genre
 */
// MusicGenre type is now imported from bndy-types


/**
 * Represents social media links for an artist
 */
export interface SocialMediaLinks {
  instagram?: string;
  facebook?: string;
  spotify?: string;
  twitter?: string;
  youtube?: string;
  website?: string;
}
// All artist-related types have been moved to 'bndy-types'.
// Please import Artist, ArtistMember, CreateArtistData, MusicGenre, etc. directly from 'bndy-types'.
