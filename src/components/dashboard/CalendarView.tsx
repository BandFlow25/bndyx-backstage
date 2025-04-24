'use client';

import React from 'react';
import Link from 'next/link';
import { CalendarDays, ArrowRight, Loader2 } from 'lucide-react';
import { BndyCalendar } from 'bndy-ui';
import { useCalendar } from '@/lib/context/calendar-context';
import { useTheme } from '@/lib/context/theme-context';
import { BndyCalendarEvent } from '@/types/calendar';

export default function CalendarView() {
  const { events, isLoading, error } = useCalendar();
  const { isDarkMode } = useTheme();
  
  // Get upcoming events (next 7 days)
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= today && eventDate <= nextWeek;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5); // Limit to 5 events for the dashboard

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-slate-900 dark:text-white">My Calendar</h2>
        <Link href="/calendar" className="text-orange-500 hover:text-orange-600 flex items-center text-sm font-medium">
          Full Calendar <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      {isLoading ? (
        <div className="h-[300px] flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-orange-500" />
        </div>
      ) : error ? (
        <div className="h-[300px] flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-2">Could not load calendar events</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{error.message}</p>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="text-center">
            <CalendarDays className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-300 mb-2">No upcoming events</p>
            <Link href="/calendar" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
              Add your first event
            </Link>
          </div>
        </div>
      ) : (
        <div className="h-[300px] overflow-hidden rounded-lg">
          <BndyCalendar 
            events={events}
            isDarkMode={isDarkMode}
            defaultView="agenda"
            readOnly={true}
          />
        </div>
      )}
    </div>
  );
}
