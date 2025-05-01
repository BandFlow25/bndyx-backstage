import { getUserEvents } from '../user-events';
import { mockUser, mockEvent } from '../../../../testUtils/mocks';

jest.mock('../user-events', () => ({
  getUserEvents: jest.fn(),
}));

describe('getUserEvents', () => {
  it('returns user events when present', async () => {
    (getUserEvents as jest.Mock).mockResolvedValue([mockEvent]);
    const events = await getUserEvents(mockUser.uid);
    expect(events).toHaveLength(1);
    expect(events[0].title).toBe('Band Practice');
  });

  it('returns empty array when no events', async () => {
    (getUserEvents as jest.Mock).mockResolvedValue([]);
    const events = await getUserEvents(mockUser.uid);
    expect(events).toEqual([]);
  });
});
