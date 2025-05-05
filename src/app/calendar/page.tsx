'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from 'bndy-ui';
import { BndyCalendarEvent, getEventColor, USER_CALENDAR_BAND_EVENT_COLOR } from '@/types/calendar';
import { Loader2 } from 'lucide-react';
import { useArtist } from '@/lib/context/artist-context';
import { useCalendar } from '@/lib/context/calendar-context';
import { useTheme } from '@/lib/context/theme-context';

// Import our components
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarContainer from '@/components/calendar/CalendarContainer';
import ModalWrapper from '@/components/shared/ModalWrapper';
import ReadOnlyEventDetails from '@/components/calendar/ReadOnlyEventDetails';
import { ErrorBoundary, ApiErrorBoundary } from 'bndy-ui';

// Import dark mode styles
import './event-form-dark-mode.css';

export default function UserCalendarPage() {
  const router = useRouter();
  const { currentUser, isLoading: authLoading } = useAuth();
  const { currentUserArtists } = useArtist();
  const { events, isLoading: calendarLoading, error, showBandEvents, toggleBandEvents } = useCalendar();
  const { isDarkMode } = useTheme();
  
  // Simple UI state for read-only event details
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BndyCalendarEvent | null>(null);

  // Handle selecting an event - show read-only details
  const handleSelectEvent = (event: BndyCalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };
  
  // Performance tracking for events loading and rendering
  useEffect(() => {
    if (events && events.length > 0) {
      const bandEvents = events.filter(e => e.sourceType === 'band').length;
      const userEvents = events.length - bandEvents;
      console.log(`[PERF][${new Date().toISOString()}] Calendar page received ${events.length} events (${bandEvents} band, ${userEvents} user)`);
    }
  }, [events]);

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
        <div className="container mx-auto px-0 py-3 bg-white dark:bg-slate-900 transition-colors duration-300">
          {/* Calendar Header */}
          <CalendarHeader 
            title="My Calendar" 
            darkMode={isDarkMode}
          />
          
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
            {/* Render the calendar container */}
            {(() => {
              // Log render time for performance tracking
              console.log(`[PERF][${new Date().toISOString()}] Calendar container rendering with ${events.length} events`);
              // Create a copy of events with proper structure for event dots
              const processedEvents = events.map(event => {
                // Ensure event has proper structure for event dots
                const processedEvent = {
                  ...event,
                  // Ensure these properties exist for event dots
                  id: event.id || `event-${Math.random().toString(36).substr(2, 9)}`,
                  title: event.title || 'Untitled Event',
                  start: event.start instanceof Date ? event.start : new Date(event.start),
                  end: event.end instanceof Date ? event.end : new Date(event.end),
                  allDay: typeof event.allDay === 'boolean' ? event.allDay : false,
                  // Set a default eventType if not present
                  eventType: event.eventType || 'other'
                };
                
                // Add color based on source type and event type
                if (event.sourceType === 'band') {
                  return {
                    ...processedEvent,
                    color: USER_CALENDAR_BAND_EVENT_COLOR // Centralized color for band events in user context
                  };
                } else {
                  // For user events, use the centralized utility to get the color
                  return {
                    ...processedEvent,
                    color: getEventColor(event.eventType, 'user')
                  };
                }
              });
              
              // Debug log for processed events
              console.log('Processed events for calendar:', processedEvents.slice(0, 2));
              
              return (
                <CalendarContainer 
                  events={processedEvents}
                  isDarkMode={isDarkMode}
                  context="user"
                  title=""
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={() => {}} // Empty function - no action on slot select
                  showDayAgenda={true} // Show the day agenda below the month view
                />
              );
            })()} 
          </ApiErrorBoundary>
          
          {/* Read-only Event Details Modal */}
          <ModalWrapper 
            isOpen={showEventDetails && selectedEvent !== null} 
            onClose={() => {
              setShowEventDetails(false);
              setSelectedEvent(null);
            }}
          >
            {selectedEvent && (
              <ReadOnlyEventDetails
                event={selectedEvent}
                onClose={() => {
                  setShowEventDetails(false);
                  setSelectedEvent(null);
                }}
              />
            )}
          </ModalWrapper>
        </div>
      </ErrorBoundary>
    </MainLayout>
  );
}
