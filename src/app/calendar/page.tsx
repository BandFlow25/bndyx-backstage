'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from 'bndy-ui/components/auth';
import { BndyCalendarEvent, EventType } from '@/types/calendar';
import { PlusCircle, Loader2, Calendar, Users } from 'lucide-react';
import { useArtist } from '@/lib/context/artist-context';
import { useCalendar } from '@/lib/context/calendar-context';
import EventForm from '@/components/calendar/EventForm';
import EventDetailsModal from '@/components/calendar/EventDetailsModal';
// Import the BndyCalendar component from bndy-ui
import { BndyCalendar } from 'bndy-ui';
import { useTheme } from '@/lib/context/theme-context';

export default function UserCalendarPage() {
  const router = useRouter();
  const { currentUser, isLoading: authLoading } = useAuth();
  const { currentUserArtists } = useArtist();
  const { events, isLoading: calendarLoading, error, createNewEvent, updateExistingEvent, removeEvent } = useCalendar();
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
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Calendar</h1>
          <button
            onClick={handleCreateEvent}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            <PlusCircle size={18} className="mr-2" />
            Add Event
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-lg">
            <p className="font-medium">Error loading calendar events</p>
            <p>{error.message}</p>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-slate-900 dark:text-white">My Personal Calendar</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Manage your personal availability and see your band events
              </p>
            </div>
            
            {/* User Context Legend */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#4caf50] mr-2"></div>
                <span className="text-sm text-[var(--text-secondary)]">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#f44336] mr-2"></div>
                <span className="text-sm text-[var(--text-secondary)]">Unavailable</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#ffc107] mr-2"></div>
                <span className="text-sm text-[var(--text-secondary)]">Tentative</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#9e9e9e] mr-2"></div>
                <span className="text-sm text-[var(--text-secondary)]">Other (Private)</span>
              </div>
            </div>
            
            {/* Calendar Component */}
            <div className="rounded-lg overflow-hidden">
              <BndyCalendar
                events={events}
                isDarkMode={isDarkMode}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
              />
            </div>
          </div>
        </div>
        {/* Event Form Modal */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className={`w-full max-w-2xl ${isDarkMode ? 'dark' : ''}`}>
              <EventForm
                event={selectedEvent || {
                  id: '',
                  title: '',
                  start: newEventStartDate || new Date(),
                  end: newEventEndDate || new Date(),
                  eventType: 'available' as EventType,
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
          </div>
        )}
        {/* Event Details Modal */}
        {showEventDetails && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="w-full max-w-2xl">
              <EventDetailsModal
                event={selectedEvent}
                onClose={() => {
                  setShowEventDetails(false);
                  setSelectedEvent(null);
                }}
                onEdit={handleEventUpdate}
                onDelete={handleEventDelete}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
