'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from 'bndy-ui';
import { useArtist } from '@/lib/context/artist-context';
import { useTheme } from '@/lib/context/theme-context';
import { ArtistService } from '@/lib/services/artist-service';
import { CreateArtistData, MusicGenre, getAvailableMusicGenres, UserProfile } from 'bndy-types';
import { validateSocialMediaUrl } from '@/lib/utils/social-media-utils';
import { MapPin, InfoIcon, Check, X } from 'lucide-react';
import Link from 'next/link';
import { PlaceLookup, BndyLoadingScreen } from 'bndy-ui';
// Now importing from main entry point since types are properly exported
import type { SocialMediaLink } from 'bndy-ui';

// Import our modular components
import {
  ArtistTypeSelector,
  GenreSelector,
  ImageUploader,
  MusicTypeSelector,
  NameAvailabilityChecker,
  SocialMediaSelector
} from './components';

// Get available genres from the shared utility function
const AVAILABLE_GENRES = getAvailableMusicGenres();

const CreateArtistPage = () => {
  const { currentUser } = useAuth() as { currentUser: UserProfile | null };
  const { refreshArtists } = useArtist();
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [name, setName] = useState('');
  const [hometown, setHometown] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<MusicGenre[]>([]);
  
  // New form state for artist type, multiple formats, and covers/originals
  const [artistType, setArtistType] = useState<'solo' | 'band'>('band');
  const [enableMultipleFormats, setEnableMultipleFormats] = useState<boolean>(false);
  const [musicType, setMusicType] = useState<string[]>([]); // Changed to array for multiple selection of covers/originals
  
  // Social media links
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLink[]>([]);
  
  // UI state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [headerPreview, setHeaderPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);
  const [isCheckingName, setIsCheckingName] = useState(false);

  // Handle genre selection
  const handleGenreToggle = (genre: MusicGenre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // Handle image uploads
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeaderFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeaderPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Check if artist name is available
  const handleCheckName = async () => {
    if (!name) return;
    
    try {
      setIsCheckingName(true);
      const isAvailable = await ArtistService.isNameAvailable(name);
      setNameAvailable(isAvailable);
    } catch (err) {
      console.error('Error checking name availability:', err);
      setNameAvailable(null);
    } finally {
      setIsCheckingName(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to create an artist');
      return;
    }
    
    if (selectedGenres.length === 0) {
      setError('Please select at least one genre');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Create artist data
      const artistData: CreateArtistData = {
        name,
        hometown,
        genres: selectedGenres,
        description,
        // Add new fields
        artistType,
        enableMultipleFormats,
        musicType, // Allow empty array if neither option is selected
        socialMedia: socialMediaLinks.reduce((obj, link) => {
          // Handle backward compatibility for twitter/x
          if (link.platform === 'x') {
            obj.twitter = link.url; // Keep for backward compatibility
            obj.x = link.url;
          } else {
            obj[link.platform] = link.url;
          }
          return obj;
        }, {} as Record<string, string>)
      };
      
      // Create artist in Firestore
      const artist = await ArtistService.createArtist(
        artistData,
        currentUser.uid,
        currentUser.displayName || 'Unknown User',
        currentUser.email || 'unknown@example.com'
      );
      
      // Upload avatar if provided
      if (avatarFile) {
        await ArtistService.uploadAvatarImage(artist.id, avatarFile);
      }
      
      // Upload header image if provided
      if (headerFile) {
        await ArtistService.uploadHeaderImage(artist.id, headerFile);
      }
      
      // Refresh artists in context
      await refreshArtists();
      
      // Redirect to artist page
      router.push(`/artists/${artist.id}`);
    } catch (err) {
      console.error('Error creating artist:', err);
      setError('Failed to create artist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return <BndyLoadingScreen />;
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Artist</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Set up your artist profile to start managing your events and performances.
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md flex items-start">
            <InfoIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-6">
                <div className="relative">
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Artist/Band Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setNameAvailable(null);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  {name.length > 0 && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {isCheckingName ? (
                        <div className="h-5 w-5 border-2 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
                      ) : nameAvailable === true ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : nameAvailable === false ? (
                        <X className="h-5 w-5 text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>
                {name.length > 0 && !isCheckingName && (
                  <div className="mt-1 flex items-center">
                    {nameAvailable === true ? (
                      <p className="text-sm text-green-600">This name is available!</p>
                    ) : nameAvailable === false ? (
                      <p className="text-sm text-red-600">This name is already taken. Please try another.</p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCheckName}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        Check availability
                      </button>
                    )}
                  </div>
                )}
              </div>
              </div>
              
              <div className="mb-6">
                <label className="flex items-center text-sm font-medium mb-2">
                  <MapPin className="mr-2 h-5 w-5 text-indigo-500" />
                  Hometown
                </label>
                <PlaceLookup
                  value={hometown}
                  onChange={setHometown}
                  placeholder="Enter hometown"
                  className="w-full"
                  label="Hometown"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Tell us about your artist/band..."
                />
              </div>
              
              <ArtistTypeSelector
                artistType={artistType}
                setArtistType={setArtistType}
              />
              
              <MusicTypeSelector
                musicType={musicType}
                setMusicType={setMusicType}
                enableMultipleFormats={enableMultipleFormats}
                setEnableMultipleFormats={setEnableMultipleFormats}
              />
            </div>
            
            <div>
              <GenreSelector
                availableGenres={AVAILABLE_GENRES}
                selectedGenres={selectedGenres}
                handleGenreToggle={handleGenreToggle}
              />
              
              <SocialMediaSelector
                socialMediaLinks={socialMediaLinks}
                setSocialMediaLinks={setSocialMediaLinks}
              />
              
              <ImageUploader
                title="Artist Avatar"
                imagePreview={avatarPreview}
                handleImageChange={handleAvatarChange}
                inputRef={avatarInputRef as React.RefObject<HTMLInputElement>}
                aspectRatio="w-full h-40"
              />
              
              <ImageUploader
                title="Header Image"
                imagePreview={headerPreview}
                handleImageChange={handleHeaderChange}
                inputRef={headerInputRef as React.RefObject<HTMLInputElement>}
                aspectRatio="w-full h-32"
              />
            </div>
          </div>
          
          <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link 
              href="/artists" 
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading || nameAvailable === false}
            >
              Create Artist
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateArtistPage;
