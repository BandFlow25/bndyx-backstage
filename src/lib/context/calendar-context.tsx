'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from 'bndy-ui';
import type { User } from 'firebase/auth';
import { useArtist } from './artist-context';
import { BndyCalendarEvent, EventType, USER_CALENDAR_BAND_EVENT_COLOR } from '@/types/calendar';
// Import from the new modular structure
import { createEvent, updateEvent, deleteEvent } from '@/lib/firebase/events/core-operations';
import { getUserEvents } from '@/lib/firebase/events/user-events';
import { getArtistEvents } from '@/lib/firebase/events/artist-events';
// Import the new artist cache service
import { getCachedArtistsByUserId } from '@/lib/services/cache/artist-cache';

interface CalendarContextType {
  events: BndyCalendarEvent[];
  isLoading: boolean;
  error: Error | null;
  showBandEvents: boolean;
  toggleBandEvents: () => void;
  createNewEvent: (event: BndyCalendarEvent) => Promise<string>;
  updateExistingEvent: (eventId: string, event: Partial<BndyCalendarEvent>) => Promise<void>;
  removeEvent: (eventId: string) => Promise<void>;
  refreshEvents: () => Promise<void>;
  getEventsForArtist: (artistId: string) => Promise<BndyCalendarEvent[]>;
}

const CalendarContext = createContext<CalendarContextType>({
  events: [],
  isLoading: false,
  error: null,
  showBandEvents: true,
  toggleBandEvents: () => {},
  createNewEvent: async () => '',
  updateExistingEvent: async () => {},
  removeEvent: async () => {},
  refreshEvents: async () => {},
  getEventsForArtist: async () => []
});

