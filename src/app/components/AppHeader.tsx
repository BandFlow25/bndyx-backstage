//path: src/app/components/AppHeader.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BndyLogo } from 'bndy-ui';
import { useAuth } from 'bndy-ui';
import { UserProfile } from 'bndy-types';
import { Menu, X, LogIn, LogOut, User, Bug, X as CloseIcon } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

// Interface for decoded token data
interface DecodedToken {
  uid: string;
  email?: string;
  roles?: string[];
  displayName?: string | null;
  photoURL?: string | null;
  godMode?: boolean;
  exp: number;
  iat?: number;
  [key: string]: any;
}

export function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDebugPopup, setShowDebugPopup] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<DecodedToken | null>(null);
  const { currentUser, signOut, getAuthToken } = useAuth() as {
    currentUser: UserProfile | null;
    signOut: () => Promise<void>;
    getAuthToken: () => Promise<string | null>;
  };
  
  // Only admin users should see the debug icon
  // Using type assertion to avoid TypeScript errors
  const isAdmin = currentUser?.roles?.includes('admin') || false;
  const hasGodMode = Array.isArray(currentUser?.roles) && 
    (currentUser?.roles?.includes('GODMODE') || false);
  const showDebugIcon = isAdmin || hasGodMode;
  
  // Load token info when debug popup is opened
  useEffect(() => {
    if (showDebugPopup) {
      try {
        // Use getAuthToken from useAuth hook instead of direct localStorage access
        getAuthToken().then((token: string | null) => {
          if (token) {
            const decoded = jwtDecode<DecodedToken>(token);
            setTokenInfo(decoded);
          }
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        setTokenInfo(null);
      }
    }
  }, [showDebugPopup]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <BndyLogo className="h-8 w-auto" color="#f97316" holeColor='#ffffff' />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              href="/" 
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-orange-500"
            >
              Home
            </Link>
            <Link 
              href="https://bndy.live" 
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-orange-500"
            >
              Discover
            </Link>
            <Link 
              href="https://backstage.bndy.co.uk" 
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-orange-500"
            >
              Manage
            </Link>
            <Link 
              href="/about" 
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-orange-500"
            >
              About
            </Link>

            {currentUser ? (
              <div className="flex items-center ml-4">
                {/* Debug icon - only shown for admin/godMode users */}
                {showDebugIcon && (
                  <button
                    onClick={() => setShowDebugPopup(true)}
                    className="flex items-center justify-center mr-3 p-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                    title="Authentication Debug"
                  >
                    <Bug size={22} className="text-orange-500" />
                  </button>
                )}
                
                <Link
                  href="/account"
                  className="flex items-center justify-center mr-3 p-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <User 
                    size={22} 
                    fill="#FFD700" 
                    color="#FFD700" 
                    className="filter drop-shadow-sm" 
                  />
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors"
                >
                  <LogOut size={16} className="mr-1" />
                  Sign out
                </button>
              </div>
            ) : (
              <a
                href="https://localhost:3001/login?returnTo=http%3A%2F%2Flocalhost%3A3002"
                target="_self"
                className="block py-2 px-4 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <div className="flex items-center">
                  <LogIn size={16} className="mr-1" />
                  <span>Log In</span>
                </div>
              </a>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-slate-500 hover:text-slate-700"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
            <Link 
              href="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-orange-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="https://bndy.live" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-orange-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Discover
            </Link>
            <Link 
              href="https://backstage.bndy.co.uk" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-orange-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Manage
            </Link>
            <Link 
              href="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-orange-500"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            
            {currentUser ? (
              <>
                <Link 
                  href="/account"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-orange-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User 
                    size={20} 
                    fill="#FFD700" 
                    color="#FFD700" 
                    className="mr-2 filter drop-shadow-sm" 
                  />
                  Account
                </Link>
                <button 
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full mt-2 flex items-center justify-center px-3 py-2 rounded-md text-base font-medium text-white bg-orange-500 hover:bg-orange-600"
                >
                  <LogOut size={16} className="mr-1" />
                  Sign out
                </button>
              </>
            ) : (
              <a 
                href="https://localhost:3001/login?returnTo=http%3A%2F%2Flocalhost%3A3002"
                target="_self"
                onClick={() => setIsMenuOpen(false)}
                className="w-full mt-2 block"
              >
                <div className="flex items-center justify-center px-3 py-2 rounded-md text-base font-medium text-white bg-orange-500 hover:bg-orange-600">
                  <LogIn size={16} className="mr-1" />
                  Sign in
                </div>
              </a>
            )}
          </div>
        </div>
      )}
      
      {/* Debug Popup */}
      {showDebugPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Authentication Debug</h3>
              <button 
                onClick={() => setShowDebugPopup(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <CloseIcon size={20} />
              </button>
            </div>
            
            <div className="p-4 overflow-auto max-h-[calc(90vh-130px)]">
              {tokenInfo ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium mb-2">User Information</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        <p><strong>UID:</strong> {tokenInfo.uid}</p>
                        <p><strong>Email:</strong> {tokenInfo.email || 'Not set'}</p>
                        <p><strong>Display Name:</strong> {tokenInfo.displayName || 'Not set'}</p>
                        <p><strong>Expires:</strong> {new Date(tokenInfo.exp * 1000).toLocaleString()}</p>
                        <p><strong>Expires In:</strong> {((tokenInfo.exp * 1000 - Date.now()) / 1000 / 60).toFixed(2)} minutes</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Roles & Permissions</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        <p><strong>Roles:</strong></p>
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-24">
                          {JSON.stringify(tokenInfo.roles, null, 2) || 'None'}
                        </pre>
                        <p className="mt-2"><strong>GodMode:</strong> {tokenInfo.godMode === true ? 'Yes' : 'No'}</p>
                        <p><strong>Properties:</strong> {Object.keys(tokenInfo).join(', ')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Full Token Contents</h4>
                    <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-60">
                      {JSON.stringify(tokenInfo, null, 2)}
                    </pre>
                  </div>
                  
                  <div className="mt-4 flex justify-end gap-2">
                    <button 
                      onClick={async () => {
                        // Use signOut from useAuth hook instead of direct localStorage access
                        await signOut();
                        window.location.reload();
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Clear Token & Reload
                    </button>
                    <button 
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Refresh Page
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No token information available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
