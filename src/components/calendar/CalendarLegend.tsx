'use client';

import React from 'react';
import { useTheme } from '@/lib/context/theme-context';
import { EventCategory, getEventColor, USER_CALENDAR_BAND_EVENT_COLOR } from '@/types/calendar';
import { CalendarLegend as UiCalendarLegend } from 'bndy-ui';

interface LegendItem {
  id: string;
  label: string;
  color: string;
}

interface CalendarLegendProps {
  context: 'user' | 'artist';
  darkMode?: boolean;
  showBandEvents?: boolean;
}

/**
 * Thin wrapper around the bndy-ui CalendarLegend component that handles:
 * 1. Context-specific event types (artist vs user)
 * 2. Conditional display of band events
 * 3. Proper mapping of our centralized event types and colors
 */
const CalendarLegend: React.FC<CalendarLegendProps> = ({ context, darkMode, showBandEvents = true }) => {
  const { isDarkMode: contextDarkMode } = useTheme();
  // Use prop value if provided, otherwise use context
  const isDarkMode = darkMode !== undefined ? darkMode : contextDarkMode;
  
  // Create legend items based on context using centralized utilities and EventCategory enum
  const getLegendItems = (): LegendItem[] => {
    if (context === 'artist') {
      return [
        { id: EventCategory.GIG, label: 'Gig', color: getEventColor(EventCategory.GIG, 'band') },
        { id: EventCategory.PRACTICE, label: 'Practice', color: getEventColor(EventCategory.PRACTICE, 'band') },
        { id: EventCategory.RECORDING, label: 'Recording', color: getEventColor(EventCategory.RECORDING, 'band') },
        { id: EventCategory.MEETING, label: 'Meeting', color: getEventColor(EventCategory.MEETING, 'band') },
        { id: EventCategory.OTHER, label: 'Other', color: getEventColor(EventCategory.OTHER, 'band') },
        { id: EventCategory.UNAVAILABLE, label: 'Member Unavailable', color: getEventColor(EventCategory.UNAVAILABLE, 'user') },
        { id: EventCategory.TENTATIVE, label: 'Member Tentative', color: getEventColor(EventCategory.TENTATIVE, 'user') }
      ];
    }
    
    const userItems: LegendItem[] = [
      { id: EventCategory.AVAILABLE, label: 'Available', color: getEventColor(EventCategory.AVAILABLE, 'user') },
      { id: EventCategory.UNAVAILABLE, label: 'Unavailable', color: getEventColor(EventCategory.UNAVAILABLE, 'user') },
      { id: EventCategory.TENTATIVE, label: 'Tentative', color: getEventColor(EventCategory.TENTATIVE, 'user') }
    ];
      
    // Only add band events to the legend if showBandEvents is true
    if (showBandEvents) {
      userItems.push({ id: 'band', label: 'Band Events', color: USER_CALENDAR_BAND_EVENT_COLOR });
    }
      
    return userItems;
  };

  const items = getLegendItems();

  // Use the bndy-ui CalendarLegend component for consistent styling
  return (
    <UiCalendarLegend
      items={items}
      isDarkMode={isDarkMode}
      className="mb-4"
    />
  );
};

export { CalendarLegend };

export default CalendarLegend;
