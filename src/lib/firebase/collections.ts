// src/lib/firebase/collections.ts
// Collection names for Firestore

export const COLLECTIONS = {
  USERS: 'bf_users',
  ARTISTS: 'bndy_artists',
  EVENTS: 'bndy_events',
  VENUES: 'bndy_venues',
  SONGS: 'songs',
  SETLISTS: 'setlists',
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];
