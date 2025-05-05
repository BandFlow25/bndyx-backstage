'use client';

import React from 'react';
import Link from 'next/link';
import { CalendarDays, ArrowRight, Loader2 } from 'lucide-react';
import { useCalendar } from '@/lib/context/calendar-context';
import { useTheme } from '@/lib/context/theme-context';
import { SimpleAgendaView } from 'bndy-ui';

export default function CalendarView() {
  const { events, isLoading, error } = useCalendar();
  const { isDarkMode } = useTheme();

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-end p-2">
        <Link href="/calendar" className="text-orange-500 hover:text-orange-600 flex items-center text-sm font-medium">
          Full Calendar <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    
      {isLoading ? (
        <div className="h-[250px] flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-orange-500" />
        </div>
      ) : error ? (
        <div className="h-[250px] flex items-center justify-center bg-slate-50 dark:bg-slate-700/50">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-2">Could not load calendar events</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{error.message}</p>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="h-[250px] flex items-center justify-center bg-slate-50 dark:bg-slate-700/50">
          <div className="text-center">
            <CalendarDays className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-300 mb-2">No upcoming events</p>
            <Link href="/calendar" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
              Add your first event
            </Link>
          </div>
        </div>
      ) : (
        <div className="h-[250px] overflow-auto">
          <SimpleAgendaView 
            events={events}
            onSelectEvent={(event) => console.log('Event selected:', event)}
            daysToShow={14}
            isDarkMode={isDarkMode}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
