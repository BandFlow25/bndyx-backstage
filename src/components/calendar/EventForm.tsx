'use client';

import React, { useState, useEffect } from 'react';
import { useArtist } from '@/lib/context/artist-context';
import { useTheme } from '@/lib/context/theme-context';
import { BndyCalendarEvent, EventType } from '@/types/calendar';
import { X } from 'lucide-react';

// Import sub-components
import { DateTimeSection } from './DateTimeSection';
import { EventTypeSection } from './EventTypeSection';
import { EventDetailsSection } from './EventDetailsSection';

interface EventFormProps {
  event?: Partial<BndyCalendarEvent>;
  onSubmit: (event: BndyCalendarEvent) => Promise<void>;
  onCancel: () => void;
  isArtistContext?: boolean;
  artistId?: string;
  calendarContext?: 'user' | 'band';
  newEventStartDate?: Date;
  isDarkMode?: boolean; // Optional prop to override theme context
}

export default function EventForm({ 
  event, 
  onSubmit, 
  onCancel,
  isArtistContext = false,
  artistId,
  calendarContext = 'band',
  newEventStartDate,
  isDarkMode: propIsDarkMode
}: EventFormProps) {
  const { isDarkMode: contextIsDarkMode } = useTheme();
  
  // Use the prop value if provided, otherwise use the theme context
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : contextIsDarkMode;
  const { currentUserArtists, currentArtist } = useArtist();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Get today's date as YYYY-MM-DD for min date validation
  const today = new Date().toISOString().slice(0, 10);
  
  // Form state - use newEventStartDate if provided (from calendar click)
  const [title, setTitle] = useState(event?.title || '');
  const [eventDate, setEventDate] = useState(
    event?.start ? new Date(event.start).toISOString().slice(0, 10) : 
    newEventStartDate ? newEventStartDate.toISOString().slice(0, 10) : today
  );
  const [startTime, setStartTime] = useState(
    event?.start ? roundToNearestQuarterHour(new Date(event.start)) : '18:00'
  );
  const [endTime, setEndTime] = useState(
    event?.end ? roundToNearestQuarterHour(new Date(event.end)) : '21:00'
  );
  // Default to single-day events for new events
  const [showEndDate, setShowEndDate] = useState(event?.id ? (event?.start?.toDateString() !== event?.end?.toDateString()) : false);
  const [endDate, setEndDate] = useState(
    event?.end ? new Date(event.end).toISOString().slice(0, 10) : eventDate
  );
  const [showTimeSelection, setShowTimeSelection] = useState(
    calendarContext === 'band' || (event && !event.allDay) || false
  );
  
  // Helper function to round time to nearest 15 minutes
  function roundToNearestQuarterHour(date: Date): string {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.round(minutes / 15) * 15;
    const hours = date.getHours();
    const adjustedHours = roundedMinutes === 60 ? hours + 1 : hours;
    const adjustedMinutes = roundedMinutes === 60 ? 0 : roundedMinutes;
    return `${String(adjustedHours).padStart(2, '0')}:${String(adjustedMinutes).padStart(2, '0')}`;
  }
  
  // Update end date when event date changes (if not showing end date)
  useEffect(() => {
    if (!showEndDate) {
      setEndDate(eventDate);
    }
  }, [eventDate, showEndDate]);
  // Always default to all-day events for new events
  const [isAllDay, setIsAllDay] = useState(event?.id ? event?.allDay || false : true);
  const [eventType, setEventType] = useState<EventType>(event?.eventType || (calendarContext === 'user' ? 'unavailable' : 'practice'));
  const [isPublic, setIsPublic] = useState(event?.isPublic || false);
  const [venueId, setVenueId] = useState(event?.venueId || '');
  const [description, setDescription] = useState(event?.description || '');

  // Artist ID is determined by context, no selection needed

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Validate form
    if (!title.trim()) {
      setFormError('Title is required');
      return;
    }
    
    if (eventType === 'gig' && !venueId) {
      setFormError('Venue is required for gigs');
      return;
    }
    
    // Create start and end dates
    const start = new Date(`${eventDate}T${isAllDay || !showTimeSelection ? '00:00' : startTime}`);
    let end;
    
    if (showEndDate) {
      end = new Date(`${endDate}T${isAllDay || !showTimeSelection ? '23:59' : endTime}`);
    } else {
      // If no end date is specified, use the same date with end time or 23:59
      end = new Date(`${eventDate}T${isAllDay || !showTimeSelection ? '23:59' : endTime}`);
    }
    
    // Validate dates
    if (end < start) {
      setFormError('End date/time must be after start date/time');
      return;
    }
    
    // Validate that dates are not in the past
    const now = new Date();
    if (start < now && !event?.id) { // Only check for new events
      setFormError('Start date/time cannot be in the past');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create event object
      const newEvent: BndyCalendarEvent = {
        id: event?.id || '',
        title,
        start,
        end,
        allDay: isAllDay,
        eventType,
        isPublic: calendarContext === 'band' ? isPublic : false, // Only band events can be public
        description,
        // Only include artistId for band/artist context
        artistId: isArtistContext ? artistId : undefined,
        venueId: venueId || undefined,
        // Use the artist name from the context if in artist context
        artistName: isArtistContext && artistId && currentArtist
          ? currentArtist.name
          : undefined
      };
      
      await onSubmit(newEvent);
    } catch (error) {
      console.error('Error submitting event:', error);
      setFormError('Failed to save event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white text-slate-900 rounded-lg shadow-lg max-w-2xl w-full mx-auto border border-slate-200 dark:bg-slate-800 dark:text-white dark:border-slate-600 transition-colors duration-300 special-event-form">
      <div className="bg-slate-50 dark:bg-slate-700 flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-600 transition-colors duration-300 relative special-event-form-header">
        <h2 className="text-xl font-semibold transition-colors duration-300">
          {event?.id ? 'Edit Event' : 'Create New Event'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-500 dark:text-white hover:opacity-80 transition-colors duration-300"
          aria-label="Close"
        >  
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-slate-800 transition-colors duration-300 special-event-form-content">
        {formError && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-md">
            {formError}
          </div>
        )}
        
        {/* Date & Time Section */}
        <DateTimeSection
          eventDate={eventDate}
          setEventDate={setEventDate}
          endDate={endDate}
          setEndDate={setEndDate}
          showEndDate={showEndDate}
          setShowEndDate={setShowEndDate}
          isAllDay={isAllDay}
          setIsAllDay={setIsAllDay}
          showTimeSelection={showTimeSelection}
          setShowTimeSelection={setShowTimeSelection}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          isDarkMode={isDarkMode}
          calendarContext={calendarContext}
          newEventStartDate={newEventStartDate}
          event={event}
          today={today}
        />
        
        {/* Event Details Section */}
        <EventDetailsSection
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          isDarkMode={isDarkMode}
        />
        
        {/* Event Type Section */}
        <EventTypeSection
          eventType={eventType}
          setEventType={setEventType}
          isPublic={isPublic}
          setIsPublic={setIsPublic}
          calendarContext={calendarContext}
          isDarkMode={isDarkMode}
          isEditMode={!!event?.id}
        />
        
        {/* Artist context is automatically determined based on where the calendar is accessed from */}
        
        {/* Form Actions */}
        <div className="flex justify-between mt-6 space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-white rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-300 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : event?.id ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
