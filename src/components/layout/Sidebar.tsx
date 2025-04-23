"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from 'bndy-ui/components/auth';
import { useArtist } from '@/lib/context/artist-context';
import BndyLogo from '../logo/bndylogo';
import { Home, Music, User, Calendar, BookOpen, ListMusic, FileMusic, Theater, Users, Search, ChevronDown, ChevronUp, LogOut } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
  requiresArtist?: boolean;
}

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, signOut } = useAuth();
  const { currentArtist, currentUserArtists, setCurrentArtistById, clearCurrentArtist, hasActiveArtist } = useArtist();
  const [artistSelectorOpen, setArtistSelectorOpen] = useState(false);
  
  const navItems: NavItem[] = [
    { 
      label: 'Dashboard', 
      href: '/dashboard', 
      icon: <Home className="h-5 w-5" />
    },
    { 
      label: 'My Artists', 
      href: '/artists', 
      icon: <Music className="h-5 w-5" />
    },
    { 
      label: 'My Profile', 
      href: '/profile', 
      icon: <User className="h-5 w-5" />
    },
    { 
      label: 'My Calendar', 
      href: '/calendar', 
      icon: <Calendar className="h-5 w-5" />
    },
  ];
  
  // Add artist dashboard link if an artist is selected
  const artistDashboardItem = currentArtist ? {
    label: `${currentArtist.name} Dashboard`,
    href: `/artists/${currentArtist.id}/dashboard`,
    icon: <Music className="h-5 w-5 text-orange-500" />
  } : null;

  // All items are shown by default since we're using proper role-based auth in the routes

  // Create the final navigation items list, including the artist dashboard if available
  const finalNavItems = artistDashboardItem 
    ? [...navItems, artistDashboardItem]
    : navItems;

  // Handle artist selection
  const handleSelectArtist = (artistId: string) => {
    setCurrentArtistById(artistId);
    setArtistSelectorOpen(false);
    // Redirect to dashboard after selecting an artist
    router.push('/dashboard');
  };

  // Handle clearing artist selection
  const handleClearArtist = () => {
    clearCurrentArtist();
    setArtistSelectorOpen(false);
    // Redirect to dashboard after clearing artist
    router.push('/dashboard');
  };

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/signin');
  };
  
  return (
    <div className="h-full w-64 bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="text-lg font-semibold text-slate-900 dark:text-white transition-colors duration-300">Navigation</div>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {/* Active Artist Selector */}
        {currentUserArtists.length > 0 && (
          <div className="mb-6">
            <div 
              className="flex items-center justify-between p-2 rounded-md bg-slate-100 dark:bg-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-300"
              onClick={() => setArtistSelectorOpen(!artistSelectorOpen)}
            >
              <div className="flex items-center">
                {currentArtist ? (
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center mr-2 transition-colors duration-300">
                      <Music className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white transition-colors duration-300">
                      {currentArtist ? currentArtist.name : 'Select Artist'}
                    </div>
                  </div>
                ) : (
                  <span className="text-orange-500 dark:text-orange-400 font-medium transition-colors duration-300">Select Artist</span>
                )}
              </div>
              {artistSelectorOpen ? <ChevronUp size={16} className="text-slate-500 dark:text-slate-300" /> : <ChevronDown size={16} className="text-slate-500 dark:text-slate-300" />}
            </div>
            
            {/* Artist Dropdown */}
            {artistSelectorOpen && (
              <div className="mt-2 py-1 bg-white dark:bg-slate-700 rounded-md shadow-lg border border-slate-200 dark:border-slate-600 transition-colors duration-300">
                {currentUserArtists.map(artist => (
                  <div 
                    key={artist.id}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-300 ${currentArtist?.id === artist.id ? 'bg-slate-200 dark:bg-slate-600' : ''}`}
                    onClick={() => handleSelectArtist(artist.id)}
                  >
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
                    <span className="truncate text-slate-900 dark:text-white transition-colors duration-300">{artist.name}</span>
                    {currentArtist?.id === artist.id && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-orange-500"></span>
                    )}
                  </div>
                ))}
                
                {currentArtist && (
                  <div 
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center transition-colors duration-300 border-t border-slate-200 dark:border-slate-600"
                    onClick={handleClearArtist}
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Clear Selection</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        <nav>
          <ul className="space-y-2 md:space-y-3">
            {finalNavItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname?.startsWith(item.href));
              
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md transition-colors duration-300 ${isActive ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className="font-medium text-sm md:text-base">{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-orange-500"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      
      <div className="mt-auto pt-6">
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
          <div className="flex flex-col space-y-2">
            <div className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
              &copy; {new Date().getFullYear()} bndy
            </div>
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300">
              Keeping <span className="text-cyan-500">LIVE</span> Music <span className="text-orange-500">ALIVE</span>
            </div>
            
            <button 
              onClick={handleSignOut}
              className="mt-2 w-full flex items-center justify-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-md transition-colors duration-300 text-sm"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;