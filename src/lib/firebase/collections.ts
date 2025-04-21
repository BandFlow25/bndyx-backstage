// src/lib/firebase/collections.ts
// Collection names for Firestore

export const COLLECTIONS = {
  USERS: 'users',
  ARTISTS: 'bndy_artists',
  EVENTS: 'events',
  SONGS: 'songs',
  SETLISTS: 'setlists',
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];
