"use client";

import React, { ReactNode, useState, useMemo, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import ThinFooter from './ThinFooter';
import Sidebar from './Sidebar';
import { useAuth } from 'bndy-ui/components/auth';
// Auth context import logging removed
import BndyLogo from '../logo/bndylogo';
import { BndyLoadingScreen } from 'bndy-ui';
import { Menu, X } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { currentUser, isLoading, signOut } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Add targeted debug logging
  const logFlow = (message: string, ...args: any[]) => {
    // Auth flow logging removed
  };
  
  // Monitor authentication state with improved safety mechanisms
  React.useEffect(() => {
    logFlow(`MainLayout: auth state changed - currentUser:${!!currentUser}, isLoading:${isLoading}`);
    
    // CRITICAL FIX: Never trigger automatic refreshes in MainLayout
    // This prevents the isLoading loop by letting auth-context handle auth properly
    if (!isLoading && !currentUser) {
      const token = localStorage.getItem('bndyAuthToken');
      if (token) {
        logFlow('MainLayout: Token exists but no currentUser - not forcing refresh to prevent loops');
        // Instead of refreshing, we'll rely on the auth-context's recovery mechanisms
      }
    }
  }, [currentUser, isLoading]);
  
  // Ultra-safe isLoading escape mechanism that never triggers a page refresh
  const [forceLoaded, setForceLoaded] = useState(false);
  const [safetyTriggered, setSafetyTriggered] = useState(false);
  
  React.useEffect(() => {
    // Reset safety trigger when auth state changes meaningfully
    if (!isLoading || currentUser) {
      setSafetyTriggered(false);
    }
    
    // If we're in a isLoading state, set a short timeout to force render
    if (isLoading && !forceLoaded && !safetyTriggered) {
      const startTime = Date.now();
      logFlow('MainLayout: Setting safety timeout for UI rendering');
      
      // Log token status for debugging
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('bndyAuthToken');
        if (token) {
          logFlow(`MainLayout: Token found in localStorage: ${token.substring(0, 10)}...`);
        } else {
          logFlow('MainLayout: No token in localStorage');
        }
      }
      
      // Short timeout that just forces the UI to render without refresh
      const safetyTimeout = setTimeout(() => {
        if (isLoading && !forceLoaded) {
          const duration = Date.now() - startTime;
          logFlow(`MainLayout: Safety timeout triggered after ${duration}ms - forcing UI to render`);
          
          // CRITICAL: Always set forceLoaded without refresh
          setForceLoaded(true);
          setSafetyTriggered(true);
        }
      }, 1500); // Shorter timeout for better UX
      
      return () => clearTimeout(safetyTimeout);
    }
  }, [isLoading, forceLoaded, currentUser, safetyTriggered]);

  // Show isLoading state with a clean UI
  const showLoading = isLoading && !forceLoaded;
  
  // DEBUG: Add token info to isLoading screen using client-side only approach
  const [tokenInfo, setTokenInfo] = useState<string | null>(null);
  
  // Only check localStorage on the client side after initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('bndyAuthToken');
      if (!token) {
        setTokenInfo('No token found');
      } else {
        setTokenInfo(`Token exists (${token.substring(0, 10)}...)`);
      }
    }
  }, [isLoading]);
  
  if (showLoading) {
    // Use branded, theme-aware loading screen
    // Optionally pass tokenInfo as a label for debug builds
    return <BndyLoadingScreen label={tokenInfo || 'Loading...'} />;
  }

  // If not authenticated, show login screen with debug panel if token exists
  // Also show this if we were force-loaded but don't have a currentUser
  if (!currentUser || (forceLoaded && !currentUser)) {
    const token = localStorage.getItem('bndyAuthToken');
    
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col text-slate-900 dark:text-white transition-colors duration-300">
        <Header />
        {token && (
          <div className="mx-auto max-w-md w-full mt-4 p-4 bg-yellow-800 rounded-lg text-white">
            <h3 className="text-lg font-bold mb-2">Authentication Debug Panel</h3>
            <p className="mb-2">Token exists in localStorage but currentUser is not authenticated.</p>
            <p className="mb-2">This indicates a potential issue with token processing.</p>
            <div className="flex gap-2 justify-center">
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md">
                Reload Page
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('bndyAuthToken');
                  window.location.reload();
                }} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md">
                Clear Token & Reload
              </button>
            </div>
          </div>
        )}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl transition-colors duration-300">
            <div className="mb-6">
              <BndyLogo className="h-16 w-auto mx-auto" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">Artist, Venue and Studio Management Platform</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg">Please log in to access the platform for bands, artists, and venues.</p>
            <a 
              href="https://localhost:3001/login?returnTo=http%3A%2F%2Flocalhost%3A3002%2Fdashboard"
              target="_self"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition-colors font-medium text-lg shadow-md"
              onClick={() => {
                // Login button clicked, redirecting to auth service
              }}
            >
              Log In
            </a>
            <p className="mt-6 text-sm text-slate-400">Keeping <span className="text-cyan-500">LIVE</span> music <span className="text-orange-500">ALIVE</span></p>
          </div>
        </div>
      </div>
    );
  }

  // Main layout with sidebar for authenticated currentUser
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col text-slate-900 dark:text-white transition-colors duration-300">
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="flex flex-1 relative">
        
        {/* Sidebar - hidden on mobile unless toggled */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 fixed md:static top-0 left-0 h-full z-40 md:z-auto`}>
          <Sidebar />
        </div>
        
        {/* Overlay when sidebar is open on mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-white dark:bg-slate-900 w-full pb-16">
          {children}
        </main>
      </div>
      
      {/* Add ThinFooter */}
      <ThinFooter />
    </div>
  );
};

export default MainLayout;
