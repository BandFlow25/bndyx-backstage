'use client';

import React from 'react';

interface EventDetailsSectionProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  isDarkMode: boolean;
}

export const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  isDarkMode
}) => {
  return (
    <>
      {/* Title */}
      <div className="mb-4">
        <label htmlFor="title" style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }} className="block mb-1 font-medium">
          Event Title*
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            backgroundColor: isDarkMode ? '#334155' : 'white',
            borderColor: isDarkMode ? '#475569' : '#d1d5db',
            color: isDarkMode ? 'white' : '#0f172a',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            width: '100%',
          }}
          className="focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
          placeholder="Enter event title"
          required
        />
      </div>
      
      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }} className="block mb-1 font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            backgroundColor: isDarkMode ? '#334155' : 'white',
            borderColor: isDarkMode ? '#475569' : '#d1d5db',
            color: isDarkMode ? 'white' : '#0f172a',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            width: '100%',
          }}
          className="focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
          placeholder="Optional description"
          rows={4}
        />
      </div>
    </>
  );
};
