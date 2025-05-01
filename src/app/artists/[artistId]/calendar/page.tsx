'use client';

import React, { useState, useEffect } from 'react';
import '../../../calendar/calendar-dark-mode.css';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from 'bndy-ui';
import { BndyCalendarEvent, EventType } from '@/types/calendar';
import { PlusCircle, ArrowLeft, Loader2, Users } from 'lucide-react';
import { useArtist } from '@/lib/context/artist-context';
import { useCalendar } from '@/lib/context/calendar-context';
import { useTheme } from '@/lib/context/theme-context';
import EventForm from '@/components/calendar/EventForm';
import EventDetailsModal from '@/components/calendar/EventDetailsModal';
import Link from 'next/link';
import { ErrorBoundary, ApiErrorBoundary } from 'bndy-ui';
import ArtistCalendarWrapper from '@/components/calendar/ArtistCalendarWrapper';

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
      const events = await getEventsForArtist(artistId);
      setArtistEvents(events);
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
        <div className="container mx-auto px-4 py-6">
        {/* Back to Artist Dashboard */}
        <div className="mb-4">
          <Link 
            href={`/artists/${artistId}/dashboard`} 
            className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span>Back to {currentArtist.name} Backstage</span>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{currentArtist.name}'s Calendar</h1>
          <button
            onClick={handleCreateEvent}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            <PlusCircle size={18} className="mr-2" />
            Add Event
          </button>
        </div>

        {(error || artistEventsError) && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-lg">
            <p className="font-medium">Error loading calendar events</p>
            <p>{(error || artistEventsError)?.message}</p>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="mb-6">
       
            
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#e91e63] mr-2"></div>
                <span className="text-sm text-[var(--text-secondary)]">Gigs</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#ff9800] mr-2"></div>
                <span className="text-sm text-[var(--text-secondary)]">Practice</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#9c27b0] mr-2"></div>
                <span className="text-sm text-[var(--text-secondary)]">Recording</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#2196f3] mr-2"></div>
                <span className="text-sm text-[var(--text-secondary)]">Meetings</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#9e9e9e] mr-2"></div>
                <span className="text-sm text-[var(--text-secondary)]">Other</span>
              </div>
            </div>
            
            {/* Member unavailability is shown directly on the calendar with member names */}
          </div>

          {/* Calendar Component */}
          <ApiErrorBoundary onRetry={() => loadArtistEvents()}>
            <div className="rounded-lg overflow-hidden">
              {isLoadingArtistEvents ? (
                <div className="h-[500px] flex items-center justify-center bg-slate-50 dark:bg-slate-700/50">
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
                        Click "Add Event" to create your first event for {currentArtist.name}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-[600px]">
                  <ArtistCalendarWrapper
                    events={artistEvents}
                    isDarkMode={isDarkMode}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    readOnly={false}
                  />
                </div>
              )}
            </div>
          </ApiErrorBoundary>

        </div>

        {/* Event Form Modal */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-2xl ${isDarkMode ? 'dark' : ''}`}>
              <EventForm
                event={selectedEvent || {
                  id: '',
                  title: '',
                  start: newEventStartDate || new Date(),
                  end: newEventEndDate || new Date(),
                  eventType: 'practice' as EventType,
                  isPublic: true
                }}
                onSubmit={handleEventSubmit}
                onCancel={() => {
                  setShowEventForm(false);
                  setNewEventStartDate(null);
                  setNewEventEndDate(null);
                }}
                isArtistContext={true}
                artistId={artistId}
                calendarContext="band"
                newEventStartDate={newEventStartDate || undefined}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        )}

        {/* Event Details Modal */}
        {showEventDetails && selectedEvent && (
          <EventDetailsModal
            event={selectedEvent}
            onClose={() => {
              setShowEventDetails(false);
              setSelectedEvent(null);
            }}
            onEdit={selectedEvent.sourceType !== 'member' ? handleEventUpdate : undefined}
            onDelete={selectedEvent.sourceType !== 'member' ? handleEventDelete : undefined}
            isArtistContext={true}
            calendarContext="band"
          />
        )}
      </div>
      </ErrorBoundary>
    </MainLayout>
  );
}
