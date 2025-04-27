'use client';

import React from 'react';
import { BndyDatePicker } from 'bndy-ui';
import { BndyTimePicker } from './BndyTimePicker';
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

  return (
    <>
      <div className="mb-4">
        <label htmlFor="eventDate" className="block mb-1 font-medium text-slate-700 special-event-form-label">
          Start Date*
        </label>
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <BndyDatePicker
            date={new Date(eventDate)}
            onSelect={(date) => {
              if (date) {
                // Use local date components to prevent timezone issues
                const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                setEventDate(formattedDate);
                if (!showEndDate) {
                  setEndDate(formattedDate);
                }
              }
            }}
            buttonLabel={eventDate ? new Date(eventDate).toLocaleDateString('en-GB', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }) : 'Select date'}
            className="w-full"
            minDate={new Date(today)}
            darkMode={isDarkMode}
            disablePastDates={true}
            weekStartsOn={1} // Start week on Monday
          />
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="showEndDate"
          checked={showEndDate}
          onChange={(e) => setShowEndDate(e.target.checked)}
          className="w-4 h-4 border border-slate-300 dark:border-slate-600 rounded focus:ring-orange-500 text-orange-500 bg-white dark:bg-slate-700"
        />
        <label htmlFor="showEndDate" className="ml-2 text-sm font-medium text-slate-700 dark:text-white">
          Add end date
        </label>
      </div>

      {showEndDate && (
        <div className="mb-4">
          <label htmlFor="endDate" className="block mb-1 font-medium text-slate-700 dark:text-white">
            End Date*
          </label>
          <div onClick={(e) => e.stopPropagation()}>
            <BndyDatePicker
              date={new Date(endDate)}
              onSelect={(date) => {
                if (date) {
                  // Use local date components to prevent timezone issues
                  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  setEndDate(formattedDate);
                }
              }}
              buttonLabel={endDate ? new Date(endDate).toLocaleDateString('en-GB', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }) : 'Select end date'}
              className="w-full"
              minDate={new Date(eventDate) || new Date(today)}
              darkMode={isDarkMode}
              weekStartsOn={1} // Start week on Monday
            />
          </div>
        </div>
      )}

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="isAllDay"
          checked={isAllDay}
          onChange={(e) => {
            setIsAllDay(e.target.checked);
            // If all day is checked, hide time selection
            // If unchecked, show time selection (always for band context, optional for user context)
            setShowTimeSelection(!e.target.checked && (calendarContext === 'band' || showTimeSelection));
          }}
          className="w-4 h-4 border border-slate-300 dark:border-slate-600 rounded focus:ring-orange-500 text-orange-500 bg-white dark:bg-slate-700"
        />
        <label htmlFor="isAllDay" className="ml-2 text-sm font-medium text-slate-700 dark:text-white">
          All day event
        </label>
      </div>

      {/* Only show the time selection checkbox for user context when not an all-day event */}
      {!isAllDay && calendarContext === 'user' && (
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="showTimeSelection"
            checked={showTimeSelection}
            onChange={(e) => setShowTimeSelection(e.target.checked)}
            className="w-4 h-4 border border-slate-300 dark:border-slate-600 rounded focus:ring-orange-500 text-orange-500 bg-white dark:bg-slate-700"
          />
          <label htmlFor="showTimeSelection" className="ml-2 text-sm font-medium text-slate-700 dark:text-white">
            Add specific times
          </label>
        </div>
      )}

      {!isAllDay && showTimeSelection && (
        <div className="mb-4">
          <div className="mb-4" onClick={(e) => e.stopPropagation()}>
            <BndyTimePicker
              time={startTime}
              onTimeChange={(newTime) => {
                setStartTime(newTime);
                
                // Ensure end time is after start time
                const [startHours, startMinutes] = newTime.split(':').map(Number);
                const [endHours, endMinutes] = endTime.split(':').map(Number);
                
                const startTotalMinutes = startHours * 60 + startMinutes;
                const endTotalMinutes = endHours * 60 + endMinutes;
                
                // If end time is before or equal to start time, set it to start time + 1 hour
                if (endTotalMinutes <= startTotalMinutes) {
                  const newEndHours = (startHours + 1) % 24;
                  setEndTime(`${String(newEndHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')}`);
                }
              }}
              label="Start Time*"
              darkMode={isDarkMode}
            />
          </div>
          
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="showEndTime"
              checked={showEndDate || endTime !== startTime}
              onChange={(e) => {
                if (e.target.checked) {
                  // Set end time to start time + 1 hour
                  const [hours, minutes] = startTime.split(':').map(Number);
                  const newEndHours = (hours + 1) % 24;
                  setEndTime(`${String(newEndHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
                } else {
                  // Set end time same as start time
                  setEndTime(startTime);
                }
              }}
              className="w-4 h-4 border border-slate-300 dark:border-slate-600 rounded focus:ring-orange-500 text-orange-500 bg-white dark:bg-slate-700"
            />
            <label htmlFor="showEndTime" className="ml-2 text-sm font-medium text-slate-700 dark:text-white">
              Add end time
            </label>
          </div>
          
          {(showEndDate || endTime !== startTime) && (
            <div className="mb-4" onClick={(e) => e.stopPropagation()}>
              <BndyTimePicker
                time={endTime}
                onTimeChange={setEndTime}
                label="End Time*"
                darkMode={isDarkMode}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};
