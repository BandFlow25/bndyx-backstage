"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';

const DashboardPage = () => {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white border-b border-slate-800 pb-4">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-700">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">👤</span>
              <h2 className="text-xl font-semibold text-cyan-500">Profile</h2>
            </div>
            <p className="text-slate-300 mb-4 h-16">Manage your artist, band, or venue profile information.</p>
            <Link 
              href="/profile" 
              className="text-orange-500 hover:text-orange-400 font-medium inline-flex items-center bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
            >
              View Profile <span className="ml-1">→</span>
            </Link>
          </div>
          
          {/* Calendar Card */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-700">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">📅</span>
              <h2 className="text-xl font-semibold text-cyan-500">Calendar</h2>
            </div>
            <p className="text-slate-300 mb-4 h-16">Manage your gigs, practice sessions, and other events.</p>
            <Link 
              href="/calendar" 
              className="text-orange-500 hover:text-orange-400 font-medium inline-flex items-center bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
            >
              View Calendar <span className="ml-1">→</span>
            </Link>
          </div>
          
          {/* Setlists Card */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-700">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">📝</span>
              <h2 className="text-xl font-semibold text-cyan-500">Setlists</h2>
            </div>
            <p className="text-slate-300 mb-4 h-16">Create and manage your setlists with drag-and-drop functionality.</p>
            <Link 
              href="/setlist" 
              className="text-orange-500 hover:text-orange-400 font-medium inline-flex items-center bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
            >
              View Setlists <span className="ml-1">→</span>
            </Link>
          </div>
          
          {/* Playbook Card */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-700">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">📚</span>
              <h2 className="text-xl font-semibold text-cyan-500">Playbook</h2>
            </div>
            <p className="text-slate-300 mb-4 h-16">Manage your songs with notes, chord charts, and lyrics.</p>
            <Link 
              href="/playbook" 
              className="text-orange-500 hover:text-orange-400 font-medium inline-flex items-center bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
            >
              View Playbook <span className="ml-1">→</span>
            </Link>
          </div>
          
          {/* Events Card */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-700">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">🎭</span>
              <h2 className="text-xl font-semibold text-cyan-500">Events</h2>
            </div>
            <p className="text-slate-300 mb-4 h-16">Create and manage your public events for the bndy.live platform.</p>
            <Link 
              href="/events" 
              className="text-orange-500 hover:text-orange-400 font-medium inline-flex items-center bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Manage Events <span className="ml-1">→</span>
            </Link>
          </div>
          
          {/* Vacancies Card */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-700">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">🔍</span>
              <h2 className="text-xl font-semibold text-cyan-500">Vacancies</h2>
            </div>
            <p className="text-slate-300 mb-4 h-16">Find musicians or advertise positions in your band.</p>
            <Link 
              href="/vacancies" 
              className="text-orange-500 hover:text-orange-400 font-medium inline-flex items-center bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
            >
              View Vacancies <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
        
        <div className="mt-10 bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">⚡</span>
            <h2 className="text-xl font-semibold text-cyan-500">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link 
              href="/events/new" 
              className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg text-center transition-colors font-medium shadow-md flex items-center justify-center"
            >
              <span className="mr-2">🎭</span> Add New Event
            </Link>
            <Link 
              href="/setlist/new" 
              className="bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-4 rounded-lg text-center transition-colors font-medium shadow-md flex items-center justify-center"
            >
              <span className="mr-2">📝</span> Create Setlist
            </Link>
            <Link 
              href="/songs/new" 
              className="bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg text-center transition-colors font-medium shadow-md flex items-center justify-center"
            >
              <span className="mr-2">🎵</span> Add Song
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
