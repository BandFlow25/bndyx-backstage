'use client';

import React, { useState, useEffect } from 'react';
import '../../../calendar/calendar-dark-mode.css';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from 'bndy-ui';
import { BndyCalendarEvent, EventType, getEventColor, EventCategory } from '@/types/calendar';
import { Loader2, Users } from 'lucide-react';
import { useArtist } from '@/lib/context/artist-context';
import { useCalendar } from '@/lib/context/calendar-context';
import { useTheme } from '@/lib/context/theme-context';
import { ErrorBoundary, ApiErrorBoundary } from 'bndy-ui';
import ArtistModernCalendarWrapper from '@/components/calendar/ArtistModernCalendarWrapper';
import CalendarContainer from '@/components/calendar/CalendarContainer';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import { consolidateMemberEvents } from '@/lib/utils/calendar-helpers';

export default function ArtistCalendarPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, isLoading: authLoading } = useAuth();
  const { currentArtist, artistLoading, setCurrentArtistById } = useArtist();
  const { events, isLoading: calendarLoading, error, createNewEvent, updateExistingEvent, removeEvent, getEventsForArtist } = useCalendar();
  const { isDarkMode } = useTheme();
  
  // UI state
  const [artistEvents, setArtistEvents] = useState<BndyCalendarEvent[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BndyCalendarEvent | null>(null);
  const [newEventStartDate, setNewEventStartDate] = useState<Date | null>(null);
  const [newEventEndDate, setNewEventEndDate] = useState<Date | null>(null);
  const [isLoadingArtistEvents, setIsLoadingArtistEvents] = useState(false);
  const [artistEventsError, setArtistEventsError] = useState<Error | null>(null);
  
  const artistId = params.artistId as string;
  
  // Set the current artist based on the URL parameter
  useEffect(() => {
    if (artistId && (!currentArtist || currentArtist.id !== artistId)) {
      setCurrentArtistById(artistId);
    }
  }, [artistId, currentArtist, setCurrentArtistById]);

  // Function to load events for this specific artist
  const loadArtistEvents = async () => {
    if (!currentArtist || !artistId) return;
    
    try {
      setIsLoadingArtistEvents(true);
      setArtistEventsError(null);
      // Get the original events from the API
      const originalEvents = await getEventsForArtist(artistId);
      
      // Consolidate member unavailable/tentative events to show only one dot per day
      const consolidatedEvents = consolidateMemberEvents(originalEvents);
      
      // Set the consolidated events for the calendar view
      setArtistEvents(consolidatedEvents);
    } catch (err) {
      console.error('Error loading artist events:', err);
      setArtistEventsError(err instanceof Error ? err : new Error('Failed to load artist events'));
    } finally {
      setIsLoadingArtistEvents(false);
    }
  };
  
  // Load events when component mounts or dependencies change
  useEffect(() => {
    loadArtistEvents();
  }, [artistId, currentArtist, getEventsForArtist]);

  // Handle creating a new event (from button click - uses today's date)
  const handleCreateEvent = () => {
    setSelectedEvent(null);
    // Use today's date for button-initiated event creation
    setNewEventStartDate(new Date());
    setNewEventEndDate(new Date());
    setShowEventForm(true);
  };

  // Handle selecting an event
  const handleSelectEvent = (event: BndyCalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  // Handle selecting a time slot (from calendar click - uses clicked date)
  const handleSelectSlot = (slotInfo: any) => {
    setSelectedEvent(null);
    // Use clicked date for calendar-initiated event creation
    const clickedDate = new Date(slotInfo.start);
    setNewEventStartDate(clickedDate);
    setNewEventEndDate(clickedDate);
    setShowEventForm(true);
  };

  // Handle form submission
  const handleEventSubmit = async (event: BndyCalendarEvent) => {
    try {
      // Make sure the event is associated with this artist
      const eventWithArtist = {
        ...event,
        artistId: artistId,
        artistName: currentArtist?.name || ''
      };
      
      if (event.id) {
        // Update existing event
        await updateExistingEvent(event.id, eventWithArtist);
      } else {
        // Create new event
        await createNewEvent(eventWithArtist);
      }
      
      // Refresh artist events
      const updatedEvents = await getEventsForArtist(artistId);
      setArtistEvents(updatedEvents);
      
      setShowEventForm(false);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  // Handle event update
  const handleEventUpdate = async (event: BndyCalendarEvent) => {
    try {
      await updateExistingEvent(event.id, event);
      
      // Refresh artist events
      const updatedEvents = await getEventsForArtist(artistId);
      setArtistEvents(updatedEvents);
      
      setShowEventDetails(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  // Handle event deletion
  const handleEventDelete = async (eventId: string) => {
    try {
      await removeEvent(eventId);
      
      // Refresh artist events
      const updatedEvents = await getEventsForArtist(artistId);
      setArtistEvents(updatedEvents);
      
      setShowEventDetails(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Loading state
  const isPageLoading = authLoading || artistLoading || calendarLoading || isLoadingArtistEvents;
  
  if (isPageLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 size={48} className="animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-300">Loading artist calendar...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!currentUser) {
    router.push('/auth/signin');
    return null;
  }

  if (!currentArtist) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-white p-6 rounded-lg border border-red-200 dark:border-red-700">
            <h2 className="text-xl font-bold mb-2">Error Loading Artist</h2>
            <p className="mb-4">Artist not found or you don't have access to this artist.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-white dark:bg-red-700 text-red-800 dark:text-white rounded-md font-medium hover:bg-red-50 dark:hover:bg-red-600 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ErrorBoundary>
        <div className="container mx-auto px-0 py-3 bg-white dark:bg-slate-900 transition-colors duration-300">
        {/* Back to Artist Dashboard */}
        {/* Calendar Header - Using the same component as user calendar */}
        <CalendarHeader 
          title={`${currentArtist.name}'s Calendar`}
          darkMode={isDarkMode}
          backLink={`/artists/${artistId}/dashboard`}
          backText="Backstage"
        />

        {(error || artistEventsError) && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-lg">
            <p className="font-medium">Error loading calendar events</p>
            <p>{(error || artistEventsError)?.message}</p>
          </div>
        )}

        {/* Calendar Component */}
        <ApiErrorBoundary 
          onRetry={() => loadArtistEvents()}
          fallbackComponent={
            <div className="p-4 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-lg">
              <p className="font-medium">Error loading calendar events</p>
              <p>An error occurred while fetching calendar data</p>
            </div>
          }
        >
          {isLoadingArtistEvents ? (
            <div className="h-[500px] flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <Loader2 size={36} className="animate-spin text-orange-500" />
            </div>
          ) : artistEventsError ? (
            <div className="h-[500px] flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400 mb-2">Error loading events</p>
                <button 
                  onClick={() => loadArtistEvents()}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : artistEvents.length === 0 ? (
            <div className="h-[500px] flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="text-center">
                <Users className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
                <p className="text-[var(--text-secondary)] mb-2">No events yet</p>
                {currentArtist && (
                  <p className="text-[var(--text-secondary)] text-sm">
                    Calendar for {currentArtist.name}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <CalendarContainer
              context="artist"
              events={artistEvents}
              isDarkMode={isDarkMode}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={() => {}} // No action on slot select since we removed Add Event button
              readOnly={true} // Set to read-only since we removed the Add Event functionality
              artistId={artistId as string}
              showDayAgenda={true} // Show the day agenda below the month view
            />
          )}
        </ApiErrorBoundary>


      </div>
      </ErrorBoundary>
    </MainLayout>
  );
}
