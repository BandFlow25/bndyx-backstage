/**
 * This is a simple test file to verify that the centralized event types and utilities
 * from bndy-types are working correctly. This file is not meant to be executed,
 * but rather to check that the TypeScript types are correct.
 */

import { 
  EventType, 
  EventCategory, 
  BndyCalendarEvent,
  getEventColor,
  getEventCategoryColor,
  EVENT_CATEGORY_COLORS,
  USER_CALENDAR_BAND_EVENT_COLOR
} from '../types/calendar';

// Test creating events with different types
const userEvent: BndyCalendarEvent = {
  id: '1',
  title: 'User Unavailable',
  start: new Date(),
  end: new Date(),
  eventType: 'unavailable',
  isPublic: false,
  sourceType: undefined // Not a band event
};

const bandEvent: BndyCalendarEvent = {
  id: '2',
  title: 'Band Practice',
  start: new Date(),
  end: new Date(),
  eventType: 'practice',
  isPublic: true,
  artistId: 'band-123',
  sourceType: 'band',
  sourceId: 'band-123',
  sourceName: 'Test Band'
};

// Test getting colors for different event types and contexts
const userEventColor = getEventColor(userEvent.eventType, 'user');
const bandEventColor = getEventColor(bandEvent.eventType, 'band');
const bandEventInUserCalendarColor = getEventColor(bandEvent.eventType, 'user', 'band');

// Verify that band events in user calendar are always blue
console.assert(
  bandEventInUserCalendarColor === USER_CALENDAR_BAND_EVENT_COLOR,
  'Band events in user calendar should always be blue'
);

// Test using the EventCategory enum
const unavailableColor = getEventCategoryColor(EventCategory.UNAVAILABLE);
const practiceColor = getEventCategoryColor(EventCategory.PRACTICE);

// Verify that the colors match the expected values
console.assert(
  unavailableColor === EVENT_CATEGORY_COLORS[EventCategory.UNAVAILABLE],
  'Unavailable color should match the value in EVENT_CATEGORY_COLORS'
);

console.assert(
  practiceColor === EVENT_CATEGORY_COLORS[EventCategory.PRACTICE],
  'Practice color should match the value in EVENT_CATEGORY_COLORS'
);

// This demonstrates that we can use both the string-based EventType
// and the enum-based EventCategory in our code, maintaining backward
// compatibility while providing a more structured approach.
