import { getArtistEvents } from '../artist-events';
import { mockArtist, mockEvent } from '../../../../testUtils/mocks';

jest.mock('../artist-events', () => ({
  getArtistEvents: jest.fn(),
}));

describe('getArtistEvents', () => {
  it('returns artist events when present', async () => {
    (getArtistEvents as jest.Mock).mockResolvedValue([mockEvent]);
    const events = await getArtistEvents(mockArtist.id);
    expect(events).toHaveLength(1);
    expect(events[0].title).toBe('Band Practice');
  });

  it('returns empty array when no events', async () => {
    (getArtistEvents as jest.Mock).mockResolvedValue([]);
    const events = await getArtistEvents(mockArtist.id);
    expect(events).toEqual([]);
  });
});
