"use client";

import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '@/lib/auth/auth-context';
import BndyLogo from '../logo/bndylogo';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-orange-500 border-r-cyan-500 border-b-orange-500 border-l-cyan-500 rounded-full animate-spin mx-auto"></div>
          <div className="mt-6 mb-2">
            <BndyLogo className="h-12 w-auto mx-auto" />
          </div>
          <p className="text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, only show header
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center bg-slate-800 p-8 rounded-lg shadow-xl">
            <div className="mb-6">
              <BndyLogo className="h-16 w-auto mx-auto" />
              <h2 className="text-2xl font-bold text-white mt-4">BAV Management Platform</h2>
            </div>
            <p className="text-slate-300 mb-8 text-lg">Please log in to access the platform for bands, artists, and venues.</p>
            <a 
              href="https://bndy.co.uk/login" 
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition-colors font-medium text-lg shadow-md"
            >
              Log In
            </a>
            <p className="mt-6 text-sm text-slate-400">Keeping <span className="text-cyan-500">LIVE</span> music <span className="text-orange-500">ALIVE</span></p>
          </div>
        </div>
      </div>
    );
  }

  // Main layout with sidebar for authenticated users
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
