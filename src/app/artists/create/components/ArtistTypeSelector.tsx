'use client';

import React from 'react';
import { RadioButton } from 'bndy-ui';
import { Music } from 'lucide-react';

interface ArtistTypeSelectorProps {
  artistType: 'solo' | 'band';
  setArtistType: (type: 'solo' | 'band') => void;
}

export const ArtistTypeSelector: React.FC<ArtistTypeSelectorProps> = ({
  artistType,
  setArtistType
}) => {
  return (
    <div className="mb-6">
      <label className="text-sm font-medium mb-2 flex items-center">
        <Music className="mr-2 h-5 w-5 text-indigo-500" />
        Artist Type
      </label>
      <div className="flex space-x-4">
        <RadioButton
          id="artist-type-band"
          name="artist-type"
          value="band"
          checked={artistType === 'band'}
          onChange={() => setArtistType('band')}
          label="Band"
        />
        <RadioButton
          id="artist-type-solo"
          name="artist-type"
          value="solo"
          checked={artistType === 'solo'}
          onChange={() => setArtistType('solo')}
          label="Solo Artist"
        />
      </div>
    </div>
  );
};
