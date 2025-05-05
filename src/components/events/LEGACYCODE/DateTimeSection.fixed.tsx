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
  
//   // Validate date and time selections
//   const validateDateTimeSelections = (): Record<string, string> => {
//     const validationErrors: Record<string, string> = {};
    
//     // Validate event date
//     if (!eventDate) {
//       validationErrors.eventDate = 'Please select an event date';
//     }
    
//     // Validate end date if multi-day event
//     if (showEndDate && !endDate) {
//       validationErrors.endDate = 'Please select an end date';
//     }
    
//     // Validate end date is after start date
//     if (showEndDate && eventDate && endDate) {
//       const startDateObj = new Date(eventDate);
//       const endDateObj = new Date(endDate);
      
//       if (endDateObj < startDateObj) {
//         validationErrors.endDate = 'End date must be after start date';
//       }
//     }
    
//     // Validate times if time selection is enabled
//     if (showTimeSelection) {
//       if (!startTime) {
//         validationErrors.startTime = 'Please select a start time';
//       }
      
//       if (showEndTime && !endTime) {
//         validationErrors.endTime = 'Please select an end time';
//       }
      
//       if (showEndTime && startTime && endTime && !isEndTimeValid()) {
//         validationErrors.endTime = 'End time must be after start time';
//       }
//     }
    
//     return validationErrors;
//   };
  
//   // Get field error message
//   const getFieldError = (fieldName: string): string => {
//     return errors[fieldName] || '';
//   };
  
//   // Mark a field as touched when interacted with
//   const markFieldAsTouched = (fieldName: string) => {
//     setFieldsTouched((prev: Record<string, boolean>) => ({
//       ...prev,
//       [fieldName]: true
//     }));
    
//     // Clear error when field is interacted with
//     if (fieldName === 'eventDate' && eventDate) {
//       setErrors((prev: Record<string, string>) => ({
//         ...prev,
//         eventDate: ''
//       }));
//     }
    
//     if (fieldName === 'endDate' && endDate) {
//       setErrors((prev: Record<string, string>) => ({
//         ...prev,
//         endDate: ''
//       }));
//     }
//   };
  
//   // Validate a field and set error message if needed
//   const validateField = (fieldName: string, value: string): boolean => {
//     // We only validate on form submission, not during field interactions
//     if (!value || value.trim() === '') {
//       return false;
//     }
//     return true;
//   };

//   return (
//     <>
//       {/* Event Date Picker - No label, just the button */}
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
//                 // Mark the field as touched for validation
//                 setFieldsTouched(prev => ({ ...prev, eventDate: true }));
//               }
//             }}
//             buttonLabel={eventDate && !isNaN(new Date(eventDate).getTime()) ? 
//               new Date(eventDate).toLocaleDateString('en-US', {
//                 day: 'numeric',
//                 month: 'short',
//                 year: 'numeric'
//               }) : 'Select date'}
//             className="w-full"
//             minDate={today ? new Date(today) : undefined}
//             darkMode={isDarkMode}
//             disablePastDates={true}
//             weekStartsOn={1} // Start week on Monday
//           />
//           {/* Validation messages only shown on form submission */}
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
//                   // Mark the field as touched for validation
//                   setFieldsTouched(prev => ({ ...prev, endDate: true }));
//                 }
//               }}
//               buttonLabel={endDate && !isNaN(new Date(endDate).getTime()) ? 
//                 new Date(endDate).toLocaleDateString('en-US', {
//                   day: 'numeric',
//                   month: 'short',
//                   year: 'numeric'
//                 }) : 'Select end date'}
//               className="w-full"
//               minDate={eventDate ? new Date(eventDate) : undefined}
//               darkMode={isDarkMode}
//               disablePastDates={true}
//               weekStartsOn={1} // Start week on Monday
//             />
//             {/* Validation messages only shown on form submission */}
//           </div>
//         </div>
//       )}

//       {/* Add Times Checkbox (replaces All Day Event) */}
//       <div className="mb-4 flex items-center">
//         <input
//           type="checkbox"
//           id="showTimeSelection"
//           checked={showTimeSelection}
//           onChange={(e) => {
//             setShowTimeSelection(e.target.checked);
//             // If times are not shown, set isAllDay to true
//             setIsAllDay(!e.target.checked);
//             // Reset end time selection when toggling time selection
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
