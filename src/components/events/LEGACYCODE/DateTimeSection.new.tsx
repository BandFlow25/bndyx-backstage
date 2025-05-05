// 'use client';

// import React, { useState, useEffect } from 'react';
// import { BndyDatePicker, BndyTimePicker } from 'bndy-ui';
// import { Calendar as CalendarIcon } from 'lucide-react';

// interface DateTimeSectionProps {
//   eventDate: string;
//   setEventDate: (date: string) => void;
//   endDate: string;
//   setEndDate: (date: string) => void;
//   showEndDate: boolean;
//   setShowEndDate: (show: boolean) => void;
//   isAllDay: boolean;
//   setIsAllDay: (isAllDay: boolean) => void;
//   showTimeSelection: boolean;
//   setShowTimeSelection: (show: boolean) => void;
//   startTime: string;
//   setStartTime: (time: string) => void;
//   endTime: string;
//   setEndTime: (time: string) => void;
//   isDarkMode: boolean;
//   calendarContext: 'user' | 'band';
//   newEventStartDate?: Date;
//   event?: { id?: string; start?: Date; end?: Date };
//   today: string;
// } 

// export const DateTimeSection: React.FC<DateTimeSectionProps> = ({
//   eventDate,
//   setEventDate,
//   endDate,
//   setEndDate,
//   showEndDate,
//   setShowEndDate,
//   isAllDay,
//   setIsAllDay,
//   showTimeSelection,
//   setShowTimeSelection,
//   startTime,
//   setStartTime,
//   endTime,
//   setEndTime,
//   isDarkMode,
//   calendarContext,
//   newEventStartDate,
//   event,
//   today
// }) => {
//   // Track field interactions to prevent premature validation
//   const [fieldsTouched, setFieldsTouched] = useState<Record<string, boolean>>({
//     eventDate: false,
//     endDate: false
//   });
  
//   // Track validation errors
//   const [errors, setErrors] = useState<Record<string, string>>({
//     eventDate: '',
//     endDate: ''
//   });
  
//   // Track if end time picker should be shown
//   const [showEndTime, setShowEndTime] = useState<boolean>(false);

//   // Initialize with proper date if provided
//   useEffect(() => {
//     if (newEventStartDate && newEventStartDate instanceof Date && !isNaN(newEventStartDate.getTime())) {
//       // Format date as YYYY-MM-DD
//       const formattedDate = `${newEventStartDate.getFullYear()}-${String(newEventStartDate.getMonth() + 1).padStart(2, '0')}-${String(newEventStartDate.getDate()).padStart(2, '0')}`;
//       setEventDate(formattedDate);
//       setEndDate(formattedDate);
      
//       // Debug log
//       console.log('Setting initial date:', formattedDate, 'from', newEventStartDate);
//     }
//   }, [newEventStartDate, setEventDate, setEndDate]);
  
//   // Debug the date values
//   useEffect(() => {
//     console.log('DateTimeSection - Current eventDate:', eventDate);
//     console.log('DateTimeSection - newEventStartDate:', newEventStartDate);
//   }, [eventDate, newEventStartDate]);
  
//   // Helper to check if end time is valid (after start time)
//   const isEndTimeValid = (): boolean => {
//     if (!showEndTime || !startTime || !endTime) return true;
    
//     // If dates are different, any end time is valid
//     if (eventDate !== endDate) return true;
    
//     // Parse times for comparison (they are in 24-hour format)
//     const [startHour, startMinute] = startTime.split(':').map(Number);
//     const [endHour, endMinute] = endTime.split(':').map(Number);
    
//     // Convert to total minutes for easier comparison
//     const startTotalMinutes = startHour * 60 + startMinute;
//     const endTotalMinutes = endHour * 60 + endMinute;
    
//     // Special case: If start time is in the evening (after 6 PM) and end time is in the morning (before 6 AM),
//     // assume it's an event crossing midnight without requiring multi-day selection
//     if (startHour >= 18 && endHour < 6) return true;
    
//     // Special case: If end time is midnight (00:00), it's valid regardless of start time
//     if (endHour === 0 && endMinute === 0) return true;
    
//     // Normal case: end time should be after start time
//     return endTotalMinutes > startTotalMinutes;
//   };
  
//   // Get field error message
//   const getFieldError = (fieldName: string): string => {
//     return errors[fieldName] || '';
//   };

//   // Format date for display
//   const formatDateForDisplay = (dateString: string | undefined): string => {
//     if (!dateString) return 'Select date';
    
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return 'Select date';
      
//       return date.toLocaleDateString('en-US', {
//         day: 'numeric',
//         month: 'short',
//         year: 'numeric'
//       });
//     } catch (e) {
//       console.error('Error formatting date:', e);
//       return 'Select date';
//     }
//   };

//   return (
//     <>
//       {/* Event Date Picker */}
//       <div className="mb-4">
//         <div className="relative" onClick={(e) => e.stopPropagation()}>
//           <BndyDatePicker
//             onOpen={() => {}}
//             onClose={() => {}}
//             date={eventDate ? new Date(eventDate) : undefined}
//             onSelect={(date: Date | undefined) => {
//               if (date && !isNaN(date.getTime())) {
//                 // Use local date components to prevent timezone issues
//                 const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
//                 setEventDate(formattedDate);
//                 if (!showEndDate) {
//                   setEndDate(formattedDate);
//                 }
//                 setFieldsTouched(prev => ({ ...prev, eventDate: true }));
//               }
//             }}
//             buttonLabel={formatDateForDisplay(eventDate)}
//             className="w-full"
//             minDate={today ? new Date(today) : undefined}
//             darkMode={isDarkMode}
//             disablePastDates={true}
//             weekStartsOn={1} // Start week on Monday
//           />
//         </div>
//       </div>

