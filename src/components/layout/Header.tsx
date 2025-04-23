"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from 'bndy-ui/components/auth';
import { useArtist } from '@/lib/context/artist-context';
import { useTheme } from '@/lib/context/theme-context';
import BndyLogo from '../logo/bndylogo';
import { ShieldCheck, User, LogOut, ChevronDown, Menu, X, Sun, Moon } from 'lucide-react';

const Header: React.FC<{ toggleSidebar?: () => void, sidebarOpen?: boolean }> = ({ toggleSidebar, sidebarOpen }) => {
  const router = useRouter();
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

              
            {/* Artist Selector Dropdown - Only visible if user has artists */}
            {currentUserArtists.length > 0 && (
              <div className="relative ml-4">
                <button 
                  onClick={() => setArtistDropdownOpen(!artistDropdownOpen)}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                >
                  {currentArtist ? (
                    <>
                      {currentArtist.name}
                      <ChevronDown size={16} className="ml-1" />
                    </>
                  ) : (
                    <>
                      Select Artist
                      <ChevronDown size={16} className="ml-1" />
                    </>
                  )}
                </button>

                {/* Artist Dropdown Menu */}
                {artistDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <div className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                        Select Artist/Band
                      </div>
                      
                      {currentUserArtists.map(artist => (
                        <button
                          key={artist.id}
                          onClick={() => handleSelectArtist(artist.id)}
                          className={`w-full text-left px-4 py-2 text-sm ${currentArtist?.id === artist.id 
                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' 
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                          role="menuitem"
                        >
                          <div className="flex items-center">
                            {artist.avatarUrl ? (
                              <img 
                                src={artist.avatarUrl} 
                                alt={artist.name} 
                                className="h-6 w-6 rounded-full mr-2 object-cover"
                              />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center mr-2">
                                <span className="text-white text-xs font-medium">{artist.name.charAt(0)}</span>
                              </div>
                            )}
                            <span>{artist.name}</span>
                          </div>
                        </button>
                      ))}
                      
                      {currentArtist && (
                        <button
                          onClick={handleClearArtist}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-t border-slate-200 dark:border-slate-700"
                          role="menuitem"
                        >
                          <div className="flex items-center text-slate-500 dark:text-slate-400">
                            <LogOut size={14} className="mr-2" />
                            <span>Clear Selection</span>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                )}
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
