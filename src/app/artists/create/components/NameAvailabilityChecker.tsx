'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface NameAvailabilityCheckerProps {
  name: string;
  nameAvailable: boolean | null;
  isCheckingName: boolean;
  handleCheckName: () => Promise<void>;
}

export const NameAvailabilityChecker: React.FC<NameAvailabilityCheckerProps> = ({
  name,
  nameAvailable,
  isCheckingName,
  handleCheckName
}) => {
  return (
    <div className="mb-6">
      <label htmlFor="name" className="block text-sm font-medium mb-2">
        Artist/Band Name <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        {name.length > 0 && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isCheckingName ? (
              <div className="h-5 w-5 border-2 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
            ) : nameAvailable === true ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : nameAvailable === false ? (
              <X className="h-5 w-5 text-red-500" />
            ) : null}
          </div>
        )}
      </div>
      {name.length > 0 && !isCheckingName && (
        <div className="mt-1 flex items-center">
          {nameAvailable === true ? (
            <p className="text-sm text-green-600">This name is available!</p>
          ) : nameAvailable === false ? (
            <p className="text-sm text-red-600">This name is already taken. Please try another.</p>
          ) : (
            <button
              type="button"
              onClick={handleCheckName}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Check availability
            </button>
          )}
        </div>
      )}
    </div>
  );
};
