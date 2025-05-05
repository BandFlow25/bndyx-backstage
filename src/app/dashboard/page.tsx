"use client";

import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from 'bndy-ui';
import { UserProfile } from 'bndy-types';
import { useArtist } from '@/lib/context/artist-context';
import { ErrorBoundary, ApiErrorBoundary, BndyLoadingScreen } from 'bndy-ui';
import EmptyArtistState from '@/components/dashboard/EmptyArtistState';
import MyDashboard from '@/components/dashboard/MyDashboard';
import { useTheme } from '@/lib/context/theme-context';
import DashboardCards from '@/components/dashboard/DashboardCards';
import CalendarView from '@/components/dashboard/CalendarView';
import ArtistCards from '@/components/dashboard/ArtistCards';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Collapsible section component
const CollapsibleSection = ({ 
  title, 
  defaultCollapsed = false,
  children 
}: {
  title: string;
  defaultCollapsed?: boolean;
  children: React.ReactNode;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  
  return (
    <div className="mb-4">
      <div 
        className="flex items-center cursor-pointer px-4 py-2"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? 
          <ChevronRight className="h-5 w-5 text-slate-500 mr-2" /> : 
          <ChevronDown className="h-5 w-5 text-slate-500 mr-2" />
        }
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
      </div>
      
      {!isCollapsed && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const { currentUser, signOut } = useAuth() as { currentUser: UserProfile | null; signOut: () => Promise<void> };
  const { 
    currentUserArtists, 
    currentArtist, 
    artistLoading, 
    artistError, 
    refreshArtists, 
    hasLoadedArtists, 
    hasActiveArtist, 
    setCurrentArtistById 
  } = useArtist();
  const { isDarkMode } = useTheme();

  // Simple debug state
  const [debugInfo, setDebugInfo] = useState({
    errors: [] as string[]
  });

  // Enable/disable debug logging
  const DEBUG = true;
  const logDebug = (message: string, ...args: any[]) => {
    if (DEBUG) {
      console.log(`[Dashboard] ${message}`, ...args);
    }
  };

  // Initialize dashboard and load artists when authenticated 
  useEffect(() => {
    logDebug(`Dashboard mounted, authenticated: ${!!currentUser}`);
    
    // Log detailed auth state
    if (currentUser) {
      logDebug('Auth details:', { 
        uid: currentUser.uid,
        email: currentUser.email,
        roles: currentUser.roles,
        hasToken: !!currentUser
      });
    } else {
      logDebug('Not authenticated. URL:', window.location.href);
      // Check if there's a code in the URL that might not have been processed
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get('code');
      if (authCode) {
        logDebug(`Found unprocessed auth code in URL: ${authCode.substring(0, 5)}...`);
      }
    }
    
    // Only refresh artists if we haven't loaded them yet
    if (currentUser && !hasLoadedArtists && !artistLoading) {
      logDebug('User authenticated and artists not loaded, refreshing artists');
      refreshArtists();
    }
  }, [currentUser, hasLoadedArtists, artistLoading, refreshArtists]);

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

  if (artistLoading) {
    return <BndyLoadingScreen label="Loading your artists…" />;
  }

  return (
    <MainLayout>
      <ErrorBoundary>
        <div className="container mx-auto px-0 py-3 bg-white dark:bg-slate-900 transition-colors duration-300">
          {/* Error display */}
          {(artistError || debugInfo.errors.length > 0) && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
              <h3 className="font-medium text-red-800 dark:text-red-200">Errors</h3>
              <ul className="mt-1 text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                {artistError && <li>{artistError}</li>}
                {debugInfo.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* No action buttons here - they were removed as they weren't part of the refactoring */}
          
          {/* Main Dashboard Content */}
          {!currentUser ? (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">Please log in to view your dashboard.</p>
            </div>
          ) : currentUserArtists.length === 0 ? (
            <EmptyArtistState />
          ) : (
            <MyDashboard 
              artists={currentUserArtists}
            />
          )}
      </div>
      </ErrorBoundary>
    </MainLayout>
  );
}
