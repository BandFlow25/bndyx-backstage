"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from 'bndy-ui';
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
  
  // Dashboard section items
  const dashboardItems: NavItem[] = [
    { 
      label: 'My Dashboard', 
      href: '/dashboard', 
      icon: <Home className="h-5 w-5" />
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
    { 
      label: 'My Artists', 
      href: '/artists', 
      icon: <Music className="h-5 w-5" />
    },
  ];
  
  // Backstage section items - only shown when an artist is selected
  const backstageItems = currentArtist ? [
    {
      label: `${currentArtist.name}`,
      href: `/artists/${currentArtist.id}/dashboard`,
      icon: <Music className="h-5 w-5 text-orange-500" />
    },
    {
      label: 'Playbook',
      href: `/artists/${currentArtist.id}/playbook`,
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      label: 'Calendar',
      href: `/artists/${currentArtist.id}/calendar`,
      icon: <Calendar className="h-5 w-5" />
    },
    {
      label: 'Songs',
      href: `/artists/${currentArtist.id}/songs`,
      icon: <FileMusic className="h-5 w-5" />
    },
    {
      label: 'Members',
      href: `/artists/${currentArtist.id}/members`,
      icon: <Users className="h-5 w-5" />
    }
  ] : [];

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
      <div className="flex-1 overflow-y-auto pt-16 px-3">
        
        {/* Dashboard Section */}
        <div className="mb-6">
          <nav>
            <ul className="space-y-2 md:space-y-3">
              {dashboardItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboard' && pathname?.startsWith(item.href) && !pathname?.includes('/dashboard'));
                
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md transition-colors duration-300 ${isActive ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}
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
        
        {/* Backstage Section - Only shown when an artist is selected */}
        {currentArtist && backstageItems.length > 0 && (
          <div className="mb-6">
            <div className="px-3 py-2 text-base font-semibold text-orange-500 uppercase tracking-wider flex items-center">
              <Music className="h-4 w-4 mr-2" />
              Backstage
            </div>
            <nav>
              <ul className="space-y-2 md:space-y-3">
                {backstageItems.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href);
                  
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={`flex items-center px-3 py-2 rounded-md transition-colors duration-300 ${isActive ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}
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
        )}
      </div>
      
      <div className="mt-auto pt-6">
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
          <div className="flex flex-col space-y-2">
            <div className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
              &copy; {new Date().getFullYear()} bndy
            </div>
            <div className="text-xs font-medium text-[var(--text-secondary)] transition-colors duration-300">
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