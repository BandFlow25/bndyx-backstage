'use client';

import React from 'react';
import { Checkbox } from 'bndy-ui';
import { MusicGenre } from 'bndy-types';

interface GenreSelectorProps {
  availableGenres: MusicGenre[];
  selectedGenres: MusicGenre[];
  handleGenreToggle: (genre: MusicGenre) => void;
}

export const GenreSelector: React.FC<GenreSelectorProps> = ({
  availableGenres,
  selectedGenres,
  handleGenreToggle
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">
        Genres <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {availableGenres.map((genre) => (
          <div key={genre} className="flex items-center">
            <Checkbox
              id={`genre-${genre}`}
              checked={selectedGenres.includes(genre)}
              onChange={() => handleGenreToggle(genre)}
              label={genre}
            />
          </div>
        ))}
      </div>
      {selectedGenres.length === 0 && (
        <p className="text-sm text-red-500 mt-1">
          Please select at least one genre
        </p>
      )}
    </div>
  );
};
