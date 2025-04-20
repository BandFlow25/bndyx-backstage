"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import BndyLogo from '../logo/bndylogo';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-slate-900 text-white py-3 px-6 flex justify-between items-center border-b border-slate-800 shadow-md">
      <div className="flex items-center">
        <Link href="/dashboard" className="flex items-center hover:opacity-90 transition-opacity">
          <BndyLogo className="h-8 w-auto" />
          <span className="text-xl font-bold ml-2 text-white">core</span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-slate-300">
              {user.profileType === 'band' && <span className="text-green-500 mr-1">🎸</span>}
              {user.profileType === 'artist' && <span className="text-green-500 mr-1">🎤</span>}
              {user.profileType === 'venue' && <span className="text-cyan-500 mr-1">🏢</span>}
              {user.displayName}
            </span>
            
            {user.photoURL && (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'User'} 
                className="w-10 h-10 rounded-full border-2 border-orange-500 shadow-md"
              />
            )}
          </div>
        ) : (
          <Link 
            href="https://bndy.co.uk/login" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md font-medium"
          >
            Log In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;