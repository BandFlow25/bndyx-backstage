// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useArtist } from '@/lib/context/artist-context';
// import { useTheme } from '@/lib/context/theme-context';
// import { BndyCalendarEvent, EventType } from '@/types/calendar';
// import { X } from 'lucide-react';

// // Import sub-components
// import { DateTimeSection } from './DateTimeSection';
// import { EventTypeSection } from './EventTypeSection';
// import { EventDetailsSection } from './EventDetailsSection';

// interface EventFormProps {
//   event?: Partial<BndyCalendarEvent>;
//   onSubmit: (event: BndyCalendarEvent) => Promise<void>;
//   onCancel: () => void;
//   isArtistContext?: boolean;
//   artistId?: string;
//   calendarContext?: 'user' | 'band';
//   newEventStartDate?: Date;
//   isDarkMode?: boolean; // Optional prop to override theme context
//   datePickerProps?: {
//     onOpen?: () => void;
//     onClose?: () => void;
//   };
// }

// export default function EventForm({ 
//   event, 
//   onSubmit, 
//   onCancel,
//   isArtistContext = false,
//   artistId,
//   calendarContext = 'band',
//   newEventStartDate,
//   isDarkMode: propIsDarkMode,
//   datePickerProps
// }: EventFormProps) {
//   const { isDarkMode: contextIsDarkMode } = useTheme();
  
//   // Use the prop value if provided, otherwise use the theme context
//   const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : contextIsDarkMode;
//   const { currentUserArtists, currentArtist } = useArtist();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formError, setFormError] = useState<string | null>(null);
  
//   // Get today's date as YYYY-MM-DD for min date validation
//   const today = new Date().toISOString().slice(0, 10);
  
//   // Form state - use newEventStartDate if provided (from calendar click)
//   const [title, setTitle] = useState(event?.title || '');
  
//   // Debug log for incoming date
//   console.log('EventForm - newEventStartDate:', newEventStartDate);
//   console.log('EventForm - event:', event);
//   console.log('EventForm - today:', today);
  
//   // Initialize event date with proper timezone handling
//   const [eventDate, setEventDate] = useState(() => {
//     if (event?.start && event.start instanceof Date && !isNaN(event.start.getTime())) {
//       // For existing events, use the stored date
//       const date = event.start;
//       const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
//       console.log('EventForm - Using event.start date:', formattedDate, 'from', date);
//       return formattedDate;
//     } else if (newEventStartDate && newEventStartDate instanceof Date && !isNaN(newEventStartDate.getTime())) {
//       // For new events from calendar click, preserve the exact date that was clicked
//       const formattedDate = `${newEventStartDate.getFullYear()}-${String(newEventStartDate.getMonth() + 1).padStart(2, '0')}-${String(newEventStartDate.getDate()).padStart(2, '0')}`;
//       console.log('EventForm - Using newEventStartDate:', formattedDate, 'from', newEventStartDate);
//       return formattedDate;
//     } else {
//       // Default to today
//       console.log('EventForm - Using today:', today);
//       return today;
//     }
//   });
//   const [startTime, setStartTime] = useState(
//     event?.start ? roundToNearestQuarterHour(new Date(event.start)) : '18:00'
//   );
//   const [endTime, setEndTime] = useState(
//     event?.end ? roundToNearestQuarterHour(new Date(event.end)) : '21:00'
//   );
//   // Default to single-day events for new events
//   const [showEndDate, setShowEndDate] = useState(event?.id ? (event?.start?.toDateString() !== event?.end?.toDateString()) : false);
//   // Initialize end date with proper timezone handling
//   const [endDate, setEndDate] = useState(() => {
//     if (event?.end && event.end instanceof Date && !isNaN(event.end.getTime())) {
//       // For existing events, use the stored end date
//       const date = event.end;
//       const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
//       console.log('EventForm - Using event.end date:', formattedDate, 'from', date);
//       return formattedDate;
//     } else if (newEventStartDate && newEventStartDate instanceof Date && !isNaN(newEventStartDate.getTime())) {
//       // For new events, use the same date as the start date
//       const formattedDate = `${newEventStartDate.getFullYear()}-${String(newEventStartDate.getMonth() + 1).padStart(2, '0')}-${String(newEventStartDate.getDate()).padStart(2, '0')}`;
//       console.log('EventForm - Using newEventStartDate for end date:', formattedDate);
//       return formattedDate;
//     } else {
//       // Default to same as start date
//       console.log('EventForm - Using eventDate for end date:', eventDate);
//       return eventDate;
//     }
//   });
//   const [showTimeSelection, setShowTimeSelection] = useState(false);
  
