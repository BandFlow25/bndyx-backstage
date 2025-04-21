'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { BndySpinner } from 'bndy-ui';
import { useAuth } from 'bndy-ui/components/auth';
import { useArtist } from '@/lib/context/artist-context';
import { ArtistService } from '@/lib/services/artist-service';
import { Artist, MusicGenre, ArtistMember } from 'bndy-types';
import MemberManagement from '@/components/artists/MemberManagement';
import SocialMediaLinks from '@/components/artists/SocialMediaLinks';
import { Music, MapPin, Users, Calendar, Edit, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

import { useParams } from 'next/navigation';

const ArtistDetailPage = () => {
  const params = useParams();
  const artistId = params.artistId as string;
  const { currentUser } = useAuth();
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
        
        // Check if currentUser is owner or member
        const currentUserMember = artistData && artistData.members.find((member: ArtistMember, idx: number) => member.userId === currentUser.uid);
        setIsMember(!!currentUserMember);
        setIsOwner(currentUserMember?.role === 'owner' || false);
        
        // If currentUser is not a member, redirect to artists page
        if (!currentUserMember) {
          router.push('/artists');
        }
      } catch (err) {
        console.error('Error fetching artist:', err);
        setError('Failed to load artist details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [artistId, currentUser, router]);



  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <BndySpinner />
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded-lg">
            <p>{error}</p>
            <Link 
              href="/artists" 
              className="mt-4 inline-block px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Back to Artists
            </Link>
          </div>
        ) : artist ? (
          <>
            {/* Artist Header */}
            <div className="relative mb-8">
              <div className="h-48 md:h-64 bg-slate-800 rounded-t-lg overflow-hidden">
                {artist.headerImageUrl ? (
                  <img 
                    src={artist.headerImageUrl} 
                    alt={artist.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-orange-500/20 to-cyan-500/20">
                    <Music className="h-16 w-16 text-slate-700" />
                  </div>
                )}
              </div>
              
              <div className="bg-slate-800 rounded-b-lg border-t border-slate-700 p-6 pb-4">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-shrink-0 -mt-16 md:-mt-20 mb-4 md:mb-0 z-10">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-slate-800 overflow-hidden bg-slate-700">
                      {artist.avatarUrl ? (
                        <img 
                          src={artist.avatarUrl} 
                          alt={artist.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-orange-500">
                          <Music className="h-12 w-12 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-white mb-1">{artist.name}</h1>
                        <div className="flex items-center text-slate-300 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{artist.hometown}</span>
                        </div>
                      </div>
                      
                      {isOwner && (
                        <div className="flex space-x-3 mt-3 md:mt-0">
                          <Link 
                            href={`/artists/${artistId}/edit`}
                            className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                          <button 
                            className="px-4 py-2 bg-red-900/30 text-red-300 rounded-lg hover:bg-red-900/50 transition-colors flex items-center"
                            onClick={() => {
                              // Show confirmation dialog before deleting
                              if (window.confirm('Are you sure you want to delete this artist? This action cannot be undone.')) {
                                // Delete artist and redirect to artists page
                                ArtistService.deleteArtist(artistId)
                                  .then(() => {
                                    refreshArtists();
                                    router.push('/artists');
                                  })
                                  .catch(err => {
                                    console.error('Error deleting artist:', err);
                                    setError('Failed to delete artist. Please try again.');
                                  });
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 my-3">
                      {artist && (artist.genres ?? []).map((genre: MusicGenre, index: number) => (
                        <span 
                          key={index} 
                          className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-slate-300 mb-4">{artist.description}</p>
                    
                    <SocialMediaLinks socialMedia={artist.socialMedia ?? {}} size="medium" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Artist Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Members */}
              <div className="md:col-span-3">
                <MemberManagement artist={artist} />
              </div>
              
              {/* Quick Links */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 md:col-span-2">
                <h2 className="text-xl font-bold text-white mb-4">Manage Your Band</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link 
                    href={`/artists/${artistId}/songs`}
                    className="bg-slate-700 hover:bg-slate-600 p-4 rounded-lg transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-orange-500/20 flex items-center justify-center mb-3 transition-colors">
                      <Music className="h-6 w-6 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">Songs</h3>
                    <p className="text-slate-400 text-sm">Manage your song library</p>
                  </Link>
                  
                  <Link 
                    href={`/artists/${artistId}/events`}
                    className="bg-slate-700 hover:bg-slate-600 p-4 rounded-lg transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-orange-500/20 flex items-center justify-center mb-3 transition-colors">
                      <Calendar className="h-6 w-6 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">Events</h3>
                    <p className="text-slate-400 text-sm">Manage your gigs and events</p>
                  </Link>
                  
                  <Link 
                    href={`/artists/${artistId}/members`}
                    className="bg-slate-700 hover:bg-slate-600 p-4 rounded-lg transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-orange-500/20 flex items-center justify-center mb-3 transition-colors">
                      <Users className="h-6 w-6 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">Members</h3>
                    <p className="text-slate-400 text-sm">Manage your band members</p>
                  </Link>
                </div>
              </div>
              
              {/* Stats */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h2 className="text-xl font-bold text-white mb-4">Band Stats</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-1">Members</h3>
                    <p className="text-2xl font-bold text-white">{artist.members?.length || 0}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-1">Songs</h3>
                    <p className="text-2xl font-bold text-white">0</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-1">Upcoming Events</h3>
                    <p className="text-2xl font-bold text-white">0</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default ArtistDetailPage;
