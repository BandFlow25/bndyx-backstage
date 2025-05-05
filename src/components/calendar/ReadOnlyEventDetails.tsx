'use client';

import React from 'react';
import { BndyCalendarEvent, EventCategory, getEventColor } from '@/types/calendar';
import { X, Calendar, Clock, Info } from 'lucide-react';

interface ReadOnlyEventDetailsProps {
  event: BndyCalendarEvent;
  onClose: () => void;
}

/**
 * A simple read-only event details component that displays event information
 * without any editing capabilities
 */
const ReadOnlyEventDetails: React.FC<ReadOnlyEventDetailsProps> = ({ 
  event, 
  onClose 
}) => {
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get event type display name
  const getEventTypeDisplay = (type: string) => {
    switch (type) {
      case 'unavailable':
        return 'Unavailable';
      case 'tentative':
        return 'Tentative';
      case 'available':
        return 'Available';
      case 'practice':
        return 'Practice';
      case 'gig':
        return 'Gig';
      case 'recording':
        return 'Recording';
      case 'other':
        return 'Other';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Get color class based on event type using centralized utilities
  const getEventTypeColorClass = (event: BndyCalendarEvent) => {
    // Determine the context based on the event source
    const context = event.sourceType === 'band' ? 'band' : 'user';
    
    // Get the color from our centralized utility
    const color = getEventColor(event.eventType, context, event.sourceType);
    
    // Map the hex color to the corresponding Tailwind class
    // This mapping should ideally be centralized as well in a future refactor
    switch (color) {
      case '#ef4444': // red-500
        return 'bg-red-500';
      case '#f97316': // orange-500
        return 'bg-orange-500';
      case '#22c55e': // green-500
        return 'bg-green-500';
      case '#3b82f6': // blue-500
        return 'bg-blue-500';
      case '#06b6d4': // cyan-500
        return 'bg-cyan-500';
      case '#8b5cf6': // violet-500
        return 'bg-violet-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-auto">
      {/* Modal Header */}
      <div className="bg-slate-50 dark:bg-slate-700 flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-600">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Event Details
        </h2>
        <button 
          onClick={onClose}
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      {/* Event Details */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          {event.title}
        </h3>
        
        {/* Event Type */}
        <div className="mb-4 flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${getEventTypeColorClass(event)}`}></div>
          <span className="text-slate-700 dark:text-slate-300">
            {getEventTypeDisplay(event.eventType)}
          </span>
        </div>
        
        {/* Date & Time */}
        <div className="mb-4">
          <div className="flex items-start mb-2">
            <Calendar className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400 mt-0.5" />
            <div>
              {event.allDay ? (
                <div>{formatDate(event.start)}</div>
              ) : (
                <>
                  <div>{formatDate(event.start)}</div>
                  {event.start.toDateString() !== event.end.toDateString() && (
                    <div>to {formatDate(event.end)}</div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {!event.allDay && (
            <div className="flex items-start ml-8">
              <Clock className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400 mt-0.5" />
              <div>
                {formatTime(event.start)} - {formatTime(event.end)}
              </div>
            </div>
          )}
        </div>
        
        {/* Description (if available) */}
        {event.description && (
          <div className="mb-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400 mt-0.5" />
              <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {event.description}
              </div>
            </div>
          </div>
        )}
        
        {/* Artist/Band info (if available) */}
        {event.artistName && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-slate-700 dark:text-slate-300">
              <span className="font-medium">Artist/Band:</span> {event.artistName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadOnlyEventDetails;
