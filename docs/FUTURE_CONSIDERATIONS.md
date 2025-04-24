# Future Considerations for bndy Platform

## Calendar UX Improvements

### Calendar Display and Interaction

1. **Default Calendar View**
   - Calendar month grid should always display, even when no events exist
   - Replace "Calendar integration ready" message with the actual calendar grid
   - Allow users to click on any day to add a new event with that date pre-selected

2. **Date and Time Selection**
   - Implement consistent bndy-branded date picker across the platform
   - Use the existing date picker from bndy-ui as the standard
   - Improve time picker UX:
     - Limit minute selection to 15-minute intervals (00, 15, 30, 45)
     - Implement a mobile-friendly "clock face" time picker for better UX
     - Consider a two-step process: select hours first, then minutes

3. **Context-Aware Calendar**
   - **User Context** (accessed from User Dashboard):
     - Limit to personal events only
     - Event types: Unavailable, Available, Tentative, Other
     - First three types visible to band members in band calendar
     - "Other" category remains private to the user
     - Show as "[User Name] Unavailable" in band calendars

   - **Band/Artist Context** (accessed via Backstage):
     - Show all band members' availability
     - Event types: Gig, Practice, Meeting, Recording, Other
     - Gigs require a validated `bndy_venue` ID
     - Implement conflict detection:
       - Warn if band members are unavailable
       - Alert if venue already has an event that day

   - **Context Switching**:
     - Allow switching between personal and band contexts
     - Make context switch visually distinct (different styling/iconography)
     - Consider using tabs to switch calendar context
     - Context determines event type options, not user selection

4. **Dashboard Integration**
   - Replace "Calendar view coming soon" with actual calendar in month view
   - For users in multiple bands, provide quick band context switching
   - Maintain simple UX for users in only one band

5. **Event Confirmation System**
   - Implement artist and venue status fields for events
   - Support confirmation workflow between artists and venues
   - Allow creation of events for entities not yet in bndy
   - Support community builders creating events for artists/venues

## Database Performance Optimization

### Events Collection Performance

As the bndy platform grows, we may need to optimize the events collection for performance, especially for bndy-live which needs to be highly responsive while only accessing a small subset of events (public gigs).

#### Current Approach
- All events (personal, band, public, private) are stored in a single `bndy_events` collection
- Queries use proper filtering: `where('isPublic', '==', true), where('eventType', '==', 'gig')`
- This approach simplifies the data model and avoids duplication

#### Future Optimizations to Consider

1. **Create specific composite indexes** for common queries:
   ```
   Collection: bndy_events
   Fields indexed: isPublic (Ascending), eventType (Ascending), startDate (Ascending)
   ```

2. **Implement pagination** in bndy-live to limit initial data load (e.g., only load next 30 days of events initially)

3. **Use Firestore's query caching** to improve repeated access performance

4. **Consider a denormalized public events collection** if performance becomes an issue:
   - Create a separate `bndy_public_events` collection
   - Use Cloud Functions to automatically sync public gigs from `bndy_events` to this collection
   - Have bndy-live read exclusively from this smaller, focused collection

5. **Explore Firestore collection group queries** if we decide to split events by artist

6. **Monitor and optimize** based on actual usage patterns and performance metrics

7. **Implement server-side filtering** for complex queries that can't be efficiently indexed

### Decision Criteria

Before implementing any of these optimizations, we should:

1. Measure actual performance with real-world data volumes
2. Identify specific bottlenecks through performance testing
3. Consider the trade-offs between maintenance complexity and performance gains
4. Prioritize optimizations that provide the most benefit with minimal code changes
