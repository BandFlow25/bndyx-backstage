'use client';

import React, { useState } from 'react';
import { BndyCalendarEvent } from '@/types/calendar';
import { X, Edit, Trash, Calendar, Clock, MapPin, User, Eye, EyeOff } from 'lucide-react';
import EventForm from './EventForm';

interface EventDetailsModalProps {
  event: BndyCalendarEvent;
  onClose: () => void;
  onEdit: (event: BndyCalendarEvent) => Promise<void>;
  onDelete: (eventId: string) => Promise<void>;
  isArtistContext?: boolean;
}

export default function EventDetailsModal({
  event,
  onClose,
  onEdit,
  onDelete,
  isArtistContext = false
}: EventDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format dates for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle edit submit
  const handleEditSubmit = async (updatedEvent: BndyCalendarEvent) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onEdit(updatedEvent);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onDelete(event.id);
      onClose();
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get background color based on event type
  const getEventColor = () => {
    switch (event.eventType) {
      case 'gig':
        return 'bg-green-500';
      case 'practice':
        return 'bg-blue-500';
      case 'meeting':
        return 'bg-purple-500';
      case 'recording':
        return 'bg-pink-500';
      case 'unavailable':
        return 'bg-red-500';
      case 'available':
        return 'bg-lime-500';
      default:
        return 'bg-orange-500';
    }
  };

  // If in editing mode, show the event form
  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-2xl">
          <EventForm
            event={event}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditing(false)}
            isArtistContext={isArtistContext}
            artistId={event.artistId}
          />
        </div>
      </div>
    );
  }

  // If in delete confirmation mode
  if (isDeleting) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full mx-auto p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Delete Event
          </h2>
          
          <p className="text-slate-700 dark:text-slate-300 mb-6">
            Are you sure you want to delete "{event.title}"? This action cannot be undone.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsDeleting(false)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md
                       text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600
                       disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Event'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default view - event details
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full mx-auto">
        <div className={`${getEventColor()} p-4 rounded-t-lg`}>
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold text-white">{event.title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          <div className="mt-1 text-white/90">
            {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
          </div>
        </div>
        
        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {/* Date & Time */}
            <div className="flex items-start">
              <Calendar size={18} className="mr-3 mt-0.5 text-slate-500 dark:text-slate-400" />
              <div>
                <div className="text-slate-900 dark:text-white">
                  {event.allDay ? (
                    <>
                      {formatDate(event.start)}
                      {new Date(event.start).toDateString() !== new Date(event.end).toDateString() && (
                        <> - {formatDate(event.end)}</>
                      )}
                      <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                        (All day)
                      </span>
                    </>
                  ) : (
                    <>
                      {formatDate(event.start)}
                      {new Date(event.start).toDateString() !== new Date(event.end).toDateString() && (
                        <> - {formatDate(event.end)}</>
                      )}
                    </>
                  )}
                </div>
                
                {!event.allDay && (
                  <div className="text-slate-600 dark:text-slate-400 flex items-center mt-1">
                    <Clock size={14} className="mr-1" />
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </div>
                )}
              </div>
            </div>
            
            {/* Artist */}
            {event.artistName && (
              <div className="flex items-start">
                <User size={18} className="mr-3 mt-0.5 text-slate-500 dark:text-slate-400" />
                <div className="text-slate-900 dark:text-white">
                  {event.artistName}
                </div>
              </div>
            )}
            
            {/* Venue */}
            {event.venueId && (
              <div className="flex items-start">
                <MapPin size={18} className="mr-3 mt-0.5 text-slate-500 dark:text-slate-400" />
                <div className="text-slate-900 dark:text-white">
                  Venue ID: {event.venueId}
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    (Venue details will be shown here)
                  </div>
                </div>
              </div>
            )}
            
            {/* Public/Private */}
            <div className="flex items-start">
              {event.isPublic ? (
                <Eye size={18} className="mr-3 mt-0.5 text-slate-500 dark:text-slate-400" />
              ) : (
                <EyeOff size={18} className="mr-3 mt-0.5 text-slate-500 dark:text-slate-400" />
              )}
              <div className="text-slate-900 dark:text-white">
                {event.isPublic ? 'Public event (visible on bndy.live)' : 'Private event'}
              </div>
            </div>
            
            {/* Description */}
            {event.description && (
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-3">
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Description</h3>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setIsDeleting(true)}
              className="px-3 py-1.5 border border-red-300 dark:border-red-800 rounded-md
                       text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30
                       flex items-center"
            >
              <Trash size={16} className="mr-1" />
              Delete
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600
                       flex items-center"
            >
              <Edit size={16} className="mr-1" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
