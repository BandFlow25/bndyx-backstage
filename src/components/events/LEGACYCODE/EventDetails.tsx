// import React from 'react';
// import { BndyCalendarEvent } from '@/types/calendar';
// import { Edit, Trash, Calendar, Clock, MapPin, User, Eye, EyeOff } from 'lucide-react';

// interface EventDetailsProps {
//   event: BndyCalendarEvent;
//   onEdit: () => void;
//   onDelete: () => void;
//   isArtistContext?: boolean;
//   calendarContext?: 'user' | 'band';
//   canEdit: boolean;
//   canDelete: boolean;
// }

// export default function EventDetails({
//   event,
//   onEdit,
//   onDelete,
//   isArtistContext = false,
//   calendarContext = 'band',
//   canEdit,
//   canDelete
// }: EventDetailsProps) {
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

//   // Get event type display name
//   const getEventTypeDisplay = () => {
//     if (event.sourceType === 'band' && calendarContext === 'user') {
//       return 'Band Event';
//     }
    
//     switch (event.eventType) {
//       // Band context
//       case 'gig':
//         return 'Gig';
//       case 'practice':
//         return 'Practice';
//       case 'meeting':
//         return 'Meeting';
//       case 'recording':
//         return 'Recording';
      
//       // User context
//       case 'unavailable':
//         return 'Unavailable';
//       case 'available':
//         return 'Available';
//       case 'tentative':
//         return 'Tentative';
//       default:
//         return 'Other';
//     }
//   };

//   // Get background color based on event type and context
//   const getEventColor = () => {
//     // Force band events to be blue in the user context
//     if (event.sourceType === 'band' && calendarContext === 'user') {
//       return 'bg-blue-500';
//     }
    
//     // Otherwise use the color based on event type
//     switch (event.eventType) {
//       // Band context colors
//       case 'gig':
//         return 'bg-orange-500';
//       case 'practice':
//         return 'bg-orange-500';
//       case 'meeting':
//         return 'bg-orange-500';
//       case 'recording':
//         return 'bg-orange-500';
      
//       // User context colors
//       case 'unavailable':
//         return 'bg-red-500';
//       case 'tentative':
//         return 'bg-amber-500';
//       case 'available':
//         return 'bg-green-500';
//       default:
//         return 'bg-orange-500';
//     }
//   };

//   return (
//     <div>
//       {/* Event Type Badge */}
//       <div className="flex items-center justify-between mb-6">
//         <div className={`${getEventColor()} text-white text-sm font-medium py-1 px-3 rounded-full`}>
//           {getEventTypeDisplay()}
//         </div>
        
//         {/* Action buttons */}
//         <div className="flex space-x-2">
//           {canEdit && event.sourceType !== 'band' && (
//             <button
//               onClick={onEdit}
//               className="p-2 text-slate-600 hover:text-orange-500 hover:bg-slate-100 rounded-full dark:text-slate-300 dark:hover:text-orange-400 dark:hover:bg-slate-700"
//               aria-label="Edit event"
//             >
//               <Edit size={18} />
//             </button>
//           )}
          
//           {canDelete && event.sourceType !== 'band' && (
//             <button
//               onClick={onDelete}
//               className="p-2 text-slate-600 hover:text-red-500 hover:bg-slate-100 rounded-full dark:text-slate-300 dark:hover:text-red-400 dark:hover:bg-slate-700"
//               aria-label="Delete event"
//             >
//               <Trash size={18} />
//             </button>
//           )}
//         </div>
//       </div>
      
//       {/* Event Title */}
//       <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
//         {event.title}
//       </h3>
      
//       {/* Event Details */}
//       <div className="space-y-4 text-slate-700 dark:text-slate-300">
//         {/* Date & Time */}
//         <div className="flex items-start">
//           <Calendar className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400 mt-0.5" />
//           <div>
//             <div>{formatDate(new Date(event.start))}</div>
//             {!event.allDay && (
//               <div className="flex items-center mt-1">
//                 <Clock className="w-4 h-4 mr-1 text-slate-500 dark:text-slate-400" />
//                 <span>{formatTime(new Date(event.start))}</span>
//                 {event.end && (
//                   <>
//                     <span className="mx-2">-</span>
//                     <span>{formatTime(new Date(event.end))}</span>
//                   </>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* Location (if available) */}
//         {(event as any).location && (
//           <div className="flex items-start">
//             <MapPin className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400 mt-0.5" />
//             <div>{(event as any).location}</div>
//           </div>
//         )}
        
//         {/* Artist (if in user context and it's a band event) */}
//         {event.sourceType === 'band' && calendarContext === 'user' && event.artistName && (
//           <div className="flex items-start">
//             <User className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400 mt-0.5" />
//             <div>{event.artistName}</div>
//           </div>
//         )}
        
//         {/* Visibility */}
//         <div className="flex items-start">
//           {event.isPublic ? (
//             <>
//               <Eye className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400 mt-0.5" />
//               <div>Public event</div>
//             </>
//           ) : (
//             <>
//               <EyeOff className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400 mt-0.5" />
//               <div>Private event</div>
//             </>
//           )}
//         </div>
        
//         {/* Description (if available) */}
//         {event.description && (
//           <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
//             <h4 className="font-medium text-slate-900 dark:text-white mb-2">Description</h4>
//             <p className="whitespace-pre-line">{event.description}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
