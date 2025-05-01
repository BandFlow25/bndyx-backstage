'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Music, MessageCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from 'bndy-ui';
import { useArtist } from '@/lib/context/artist-context';
import { BndyCalendarEvent } from '@/types/calendar';
import { getUpcomingEventsForDashboard } from '@/lib/firebase/events/dashboard-events';
import Link from 'next/link';

// Function to render the pink exclamation mark for unimplemented features
const NotImplementedMark = () => (
  <div className="absolute top-4 right-4">
    <AlertTriangle className="h-6 w-6 text-pink-500" />
  </div>
);

export const DashboardCards = () => {
  const { currentUser } = useAuth();
  const { currentUserArtists } = useArtist();
  const [upcomingEvents, setUpcomingEvents] = useState<BndyCalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Format date for display
  const formatEventDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Load upcoming events
  useEffect(() => {
    const loadUpcomingEvents = async () => {
      if (!currentUser || !currentUserArtists || currentUserArtists.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        // Get artist IDs
        const artistIds = currentUserArtists.map(artist => artist.id);
        
        // Get upcoming events
        const events = await getUpcomingEventsForDashboard(
          currentUser.uid,
          artistIds,
          2 // Limit to 2 events
        );
        
        setUpcomingEvents(events);
      } catch (error) {
        console.error('Error loading upcoming events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUpcomingEvents();
  }, [currentUser, currentUserArtists]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Upcoming Events Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 relative">
        <Calendar className="h-8 w-8 text-orange-500 mb-3" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Upcoming Events</h3>
        
        {isLoading ? (
          <p className="text-[var(--text-secondary)] text-sm">Loading events...</p>
        ) : upcomingEvents.length > 0 ? (
          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <div key={event.id} className="border-b border-slate-100 dark:border-slate-700 pb-2 last:border-0 last:pb-0">
                <p className="text-sm font-medium text-[var(--text-secondary)]">{event.artistName ? `${event.artistName} - ${event.title}` : event.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatEventDate(event.start)}
                </p>
              </div>
            ))}
            <Link href="/calendar" className="text-xs text-orange-500 hover:text-orange-600 flex items-center mt-2">
              View all events <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
        ) : (
          <p className="text-[var(--text-secondary)] text-sm">
            No upcoming events from your bands/artists
          </p>
        )}
      </div>
      
      {/* Song Actions Card - Not implemented */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 relative">
        <Music className="h-8 w-8 text-orange-500 mb-3" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Song Actions</h3>
        <p className="text-[var(--text-secondary)] text-sm">
          No pending song actions
        </p>
        <NotImplementedMark />
      </div>
      
      {/* Message Hub Card - Not implemented */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 relative">
        <MessageCircle className="h-8 w-8 text-orange-500 mb-3" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Message Hub</h3>
        <p className="text-[var(--text-secondary)] text-sm">
          No new messages
        </p>
        <NotImplementedMark />
      </div>
    </div>
  );
};

export default DashboardCards;
