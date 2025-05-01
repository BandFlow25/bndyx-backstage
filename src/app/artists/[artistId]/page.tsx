'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { BndySpinner, ErrorBoundary, ApiErrorBoundary } from 'bndy-ui';
import { useAuth } from 'bndy-ui';
import { useArtist } from '@/lib/context/artist-context';
import { ArtistService } from '@/lib/services/artist-service';
import { Artist, ArtistMember, UserProfile } from 'bndy-types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Import the new components
import ArtistProfileHeader from '@/components/artists/backstage/ArtistProfileHeader';
import QuickLinks from '@/components/artists/backstage/QuickLinks';

const ArtistDetailPage = () => {
  const params = useParams();
  const artistId = params.artistId as string;
  const { currentUser } = useAuth() as { currentUser: UserProfile | null };
  const { refreshArtists } = useArtist();
  const router = useRouter();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const fetchArtist = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const artistData = await ArtistService.getArtistById(artistId);
        
        if (!artistData) {
          setError('Artist not found');
          return;
        }
        
        setArtist(artistData);
        
        // Check if current user is owner or member
        if (artistData.members && artistData.members.length > 0) {
          const currentUserMember = artistData.members.find(member => member.userId === currentUser.uid);
          setIsMember(!!currentUserMember);
          setIsOwner(currentUserMember?.role === 'owner');
        }
      } catch (err) {
        console.error('Error fetching artist:', err);
        setError('Failed to load artist data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtist();
  }, [artistId, currentUser]);
  
  const handleDeleteArtist = async () => {
    if (!currentUser || !isOwner || !artist) return;
    
    try {
      const confirmed = window.confirm(`Are you sure you want to delete ${artist.name}? This action cannot be undone.`);
      
      if (confirmed) {
        await ArtistService.deleteArtist(artistId);
        refreshArtists();
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Error deleting artist:', err);
      alert('Failed to delete artist. Please try again.');
    }
  };

  return (
    <MainLayout>
      <ErrorBoundary>
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <BndySpinner label="Loading artist details" />
            </div>
          ) : error ? (
            <div className="bg-red-900/20 dark:bg-red-900/30 border border-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg">
              <p>{error}</p>
              <Link 
                href="/artists" 
                className="mt-4 inline-block px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors duration-300"
              >
                Back to Artists
              </Link>
            </div>
          ) : artist ? (
            <>
              {/* Artist Profile Header - Using the new component */}
              <ApiErrorBoundary 
                onRetry={() => window.location.reload()} 
                fallbackComponent={
                  <div className="p-4 bg-red-100 text-red-800 rounded-md">
                    <p>Error loading artist data: An error occurred when loading the artist profile</p>
                  </div>
                }
              >
                <ArtistProfileHeader 
                  artist={artist} 
                  artistId={artistId} 
                  isOwner={isOwner} 
                  onDeleteArtist={handleDeleteArtist} 
                />
              </ApiErrorBoundary>
              
              {/* Artist Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Links - Using the new component */}
                <ErrorBoundary>
                  <QuickLinks artistId={artistId} />
                </ErrorBoundary>
                
                {/* Quick Stats - Using the existing component */}
                <ErrorBoundary>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-300">Band Members</h2>
                    
                    {artist && artist.members && artist.members.length > 0 ? (
                      <div className="space-y-4">
                        {artist.members.map((member, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mr-3 transition-colors duration-300">
                              <span className="text-slate-700 dark:text-slate-300 font-medium transition-colors duration-300">{member.displayName.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white transition-colors duration-300">{member.displayName}</p>
                              <p className="text-sm text-[var(--text-secondary)]">{member.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[var(--text-secondary)]">No members added yet</p>
                    )}
                  </div>
                </ErrorBoundary>
              </div>
            </>
          ) : null}
        </div>
      </ErrorBoundary>
    </MainLayout>
  );
};

export default ArtistDetailPage;
