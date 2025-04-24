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
        <label htmlFor="eventType" style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }} className="block mb-1 font-medium">
          Event Type*
        </label>
        <div className="relative">
          <select
            id="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value as EventType)}
            style={{
              backgroundColor: isDarkMode ? '#334155' : 'white',
              borderColor: isDarkMode ? '#475569' : '#d1d5db',
              color: isDarkMode ? 'white' : '#0f172a',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              width: '100%',
              paddingRight: '2.5rem',
              appearance: 'none'
            }}
            className="focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
            required
          >
          {calendarContext === 'user' ? (
            // User context event types
            <>
              <option value="available">Available</option>
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
            <svg style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }} className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Public Event Toggle - Only show for band events */}
      {calendarContext === 'band' && !isEditMode && (
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            style={{
              borderColor: isDarkMode ? '#475569' : '#d1d5db',
              marginRight: '0.5rem',
              height: '1.25rem',
              width: '1.25rem'
            }}
            className="text-orange-500 focus:ring-orange-500 focus:ring-2 focus:ring-offset-0 rounded transition-colors"
          />
          <span style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }}>Make this event public (visible to fans)</span>
        </label>
      )}
    </>
  );
};