export const useCalendar = () => useContext(CalendarContext);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const { currentUserArtists } = useArtist();
  const [events, setEvents] = useState<BndyCalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [showBandEvents, setShowBandEvents] = useState<boolean>(true);
  const [userEvents, setUserEvents] = useState<BndyCalendarEvent[]>([]);
  const [bandEvents, setBandEvents] = useState<BndyCalendarEvent[]>([]);

  // Toggle band events visibility
  const toggleBandEvents = useCallback(() => {
    setShowBandEvents(prev => !prev);
  }, []);

  // Update displayed events based on showBandEvents setting
  useEffect(() => {
    // Performance tracking for event filtering
    const startTime = performance.now();
    
    // Create a new array of events with proper styling
    let filteredEvents = [];
    
    // Add user events
    filteredEvents = [...userEvents];
    
    // Add band events if toggle is on
    if (showBandEvents) {
      // Make sure band events are blue
      const styledBandEvents = bandEvents.map(event => ({
        ...event,
        color: USER_CALENDAR_BAND_EVENT_COLOR
      }));
      
      filteredEvents = [...filteredEvents, ...styledBandEvents];
    }
    
    // Log performance metrics
    const endTime = performance.now();
    console.log(`[PERF][${new Date().toISOString()}] CalendarContext - Filtered ${filteredEvents.length} events (${userEvents.length} user, ${bandEvents.length} band) in ${(endTime - startTime).toFixed(2)}ms`);
    
    setEvents(filteredEvents);
  }, [showBandEvents, userEvents, bandEvents]);

  // Load events for the current user and their artists with parallel data fetching and caching
  const loadEvents = useCallback(async () => {
    if (!currentUser) {
      setUserEvents([]);
      setBandEvents([]);
      setIsLoading(false);
      return;
    }

    try {
      // Start performance tracking
      const startTime = performance.now();
      console.log(`[PERF][${new Date().toISOString()}] CalendarContext - Starting parallel data loading`);
      
      setIsLoading(true);
      setError(null);

      // Type assertion for currentUser to ensure it has the uid property
      const user = currentUser as User;
      
      // Fetch user events and artists data in parallel using Promise.all
      console.log(`[PERF][${new Date().toISOString()}] CalendarContext - Starting parallel fetch for user ${user.uid}`);
      
      // Use Promise.all to fetch both user events and artist data in parallel
      // This is a significant performance improvement over sequential fetching
      const [artists, allEvents] = await Promise.all([
        // Get cached artist data - this will use the cache if available
        getCachedArtistsByUserId(user.uid),
        // Get user events using the artistIds from the cached artists
        // This ensures we have the artist data before fetching events
        getUserEvents(user.uid, currentUserArtists?.map(artist => artist.id) || [])
      ]);
      
      const dataLoadTime = performance.now();
      console.log(`[PERF][${new Date().toISOString()}] CalendarContext - Parallel data loading completed in ${(dataLoadTime - startTime).toFixed(2)}ms`);
      console.log(`[PERF][${new Date().toISOString()}] CalendarContext - Retrieved ${artists.length} artists and ${allEvents.length} events`);
      
      // Process the events with artist information for better display
      // This creates a mapping of artistId to artist name for faster lookups
      const artistMap = new Map(artists.map(artist => [artist.id, artist.name]));
      
      // Enhance band events with artist names if missing
      const enhancedEvents = allEvents.map(event => {
        if (event.sourceType === 'band' && event.artistId && !event.artistName) {
          return {
            ...event,
            artistName: artistMap.get(event.artistId) || 'Unknown Band'
          };
        }
        return event;
      });
      
      // Separate user events and band events
      const userOnlyEvents = enhancedEvents.filter(event => event.sourceType !== 'band');
      const bandOnlyEvents = enhancedEvents.filter(event => event.sourceType === 'band');
      
      // Log event counts
      console.log(`[PERF][${new Date().toISOString()}] CalendarContext - Processing ${enhancedEvents.length} events (${userOnlyEvents.length} user, ${bandOnlyEvents.length} band)`);
      
      // Update state with the fetched and enhanced data
      setUserEvents(userOnlyEvents);
      setBandEvents(bandOnlyEvents);
      
      const endTime = performance.now();
      console.log(`[PERF][${new Date().toISOString()}] CalendarContext - Total load time: ${(endTime - startTime).toFixed(2)}ms`);
    } catch (err) {
      console.error('Error loading events:', err);
      setError(err instanceof Error ? err : new Error('Failed to load events'));
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, currentUserArtists]);

  // Load events when the user or their artists change
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Create a new event
  const createNewEvent = async (event: BndyCalendarEvent): Promise<string> => {
    if (!currentUser) {
      throw new Error('User must be logged in to create events');
    }

    try {
      // Type assertion for currentUser to ensure it has the uid property
      const user = currentUser as User;
      const eventId = await createEvent(event, user.uid);
      await loadEvents(); // Refresh events after creating a new one
      return eventId;
    } catch (err) {
      console.error('Error creating event:', err);
      throw err;
    }
  };

  // Update an existing event
  const updateExistingEvent = async (eventId: string, event: Partial<BndyCalendarEvent>): Promise<void> => {
    try {
      await updateEvent(eventId, event);
      await loadEvents(); // Refresh events after updating
    } catch (err) {
      console.error('Error updating event:', err);
      throw err;
    }
  };

  // Delete an event
  const removeEvent = async (eventId: string): Promise<void> => {
    try {
      await deleteEvent(eventId);
      await loadEvents(); // Refresh events after deleting
    } catch (err) {
      console.error('Error deleting event:', err);
      throw err;
    }
  };

  // Manually refresh events
  const refreshEvents = async (): Promise<void> => {
    await loadEvents();
  };

  // Get events for a specific artist
  const getEventsForArtist = async (artistId: string): Promise<BndyCalendarEvent[]> => {
    try {
      return await getArtistEvents(artistId);
    } catch (err) {
      console.error('Error getting artist events:', err);
      throw err;
    }
  };

  return (
    <CalendarContext.Provider
      value={{
        events,
        isLoading,
        error,
        showBandEvents,
        toggleBandEvents,
        createNewEvent,
        updateExistingEvent,
        removeEvent,
        refreshEvents,
        getEventsForArtist
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
