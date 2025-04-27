"use client";

import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from 'bndy-ui/components/auth';
import { useArtist } from '@/lib/context/artist-context';
import { ArtistService } from '@/lib/services/artist-service';

// Import dashboard components
import MyDashboard from '@/components/dashboard/MyDashboard';
import EmptyArtistState from '@/components/dashboard/EmptyArtistState';

// Define a custom JWT payload type for our token
interface BndyJwtPayload {
  uid: string;
  email?: string;
  displayName?: string | null;
  photoURL?: string | null;
  roles?: string[] | string;
  godMode?: boolean;
  godmode?: boolean;
  GODMODE?: boolean;
  GodMode?: boolean;
  exp: number;
  iat?: number;
  [key: string]: any; // Allow for additional properties
}

import { BndyLoadingScreen, ErrorBoundary, ApiErrorBoundary } from 'bndy-ui';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { currentUserArtists, currentArtist, artistLoading, artistError, refreshArtists, hasLoadedArtists, hasActiveArtist, setCurrentArtistById } = useArtist();

  // Debug information
  const [debugInfo, setDebugInfo] = useState({
    currentUserLoaded: false,
    tokenExists: false,
    artistLoadAttempted: false,
    artistLoadSucceeded: false,
    directArtistCallMade: false, // Track if we've already made a direct artist call
    directArtistCallComplete: false, // Track if the direct call is complete
    tokenPayload: null as BndyJwtPayload | null,
    tokenError: null as string | null,
    tokenForceRefresh: false, // Whether we've triggered a page refresh to fix auth
    errors: [] as string[]
  });

  // Enable/disable debug logging
  const DEBUG = true;
  const logDebug = (message: string, ...args: any[]) => {
    if (DEBUG) {
      // Dashboard debug logging removed
    }
  };

  // Focused dashboard initialization with token extraction
  useEffect(() => {
    logDebug(`Dashboard mounted, authenticated: ${!!currentUser}`);
    
    // Check for token and try to extract information
    const token = typeof window !== 'undefined' ? localStorage.getItem('bndyAuthToken') : null;
    const tokenExists = !!token;
    
    // Extract token information if it exists but currentUser isn't set
    let extractedPayload: BndyJwtPayload | null = null;
    let extractError: string | null = null;

    if (token && !currentUser) {
      try {
        extractedPayload = jwtDecode<BndyJwtPayload>(token);
        logDebug('Token decoded in dashboard for emergency use');
      } catch (err) {
        extractError = err instanceof Error ? err.message : 'Unknown token decode error';
        logDebug('Failed to decode token:', extractError);
      }
    }
    
    // Only refresh artists if we haven't loaded them yet
    if (currentUser && !hasLoadedArtists && !artistLoading) {
      logDebug('User authenticated and artists not loaded, refreshing artists');
      refreshArtists();
    }

    // Store debug info 
    setDebugInfo(prev => ({
      ...prev,
      currentUserLoaded: !!currentUser,
      tokenExists,
      tokenPayload: extractedPayload || prev.tokenPayload,
      tokenError: extractError
    }));
    
    // IMPORTANT: Do not force page reloads to prevent dashboard loading loops
    // Instead of refreshing, we'll log diagnostic information
    if (token && !currentUser && !debugInfo.tokenForceRefresh && extractedPayload) {
      logDebug('Found token but no currentUser - not forcing refresh to prevent loading loops');
      setDebugInfo(prev => ({
        ...prev,
        tokenForceRefresh: true,
        errors: [...prev.errors, 'Token exists but currentUser not authenticated - possible auth error']
      }));
      
      // Log token expiration information to help diagnose issues
      if (extractedPayload.exp) {
        const now = Math.floor(Date.now() / 1000);
        const expiresIn = extractedPayload.exp - now;
        logDebug(`Token expires in ${expiresIn} seconds (${new Date(extractedPayload.exp * 1000).toLocaleString()})`);
      }
    }
  }, [currentUser, currentUserArtists, artistLoading, refreshArtists, debugInfo.tokenForceRefresh]);

  // Handle artist loading
  // Only refresh artists once after login, using hasLoadedArtists
  useEffect(() => {
    if (currentUser && !hasLoadedArtists && !artistLoading) {
      logDebug('User authenticated and artists not loaded, refreshing artists');
      setDebugInfo(prev => ({
        ...prev,
        currentUserLoaded: true,
        artistLoadAttempted: true
      }));
      refreshArtists();
    }
    // Only attempt direct artist loading once to prevent infinite loops
    else if (!currentUser && debugInfo.tokenPayload && !artistLoading && currentUserArtists.length === 0 && !debugInfo.directArtistCallMade) {
      logDebug('Token exists but currentUser state is not set - attempting direct loading');
      setDebugInfo(prev => ({
        ...prev,
        errors: [...prev.errors, 'Token exists but currentUser state is not set - using fallback approach'],
        directArtistCallMade: true
      }));
      logDebug(`Trying fallback artist loading for currentUser: ${debugInfo.tokenPayload.uid}`);
      ArtistService.getArtistsByUserId(debugInfo.tokenPayload.uid)
        .then(directArtists => {
          logDebug(`Direct artist loading success: ${directArtists.length} artists found`);
          setDebugInfo(prev => ({
            ...prev,
            artistLoadSucceeded: true,
            directArtistCallComplete: true
          }));
        })
        .catch(err => {
          logDebug(`Direct artist loading failed: ${err.message || err}`);
          setDebugInfo(prev => ({
            ...prev,
            errors: [...prev.errors, `Direct artist loading failed: ${err.message || 'Unknown error'}`],
            directArtistCallComplete: true
          }));
        });
    }
  }, [currentUser, hasLoadedArtists, artistLoading, debugInfo.tokenPayload, currentUserArtists.length, debugInfo.directArtistCallMade, refreshArtists]);

  useEffect(() => {
    if (currentUserArtists.length > 0) {
      // Artists loaded successfully
      setDebugInfo(prev => ({
        ...prev,
        artistLoadSucceeded: true
      }));
    }
  }, [currentUserArtists.length]);

  // Add a safety timeout for artist loading
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (artistLoading) {
      timeout = setTimeout(() => {
        // Artist loading safety timeout triggered
        setDebugInfo(prev => ({
          ...prev,
          errors: [...prev.errors, 'Artist loading timed out after 10 seconds']
        }));
      }, 10000); // 10 second timeout
    }
    
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [artistLoading]);

    // No component definitions needed here as they've been moved to separate files
  
  if (artistLoading) {
    return <BndyLoadingScreen label="Loading your artists…" />;
  }

  return (
    <MainLayout>
      <ErrorBoundary>
        <div className="container mx-auto px-4 py-6">
        {/* Debug Info - Shown during development to help troubleshoot */}
        {!currentUser && (
          <div className="mb-4 p-4 bg-yellow-800 rounded-lg text-white">
            <h3 className="text-lg font-bold mb-2">Authentication Debug Panel</h3>
            <p className="mb-2">User state is not set, but you reached the dashboard.</p>
            <div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                <div><strong>User Loaded:</strong> {debugInfo.currentUserLoaded ? '✅' : '❌'}</div>
                <div><strong>Token Exists:</strong> {debugInfo.tokenExists ? '✅' : '❌'}</div>
                <div><strong>Artist Load Attempted:</strong> {debugInfo.artistLoadAttempted ? '✅' : '❌'}</div>
                <div><strong>Artist Load Succeeded:</strong> {debugInfo.artistLoadSucceeded ? '✅' : '❌'}</div>
              </div>
              
              {/* Token Payload Information */}
              {debugInfo.tokenPayload && (
                <div className="mt-2 border-t border-gray-200 pt-2">
                  <h4 className="font-medium">Token Payload</h4>
                  <div className="mt-1 overflow-auto max-h-48 bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono text-gray-900 dark:text-gray-200">
                    <pre>{JSON.stringify(debugInfo.tokenPayload, null, 2)}</pre>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                    <div><strong>UID:</strong> {debugInfo.tokenPayload.uid}</div>
                    <div><strong>Email:</strong> {debugInfo.tokenPayload.email}</div>
                    <div><strong>Display Name:</strong> {debugInfo.tokenPayload.displayName}</div>
                    <div><strong>GodMode:</strong> {typeof debugInfo.tokenPayload.godMode !== 'undefined' ? (debugInfo.tokenPayload.godMode ? '✅' : '❌') : 'Not set'}</div>
                    <div className="col-span-2">
                      <strong>Roles:</strong> {Array.isArray(debugInfo.tokenPayload.roles) ? 
                        debugInfo.tokenPayload.roles.map((role: string) => (
                          <span key={role} className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-1.5 py-0.5 rounded mr-1 mb-1">{role}</span>
                        ))
                      : 'No roles array found'}
                    </div>
                  </div>
                </div>
              )}
              
              {(artistError || debugInfo.errors.length > 0) && (
                <div className="mt-2">
                  <strong className="text-red-500">Errors:</strong>
                  <ul className="mt-1 text-sm text-red-500 list-disc list-inside">
                    {artistError && <li>{artistError}</li>}
                    {debugInfo.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-4 flex space-x-2">
              <button 
                onClick={() => refreshArtists()}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-sm transition-colors"
              >
                Refresh Artists
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('bndyAuthToken');
                  window.location.reload();
                }}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
              >
                Clear Token & Reload
              </button>
            </div>
          </div>
        )}
        
        {/* Show authentication warning if token is recognized but currentUser context isn't set */}
        {!currentUser && debugInfo.directArtistCallComplete ? (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md transition-colors duration-300">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Authentication Warning</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Your authentication token was recognized, but the currentUser context couldn't be properly initialized. 
              Some features may be limited. Consider logging out and logging back in.
            </p>
            <button 
              onClick={() => {
                localStorage.removeItem('bndyAuthToken');
                window.location.href = process.env.NEXT_PUBLIC_LANDING_URL || 'https://bndy.rocks';
              }}
              className="mt-2 px-3 py-1 text-xs bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-700 transition-colors duration-300"
            >
              Clear Token & Logout
            </button>
          </div>
        ) : null}
        
        {/* Main Dashboard Content */}
        {artistLoading ? (
          // Loading state
          <div className="flex justify-center items-center h-64 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : artistError ? (
          // Error state
          <div className="bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100 p-6 rounded-lg border border-red-200 dark:border-red-800 transition-colors duration-300">
            <h3 className="font-medium text-xl">Error loading artists</h3>
            <p className="mt-2">{artistError}</p>
            <button 
              onClick={() => refreshArtists()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300"
            >
              Retry
            </button>
          </div>
        ) : !artistLoading && currentUserArtists.length === 0 ? (
          // No artists state
          <EmptyArtistState />
        ) : (
          // Show the new dashboard layout
          <ApiErrorBoundary onRetry={() => refreshArtists()}>
            <MyDashboard artists={currentUserArtists} />
          </ApiErrorBoundary>
        )}
      </div>
      </ErrorBoundary>
    </MainLayout>
  );
}
