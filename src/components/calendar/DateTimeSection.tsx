'use client';

import React from 'react';
import { BndyDatePicker } from 'bndy-ui';
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
      {/* Date Selection - BndyDatePicker */}
      <div className="mb-4">
        <label htmlFor="eventDate" style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }} className="block mb-1 font-medium">
          Date*
        </label>
        <div className="relative">
          <BndyDatePicker
            date={event?.start ? new Date(event.start) : newEventStartDate || new Date(eventDate)}
            onSelect={(date) => {
              if (date) {
                const dateStr = date.toISOString().slice(0, 10);
                setEventDate(dateStr);
                // If not showing end date, also update end date
                if (!showEndDate) {
                  setEndDate(dateStr);
                }
              }
            }}
            buttonLabel={eventDate ? new Date(eventDate).toLocaleDateString('en-GB', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }) : 'Select date'}
            darkMode={isDarkMode}
            disablePastDates={!event?.id} // Only disable past dates for new events
            weekStartsOn={1} // Start week on Monday
          />
        </div>
      </div>
      
      {/* Multi-day Event Toggle */}
      <div className="mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showEndDate}
            onChange={(e) => setShowEndDate(e.target.checked)}
            className="mr-2 h-5 w-5 text-orange-500 focus:ring-orange-500 focus:ring-2 focus:ring-offset-0 border-slate-300 dark:border-slate-600 rounded transition-colors"
          />
          <span style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }}>Multi-day event</span>
        </label>
      </div>
      
      {/* End Date (only if multi-day event) - DatePicker */}
      {showEndDate && (
        <div className="mb-4">
          <label htmlFor="endDate" style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }} className="block mb-1 font-medium">
            End Date*
          </label>
          <BndyDatePicker
            date={event?.end ? new Date(event.end) : new Date(endDate)}
            onSelect={(date) => {
              if (date) {
                setEndDate(date.toISOString().slice(0, 10));
              }
            }}
            buttonLabel={endDate ? new Date(endDate).toLocaleDateString('en-GB', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }) : 'Select end date'}
            darkMode={isDarkMode}
            minDate={new Date(eventDate)} // End date must be at least the event date
            weekStartsOn={1} // Start week on Monday
          />
        </div>
      )}
      
      {/* All Day Toggle */}
      <div className="mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isAllDay}
            onChange={(e) => {
              setIsAllDay(e.target.checked);
              if (e.target.checked) {
                setShowTimeSelection(false);
              }
            }}
            className="mr-2 h-5 w-5 text-orange-500 focus:ring-orange-500 focus:ring-2 focus:ring-offset-0 border-slate-300 dark:border-slate-600 rounded transition-colors"
          />
          <span style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }}>All Day Event</span>
        </label>
      </div>
      
      {/* Time Selection Toggle (only if not all day) */}
      {!isAllDay && (
        <div className="mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showTimeSelection}
              onChange={(e) => setShowTimeSelection(e.target.checked)}
              className="mr-2 h-5 w-5 text-orange-500 focus:ring-orange-500 focus:ring-2 focus:ring-offset-0 border-slate-300 dark:border-slate-600 rounded transition-colors"
            />
            <span style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }}>Specify time</span>
          </label>
        </div>
      )}
      
      {/* Time Selection (only if not all day and time selection is enabled) */}
      {!isAllDay && showTimeSelection && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
              Start Time
            </label>
            <div className="relative">
              <select
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md appearance-none
                  ${isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-orange-500' 
                    : 'bg-white border-slate-300 text-slate-900 focus:border-orange-500'}
                  focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors
                  h-10 md:h-11 text-base md:text-lg`}
              >
                {Array.from({ length: 24 * 4 }).map((_, i) => {
                  const hour = Math.floor(i / 4);
                  const minute = (i % 4) * 15;
                  const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                  const displayTime = `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
                  return (
                    <option key={`start-${formattedTime}`} value={formattedTime}>
                      {displayTime}
                    </option>
                  );
                })}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`} 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="endTime" className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
              End Time
            </label>
            <div className="relative">
              <select
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md appearance-none
                  ${isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-orange-500' 
                    : 'bg-white border-slate-300 text-slate-900 focus:border-orange-500'}
                  focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors
                  h-10 md:h-11 text-base md:text-lg`}
              >
                {Array.from({ length: 24 * 4 }).map((_, i) => {
                  const hour = Math.floor(i / 4);
                  const minute = (i % 4) * 15;
                  const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                  const displayTime = `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
                  return (
                    <option key={`end-${formattedTime}`} value={formattedTime}>
                      {displayTime}
                    </option>
                  );
                })}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`} 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
