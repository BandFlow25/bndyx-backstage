// 'use client';

// import React, { useState } from 'react';
// import { BndyCalendarEvent } from '@/types/calendar';
// import { X, Edit, Trash, Calendar, Clock, MapPin, User, Eye, EyeOff } from 'lucide-react';
// import EventForm from './EventForm';

// interface EventDetailsModalProps {
//   event: BndyCalendarEvent;
//   onClose: () => void;
//   onEdit?: (event: BndyCalendarEvent) => Promise<void>;
//   onDelete?: (eventId: string) => Promise<void>;
//   isArtistContext?: boolean;
//   calendarContext?: 'user' | 'band';
// }

// export default function EventDetailsModal({
//   event,
//   onClose,
//   onEdit,
//   onDelete,
//   isArtistContext = false,
//   calendarContext = 'band'
// }: EventDetailsModalProps) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Format dates for display
//   const formatDate = (date: Date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const formatTime = (date: Date) => {
//     return new Date(date).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Handle edit submit
//   const handleEditSubmit = async (updatedEvent: BndyCalendarEvent) => {
//     try {
//       setIsSubmitting(true);
//       setError(null);
//       if (onEdit) {
//         await onEdit(updatedEvent);
//       }
//       setIsEditing(false);
//     } catch (err) {
//       console.error('Error updating event:', err);
//       setError('Failed to update event. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle delete
//   const handleDelete = async () => {
//     try {
//       setIsSubmitting(true);
//       setError(null);
//       if (onDelete) {
//         await onDelete(event.id);
//       }
//       onClose();
//     } catch (err) {
//       console.error('Error deleting event:', err);
//       setError('Failed to delete event. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Get background color based on event type and context
//   const getEventColor = () => {
//     // Force band events to be blue in the user context
//     if (event.sourceType === 'band') {
//       return 'bg-blue-500'; // Brand color for band events in user context
//     }
    
//     // Otherwise use the color based on event type
//     switch (event.eventType) {
//       // Band context colors - using brand colors
//       case 'gig':
//         return 'bg-orange-500'; // Brand color for gigs
//       case 'practice':
//         return 'bg-orange-500'; // Brand color for practice
//       case 'meeting':
//         return 'bg-orange-500'; // Brand color for meetings
//       case 'recording':
//         return 'bg-orange-500'; // Brand color for recording
      
//       // User context colors
//       case 'unavailable':
//         return 'bg-red-500';
//       case 'tentative':
//         return 'bg-amber-500';
//       default:
//         return 'bg-orange-500'; // Default to brand color
//     }
//   };

//   // Function to handle click on the edit modal backdrop
//   // This function will ONLY be called when the user clicks directly on the backdrop
//   // and not on any of its children due to how we've structured the event handlers
//   const handleEditBackdropClick = (e: React.MouseEvent) => {
//     // Only proceed if the click was directly on the backdrop (e.target === e.currentTarget)
//     // This ensures we're only closing when clicking on the empty space around the modal
//     if (e.target === e.currentTarget) {
//       console.log('Closing modal - direct backdrop click');
//       setIsEditing(false);
//     }
//   };
  
//   // If in editing mode, show the event form
//   if (isEditing) {
//     console.log('%c [EDIT MODE] Rendering edit mode for event:', 'background: #ff00ff; color: white; font-weight: bold;', event.id, event.title);
    
