'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from 'bndy-ui/components/auth';
import { useArtist } from './artist-context';
import { BndyCalendarEvent, EventType } from '@/types/calendar';
import { 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  getUserEvents, 
  getArtistEvents 
} from '@/lib/firebase/events';

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
    // If showing band events, include all events
    // Otherwise, filter out events with sourceType === 'band'
    console.log('Toggle state changed:', { showBandEvents, userEventsCount: userEvents.length, bandEventsCount: bandEvents.length });
    
    // Create a new array of events with proper styling
    let filteredEvents = [];
    
    // Add user events
    filteredEvents = [...userEvents];
    
    // Add band events if toggle is on
    if (showBandEvents) {
      // Make sure band events are blue
      const styledBandEvents = bandEvents.map(event => ({
        ...event,
        color: '#3b82f6' // blue-500
      }));
      
      filteredEvents = [...filteredEvents, ...styledBandEvents];
    }
    
    console.log('Filtered events:', filteredEvents.length);
    setEvents(filteredEvents);
  }, [showBandEvents, userEvents, bandEvents]);

  // Load events for the current user and their artists
  const loadEvents = useCallback(async () => {
    if (!currentUser) {
      setUserEvents([]);
      setBandEvents([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get artist IDs that the user is a member of
      const artistIds = currentUserArtists?.map(artist => artist.id) || [];
      
      // Load events for the user and their artists
      const allEvents = await getUserEvents(currentUser.uid, artistIds);
      
      // Separate user events and band events
      const userOnlyEvents = allEvents.filter(event => event.sourceType !== 'band');
      const bandOnlyEvents = allEvents.filter(event => event.sourceType === 'band');
      
      setUserEvents(userOnlyEvents);
      setBandEvents(bandOnlyEvents);
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
      const eventId = await createEvent(event, currentUser.uid);
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
