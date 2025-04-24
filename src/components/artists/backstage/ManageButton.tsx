'use client';

import React from 'react';
import Link from 'next/link';
import { Settings } from 'lucide-react';

interface ManageButtonProps {
  artistId: string;
}

export const ManageButton = ({ artistId }: ManageButtonProps) => {
  return (
    <Link
      href={`/artists/${artistId}`}
      className="inline-flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
    >
      <Settings size={16} className="mr-2" />
      <span>Manage</span>
    </Link>
  );
};

export default ManageButton;
