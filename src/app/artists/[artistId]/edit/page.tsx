'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from 'bndy-ui/components/auth';
import { useArtist } from '@/lib/context/artist-context';
import { ArtistService } from '@/lib/services/artist-service';
import { Artist, MusicGenre, ArtistMember, getAvailableMusicGenres } from 'bndy-types';
import { validateSocialMediaUrl } from '@/lib/utils/social-media-utils';
import { Music, MapPin, Check, X, Upload, InfoIcon } from 'lucide-react';
import { PlaceLookup } from 'bndy-ui';
import { RadioButton } from 'bndy-ui/components/ui/RadioButton';
import { Checkbox } from 'bndy-ui/components/ui/Checkbox';
import { SocialMediaInput } from 'bndy-ui/components/ui/SocialMediaInput';
import type { SocialMediaLink } from 'bndy-ui/components/ui/SocialMediaInput';
import Link from 'next/link';
import Image from 'next/image';

// Get available genres from the shared utility function
const AVAILABLE_GENRES = getAvailableMusicGenres();

const EditArtistPage = () => {
  const { currentUser } = useAuth();
  const { refreshArtists } = useArtist();
  const router = useRouter();
  const params = useParams();
  const artistId = params.artistId as string;
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);
  
  // Artist data state
  const [artist, setArtist] = useState<Artist | null>(null);
  
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
  
  // Image upload state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [headerPreview, setHeaderPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Fetch artist data
  useEffect(() => {
    const fetchArtist = async () => {
      if (!currentUser) return;
      
      try {
        const artistData = await ArtistService.getArtistById(artistId);
        
        if (!artistData) {
          router.push('/artists');
          return;
        }
        
        // Check if currentUser is owner
        const currentUserMember = artistData.members.find(member => member.userId === currentUser.uid);
        if (!currentUserMember || currentUserMember.role !== 'owner') {
          router.push(`/artists/${artistId}`);
          return;
        }
        
        setArtist(artistData);
        
        // Populate form fields
        setName(artistData.name || '');
        setHometown(artistData.hometown || '');
        setDescription(artistData.description || '');
        setSelectedGenres(artistData.genres || []);
        
        // Populate new fields
        setArtistType(artistData.artistType || 'band');
        setEnableMultipleFormats(artistData.enableMultipleFormats || false);
        // Convert string to array if needed for backward compatibility
        if (artistData.musicType) {
          setMusicType(Array.isArray(artistData.musicType) ? artistData.musicType : [artistData.musicType]);
        } else {
          setMusicType(['both']);
        }
        
        // Populate social media fields
        if (artistData.socialMedia) {
          const links: SocialMediaLink[] = [];
          
          if (artistData.socialMedia.instagram) {
            links.push({ platform: 'instagram', url: artistData.socialMedia.instagram });
          }
          if (artistData.socialMedia.facebook) {
            links.push({ platform: 'facebook', url: artistData.socialMedia.facebook });
          }
          if (artistData.socialMedia.spotify) {
            links.push({ platform: 'spotify', url: artistData.socialMedia.spotify });
          }
          if (artistData.socialMedia.twitter || artistData.socialMedia.x) {
            links.push({ platform: 'x', url: artistData.socialMedia.twitter || artistData.socialMedia.x || '' });
          }
          if (artistData.socialMedia.youtube) {
            links.push({ platform: 'youtube', url: artistData.socialMedia.youtube });
          }
          if (artistData.socialMedia.website) {
            links.push({ platform: 'website', url: artistData.socialMedia.website });
          }
          
          setSocialMediaLinks(links);
        }
        
        // Set image previews
        if (artistData.avatarUrl) {
          setAvatarPreview(artistData.avatarUrl);
        }
        
        if (artistData.headerImageUrl) {
          setHeaderPreview(artistData.headerImageUrl);
        }
      } catch (err) {
        console.error('Error fetching artist:', err);
      }
    };
    
    fetchArtist();
  }, [artistId, currentUser, router]);
  
  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle header image file selection
  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setHeaderFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setHeaderPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Toggle genre selection
  const toggleGenre = (genre: MusicGenre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };
  
  // Social media validation is handled by the SocialMediaInput component
  
  // Handle form submission
  const handleUpdateArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    
    // Validate form
    if (!name) {
      setSubmitError('Artist name is required');
      setIsSubmitting(false);
      return;
    }
    
    // Social media validation is handled by the SocialMediaInput component
    
    try {
      // Upload images if needed
      let avatarUrl = artist?.avatarUrl || '';
      let headerImageUrl = artist?.headerImageUrl || '';
      
      // Note: In a real implementation, you would upload the images to Firebase Storage
      // For now, we'll just use the existing URLs or empty strings
      if (avatarFile) {
        setIsUploading(true);
        // This would be implemented in ArtistService in a real app
        // avatarUrl = await ArtistService.uploadArtistImage(artistId, avatarFile, 'avatar');
        
        // For now, just use a placeholder or keep the existing URL
        avatarUrl = artist?.avatarUrl || '';
      }
      
      if (headerFile) {
        setIsUploading(true);
        // This would be implemented in ArtistService in a real app
        // headerImageUrl = await ArtistService.uploadArtistImage(artistId, headerFile, 'header');
        
        // For now, just use a placeholder or keep the existing URL
        headerImageUrl = artist?.headerImageUrl || '';
      }
      
      // Update artist data
      const updatedArtist: Partial<Artist> = {
        name,
        hometown,
        genres: selectedGenres,
        description,
        avatarUrl,
        headerImageUrl,
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
      
      await ArtistService.updateArtist(artistId, updatedArtist);
      
      // Update success state
      setSubmitSuccess(true);
      refreshArtists();
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/artists/${artistId}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating artist:', err);
      setSubmitError('Failed to update artist. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Artist Profile</h1>
          <Link 
            href={`/artists/${artistId}`}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </Link>
        </div>
        
        {submitError && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">
            <p>{submitError}</p>
          </div>
        )}
        
        {submitSuccess && (
          <div className="bg-green-100 dark:bg-green-900/20 border border-green-900 text-green-700 dark:text-green-200 p-4 rounded-lg mb-6 flex items-center">
            <Check className="h-5 w-5 mr-2" />
            <p>Artist profile updated successfully!</p>
          </div>
        )}
        
        <form onSubmit={handleUpdateArtist} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Artist/Band Name*
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter artist or band name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="hometown" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Hometown
                </label>
                <div className="relative">
                  <PlaceLookup
                    value={hometown}
                    onChange={(value) => {
                      console.log('Artist Edit - PlaceLookup onChange called with value:', value);
                      setHometown(value);
                    }}
                    placeholder="Start typing a UK city or town"
                    id="hometown"
                    className="bg-slate-700 border-slate-600 text-white focus:ring-orange-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px]"
                  placeholder="Tell people about your band..."
                />
              </div>
              
              {/* Artist Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
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
              
              {/* Music Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
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
                        musicType.includes(type) ? 'bg-orange-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Genres
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_GENRES.map((genre: MusicGenre) => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => toggleGenre(genre)}
                        className={`px-3 py-1 rounded-full text-sm ${selectedGenres.includes(genre) ? 'bg-orange-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Images */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Profile Images</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Profile Picture
                </label>
                <div className="flex flex-col items-center">
                  <div 
                    className="w-32 h-32 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 mb-4 relative shadow-md"
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt="Avatar preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-orange-500">
                        <Music className="h-12 w-12 text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm"
                  >
                    Change Profile Picture
                  </button>
                </div>
              </div>
              
              {/* Header Image */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Header Image
                </label>
                <div className="flex flex-col items-center">
                  <div 
                    className="w-full h-32 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 mb-4 relative shadow-md"
                    onClick={() => headerInputRef.current?.click()}
                  >
                    {headerPreview ? (
                      <img 
                        src={headerPreview} 
                        alt="Header preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-orange-500/20 to-cyan-500/20 dark:from-orange-500/30 dark:to-cyan-500/30">
                        <Music className="h-12 w-12 text-slate-700 dark:text-slate-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={headerInputRef}
                    onChange={handleHeaderChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => headerInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm"
                  >
                    Change Header Image
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Social Media */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Social Media</h2>
            
            <div className="space-y-4">
              <SocialMediaInput 
                links={socialMediaLinks} 
                onChange={setSocialMediaLinks}
                className="mb-4"
              />
            </div>
            
            {/* Multiple Formats Option - Inside the social media box */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Checkbox
                id="enableMultipleFormats"
                checked={enableMultipleFormats}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEnableMultipleFormats(e.target.checked)}
                label={
                  <span className="flex items-center">
                    Enable Multiple Formats/Shows
                    <span className="group relative ml-1">
                      <InfoIcon className="h-4 w-4 text-slate-500 cursor-help" />
                      <div className="absolute left-full ml-2 w-64 bg-white dark:bg-slate-700 p-2 rounded-md shadow-lg text-xs hidden group-hover:block z-10">
                        Multiple formats allow you to create different versions of your artist profile (e.g., full band, acoustic duo, solo shows) with their own bookings, playbooks, and setlists.
                      </div>
                    </span>
                  </span>
                }
                helperText={enableMultipleFormats ? "You'll be able to create and manage different formats after setup." : undefined}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className={`px-6 py-3 bg-orange-500 text-white rounded-lg font-medium ${
                (isSubmitting || isUploading) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-600'
              } transition-colors flex items-center shadow-sm`}
            >
              {isSubmitting || isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isUploading ? 'Uploading...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditArtistPage;
