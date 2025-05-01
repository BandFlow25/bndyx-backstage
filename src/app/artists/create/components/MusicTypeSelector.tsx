'use client';

import React from 'react';
import { Checkbox } from 'bndy-ui';

interface MusicTypeSelectorProps {
  musicType: string[];
  setMusicType: (types: string[]) => void;
  enableMultipleFormats: boolean;
  setEnableMultipleFormats: (enable: boolean) => void;
}

export const MusicTypeSelector: React.FC<MusicTypeSelectorProps> = ({
  musicType,
  setMusicType,
  enableMultipleFormats,
  setEnableMultipleFormats
}) => {
  const handleMusicTypeToggle = (type: string) => {
    if (musicType.includes(type)) {
      setMusicType(musicType.filter(t => t !== type));
    } else {
      setMusicType([...musicType, type]);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">
        Music Type
      </label>
      <div className="space-y-2">
        <div className="flex items-center">
          <Checkbox
            id="music-type-covers"
            checked={musicType.includes('covers')}
            onChange={() => handleMusicTypeToggle('covers')}
            label="Covers"
          />
        </div>
        <div className="flex items-center">
          <Checkbox
            id="music-type-originals"
            checked={musicType.includes('originals')}
            onChange={() => handleMusicTypeToggle('originals')}
            label="Originals"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center">
          <Checkbox
            id="enable-multiple-formats"
            checked={enableMultipleFormats}
            onChange={() => setEnableMultipleFormats(!enableMultipleFormats)}
            label="This artist performs in multiple formats (e.g. acoustic, full band)"
          />
        </div>
      </div>
    </div>
  );
};
