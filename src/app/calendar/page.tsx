'use client';

import React, { useState } from 'react';
import './calendar-dark-mode.css'; // Import custom dark mode styles 
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from 'bndy-ui';
import { BndyCalendarEvent, EventType } from '@/types/calendar';
import { Loader2 } from 'lucide-react';
import { useArtist } from '@/lib/context/artist-context';
import { useCalendar } from '@/lib/context/calendar-context';
import EventForm from '@/components/calendar/EventForm';
import EventDetailsModal from '@/components/calendar/EventDetailsModal';
import { useTheme } from '@/lib/context/theme-context';

// Import our new components
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarContainer from '@/components/calendar/CalendarContainer';
import ModalWrapper from '@/components/shared/ModalWrapper';
import { ErrorBoundary, ApiErrorBoundary } from 'bndy-ui';

export default function UserCalendarPage() {
  const router = useRouter();
  const { currentUser, isLoading: authLoading } = useAuth();
  const { currentUserArtists } = useArtist();
  const { events, isLoading: calendarLoading, error, createNewEvent, updateExistingEvent, removeEvent, showBandEvents, toggleBandEvents } = useCalendar();
  const { isDarkMode } = useTheme();
  
  // This is always user context in this view
  
  // UI state
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BndyCalendarEvent | null>(null);
  const [newEventStartDate, setNewEventStartDate] = useState<Date | null>(null);
  const [newEventEndDate, setNewEventEndDate] = useState<Date | null>(null);

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
      if (event.id) {
        // Update existing event
        await updateExistingEvent(event.id, event);
      } else {
        // Create new event
        await createNewEvent(event);
      }
      setShowEventForm(false);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  // Handle event update
  const handleEventUpdate = async (event: BndyCalendarEvent) => {
    try {
      await updateExistingEvent(event.id, event);
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
      setShowEventDetails(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Loading state
  const isPageLoading = authLoading || calendarLoading;
  
  if (isPageLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 size={48} className="animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-300">Loading calendar...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!currentUser) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <MainLayout>
      <ErrorBoundary>
        <div className="container mx-auto px-4 py-6 bg-white dark:bg-slate-900 transition-colors duration-300">
        {/* Calendar Header */}
        <CalendarHeader 
          title="My Calendar" 
          onCreateEvent={handleCreateEvent} 
          darkMode={isDarkMode}
        />
        
        {/* Band Events Toggle */}
        <div className="mb-4 flex items-center">
          <label htmlFor="showBandEvents" className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                id="showBandEvents" 
                className="sr-only" 
                checked={showBandEvents}
                onChange={toggleBandEvents}
              />
              <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ${showBandEvents ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              <div className={`absolute left-1 top-1 bg-white dark:bg-slate-800 w-6 h-6 rounded-full transition-transform duration-300 ${showBandEvents ? 'transform translate-x-6' : ''}`}></div>
            </div>
            <span className="ml-3 text-slate-700 dark:text-slate-200 text-sm font-medium">
              {showBandEvents ? 'Hide Band Events' : 'Show Band Events'}
            </span>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-lg transition-colors duration-300">
            <p className="font-medium">Error loading calendar events</p>
            <p>{error.message}</p>
          </div>
        )}

        {/* Calendar Container */}
        <ApiErrorBoundary 
          onRetry={() => window.location.reload()}
          fallbackComponent={
            <div className="p-4 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-lg">
              <p className="font-medium">Error loading calendar events</p>
              <p>An error occurred while fetching calendar data</p>
            </div>
          }
        >
          {/* Process events to ensure band events are blue */}
          {(() => {
            // Create a copy of events with band events colored blue
            const processedEvents = events.map(event => {
              if (event.sourceType === 'band') {
                return {
                  ...event,
                  color: '#3b82f6' // blue-500
                };
              }
              return event;
            });
            
            return (
              <CalendarContainer 
                events={processedEvents}
                isDarkMode={isDarkMode}
                context="user"
                title=""
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
              />
            );
          })()} 
        </ApiErrorBoundary>
        
        {/* Event Form Modal */}
        <ModalWrapper 
          isOpen={showEventForm} 
          onClose={() => {
            setShowEventForm(false);
            setNewEventStartDate(null);
            setNewEventEndDate(null);
          }}
        >
          <div className={`${isDarkMode ? 'dark' : ''}`}>
            <EventForm
              event={selectedEvent || {
                id: '',
                title: '',
                start: newEventStartDate || new Date(),
                end: newEventEndDate || new Date(),
                eventType: 'unavailable' as EventType,
                isPublic: false
              }}
              calendarContext="user"
              newEventStartDate={newEventStartDate || undefined}
              onSubmit={handleEventSubmit}
              onCancel={() => {
                setShowEventForm(false);
                setNewEventStartDate(null);
                setNewEventEndDate(null);
              }}
              isDarkMode={isDarkMode}
            />
          </div>
        </ModalWrapper>
        
        {/* Event Details Modal */}
        <ModalWrapper 
          isOpen={showEventDetails && selectedEvent !== null} 
          onClose={() => {
            setShowEventDetails(false);
            setSelectedEvent(null);
          }}
        >
          {selectedEvent && (
            <EventDetailsModal
              event={selectedEvent}
              onClose={() => {
                setShowEventDetails(false);
                setSelectedEvent(null);
              }}
              onEdit={selectedEvent.sourceType !== 'band' ? handleEventUpdate : undefined}
              onDelete={selectedEvent.sourceType !== 'band' ? handleEventDelete : undefined}
              calendarContext="user"
            />
          )}
        </ModalWrapper>
      </div>
      </ErrorBoundary>
    </MainLayout>
  );
}
