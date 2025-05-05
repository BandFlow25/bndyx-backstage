// import React, { useState, useRef, useEffect } from 'react';
// import { BndyCalendarEvent } from '@/types/calendar';
// import { X } from 'lucide-react';
// import EventForm from './EventForm';
// import EventDetails from './EventDetails';

// // Declare global window property for date picker state
// declare global {
//   interface Window {
//     isDatePickerOpen?: boolean;
//   }
// }

// interface EventModalProps {
//   event?: BndyCalendarEvent; // Optional - undefined means creating new event
//   initialMode?: 'view' | 'edit' | 'delete' | 'create';
//   onClose: () => void;
//   onSave: (event: BndyCalendarEvent) => Promise<any>;
//   onDelete?: (eventId: string) => Promise<any>;
//   isArtistContext?: boolean;
//   calendarContext?: 'user' | 'band';
//   newEventStartDate?: Date;
//   isDarkMode?: boolean;
// }

// export default function EventModal({
//   event,
//   initialMode = event ? 'view' : 'create',
//   onClose,
//   onSave,
//   onDelete,
//   isArtistContext = false,
//   calendarContext = 'user',
//   newEventStartDate,
//   isDarkMode = false
// }: EventModalProps) {
//   const [mode, setMode] = useState<'view' | 'edit' | 'delete' | 'create'>(initialMode);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [datePickerOpen, setDatePickerOpen] = useState(false);
//   const modalRef = useRef<HTMLDivElement>(null);
  
//   // Track date picker state globally
//   useEffect(() => {
//     window.isDatePickerOpen = datePickerOpen;
//     console.log('Date picker state changed:', datePickerOpen);
//   }, [datePickerOpen]);
  
//   // Handle date picker open/close events
//   const handleDatePickerOpen = () => {
//     console.log('Date picker opened');
//     setDatePickerOpen(true);
//   };
  
//   const handleDatePickerClose = () => {
//     console.log('Date picker closed');
//     setDatePickerOpen(false);
//   };
  
//   // Handle save (create or edit)
//   const handleSave = async (updatedEvent: BndyCalendarEvent) => {
//     try {
//       setIsSubmitting(true);
//       setError(null);
//       await onSave(updatedEvent);
//       onClose();
//     } catch (err) {
//       console.error('Error saving event:', err);
//       setError('Failed to save event. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
//   // Handle delete
//   const handleDelete = async () => {
//     if (!event?.id || !onDelete) return;
    
//     try {
//       setIsSubmitting(true);
//       setError(null);
//       await onDelete(event.id);
//       onClose();
//     } catch (err) {
//       console.error('Error deleting event:', err);
//       setError('Failed to delete event. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
//   // Handle modal backdrop click
//   const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     // Only close if clicking directly on the backdrop and date picker is not open
//     if (e.target === e.currentTarget && !datePickerOpen) {
//       console.log('Modal backdrop clicked, datePicker open:', datePickerOpen);
//       onClose();
//     } else {
//       console.log('Click inside modal content or date picker open, not closing');
//       e.stopPropagation();
//     }
//   };

//   return (
//     <div 
//       ref={modalRef}
//       className={`bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-auto special-event-form ${isDarkMode ? 'dark-mode' : ''}`}
//       onClick={(e) => e.stopPropagation()} // Prevent clicks from propagating to parent elements
//     >
//       {/* Modal Header */}
//       <div className="bg-slate-50 dark:bg-slate-700 flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-600 special-event-form-header">
//         <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
//           {mode === 'create' ? 'Create Event' : 
//            mode === 'edit' ? 'Edit Event' : 
//            mode === 'delete' ? 'Delete Event' : 
//            event?.title || 'Event Details'}
//         </h2>
//         <button 
//           onClick={(e) => {
//             e.stopPropagation();
//             if (!datePickerOpen) {
//               onClose();
//             } else {
//               console.log('Date picker open, preventing modal close');
//             }
//           }}
//           className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
//           aria-label="Close"
//         >
//           <X className="h-6 w-6" />
//         </button>
//       </div>
      
//       {/* Modal Content */}
//       <div className="p-6">
//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-md">
//             {error}
//           </div>
//         )}
        
//         {(mode === 'create' || mode === 'edit') && (
//           <EventForm
//             event={event || {
//               id: '',
//               title: '',
//               start: newEventStartDate || new Date(),
//               end: newEventStartDate || new Date(),
//               eventType: calendarContext === 'user' ? 'unavailable' : 'other',
//               isPublic: false
//             }}
//             onSubmit={handleSave}
//             onCancel={() => {
//               if (event) {
//                 setMode('view');
//               } else {
//                 onClose();
//               }
//             }}
//             isArtistContext={isArtistContext}
//             calendarContext={calendarContext}
//             newEventStartDate={newEventStartDate}
//             isDarkMode={isDarkMode}
//             datePickerProps={{
//               onOpen: handleDatePickerOpen,
//               onClose: handleDatePickerClose
//             }}
//           />
//         )}
        
//         {mode === 'view' && event && (
//           <EventDetails
//             event={event}
//             onEdit={() => setMode('edit')}
//             onDelete={() => setMode('delete')}
//             isArtistContext={isArtistContext}
//             calendarContext={calendarContext}
//             canEdit={!!onSave}
//             canDelete={!!onDelete}
//           />
//         )}
        
//         {mode === 'delete' && event && (
//           <div>
//             <p className="text-slate-700 dark:text-slate-300 mb-6">
//               Are you sure you want to delete "{event.title}"? This action cannot be undone.
//             </p>
            
//             <div className="flex justify-end space-x-3">
//               <button
//                 type="button"
//                 onClick={() => setMode('view')}
//                 className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleDelete}
//                 className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? 'Deleting...' : 'Delete'}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
