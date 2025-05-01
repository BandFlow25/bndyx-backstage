// Common test mocks for bndy-backstage

export const mockUser = {
  uid: 'test-user-1',
  displayName: 'Test User',
  email: 'testuser@example.com',
};

export const mockArtist = {
  id: 'artist-1',
  name: 'Test Band',
  members: [
    {
      userId: 'test-user-1',
      displayName: 'Test User',
      role: 'admin',
      instruments: [],
      joinedAt: new Date(),
    },
    {
      userId: 'test-user-2',
      displayName: 'Other User',
      role: 'member',
      instruments: [],
      joinedAt: new Date(),
    },
  ],
};

export const mockEvent = {
  id: 'event-1',
  title: 'Band Practice',
  start: new Date('2025-05-01T18:00:00Z'),
  end: new Date('2025-05-01T20:00:00Z'),
  allDay: false,
  eventType: 'practice',
  isPublic: false,
  artistId: 'artist-1',
  description: 'Weekly band practice',
};
