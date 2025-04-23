"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from 'bndy-ui/components/auth';
import { ArtistService } from '@/lib/services/artist-service';
import { Artist } from 'bndy-types';

interface ArtistContextType {
  currentArtist: Artist | null;
  artistLoading: boolean;
  artistError: string | null;
  currentUserArtists: Artist[];
  setCurrentArtistById: (artistId: string) => Promise<void>;
  refreshArtists: () => Promise<void>;
}

interface ArtistContextType {
  currentArtist: Artist | null;
  artistLoading: boolean;
  artistError: string | null;
  currentUserArtists: Artist[];
  setCurrentArtistById: (artistId: string) => Promise<void>;
  clearCurrentArtist: () => void;
  refreshArtists: () => Promise<void>;
  hasLoadedArtists: boolean;
  hasActiveArtist: boolean;
}

const ArtistContext = createContext<ArtistContextType>({
  currentArtist: null,
  artistLoading: true,
  artistError: null,
  currentUserArtists: [],
  setCurrentArtistById: async () => {},
  clearCurrentArtist: () => {},
  refreshArtists: async () => {},
  hasLoadedArtists: false,
  hasActiveArtist: false,
});

export const useArtist = () => useContext(ArtistContext);

export const ArtistProvider = ({ children }: { children: ReactNode }) => {
  const [hasLoadedArtists, setHasLoadedArtists] = useState(false);
  const { currentUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [currentArtist, setCurrentArtist] = useState<Artist | null>(null);
  const [currentUserArtists, setUserArtists] = useState<Artist[]>([]);
  const [artistLoading, setArtistLoading] = useState(true);
  const [artistError, setArtistError] = useState<string | null>(null);

  // Add targeted debug logging
  const logArtist = (message: string, ...args: any[]) => {
    // Artist flow logging removed
  };

  // Load currentUser's artists when authenticated
  useEffect(() => {
    // Skip if no currentUser or already loading
    if (!currentUser) {
      logArtist('No currentUser available, skipping artist loading');
      setArtistLoading(false);
      return;
    }

    logArtist('User authenticated, loading artists for currentUser:', currentUser.uid);
    
    // Add a safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      if (artistLoading) {
        logArtist('Safety timeout triggered - forcing artist loading to complete');
        setArtistLoading(false);
        setArtistError('Loading timed out. Please refresh the page.');
      }
    }, 5000); // Reduced to 5 second timeout

    const loadUserArtists = async () => {
      const startTime = Date.now();
      try {
        logArtist('Setting artistLoading to true');
        setArtistLoading(true);
        logArtist(`Fetching artists for currentUser: ${currentUser.uid}`);
        const artists = await ArtistService.getArtistsByUserId(currentUser.uid);
        logArtist(`Fetched ${artists.length} artists in ${Date.now() - startTime}ms`);
        setUserArtists(artists);
        setHasLoadedArtists(true);
        setArtistLoading(false);
        
        // Check if we're on an artist-specific page
        if (pathname && pathname.startsWith('/artists/') && pathname !== '/artists/create') {
          const artistId = pathname.split('/')[2];
          
          // Only set current artist if it belongs to the currentUser
          const matchingArtist = artists.find(a => a.id === artistId);
          if (matchingArtist) {
            setCurrentArtist(matchingArtist);
          }
        }
        // Remove auto-selection of first artist to enforce explicit selection
        // This ensures user must explicitly choose an artist
        
        setArtistError(null);
      } catch (err) {
        logArtist('Error loading artists');
        setArtistError('Failed to load your artists. Please try refreshing the page.');
      } finally {
        logArtist(`Artist loading completed in ${Date.now() - startTime}ms`);
        setArtistLoading(false);
        setHasLoadedArtists(true);
        clearTimeout(safetyTimeout);
      }
    }

    loadUserArtists();

    return () => {
      clearTimeout(safetyTimeout);
    }
  }, [currentUser, pathname]);

  // Set current artist by ID
  const setCurrentArtistById = useCallback(async (artistId: string) => {
    try {
      setArtistLoading(true);
      
      // First check if the artist is in the currentUser's list
      let artist = currentUserArtists.find(a => a.id === artistId);
      
      // If not found in the cached list, try to fetch it
      if (!artist) {
        const fetchedArtist = await ArtistService.getArtistById(artistId);
        
        // Verify the currentUser is a member of this artist
        if (fetchedArtist && currentUser) {
          const isMember = fetchedArtist.members.some(member => member.userId === currentUser.uid);
          if (!isMember) {
            throw new Error('You are not a member of this artist');
          }
          artist = fetchedArtist;
        }
      }
      
      if (artist) {
        setCurrentArtist(artist);
        // Save selected artist ID to localStorage for persistence
        localStorage.setItem('bndyActiveArtistId', artist.id);
        setArtistError(null);
      } else {
        throw new Error('Artist not found');
      }
    } catch (err) {
      // Error handling silenced
      setArtistError('Failed to set current artist');
    } finally {
      setArtistLoading(false);
    }
  }, [currentUserArtists, currentUser]);
  
  // Clear current artist selection
  const clearCurrentArtist = useCallback(() => {
    setCurrentArtist(null);
    localStorage.removeItem('bndyActiveArtistId');
    logArtist('Cleared current artist selection');
  }, []);

  // Refresh the list of currentUser's artists
  const refreshArtists = useCallback(async () => {
    if (!currentUser) {
      logArtist('No currentUser available, cannot refresh artists');
      return;
    }
    
    logArtist(`Refreshing artists for currentUser: ${currentUser.uid}`);
    const startTime = Date.now();
    
    // Add a safety timeout for refresh operation
    const refreshTimeout = setTimeout(() => {
      if (artistLoading) {
        logArtist('Refresh timeout triggered - forcing loading to complete');
        setArtistLoading(false);
        setArtistError('Refresh operation timed out. Please try again.');
      }
    }, 5000); // Reduced to 5 second timeout
    
    try {
      logArtist('Setting artistLoading to true for refresh');
      setArtistLoading(true);
      logArtist(`Fetching updated artists for currentUser: ${currentUser.uid}`);
      const artists = await ArtistService.getArtistsByUserId(currentUser.uid);
      logArtist(`Fetched ${artists.length} updated artists`);
      setUserArtists(artists);
      
      // If current artist is set, refresh it with the latest data
      if (currentArtist) {
        logArtist('Updating current artist data');
        const updatedCurrentArtist = artists.find(a => a.id === currentArtist.id);
        if (updatedCurrentArtist) {
          setCurrentArtist(updatedCurrentArtist);
        } else {
          // If the current artist is no longer in the currentUser's list, reset it
          logArtist('Current artist no longer in list, resetting');
          setCurrentArtist(artists.length > 0 ? artists[0] : null);
        }
      }
      
      setArtistError(null);
    } catch (err) {
      logArtist('Error refreshing artists');
      setArtistError('Failed to refresh your artists. Please try again.');
    } finally {
      logArtist(`Artist refresh completed in ${Date.now() - startTime}ms`);
      setArtistLoading(false);
      setHasLoadedArtists(true);
      clearTimeout(refreshTimeout);
    }
  }, [currentUser, currentArtist]);

  // Compute whether there's an active artist
  const hasActiveArtist = !!currentArtist;

  return (
    <ArtistContext.Provider 
      value={{ 
        currentArtist, 
        artistLoading, 
        artistError, 
        currentUserArtists,
        setCurrentArtistById,
        clearCurrentArtist,
        refreshArtists,
        hasLoadedArtists,
        hasActiveArtist
      }}
    >
      {children}
    </ArtistContext.Provider>
  );
}
