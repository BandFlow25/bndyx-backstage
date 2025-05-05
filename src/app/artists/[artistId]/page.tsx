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
import { Music, Calendar, Users, AlertTriangle } from 'lucide-react';

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
  const [loadingRetries, setLoadingRetries] = useState(0);

  useEffect(() => {
    const fetchArtist = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        setError(null);
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
        
        // Retry logic (max 3 attempts)
        if (loadingRetries < 3) {
          setTimeout(() => {
            setLoadingRetries(prev => prev + 1);
          }, 1000);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtist();
  }, [artistId, currentUser, loadingRetries]);
  
  const handleDeleteArtist = async () => {
    if (!currentUser || !isOwner || !artist) return;
    
    try {
      const confirmed = window.confirm(`Are you sure you want to delete ${artist.name}? This action cannot be undone.`);
      
      if (confirmed) {
        setLoading(true);
        await ArtistService.deleteArtist(artistId);
        refreshArtists();
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Error deleting artist:', err);
      setLoading(false);
      setError('Failed to delete artist. Please try again.');
    }
  };

  // Function to retry loading the artist data
  const handleRetry = () => {
    setLoadingRetries(0); // Reset retry counter
    setLoading(true); // Start loading again
  };

  return (
    <MainLayout>
      <ErrorBoundary>
        <div className="max-w-6xl mx-auto px-4 py-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <BndySpinner label="Loading artist details" />
            </div>
          ) : error ? (
            <div className="bg-red-900/20 dark:bg-red-900/30 border border-red-900 text-red-700 dark:text-red-200 p-6 rounded-lg flex flex-col items-center">
              <AlertTriangle className="h-12 w-12 mb-4 text-red-500" />
              <h2 className="text-xl font-bold mb-2 text-red-700 dark:text-red-200">Error Loading Artist</h2>
              <p className="mb-4 text-center">{error}</p>
              <div className="flex space-x-4">
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
                >
                  Try Again
                </button>
                <Link 
                  href="/artists" 
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors duration-300"
                >
                  Back to Artists
                </Link>
              </div>
            </div>
          ) : artist ? (
            <>
              {/* Artist Profile Header - Using the new component */}
              <ApiErrorBoundary 
                onRetry={() => window.location.reload()} 
                fallbackComponent={
                  <div className="p-6 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg flex items-center space-x-3 mb-6">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <p>Error loading artist profile data. Please try again.</p>
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
                
                {/* Band Members Section */}
                <ErrorBoundary>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
                    <div className="flex items-center mb-4">
                      <Users className="h-5 w-5 mr-2 text-orange-500" />
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-300">Band Members</h2>
                    </div>
                    
                    {artist && artist.members && artist.members.length > 0 ? (
                      <div className="space-y-4">
                        {artist.members.map((member, index) => (
                          <div key={index} className="flex items-center p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-200">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mr-3 transition-colors duration-300">
                              <span className="text-slate-700 dark:text-slate-300 font-medium transition-colors duration-300">{member.displayName ? member.displayName.charAt(0) : '?'}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-900 dark:text-white transition-colors duration-300">{member.displayName || 'Unknown Member'}</p>
                              <p className="text-sm text-[var(--text-secondary)]">
                                {member.role === 'owner' ? 'Band Leader' : 
                                 member.role === 'admin' ? 'Administrator' : 'Member'}
                              </p>
                            </div>
                            {member.instruments && member.instruments.length > 0 && (
                              <div className="text-xs text-[var(--text-secondary)]">
                                {member.instruments.join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Users className="h-12 w-12 text-slate-400 dark:text-slate-600 mb-3" />
                        <p className="text-[var(--text-secondary)]">No members added yet</p>
                        {isOwner && (
                          <Link 
                            href={`/artists/${artistId}/members`}
                            className="mt-3 text-sm text-orange-500 hover:text-orange-600 transition-colors duration-200"
                          >
                            Add band members
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </ErrorBoundary>

                {/* Upcoming Events Section */}
                <ErrorBoundary>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
                    <div className="flex items-center mb-4">
                      <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-300">Upcoming Events</h2>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <Calendar className="h-12 w-12 text-slate-400 dark:text-slate-600 mb-3" />
                      <p className="text-[var(--text-secondary)]">No upcoming events</p>
                      {isOwner && (
                        <Link 
                          href={`/artists/${artistId}/calendar`}
                          className="mt-3 text-sm text-orange-500 hover:text-orange-600 transition-colors duration-200"
                        >
                          Schedule an event
                        </Link>
                      )}
                    </div>
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
