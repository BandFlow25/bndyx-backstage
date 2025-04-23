'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from 'bndy-ui/components/auth';
import { useArtist } from '@/lib/context/artist-context';
import { useTheme } from '@/lib/context/theme-context';
import { ArtistService } from '@/lib/services/artist-service';
import { CreateArtistData, Artist, MusicGenre, ArtistMember, getAvailableMusicGenres } from 'bndy-types';
import { validateSocialMediaUrl } from '@/lib/utils/social-media-utils';
import { Music, MapPin, Check, X, Upload, InfoIcon } from 'lucide-react';
import Link from 'next/link';
import { PlaceLookup, BndyLoadingScreen } from 'bndy-ui';
import { RadioButton } from 'bndy-ui/components/ui/RadioButton';
import { Checkbox } from 'bndy-ui/components/ui/Checkbox';
import { SocialMediaInput } from 'bndy-ui/components/ui/SocialMediaInput';
import type { SocialMediaLink } from 'bndy-ui/components/ui/SocialMediaInput';

// Get available genres from the shared utility function
const AVAILABLE_GENRES = getAvailableMusicGenres();

const CreateArtistPage = () => {
  const { currentUser } = useAuth();
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
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [spotify, setSpotify] = useState('');
  const [twitter, setTwitter] = useState('');
  const [youtube, setYoutube] = useState('');
  const [website, setWebsite] = useState('');
  
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
  const toggleGenre = (genre: MusicGenre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // Handle avatar image selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle header image selection
  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setHeaderFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setHeaderPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Check if artist name is available
  const checkNameAvailability = async () => {
    if (!name.trim()) return;
    
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
      
      // Create the artist
      const newArtist = await ArtistService.createArtist(
        artistData,
        currentUser.uid,
        currentUser.displayName || 'Unknown User',
        currentUser.email || 'unknown@example.com'
      );
      
      // Upload avatar if provided
      if (avatarFile) {
        await ArtistService.uploadAvatarImage(newArtist.id, avatarFile);
      }
      
      // Upload header if provided
      if (headerFile) {
        await ArtistService.uploadHeaderImage(newArtist.id, headerFile);
      }
      
      // Refresh the list of currentUser's artists
      await refreshArtists();
      
      // Redirect to the artist page
      router.push(`/artists/${newArtist.id}`);
    } catch (err) {
      console.error('Error creating artist:', err);
      setError('Failed to create artist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-700 dark:border-slate-800 pb-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create New Artist</h1>
          <Link 
            href="/artists" 
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Back to Artists
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg mb-6 transition-colors duration-300">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div>
              {/* Artist Type Selection */}
              <div className="mb-6">
                <label className="block text-slate-900 dark:text-white font-medium mb-2 transition-colors duration-300">
                  Artist Type*
                </label>
                <div className="flex space-x-4">
                  <RadioButton 
                    name="artistType" 
                    value="solo" 
                    checked={artistType === 'solo'} 
                    onChange={() => setArtistType('solo')}
                    label="Solo Artist"
                  />
                  <RadioButton 
                    name="artistType" 
                    value="band" 
                    checked={artistType === 'band'} 
                    onChange={() => setArtistType('band')}
                    label="Band/Group"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="name" className="block text-slate-900 dark:text-white font-medium mb-2 transition-colors duration-300">
                  Artist/Band Name*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={checkNameAvailability}
                    className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300"
                    required
                    maxLength={50}
                  />
                  {isCheckingName && (
                    <div className="absolute right-3 top-2.5">
                      <div className="w-5 h-5 border-2 border-t-orange-500 border-r-cyan-500 border-b-orange-500 border-l-cyan-500 rounded-full animate-spin"></div>
                    </div>
                  )}
                  {nameAvailable === true && !isCheckingName && (
                    <div className="absolute right-3 top-2.5 text-green-500">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  {nameAvailable === false && !isCheckingName && (
                    <div className="absolute right-3 top-2.5 text-red-500">
                      <X className="w-5 h-5" />
                    </div>
                  )}
                </div>
                {nameAvailable === false && !isCheckingName && (
                  <p className="text-orange-600 dark:text-orange-400 text-sm mt-1 transition-colors duration-300">
                    This name is already taken. We'll suggest an alternative when you create the artist.
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-slate-900 dark:text-white font-medium mb-2 transition-colors duration-300">
                  Music Type*
                </label>
                <div className="flex flex-wrap gap-2">
                  {['covers', 'originals'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        if (musicType.includes(type)) {
                          setMusicType(musicType.filter(t => t !== type));
                        } else {
                          setMusicType([...musicType, type]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        musicType.includes(type) ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="hometown" className="block text-slate-900 dark:text-white font-medium mb-2 transition-colors duration-300">
                  Hometown*
                </label>
                <div className="relative">
                  <PlaceLookup
                    value={hometown}
                    onChange={(value) => {
                      console.log('PlaceLookup onChange called with value:', value);
                      setHometown(value);
                    }}
                    placeholder="Start typing a UK city or town"
                    id="hometown"
                    className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="description" className="block text-slate-900 dark:text-white font-medium mb-2 transition-colors duration-300">
                  Description* <span className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">({description.length}/120)</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300"
                  required
                  maxLength={120}
                  rows={3}
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-900 dark:text-white font-semibold mb-2 transition-colors duration-300">
                  Genres* <span className="text-slate-500 dark:text-white text-sm transition-colors duration-300">(Select at least one)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_GENRES.map((genre) => (
                    <button
                      key={genre} //
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1 rounded-full text-sm font-semibold genre-button ${
                        selectedGenres.includes(genre)
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-600 text-slate-800 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors duration-300'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div>
              <div className="mb-6">
                <label className="block text-slate-900 dark:text-white font-semibold mb-2 transition-colors duration-300">
                  Profile Images
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Avatar upload */}
                  <div>
                    <div 
                      className="bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-300"
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      {avatarPreview ? (
                        <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
                          <img 
                            src={avatarPreview} 
                            alt="Avatar preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-32 h-32 mx-auto rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center transition-colors duration-300">
                          <div className="w-16 h-16 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center">
                            <Upload className="h-8 w-8 text-slate-600 dark:text-white" />
                          </div>
                        </div>
                      )}
                      <p className="mt-2 text-slate-700 text-sm font-semibold transition-colors duration-300 upload-label">Avatar Image</p>
                    </div>
                    <input
                      type="file"
                      ref={avatarInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  
                  {/* Header upload */}
                  <div>
                    <div 
                      className="bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-300"
                      onClick={() => headerInputRef.current?.click()}
                    >
                      {headerPreview ? (
                        <div className="relative w-full h-32 mx-auto rounded-lg overflow-hidden">
                          <img 
                            src={headerPreview} 
                            alt="Header preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-32 mx-auto rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center transition-colors duration-300">
                          <div className="w-16 h-16 rounded-lg bg-slate-300 dark:bg-slate-600 flex items-center justify-center">
                            <Upload className="h-8 w-8 text-slate-600 dark:text-white" />
                          </div>
                        </div>
                      )}
                      <p className="mt-2 text-slate-700 text-sm font-semibold transition-colors duration-300 upload-label">Header Image</p>
                    </div>
                    <input
                      type="file"
                      ref={headerInputRef}
                      onChange={handleHeaderChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-slate-900 dark:text-white font-semibold mb-2 transition-colors duration-300">
                  Social Media Links
                </label>
                
                <SocialMediaInput 
                  links={socialMediaLinks} 
                  onChange={setSocialMediaLinks}
                  className="mb-4"
                />
                
                {/* Multiple Formats Option - Inside social media section */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <Checkbox
                    id="enableMultipleFormats"
                    checked={enableMultipleFormats}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEnableMultipleFormats(e.target.checked)}
                    label="Enable Multiple Formats/Shows"
                    helpText={enableMultipleFormats ? "You'll be able to create and manage different formats after setup." : undefined}
                    helpIcon={
                      <div className="group relative">
                        <InfoIcon className="h-4 w-4 text-slate-500 cursor-help" />
                        <div className="absolute left-full ml-2 w-64 bg-white dark:bg-slate-700 p-2 rounded-md shadow-lg text-xs hidden group-hover:block z-10">
                          Multiple formats allow you to create different versions of your artist profile (e.g., full band, acoustic duo, solo shows) with their own bookings, playbooks, and setlists.
                        </div>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => router.push('/artists')}
              className="px-6 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium transition-colors duration-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Creating...' : 'Create Artist'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateArtistPage;
