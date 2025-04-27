'use client';

import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from 'bndy-ui';

interface CalendarHeaderProps {
  title: string;
  subtitle?: string;
  onCreateEvent: () => void;
  darkMode?: boolean;
}

/**
 * Header component for calendar pages with consistent styling and a create event button
 */
const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  title, 
  subtitle, 
  onCreateEvent,
  darkMode = false
}) => {
  return (
    <div className="mb-6 p-4 rounded-lg bg-white dark:bg-slate-900 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{title}</h1>
        <Button
          variant="primary"
          size="default"
          onClick={onCreateEvent}
          leftIcon={<PlusCircle size={18} />}
          aria-label="Add new event"
        >
          Add Event
        </Button>
      </div>
      {subtitle && (
        <p className="text-sm text-slate-600 dark:text-white transition-colors duration-300">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default CalendarHeader;
