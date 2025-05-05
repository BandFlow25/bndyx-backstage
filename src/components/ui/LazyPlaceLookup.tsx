'use client';

import React, { useState, useEffect } from 'react';
import { PlaceLookup } from 'bndy-ui';
import { GoogleMapsProvider } from 'bndy-ui';

interface LazyPlaceLookupProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  id?: string;
  types?: string[];
  country?: string;
}

/**
 * LazyPlaceLookup - A wrapper component that lazy loads the Google Maps API
 * only when the component is rendered, to prevent unnecessary API loading
 * on pages where place lookup isn't needed.
 */
const LazyPlaceLookup: React.FC<LazyPlaceLookupProps> = (props) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Get the API key from environment variables
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    setApiKey(key);
    setIsLoading(false);

    if (!key) {
      console.warn("LazyPlaceLookup: No Google Maps API key found in environment variables");
      setErrorMessage("Location search unavailable");
    }
  }, []);

  if (isLoading) {
    return (
      <div className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
        Loading location search...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <input
        type="text"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder || "Enter location manually"}
        className={`w-full p-2 border border-gray-300 rounded-md ${props.className || ""}`}
        id={props.id}
      />
    );
  }

  return (
    <GoogleMapsProvider apiKey={apiKey}>
      <PlaceLookup {...props} />
    </GoogleMapsProvider>
  );
};

export { LazyPlaceLookup };
