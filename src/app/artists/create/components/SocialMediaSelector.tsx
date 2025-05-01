'use client';

import React from 'react';
import { SocialMediaInput } from 'bndy-ui';
import type { SocialMediaLink } from 'bndy-ui/components/ui/SocialMediaInput';

interface SocialMediaSelectorProps {
  socialMediaLinks: SocialMediaLink[];
  setSocialMediaLinks: (links: SocialMediaLink[]) => void;
}

export const SocialMediaSelector: React.FC<SocialMediaSelectorProps> = ({
  socialMediaLinks,
  setSocialMediaLinks
}) => {
  const handleSocialMediaChange = (links: SocialMediaLink[]) => {
    setSocialMediaLinks(links);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">
        Social Media Links
      </label>
      <SocialMediaInput
        links={socialMediaLinks}
        onChange={handleSocialMediaChange}
      />
    </div>
  );
};
