"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from 'bndy-ui';
import { useArtist } from '@/lib/context/artist-context';
import { useTheme } from '@/lib/context/theme-context';
import BndyLogo from '../logo/bndylogo';
import { ShieldCheck, User, LogOut, ChevronDown, Menu, X, Sun, Moon } from 'lucide-react';

const Header: React.FC<{ toggleSidebar?: () => void, sidebarOpen?: boolean }> = ({ toggleSidebar, sidebarOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isLoading, signOut } = useAuth();
  const { currentArtist, currentUserArtists, setCurrentArtistById, clearCurrentArtist } = useArtist();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [artistDropdownOpen, setArtistDropdownOpen] = useState(false);
  
  // Add targeted debug logging
  const logUI = (message: string, ...args: any[]) => {
    // UI flow logging removed
  };
  
  // Monitor authentication state
  React.useEffect(() => {
    if (currentUser) {
      logUI(`Header: User authenticated - ${currentUser?.displayName || currentUser?.email} with roles: ${(currentUser.roles ?? []).join(', ')}`);
    } else {
      logUI('Header: No currentUser authenticated');
    }
  }, [currentUser]);
  
  // Check if currentUser has admin role
  const hasAdminRole = !!currentUser && Array.isArray(currentUser.roles) && (
    ((currentUser.roles as string[]) ?? []).includes('admin') ||
    ((currentUser.roles as string[]) ?? []).includes('bndy_admin') ||
    ((currentUser.roles as string[]) ?? []).includes('live_admin') ||
    ((currentUser.roles as string[]) ?? []).includes('live_builder')
  );

  // Handle artist selection
  const handleSelectArtist = (artistId: string) => {
    setCurrentArtistById(artistId);
    setArtistDropdownOpen(false);
    // Navigate to artist dashboard
    router.push(`/artists/${artistId}/dashboard`);
  };

  // Handle clearing artist selection
  const handleClearArtist = () => {
    clearCurrentArtist();
    setArtistDropdownOpen(false);
    router.push('/dashboard');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-0 sm:px-2 lg:px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo with dashboard link */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">  
              <BndyLogo 
                className="h-8 w-auto" 
                color="#f97316" 
                holeColor={isDarkMode ? '#0f172a' : '#ffffff'} 
              />
            </Link>
          </div>

          <div className="flex items-center">
            {/* Display current artist context if in artist backstage */}
            {currentArtist && pathname?.includes(`/artists/${currentArtist.id}`) && (
              <div className="ml-4 text-orange-500 font-medium">
                {currentArtist.name}
              </div>
            )}
              
            {/* User dropdown */}
            <div className="ml-4 relative flex-shrink-0">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  {/* Theme Toggle Button */}
                  <button
                    onClick={toggleTheme}
                    className="flex items-center justify-center p-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  >
                    {isDarkMode ? (
                      <Sun size={22} className="text-orange-500" />
                    ) : (
                      <Moon size={22} className="text-orange-500" />
                    )}
                  </button>
                  
                  {/* Admin icon - only visible for admin users */}
                  {hasAdminRole && (
                    <Link
                      href="/admin"
                      className="flex items-center justify-center p-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Admin Panel"
                    >
                      <ShieldCheck 
                        size={22} 
                        className="text-orange-500" 
                      />
                    </Link>
                  )}
                  
                  {/* User Profile */}
                  <div className="relative ml-3">
                    <div>
                      <button 
                        type="button"
                        className="flex items-center max-w-xs rounded-full bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
                        id="user-menu-button"
                        aria-expanded="false"
                        aria-haspopup="true"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                      >
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white">
                          {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Logout Button */}
                  <button 
                    onClick={signOut}
                    className="hidden md:flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors"
                  >
                    <LogOut size={16} className="mr-1" />
                    Sign out
                  </button>
                </div>
              ) : (
                <a 
                  href="https://localhost:3001/login?returnTo=http%3A%2F%2Flocalhost%3A3002"
                  target="_self"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors"
                >
                  Sign in
                </a>
              )}
              
              {/* Mobile menu button */}
              {currentUser && (
                <div className="md:hidden flex items-center ml-4">
                  {/* Mobile menu button */}
                  <div className="flex md:hidden">
                    <button
                      onClick={toggleSidebar || (() => setIsMenuOpen(!isMenuOpen))}
                      className="text-slate-400 hover:text-white focus:outline-none"
                      aria-label="Toggle menu"
                    >
                      {(toggleSidebar && sidebarOpen) || (!toggleSidebar && isMenuOpen) ? (
                        <X className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Menu className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
