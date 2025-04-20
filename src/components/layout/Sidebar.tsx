"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import BndyLogo from '../logo/bndylogo';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: Array<'user' | 'profile_owner' | 'builder'>;
  profileTypes?: Array<'artist' | 'band' | 'venue' | undefined>;
}

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const navItems: NavItem[] = [
    { 
      label: 'Dashboard', 
      href: '/dashboard', 
      icon: '📊', 
      roles: ['user', 'profile_owner', 'builder']
    },
    { 
      label: 'Profile', 
      href: '/profile', 
      icon: '👤', 
      roles: ['profile_owner', 'builder']
    },
    { 
      label: 'Calendar', 
      href: '/calendar', 
      icon: '📅', 
      roles: ['profile_owner', 'builder']
    },
    { 
      label: 'Playbook', 
      href: '/playbook', 
      icon: '📚', 
      roles: ['profile_owner', 'builder'],
      profileTypes: ['artist', 'band']
    },
    { 
      label: 'Setlists', 
      href: '/setlist', 
      icon: '📝', 
      roles: ['profile_owner', 'builder'],
      profileTypes: ['artist', 'band']
    },
    { 
      label: 'Songs', 
      href: '/songs', 
      icon: '🎵', 
      roles: ['profile_owner', 'builder'],
      profileTypes: ['artist', 'band']
    },
    { 
      label: 'Events', 
      href: '/events', 
      icon: '🎭', 
      roles: ['profile_owner', 'builder']
    },
    { 
      label: 'Members', 
      href: '/members', 
      icon: '👥', 
      roles: ['profile_owner', 'builder'],
      profileTypes: ['band']
    },
    { 
      label: 'Vacancies', 
      href: '/vacancies', 
      icon: '🔍', 
      roles: ['user', 'profile_owner', 'builder']
    },
  ];

  // Filter nav items based on user role and profile type
  const filteredNavItems = navItems.filter(item => {
    // Check if user has required role
    if (!user || !item.roles.includes(user.role)) {
      return false;
    }
    
    // Check if item requires specific profile types
    if (item.profileTypes && user.profileType && 
        !item.profileTypes.includes(user.profileType)) {
      return false;
    }
    
    return true;
  });

  return (
    <aside className="bg-slate-800 text-white w-64 min-h-screen p-6 shadow-lg">
      <div className="mb-8 mt-2">
        <div className="flex items-center mb-2">
          <BndyLogo className="h-10 w-auto" />
        </div>
        <p className="text-sm font-medium text-slate-300">BAV Management Platform</p>
      </div>
      
      <nav>
        <ul className="space-y-3">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-all ${isActive 
                    ? 'bg-orange-500 text-white font-medium shadow-md' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-white"></span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="border-t border-slate-700 pt-4 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} bndy</p>
          <p className="mt-1 font-medium">Keeping <span className="text-cyan-500">LIVE</span> music <span className="text-orange-500">ALIVE</span></p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;