//       {/* Multi-Day Event Checkbox */}
//       <div className="mb-4 flex items-center">
//         <input
//           type="checkbox"
//           id="showEndDate"
//           checked={showEndDate}
//           onChange={(e) => setShowEndDate(e.target.checked)}
//           className="w-4 h-4 border border-slate-300 dark:border-slate-600 rounded focus:ring-orange-500 text-orange-500 bg-white dark:bg-slate-700"
//         />
//         <label htmlFor="showEndDate" className="ml-2 text-sm font-medium text-slate-700 dark:text-white">
//           Multi-Day Event
//         </label>
//       </div>

//       {/* End Date Picker (only shown for multi-day events) */}
//       {showEndDate && (
//         <div className="mb-4">
//           <div onClick={(e) => e.stopPropagation()}>
//             <BndyDatePicker
//             onOpen={() => {}}
//             onClose={() => {}}
//               date={endDate ? new Date(endDate) : undefined}
//               onSelect={(date: Date | undefined) => {
//                 if (date && !isNaN(date.getTime())) {
//                   // Use local date components to prevent timezone issues
//                   const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
//                   setEndDate(formattedDate);
//                   setFieldsTouched(prev => ({ ...prev, endDate: true }));
//                 }
//               }}
//               buttonLabel={formatDateForDisplay(endDate)}
//               className="w-full"
//               minDate={eventDate ? new Date(eventDate) : undefined}
//               darkMode={isDarkMode}
//               disablePastDates={true}
//               weekStartsOn={1} // Start week on Monday
//             />
//           </div>
//         </div>
//       )}

//       {/* Add Times Checkbox */}
//       <div className="mb-4 flex items-center">
//         <input
//           type="checkbox"
//           id="showTimeSelection"
//           checked={showTimeSelection}
//           onChange={(e) => {
//             setShowTimeSelection(e.target.checked);
//             setIsAllDay(!e.target.checked);
//             if (!e.target.checked) {
//               setShowEndTime(false);
//             }
//           }}
//           className="w-4 h-4 border border-slate-300 dark:border-slate-600 rounded focus:ring-orange-500 text-orange-500 bg-white dark:bg-slate-700"
//         />
//         <label htmlFor="showTimeSelection" className="ml-2 text-sm font-medium text-slate-700 dark:text-white">
//           Add Times
//         </label>
//       </div>

//       {/* Time Selection (shown when Add Times is checked) */}
//       {showTimeSelection && (
//         <div className="mb-4">
//           {/* Start Time Picker */}
//           <div className="mb-4" onClick={(e) => e.stopPropagation()}>
//             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
//             <BndyTimePicker
//               time={startTime || '12:00'} // Provide a default time if not set
//               onTimeChange={(time: string) => {
//                 if (time) {
//                   setStartTime(time);
                  
//                   // If end time is enabled and before start time, update it
//                   if (showEndTime && endTime) {
//                     const [startHours, startMinutes] = time.split(':').map(Number);
//                     const [endHours, endMinutes] = endTime.split(':').map(Number);
                    
//                     // Only adjust end time if dates are the same
//                     if (eventDate === endDate) {
//                       const startTotalMinutes = startHours * 60 + startMinutes;
//                       const endTotalMinutes = endHours * 60 + endMinutes;
                      
//                       // If end time is before start time, set it to start time + 1 hour
//                       if (endTotalMinutes <= startTotalMinutes) {
//                         // Add 1 hour to start time
//                         let newEndHours = startHours + 1;
//                         // Handle overflow to next day
//                         if (newEndHours >= 24) {
//                           newEndHours = 23;
//                           setEndTime(`${newEndHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`);
//                         } else {
//                           setEndTime(`${newEndHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`);
//                         }
//                       }
//                     }
//                   }
//                 }
//               }}
//               darkMode={isDarkMode}
//             />
//             {getFieldError('startTime') && (
//               <div className="text-red-500 text-sm mt-1 flex items-center">
//                 <span className="inline-block mr-1">⚠️</span>
//                 {getFieldError('startTime')}
//               </div>
//             )}
//           </div>
          
//           {/* End Time Checkbox */}
//           <div className="mb-4 flex items-center">
//             <input
//               type="checkbox"
//               id="showEndTime"
//               checked={showEndTime}
//               onChange={(e) => setShowEndTime(e.target.checked)}
//               className="w-4 h-4 border border-slate-300 dark:border-slate-600 rounded focus:ring-orange-500 text-orange-500 bg-white dark:bg-slate-700"
//             />
//             <label htmlFor="showEndTime" className="ml-2 text-sm font-medium text-slate-700 dark:text-white">
//               Add End Time
//             </label>
//           </div>
          
//           {/* End Time Picker (shown when Add End Time is checked) */}
//           {showEndTime && (
//             <div className="mb-4" onClick={(e) => e.stopPropagation()}>
//               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Time</label>
//               <BndyTimePicker
//                 time={endTime || '13:00'} // Provide a default time if not set
//                 onTimeChange={(time: string) => {
//                   if (time) {
//                     setEndTime(time);
//                   }
//                 }}
//                 darkMode={isDarkMode}
//               />
//               {getFieldError('endTime') && (
//                 <div className="text-red-500 text-sm mt-1 flex items-center">
//                   <span className="inline-block mr-1">⚠️</span>
//                   {getFieldError('endTime')}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// };
