'use client';

import React from 'react';
import { EventType } from '@/types/calendar';

interface EventTypeSectionProps {
  eventType: EventType;
  setEventType: (eventType: EventType) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  calendarContext: 'user' | 'band';
  isDarkMode: boolean;
  isEditMode: boolean;
}

export const EventTypeSection: React.FC<EventTypeSectionProps> = ({
  eventType,
  setEventType,
  isPublic,
  setIsPublic,
  calendarContext,
  isDarkMode,
  isEditMode
}) => {
  return (
    <>
      {/* Event Type */}
      <div className="mb-4">
        <label htmlFor="eventType" className="block mb-1 font-medium text-slate-700 dark:text-white">
          Event Type*
        </label>
        <div className="relative">
          <select
            id="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value as EventType)}
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md appearance-none bg-white dark:bg-slate-700 text-slate-700 dark:text-white"
            required
          >
          {calendarContext === 'user' ? (
            // User context event types
            <>
              {/* Commented out 'Available' option as requested */}
              {/* <option value="available">Available</option> */}
              <option value="unavailable">Unavailable</option>
              <option value="tentative">Tentative</option>
              <option value="other">Other</option>
            </>
          ) : (
            // Band context event types
            <>
              <option value="gig">Gig</option>
              <option value="practice">Practice</option>
              <option value="recording">Recording</option>
              <option value="meeting">Meeting</option>
              <option value="other">Other</option>
            </>
          )}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <svg className="h-5 w-5 text-slate-500 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Public Event Toggle - Only show for band events */}
      {calendarContext === 'band' && (
        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4 border border-slate-300 dark:border-slate-600 rounded focus:ring-orange-500 text-orange-500 bg-white dark:bg-slate-700"
          />
          <label htmlFor="isPublic" className="ml-2 text-sm font-medium text-slate-700 dark:text-white">
            Make this event public (visible to fans)
          </label>
        </div>
      )}
    </>
  );
};