//   // Helper function to round time to nearest 15 minutes
//   function roundToNearestQuarterHour(date: Date): string {
//     const minutes = date.getMinutes();
//     const roundedMinutes = Math.round(minutes / 15) * 15;
//     const hours = date.getHours();
//     const adjustedHours = roundedMinutes === 60 ? hours + 1 : hours;
//     const adjustedMinutes = roundedMinutes === 60 ? 0 : roundedMinutes;
//     return `${String(adjustedHours).padStart(2, '0')}:${String(adjustedMinutes).padStart(2, '0')}`;
//   }
  
//   // Update end date when event date changes (if not showing end date)
//   useEffect(() => {
//     if (!showEndDate) {
//       setEndDate(eventDate);
//     }
//   }, [eventDate, showEndDate]);
//   // Always default to all-day events for new events
//   const [isAllDay, setIsAllDay] = useState(event?.id ? event?.allDay || false : true);
//   // Make sure we preserve the event type from the form selection
//   const [eventType, setEventType] = useState<EventType>(
//     // If editing an existing event, use its type
//     event?.eventType || 
//     // Otherwise use appropriate default based on context
//     (calendarContext === 'user' ? 'unavailable' : 'practice')
//   );
//   const [isPublic, setIsPublic] = useState(event?.isPublic || false);
//   const [venueId, setVenueId] = useState(event?.venueId || '');
//   const [description, setDescription] = useState(event?.description || '');

//   // Artist ID is determined by context, no selection needed

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setFormError(null);
    
//     // Validate form
//     if (!title.trim()) {
//       setFormError('Title is required');
//       return;
//     }
    
//     if (eventType === 'gig' && !venueId) {
//       setFormError('Venue is required for gigs');
//       return;
//     }
    
//     // Create start and end dates with proper timezone handling
//     const startDateParts = eventDate.split('-').map(Number);
//     const endDateParts = endDate.split('-').map(Number);
    
//     // Create dates using local date components to avoid timezone issues
//     let start, end;
    
//     if (isAllDay || !showTimeSelection) {
//       // For all-day events, set time to midnight in local timezone
//       start = new Date(startDateParts[0], startDateParts[1] - 1, startDateParts[2], 0, 0, 0);
      
//       if (showEndDate) {
//         end = new Date(endDateParts[0], endDateParts[1] - 1, endDateParts[2], 23, 59, 0);
//       } else {
//         end = new Date(startDateParts[0], startDateParts[1] - 1, startDateParts[2], 23, 59, 0);
//       }
//     } else {
//       // For time-specific events, parse the time strings
//       const [startHours, startMinutes] = startTime.split(':').map(Number);
//       const [endHours, endMinutes] = endTime.split(':').map(Number);
      
//       start = new Date(startDateParts[0], startDateParts[1] - 1, startDateParts[2], startHours, startMinutes, 0);
      
//       if (showEndDate) {
//         end = new Date(endDateParts[0], endDateParts[1] - 1, endDateParts[2], endHours, endMinutes, 0);
//       } else {
//         end = new Date(startDateParts[0], startDateParts[1] - 1, startDateParts[2], endHours, endMinutes, 0);
//       }
//     }
    
//     // Validate dates
//     if (end < start) {
//       setFormError('End date/time must be after start date/time');
//       return;
//     }
    
//     // Validate that dates are not in the past
//     const now = new Date();
//     if (start < now && !event?.id) { // Only check for new events
//       setFormError('Start date/time cannot be in the past');
//       return;
//     }
    
