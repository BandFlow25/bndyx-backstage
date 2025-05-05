// 'use client';

// import React from 'react';
// import { Artist } from 'bndy-types';

// interface ArtistSectionProps {
//   selectedArtistId: string;
//   setSelectedArtistId: (artistId: string) => void;
//   currentUserArtists: Artist[];
//   isDarkMode: boolean;
//   isArtistContext: boolean;
//   isEditMode: boolean;
// }

// export const ArtistSection: React.FC<ArtistSectionProps> = ({
//   selectedArtistId,
//   setSelectedArtistId,
//   currentUserArtists,
//   isDarkMode,
//   isArtistContext,
//   isEditMode
// }) => {
//   // Only show artist selection for new events and when not in artist context
//   if (isEditMode || isArtistContext) {
//     return null;
//   }

//   return (
//     <div className="mb-4">
//       <label htmlFor="artistId" className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
//         Artist/Band
//       </label>
//       <select
//         id="artistId"
//         value={selectedArtistId}
//         onChange={(e) => setSelectedArtistId(e.target.value)}
//         className={`w-full px-3 py-2 border rounded-md appearance-none
//           ${isDarkMode 
//             ? 'bg-slate-700 border-slate-600 text-white focus:border-orange-500' 
//             : 'bg-white border-slate-300 text-slate-900 focus:border-orange-500'}
//           focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors`}
//         required
//       >
//         <option value="">Personal Event</option>
//         {currentUserArtists.map((artist) => (
//           <option key={artist.id} value={artist.id}>
//             {artist.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };
