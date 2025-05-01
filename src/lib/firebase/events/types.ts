// src/lib/firebase/events/types.ts
import { Timestamp } from 'firebase/firestore';
import { EventType } from '@/types/calendar';

// Type for Firestore event document
export interface FirestoreEvent {
  id?: string;
  title: string;
  startDate: Timestamp;
  endDate: Timestamp;
  allDay: boolean;
  eventType: EventType;
  isPublic: boolean;
  artistId?: string;
  venueId?: string;
  description?: string;
  recurring?: boolean;
  recurringPattern?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  createdBy: string;
  // Additional metadata for event source
  sourceType?: 'band' | 'member'; // Where the event comes from
  sourceId?: string;              // ID of the source (band or member)
  sourceName?: string;            // Name of the source (band or member name)
}