//     return (
//       <div 
//         className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//         onClick={(e) => {
//           console.log('%c [EDIT MODE] Backdrop onClick', 'background: #ff0000; color: white;', {
//             target: e.target,
//             currentTarget: e.currentTarget,
//             targetIsCurrentTarget: e.target === e.currentTarget,
//             targetTagName: (e.target as HTMLElement).tagName,
//             targetClassList: (e.target as HTMLElement).classList,
//             eventPhase: e.eventPhase
//           });
//           handleEditBackdropClick(e);
//         }}
//         onMouseDown={(e) => {
//           console.log('%c [EDIT MODE] Backdrop onMouseDown', 'background: #0000ff; color: white;', {
//             target: e.target,
//             currentTarget: e.currentTarget,
//             targetTagName: (e.target as HTMLElement).tagName,
//             targetClassList: (e.target as HTMLElement).classList
//           });
//           // Prevent event from reaching document level handlers
//           const target = e.target as HTMLElement;
//           if (target.closest('[data-radix-popper-content-wrapper]') !== null) {
//             console.log('%c [EDIT MODE] Preventing propagation for popper content', 'background: #00ff00; color: black;');
//             e.stopPropagation();
//           }
//         }}
//       >
//         <div 
//           className="w-full max-w-2xl"
//           onClick={(e) => {
//             console.log('Edit modal content onClick');
//             e.stopPropagation();
//           }}
//           onMouseDown={(e) => {
//             console.log('Edit modal content onMouseDown');
//             e.stopPropagation();
//           }}
//           onPointerDown={(e) => {
//             console.log('Edit modal content onPointerDown');
//             e.stopPropagation();
//           }}
//           onMouseUp={(e) => {
//             console.log('Edit modal content onMouseUp');
//             e.stopPropagation();
//           }}
//           onTouchStart={(e) => {
//             console.log('Edit modal content onTouchStart');
//             e.stopPropagation();
//           }}
//           onTouchEnd={(e) => {
//             console.log('Edit modal content onTouchEnd');
//             e.stopPropagation();
//           }}
//           onTouchMove={(e) => {
//             console.log('Edit modal content onTouchMove');
//             e.stopPropagation();
//           }}
//         >
//           <EventForm
//             event={event}
//             onSubmit={handleEditSubmit}
//             onCancel={() => setIsEditing(false)}
//             isArtistContext={isArtistContext}
//             artistId={event.artistId}
//             calendarContext={calendarContext}
//           />
//         </div>
//       </div>
//     );
//   }

//   // Function to handle click on the delete modal backdrop
//   const handleDeleteBackdropClick = (e: React.MouseEvent) => {
//     console.log('Delete modal backdrop onClick', e.target, e.currentTarget);
    
//     // Only close if clicking directly on the backdrop div itself, not any of its children
//     if (e.target === e.currentTarget) {
//       console.log('Closing delete modal due to backdrop click');
//       setIsDeleting(false);
//     } else {
//       // If clicking on any child element, prevent propagation
//       console.log('Preventing modal close - clicked on child element');
//       e.stopPropagation();
//     }
//   };
  
//   // If in delete confirmation mode
//   if (isDeleting) {
//     return (
//       <div 
//         className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
//         onClick={handleDeleteBackdropClick}
//       >
//         <div 
//           className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full mx-auto p-6 my-8 special-event-form special-event-form-content"
//           onClick={(e) => e.stopPropagation()}
//           onMouseDown={(e) => e.stopPropagation()}
//           onPointerDown={(e) => e.stopPropagation()}
//           onMouseUp={(e) => e.stopPropagation()}
//           onTouchStart={(e) => e.stopPropagation()}
//           onTouchEnd={(e) => e.stopPropagation()}
//           onTouchMove={(e) => e.stopPropagation()}
//         >
//           <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
//             Delete Event
//           </h2>
          
//           <p className="text-slate-700 dark:text-slate-300 mb-6">
//             Are you sure you want to delete "{event.title}"? This action cannot be undone.
//           </p>
          
//           {error && (
//             <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-md">
//               {error}
//             </div>
//           )}
          
//           <div className="flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={() => setIsDeleting(false)}
//               className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md
//                        text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleDelete}
//               className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600
//                        disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Deleting...' : 'Delete Event'}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Function to handle click on the main details modal backdrop
//   const handleMainBackdropClick = (e: React.MouseEvent) => {
//     console.log('Main modal backdrop onClick', e.target, e.currentTarget);
    
//     // Only close if clicking directly on the backdrop div itself, not any of its children
//     if (e.target === e.currentTarget) {
//       console.log('Closing main modal due to backdrop click');
//       onClose();
//     } else {
//       // If clicking on any child element, prevent propagation
//       console.log('Preventing modal close - clicked on child element');
//       e.stopPropagation();
//     }
//   };
  
