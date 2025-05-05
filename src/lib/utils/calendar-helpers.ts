// src/lib/utils/calendar-helpers.ts
import { BndyCalendarEvent, EventType } from '@/types/calendar';

/**
 * Consolidates member unavailable and tentative events to show only one dot per type per day
 * @param events The original array of calendar events
 * @returns A new array with consolidated member events
 */
export function consolidateMemberEvents(events: BndyCalendarEvent[]): BndyCalendarEvent[] {
  // First, separate member events from regular events
  const memberEvents = events.filter(event => event.sourceType === 'member' && 
    (event.eventType === 'unavailable' || event.eventType === 'tentative'));
  const otherEvents = events.filter(event => !(event.sourceType === 'member' && 
    (event.eventType === 'unavailable' || event.eventType === 'tentative')));
  
  // If no member events, just return the original events
  if (memberEvents.length === 0) {
    return events;
  }
  
  // Create a map to group member events by date
  const groupedEvents = new Map<string, Map<string, BndyCalendarEvent[]>>();
  
  // Process each member event
  memberEvents.forEach(event => {
    // Convert to date objects if they're strings
    const start = event.start instanceof Date ? event.start : new Date(event.start);
    const end = event.end instanceof Date ? event.end : new Date(event.end);
    
    // Create a key for the date (YYYY-MM-DD)
    const dateKey = `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`;
    
    // Initialize the date group if it doesn't exist
    if (!groupedEvents.has(dateKey)) {
      // Group by 'unavailable' and 'tentative' - we'll consolidate to one dot per day
      groupedEvents.set(dateKey, new Map<string, BndyCalendarEvent[]>());
    }
    
    // Get the date group
    const dateGroup = groupedEvents.get(dateKey)!;
    
    // We're going to consolidate all member events on this day to a single event
    // regardless of whether they're unavailable or tentative
    const groupKey = 'memberStatus';
    
    // Initialize the group if it doesn't exist
    if (!dateGroup.has(groupKey)) {
      dateGroup.set(groupKey, []);
    }
    
    // Add the event to the group
    dateGroup.get(groupKey)!.push(event);
  });
  
  // Create consolidated events
  const consolidatedEvents: BndyCalendarEvent[] = [];
  
  // Process each date group
  groupedEvents.forEach((dateGroup, dateKey) => {
    // We only have one group per day now - all member events consolidated
    const memberStatusGroup = dateGroup.get('memberStatus');
    if (!memberStatusGroup || memberStatusGroup.length === 0) return;
    
    // Use the first event as a template
    const firstEvent = memberStatusGroup[0];
    const start = firstEvent.start instanceof Date ? firstEvent.start : new Date(firstEvent.start);
    const end = firstEvent.end instanceof Date ? firstEvent.end : new Date(firstEvent.end);
    
    // Get all unique member names
    const memberNames = memberStatusGroup.map(e => e.sourceName)
      .filter((name, index, self) => self.indexOf(name) === index); // Remove duplicates
    
    // Create a title that shows the number of members
    const title = `${memberNames.length} Member${memberNames.length > 1 ? 's' : ''} Unavailable/Tentative`;
    
    // Create a description that lists all members
    const description = memberNames.join(', ');
    
    // Create the consolidated event
    const consolidatedEvent: BndyCalendarEvent = {
      ...firstEvent,
      id: `consolidated-members-${dateKey}`,
      title,
      description,
      // Keep the same start and end dates
      start,
      end,
      // Use a consistent color (we'll use the unavailable color)
      eventType: 'unavailable'
    };
    
    consolidatedEvents.push(consolidatedEvent);
  });
  
  // Return the consolidated events combined with the other events
  return [...otherEvents, ...consolidatedEvents];
}
