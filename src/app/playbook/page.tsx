"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ArtistRequired from '@/components/ArtistRequired';
import { useArtist } from '@/lib/context/artist-context';
import { BookOpen, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function Playbook() {
  const { currentArtist } = useArtist();

  return (
    <MainLayout>
      <ArtistRequired>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-orange-500 mr-3" />
              <h1 className="text-2xl font-semibold text-white">
                {currentArtist?.name} Playbook
              </h1>
            </div>
            <Link 
              href="/playbook/new" 
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              <PlusCircle size={18} />
              Add Song
            </Link>
          </div>
          
          {/* Playbook content */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="text-center py-8">
              <BookOpen className="h-16 w-16 mx-auto text-slate-500 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Your Playbook is Empty</h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Add songs to your playbook to keep track of your repertoire and create setlists for your performances.
              </p>
              <Link 
                href="/playbook/new" 
                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Your First Song
              </Link>
            </div>
          </div>
        </div>
      </ArtistRequired>
    </MainLayout>
  );
}
