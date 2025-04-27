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
        <label htmlFor="title" className="block mb-1 font-medium text-slate-700 dark:text-white">
          Event Title*
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
          placeholder="Enter event title"
          required
        />
      </div>
      
      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" className="block mb-1 font-medium text-slate-700 dark:text-white">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
          placeholder="Optional description"
          rows={4}
        />
      </div>
    </>
  );
};
