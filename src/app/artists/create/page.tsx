'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from 'bndy-ui/components/auth';
import { useArtist } from '@/lib/context/artist-context';
import { ArtistService } from '@/lib/services/artist-service';
import { CreateArtistData, Artist, MusicGenre, ArtistMember } from 'bndy-types';
import { validateSocialMediaUrl } from '@/lib/utils/social-media-utils';
import { Music, MapPin, Check, X, Upload, Instagram, Facebook, Twitter, Youtube, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

// List of available genres
const AVAILABLE_GENRES: MusicGenre[] = [
  'Rock', 'Pop', 'Country', 'R&B', 'Disco', 'Jazz', 'Reggae', 'Metal', 'Folk', 'Classical', 'Electronic', 'Other'
];

import { BndyLoadingScreen } from 'bndy-ui';

const CreateArtistPage = () => {
  const { currentUser } = useAuth();
  const { refreshArtists } = useArtist();
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
  
  // Social media validation
  const [instagramError, setInstagramError] = useState<string | null>(null);
  const [facebookError, setFacebookError] = useState<string | null>(null);
  const [spotifyError, setSpotifyError] = useState<string | null>(null);
  const [twitterError, setTwitterError] = useState<string | null>(null);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);
  const [websiteError, setWebsiteError] = useState<string | null>(null);
  
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

  // Validate social media URLs
  const validateSocialMediaUrls = () => {
    let isValid = true;
    
    // Instagram
    if (instagram && !validateSocialMediaUrl(instagram, 'instagram')) {
      setInstagramError('Please enter a valid Instagram URL');
      isValid = false;
    } else {
      setInstagramError(null);
    }
    
    // Facebook
    if (facebook && !validateSocialMediaUrl(facebook, 'facebook')) {
      setFacebookError('Please enter a valid Facebook URL');
      isValid = false;
    } else {
      setFacebookError(null);
    }
    
    // Spotify
    if (spotify && !validateSocialMediaUrl(spotify, 'spotify')) {
      setSpotifyError('Please enter a valid Spotify URL');
      isValid = false;
    } else {
      setSpotifyError(null);
    }
    
    // Twitter
    if (twitter && !validateSocialMediaUrl(twitter, 'twitter')) {
      setTwitterError('Please enter a valid Twitter URL');
      isValid = false;
    } else {
      setTwitterError(null);
    }
    
    // YouTube
    if (youtube && !validateSocialMediaUrl(youtube, 'youtube')) {
      setYoutubeError('Please enter a valid YouTube URL');
      isValid = false;
    } else {
      setYoutubeError(null);
    }
    
    // Website
    if (website && !validateSocialMediaUrl(website, 'website')) {
      setWebsiteError('Please enter a valid website URL');
      isValid = false;
    } else {
      setWebsiteError(null);
    }
    
    return isValid;
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
    
    // Validate social media URLs
    if (!validateSocialMediaUrls()) {
      setError('Please correct the errors in the social media links');
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
        socialMedia: {
          instagram: instagram || undefined,
          facebook: facebook || undefined,
          spotify: spotify || undefined,
          twitter: twitter || undefined,
          youtube: youtube || undefined,
          website: website || undefined
        }
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
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-bold text-white">Create New Artist</h1>
          <Link 
            href="/artists" 
            className="text-slate-300 hover:text-white"
          >
            Back to Artists
          </Link>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div>
              <div className="mb-6">
                <label htmlFor="name" className="block text-white font-medium mb-2">
                  Artist/Band Name*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={checkNameAvailability}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  <p className="text-orange-400 text-sm mt-1">
                    This name is already taken. We'll suggest an alternative when you create the artist.
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="hometown" className="block text-white font-medium mb-2">
                  Hometown*
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    id="hometown"
                    value={hometown}
                    onChange={(e) => setHometown(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    maxLength={50}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="description" className="block text-white font-medium mb-2">
                  Description* <span className="text-slate-400 text-sm">({description.length}/120)</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                  maxLength={120}
                  rows={3}
                />
              </div>

              <div className="mb-6">
                <label className="block text-white font-medium mb-2">
                  Genres* <span className="text-slate-400 text-sm">(Select at least one)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_GENRES.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedGenres.includes(genre)
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
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
                <label className="block text-white font-medium mb-2">
                  Profile Images
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Avatar upload */}
                  <div>
                    <div 
                      className="bg-slate-700 border border-slate-600 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-600 transition-colors"
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
                        <div className="w-32 h-32 mx-auto rounded-full bg-slate-800 flex items-center justify-center">
                          <Upload className="h-10 w-10 text-slate-400" />
                        </div>
                      )}
                      <p className="mt-2 text-slate-300 text-sm">Avatar Image</p>
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
                      className="bg-slate-700 border border-slate-600 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-600 transition-colors"
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
                        <div className="w-full h-32 mx-auto rounded-lg bg-slate-800 flex items-center justify-center">
                          <Upload className="h-10 w-10 text-slate-400" />
                        </div>
                      )}
                      <p className="mt-2 text-slate-300 text-sm">Header Image</p>
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
                <label className="block text-white font-medium mb-2">
                  Social Media Links
                </label>
                
                <div className="space-y-3">
                  {/* Instagram */}
                  <div className="relative">
                    <Instagram className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                      type="url"
                      placeholder="Instagram URL"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      onBlur={() => {
                        if (instagram && !validateSocialMediaUrl(instagram, 'instagram')) {
                          setInstagramError('Please enter a valid Instagram URL');
                        } else {
                          setInstagramError(null);
                        }
                      }}
                      className={`w-full bg-slate-700 border ${instagramError ? 'border-red-500' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    />
                    {instagramError && (
                      <p className="text-red-500 text-xs mt-1">{instagramError}</p>
                    )}
                  </div>
                  
                  {/* Facebook */}
                  <div className="relative">
                    <Facebook className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                      type="url"
                      placeholder="Facebook URL"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      onBlur={() => {
                        if (facebook && !validateSocialMediaUrl(facebook, 'facebook')) {
                          setFacebookError('Please enter a valid Facebook URL');
                        } else {
                          setFacebookError(null);
                        }
                      }}
                      className={`w-full bg-slate-700 border ${facebookError ? 'border-red-500' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    />
                    {facebookError && (
                      <p className="text-red-500 text-xs mt-1">{facebookError}</p>
                    )}
                  </div>
                  
                  {/* Spotify */}
                  <div className="relative">
                    <Music className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                      type="url"
                      placeholder="Spotify URL"
                      value={spotify}
                      onChange={(e) => setSpotify(e.target.value)}
                      onBlur={() => {
                        if (spotify && !validateSocialMediaUrl(spotify, 'spotify')) {
                          setSpotifyError('Please enter a valid Spotify URL');
                        } else {
                          setSpotifyError(null);
                        }
                      }}
                      className={`w-full bg-slate-700 border ${spotifyError ? 'border-red-500' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    />
                    {spotifyError && (
                      <p className="text-red-500 text-xs mt-1">{spotifyError}</p>
                    )}
                  </div>
                  
                  {/* Twitter */}
                  <div className="relative">
                    <Twitter className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                      type="url"
                      placeholder="Twitter URL"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      onBlur={() => {
                        if (twitter && !validateSocialMediaUrl(twitter, 'twitter')) {
                          setTwitterError('Please enter a valid Twitter URL');
                        } else {
                          setTwitterError(null);
                        }
                      }}
                      className={`w-full bg-slate-700 border ${twitterError ? 'border-red-500' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    />
                    {twitterError && (
                      <p className="text-red-500 text-xs mt-1">{twitterError}</p>
                    )}
                  </div>
                  
                  {/* YouTube */}
                  <div className="relative">
                    <Youtube className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                      type="url"
                      placeholder="YouTube URL"
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                      onBlur={() => {
                        if (youtube && !validateSocialMediaUrl(youtube, 'youtube')) {
                          setYoutubeError('Please enter a valid YouTube URL');
                        } else {
                          setYoutubeError(null);
                        }
                      }}
                      className={`w-full bg-slate-700 border ${youtubeError ? 'border-red-500' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    />
                    {youtubeError && (
                      <p className="text-red-500 text-xs mt-1">{youtubeError}</p>
                    )}
                  </div>
                  
                  {/* Website */}
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                      type="url"
                      placeholder="Website URL"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      onBlur={() => {
                        if (website && !validateSocialMediaUrl(website, 'website')) {
                          setWebsiteError('Please enter a valid website URL');
                        } else {
                          setWebsiteError(null);
                        }
                      }}
                      className={`w-full bg-slate-700 border ${websiteError ? 'border-red-500' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    />
                    {websiteError && (
                      <p className="text-red-500 text-xs mt-1">{websiteError}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Link
              href="/artists"
              className="px-6 py-2 rounded-lg bg-slate-700 text-white mr-4 hover:bg-slate-600 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  Creating...
                </>
              ) : (
                <>
                  <Music className="mr-2 h-5 w-5" />
                  Create Artist
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateArtistPage;
