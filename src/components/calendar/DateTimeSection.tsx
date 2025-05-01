'use client';

import React, { useState } from 'react';
import { BndyDatePicker, BndyTimePicker } from 'bndy-ui';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DateTimeSectionProps {
  eventDate: string;
  setEventDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  showEndDate: boolean;
  setShowEndDate: (show: boolean) => void;
  isAllDay: boolean;
  setIsAllDay: (isAllDay: boolean) => void;
  showTimeSelection: boolean;
  setShowTimeSelection: (show: boolean) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  isDarkMode: boolean;
  calendarContext: 'user' | 'band';
  newEventStartDate?: Date;
  event?: { id?: string; start?: Date; end?: Date };
  today: string;
}

export const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  eventDate,
  setEventDate,
  endDate,
  setEndDate,
  showEndDate,
  setShowEndDate,
  isAllDay,
  setIsAllDay,
  showTimeSelection,
  setShowTimeSelection,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  isDarkMode,
  calendarContext,
  newEventStartDate,
  event,
  today
}) => {
  // Track field interactions to prevent premature validation
  const [fieldsTouched, setFieldsTouched] = useState<Record<string, boolean>>({
    eventDate: false,
    endDate: false
  });
  
  // Track validation errors
  const [errors, setErrors] = useState<Record<string, string>>({
    eventDate: '',
    endDate: ''
  });
  
  // Track if end time picker should be shown
  const [showEndTime, setShowEndTime] = useState<boolean>(false);
  
  // Helper to check if end time is valid (after start time)
  const isEndTimeValid = (): boolean => {
    if (!showEndTime || !startTime || !endTime) return true;
    
    // If dates are different, any end time is valid
    if (eventDate !== endDate) return true;
    
    // Parse times for comparison (they are in 24-hour format)
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    // Convert to total minutes for easier comparison
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    // Special case: If start time is in the evening (after 6 PM) and end time is in the morning (before 6 AM),
    // assume it's an event crossing midnight without requiring multi-day selection
    if (startHour >= 18 && endHour < 6) return true;
    
    // Special case: If end time is midnight (00:00), it's valid regardless of start time
    if (endHour === 0 && endMinute === 0) return true;
    
    // Normal case: end time should be after start time
    return endTotalMinutes > startTotalMinutes;
  };
  
  // Validate date and time selections
  const validateDateTimeSelections = (): Record<string, string> => {
    const validationErrors: Record<string, string> = {};
    
    // Validate event date
    if (!eventDate) {
      validationErrors.eventDate = 'Please select an event date';
    }
    
    // Validate end date if multi-day event
    if (showEndDate && !endDate) {
      validationErrors.endDate = 'Please select an end date';
    }
    
    // Validate end date is after or equal to start date
    if (showEndDate && eventDate && endDate) {
      const start = new Date(eventDate);
      const end = new Date(endDate);
      if (end < start) {
        validationErrors.endDate = 'End date must be after or equal to start date';
      }
    }
    
    // Validate start time if time selection is enabled
    if (showTimeSelection && !startTime) {
      validationErrors.startTime = 'Please select a start time';
    }
    
    // Validate end time is after start time if both are provided
    if (showTimeSelection && showEndTime && startTime && endTime) {
      if (!isEndTimeValid()) {
        validationErrors.endTime = 'End time must be after start time';
      }
    }
    
    return validationErrors;
  };
  
  // Get validation errors for a specific field
  const getFieldError = (fieldName: string): string => {
    const errors = validateDateTimeSelections();
    return errors[fieldName] || '';
  };

  // Function to mark a field as touched and handle validation
  const markFieldAsTouched = (fieldName: string) => {
    setFieldsTouched((prev: Record<string, boolean>) => ({
      ...prev,
      [fieldName]: true
    }));
    
    // If the field is eventDate and we have a date, clear any validation errors
    if (fieldName === 'eventDate' && eventDate) {
      setErrors((prev: Record<string, string>) => ({
        ...prev,
        eventDate: ''
      }));
    }
    
    // If the field is endDate and we have a date, clear any validation errors
    if (fieldName === 'endDate' && endDate) {
      setErrors((prev: Record<string, string>) => ({
        ...prev,
        endDate: ''
      }));
    }
  };
  
  // Validate a field and set error message if needed
  const validateField = (fieldName: string, value: string): boolean => {
    // We only validate on form submission, not during field interactions
    if (!value || value.trim() === '') {
      return false;
    }
    return true;
  };

  return (
    <>
      {/* Event Date Picker - No label, just the button */}
      <div className="mb-4">
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <BndyDatePicker
            date={new Date(eventDate)}
            onSelect={(date: Date | undefined) => {
              if (date) {
                // Use local date components to prevent timezone issues
                const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                setEventDate(formattedDate);
                if (!showEndDate) {
                  setEndDate(formattedDate);
                }
              }
            }}
            buttonLabel={eventDate ? new Date(eventDate).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }) : 'Select date'}
            className="w-full"
            minDate={new Date(today)}
            darkMode={isDarkMode}
            disablePastDates={true}
            weekStartsOn={1} // Start week on Monday
          />
          {/* Validation messages only shown on form submission */}
        </div>
      </div>

      {/* Multi-Day Event Checkbox */}
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="showEndDate"
          checked={showEndDate}
          onChange={(e) => setShowEndDate(e.target.checked)}
          className="w-4 h-4 border border-slate-300 dark:border-slate-600 rounded focus:ring-orange-500 text-orange-500 bg-white dark:bg-slate-700"
        />
        <label htmlFor="showEndDate" className="ml-2 text-sm font-medium text-slate-700 dark:text-white">
          Multi-Day Event
        </label>
      </div>

      {/* End Date Picker (only shown for multi-day events) */}
      {showEndDate && (
        <div className="mb-4">
          <div onClick={(e) => e.stopPropagation()}>
            <BndyDatePicker
              date={new Date(endDate)}
              onSelect={(date: Date | undefined) => {
                if (date) {
                  // Use local date components to prevent timezone issues
                  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  setEndDate(formattedDate);
                }
              }}
              buttonLabel={endDate ? new Date(endDate).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              }) : 'Select end date'}
              className="w-full"
              minDate={new Date(eventDate) || new Date(today)}
              darkMode={isDarkMode}
              disablePastDates={true}
              weekStartsOn={1} // Start week on Monday
            />
            {/* Validation messages only shown on form submission */}
          </div>
        </div>
      )}

      {/* Add Times Checkbox (replaces All Day Event) */}
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="showTimeSelection"
          checked={showTimeSelection}
          onChange={(e) => {
            setShowTimeSelection(e.target.checked);
            // If times are not shown, set isAllDay to true
            setIsAllDay(!e.target.checked);
            // Reset end time selection when toggling time selection
            if (!e.target.checked) {
              setShowEndTime(false);
            }
          }}
          className="w-4 h-4 border border-slate-300 dark:border-slate-600 rounded focus:ring-orange-500 text-orange-500 bg-white dark:bg-slate-700"
        />
        <label htmlFor="showTimeSelection" className="ml-2 text-sm font-medium text-slate-700 dark:text-white">
          Add Times
        </label>
      </div>

      {/* Time Selection (shown when Add Times is checked) */}
      {showTimeSelection && (
        <div className="mb-4">
          {/* Start Time Picker */}
          <div className="mb-4" onClick={(e) => e.stopPropagation()}>
            <BndyTimePicker
              time={startTime}
              onTimeChange={(time: string) => {
                setStartTime(time);
                
                // If end time is enabled and before start time, update it
                if (showEndTime && endTime) {
                  const [startHours, startMinutes] = time.split(':').map(Number);
                  const [endHours, endMinutes] = endTime.split(':').map(Number);
                  
                  // Only adjust end time if dates are the same
                  if (eventDate === endDate) {
                    const startTotalMinutes = startHours * 60 + startMinutes;
                    const endTotalMinutes = endHours * 60 + endMinutes;
                    
                    // If end time is before or equal to start time, set it to start time + 1 hour
                    if (endTotalMinutes <= startTotalMinutes) {
                      const newEndHours = (startHours + 1) % 24;
                      setEndTime(`${String(newEndHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')}`);
                    }
                  }
                }
              }}
              label="Start Time"
              darkMode={isDarkMode}
            />
            {getFieldError('startTime') && (
              <div className="text-red-500 text-sm mt-1 flex items-center">
                <span className="inline-block mr-1">⚠️</span>
                {getFieldError('startTime')}
              </div>
            )}
          </div>
          
          {/* Add End Time Checkbox */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="showEndTime"
              checked={showEndTime}
              onChange={(e) => {
                setShowEndTime(e.target.checked);
                if (e.target.checked && startTime) {
                  // Set end time to start time + 1 hour
                  const [hours, minutes] = startTime.split(':').map(Number);
                  const newEndHours = (hours + 1) % 24;
                  setEndTime(`${String(newEndHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
                }
              }}
              className="w-4 h-4 border border-slate-300 dark:border-slate-600 rounded focus:ring-orange-500 text-orange-500 bg-white dark:bg-slate-700"
            />
            <label htmlFor="showEndTime" className="ml-2 text-sm font-medium text-slate-700 dark:text-white">
              Add End Time
            </label>
          </div>
          
          {/* End Time Picker (only shown when Add End Time is checked) */}
          {showEndTime && (
            <div className="mb-4" onClick={(e) => e.stopPropagation()}>
              <BndyTimePicker
                time={endTime}
                onTimeChange={setEndTime}
                label="End Time"
                darkMode={isDarkMode}
              />
              {getFieldError('endTime') && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="inline-block mr-1">⚠️</span>
                  {getFieldError('endTime')}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
