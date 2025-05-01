import { addMember, removeMember } from '../members';
import { mockArtist } from '../../../../../testUtils/mocks';

jest.mock('../members', () => ({
  addMember: jest.fn(),
  removeMember: jest.fn(),
}));

describe('Artist Membership', () => {
  it('adds a member successfully', async () => {
    (addMember as jest.Mock).mockResolvedValue({ ...mockArtist, members: [...mockArtist.members, { userId: 'new-user', displayName: 'New User', role: 'member', instruments: [], joinedAt: new Date() }] });
    const updatedArtist = await addMember(mockArtist.id, { userId: 'new-user', displayName: 'New User', role: 'member', instruments: [], joinedAt: new Date() });
    expect(updatedArtist.members).toHaveLength(3);
    expect(updatedArtist.members[2].userId).toBe('new-user');
  });

  it('removes a member successfully', async () => {
    (removeMember as jest.Mock).mockResolvedValue({ ...mockArtist, members: [mockArtist.members[1]] });
    const updatedArtist = await removeMember(mockArtist.id, mockArtist.members[0].userId);
    expect(updatedArtist.members).toHaveLength(1);
    expect(updatedArtist.members[0].userId).toBe('test-user-2');
  });
});
