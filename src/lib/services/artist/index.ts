// src/lib/services/artist/index.ts
// Re-export all artist service functionality from modular files

// Export types
export * from './types';

// Export core operations
export {
  isNameAvailable,
  generateUniqueName,
  createArtist,
  getArtistById,
  updateArtist
} from './core';

// Export user-related operations
export {
  getArtistsByUserId
} from './user-artists';

// Export media operations
export {
  uploadAvatarImage,
  uploadHeaderImage,
  deleteArtistImage
} from './media';

// Export member operations
export {
  addMember,
  removeMember,
  updateMember,
  getArtistMembers
} from './members';

// Export invitation operations
export {
  inviteMember,
  acceptInvitation,
  rejectInvitation
} from './invitations';
