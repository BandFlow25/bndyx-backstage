'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface CalendarHeaderProps {
  title: string;
  subtitle?: string;
  darkMode?: boolean;
  backLink?: string;
  backText?: string;
}

/**
 * Header component for calendar pages with consistent styling
 */
const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  title, 
  subtitle, 
  darkMode = false,
  backLink = '/dashboard',
  backText = 'Dashboard'
}) => {
  return (
    <div className="mb-0.5 pt-1 pb-1 px-4 rounded-lg bg-white dark:bg-slate-900 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{title}</h1>
        {backLink && (
          <Link 
            href={backLink} 
            className="text-orange-500 hover:text-orange-600 flex items-center text-sm font-medium">
            <ArrowLeft size={16} className="mr-1" />
            <span>{backText}</span>
          </Link>
        )}
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