//   // Default view - event details
//   return (
//     <div 
//       className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//       onClick={handleMainBackdropClick}
//     >
//       <div 
//         className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full mx-auto special-event-form special-event-form-content"
//         onClick={(e) => e.stopPropagation()}
//         onMouseDown={(e) => e.stopPropagation()}
//         onPointerDown={(e) => e.stopPropagation()}
//         onMouseUp={(e) => e.stopPropagation()}
//         onTouchStart={(e) => e.stopPropagation()}
//         onTouchEnd={(e) => e.stopPropagation()}
//         onTouchMove={(e) => e.stopPropagation()}
//       >
//         {/* Use brand colors for the header */}
//         <div 
//           className={`p-4 rounded-t-lg ${getEventColor()}`}
//           style={event.sourceType === 'band' ? { backgroundColor: '#3b82f6' } : undefined}
//         >
//           <div className="flex justify-between items-start">
//             <h2 className="text-xl font-semibold text-white">{event.title}</h2>
//             <button
//               type="button"
//               onClick={onClose}
//               className="text-white/80 hover:text-white"
//             >
//               <X size={20} />
//             </button>
//           </div>
//           {/* Event type removed from here since it's already in the title */}
//         </div>
        
//         <div className="p-4">
//           {error && (
//             <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-md">
//               {error}
//             </div>
//           )}
          
//           <div className="space-y-4">
//             {/* Date & Time */}
//             <div className="flex items-start">
//               <Calendar size={18} className="mr-3 mt-0.5 text-slate-500 dark:text-slate-400" />
//               <div>
//                 <div className="text-slate-900 dark:text-white">
//                   {event.allDay ? (
//                     <>
//                       {formatDate(event.start)}
//                       {new Date(event.start).toDateString() !== new Date(event.end).toDateString() && (
//                         <> - {formatDate(event.end)}</>
//                       )}
//                       <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
//                         (All day)
//                       </span>
//                     </>
//                   ) : (
//                     <>
//                       {formatDate(event.start)}
//                       {new Date(event.start).toDateString() !== new Date(event.end).toDateString() && (
//                         <> - {formatDate(event.end)}</>
//                       )}
//                     </>
//                   )}
//                 </div>
                
//                 {!event.allDay && (
//                   <div className="text-slate-600 dark:text-slate-400 flex items-center mt-1">
//                     <Clock size={14} className="mr-1" />
//                     {formatTime(event.start)} - {formatTime(event.end)}
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             {/* Artist */}
//             {event.artistName && (
//               <div className="flex items-start">
//                 <User size={18} className="mr-3 mt-0.5 text-slate-500 dark:text-slate-400" />
//                 <div className="text-slate-900 dark:text-white">
//                   {event.artistName}
//                 </div>
//               </div>
//             )}
            
//             {/* Venue */}
//             {event.venueId && (
//               <div className="flex items-start">
//                 <MapPin size={18} className="mr-3 mt-0.5 text-slate-500 dark:text-slate-400" />
//                 <div className="text-slate-900 dark:text-white">
//                   Venue ID: {event.venueId}
//                   <div className="text-sm text-slate-500 dark:text-slate-400">
//                     (Venue details will be shown here)
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {/* Public/Private */}
//             <div className="flex items-start">
//               {event.isPublic ? (
//                 <Eye size={18} className="mr-3 mt-0.5 text-slate-500 dark:text-slate-400" />
//               ) : (
//                 <EyeOff size={18} className="mr-3 mt-0.5 text-slate-500 dark:text-slate-400" />
//               )}
//               <div className="text-slate-900 dark:text-white">
//                 {event.isPublic ? 'Public event (visible on bndy.live)' : 'Private event'}
//               </div>
//             </div>
            
//             {/* Description */}
//             {event.description && (
//               <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-3">
//                 <h3 className="font-medium text-slate-900 dark:text-white mb-2">Description</h3>
//                 <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
//                   {event.description}
//                 </p>
//               </div>
//             )}
//           </div>
          
//           {/* Actions */}
//           <div className="flex space-x-3 mt-6">
//             {/* Check if this is a cross-context event */}
//             {(event.sourceType === 'band' && calendarContext === 'user') || 
//              (event.sourceType === 'member' && calendarContext === 'band') ? (
//               // For cross-context events, only show OK button
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 w-full justify-center"
//               >
//                 OK
//               </button>
//             ) : (
//               // For regular events, show edit and delete buttons
//               <>
//                 <button
//                   type="button"
//                   onClick={() => setIsEditing(true)}
//                   className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"
//                 >
//                   <Edit size={16} className="mr-2" />
//                   Edit
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setIsDeleting(true)}
//                   className="flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-100 rounded-md hover:bg-red-200 dark:hover:bg-red-800"
//                 >
//                   <Trash size={16} className="mr-2" />
//                   Delete
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