//     try {
//       setIsSubmitting(true);
      
//       // Create event object
//       const newEvent: BndyCalendarEvent = {
//         id: event?.id || '',
//         title,
//         start,
//         end,
//         allDay: isAllDay,
//         // Ensure we're using the selected event type
//         eventType: eventType,
//         isPublic: calendarContext === 'band' ? isPublic : false, // Only band events can be public
//         description,
//         // Only include artistId for band/artist context
//         artistId: isArtistContext ? artistId : undefined,
//         venueId: venueId || undefined,
//         // Use the artist name from the context if in artist context
//         artistName: isArtistContext && artistId && currentArtist
//           ? currentArtist.name
//           : undefined
//       };
      
//       await onSubmit(newEvent);
//     } catch (error) {
//       console.error('Error submitting event:', error);
//       setFormError('Failed to save event. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div 
//       className={`bg-white text-slate-900 rounded-lg shadow-lg max-w-2xl w-full mx-auto border border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 transition-colors duration-300 special-event-form ${isDarkMode ? 'dark-mode' : ''}`}
//       onClick={(e) => {
//         console.log('%c [EVENT FORM] Container onClick', 'background: #8800ff; color: white;', {
//           target: e.target,
//           currentTarget: e.currentTarget,
//           targetTagName: (e.target as HTMLElement).tagName,
//           targetClassList: (e.target as HTMLElement).classList
//         });
//       }}
//     >
//       <div className="bg-slate-50 dark:bg-slate-700 flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-600 transition-colors duration-300 relative special-event-form-header">
//         <h2 className="text-xl font-semibold transition-colors duration-300">
//           {event?.id ? 'Edit Event' : 'Create New Event'}
//         </h2>
//         <button
//           type="button"
//           onClick={onCancel}
//           className="text-slate-500 dark:text-white hover:opacity-80 transition-colors duration-300"
//           aria-label="Close"
//         >  
//           <X size={20} />
//         </button>
//       </div>
      
//       <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="p-4 bg-white dark:bg-slate-800 dark:text-slate-100 transition-colors duration-300 special-event-form-content" noValidate>
//         {formError && (
//           <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-md">
//             {formError}
//           </div>
//         )}
        
//         {/* Date & Time Section */}
//         <DateTimeSection
//           eventDate={eventDate}
//           setEventDate={setEventDate}
//           endDate={endDate}
//           setEndDate={setEndDate}
//           showEndDate={showEndDate}
//           setShowEndDate={setShowEndDate}
//           isAllDay={isAllDay}
//           setIsAllDay={setIsAllDay}
//           showTimeSelection={showTimeSelection}
//           setShowTimeSelection={setShowTimeSelection}
//           startTime={startTime}
//           setStartTime={setStartTime}
//           endTime={endTime}
//           setEndTime={setEndTime}
//           isDarkMode={isDarkMode}
//           calendarContext={calendarContext}
//           newEventStartDate={newEventStartDate}
//           event={event}
//           today={today}
//           onDatePickerOpen={datePickerProps?.onOpen}
//           onDatePickerClose={datePickerProps?.onClose}
//         />
        
//         {/* Event Details Section */}
//         <EventDetailsSection
//           title={title}
//           setTitle={setTitle}
//           description={description}
//           setDescription={setDescription}
//           isDarkMode={isDarkMode}
//         />
        
//         {/* Event Type Section */}
//         <EventTypeSection
//           eventType={eventType}
//           setEventType={setEventType}
//           isPublic={isPublic}
//           setIsPublic={setIsPublic}
//           calendarContext={calendarContext}
//           isDarkMode={isDarkMode}
//           isEditMode={!!event?.id}
//         />
        
//         {/* Artist context is automatically determined based on where the calendar is accessed from */}
        
//         {/* Form Actions */}
//         <div className="flex justify-between mt-6 space-x-4">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-4 py-2 bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors cancel-button"
//             disabled={isSubmitting}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-300 disabled:opacity-50 submit-button"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? 'Saving...' : event?.id ? 'Update Event' : 'Create Event'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
