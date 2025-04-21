'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from 'bndy-ui/components/auth';
import { useArtist } from '@/lib/context/artist-context';
import { ArtistService } from '@/lib/services/artist-service';
import { Artist, MusicGenre, ArtistMember } from 'bndy-types';
import { validateSocialMediaUrl } from '@/lib/utils/social-media-utils';
import { Music, MapPin, Check, X, Upload, Instagram, Facebook, Twitter, Youtube, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// List of available genres
const availableGenres: MusicGenre[] = [
  'Rock', 'Pop', 'Country', 'R&B', 'Disco', 'Jazz', 'Reggae', 'Metal', 'Folk', 'Classical', 'Electronic', 'Other'
];

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
  
  // Social media validation
  const [instagramError, setInstagramError] = useState<string | null>(null);
  const [facebookError, setFacebookError] = useState<string | null>(null);
  const [spotifyError, setSpotifyError] = useState<string | null>(null);
  const [twitterError, setTwitterError] = useState<string | null>(null);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);
  const [websiteError, setWebsiteError] = useState<string | null>(null);
  
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
        
        // Populate social media fields
        if (artistData.socialMedia) {
          setInstagram(artistData.socialMedia.instagram || '');
          setFacebook(artistData.socialMedia.facebook || '');
          setSpotify(artistData.socialMedia.spotify || '');
          setTwitter(artistData.socialMedia.twitter || '');
          setYoutube(artistData.socialMedia.youtube || '');
          setWebsite(artistData.socialMedia.website || '');
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
  
  // Validate social media URLs
  const validateSocialMedia = () => {
    let isValid = true;
    
    if (instagram) {
      const isValidInstagram = validateSocialMediaUrl(instagram, 'instagram');
      setInstagramError(isValidInstagram ? null : 'Invalid Instagram URL');
      if (!isValidInstagram) isValid = false;
    } else {
      setInstagramError(null);
    }
    
    if (facebook) {
      const isValidFacebook = validateSocialMediaUrl(facebook, 'facebook');
      setFacebookError(isValidFacebook ? null : 'Invalid Facebook URL');
      if (!isValidFacebook) isValid = false;
    } else {
      setFacebookError(null);
    }
    
    if (spotify) {
      const isValidSpotify = validateSocialMediaUrl(spotify, 'spotify');
      setSpotifyError(isValidSpotify ? null : 'Invalid Spotify URL');
      if (!isValidSpotify) isValid = false;
    } else {
      setSpotifyError(null);
    }
    
    if (twitter) {
      const isValidTwitter = validateSocialMediaUrl(twitter, 'twitter');
      setTwitterError(isValidTwitter ? null : 'Invalid Twitter URL');
      if (!isValidTwitter) isValid = false;
    } else {
      setTwitterError(null);
    }
    
    if (youtube) {
      const isValidYoutube = validateSocialMediaUrl(youtube, 'youtube');
      setYoutubeError(isValidYoutube ? null : 'Invalid YouTube URL');
      if (!isValidYoutube) isValid = false;
    } else {
      setYoutubeError(null);
    }
    
    if (website) {
      const isValidWebsite = validateSocialMediaUrl(website, 'website');
      setWebsiteError(isValidWebsite ? null : 'Invalid Website URL');
      if (!isValidWebsite) isValid = false;
    } else {
      setWebsiteError(null);
    }
    
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset submission state
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    // Validate form
    if (!name) {
      setSubmitError('Artist name is required');
      setIsSubmitting(false);
      return;
    }
    
    // Validate social media URLs
    if (!validateSocialMedia()) {
      setSubmitError('Please correct the errors in your social media links');
      setIsSubmitting(false);
      return;
    }
    
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
        description,
        genres: selectedGenres,
        avatarUrl,
        headerImageUrl,
        socialMedia: {
          instagram,
          facebook,
          spotify,
          twitter,
          youtube,
          website
        }
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
          <h1 className="text-2xl font-bold text-white">Edit Artist Profile</h1>
          <Link 
            href={`/artists/${artistId}`}
            className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancel
          </Link>
        </div>
        
        {submitError && (
          <div className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded-lg mb-6">
            <p>{submitError}</p>
          </div>
        )}
        
        {submitSuccess && (
          <div className="bg-green-900/20 border border-green-900 text-green-200 p-4 rounded-lg mb-6 flex items-center">
            <Check className="h-5 w-5 mr-2" />
            <p>Artist profile updated successfully!</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                  Artist/Band Name*
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter artist or band name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="hometown" className="block text-sm font-medium text-slate-300 mb-1">
                  Hometown
                </label>
                <input
                  type="text"
                  id="hometown"
                  value={hometown}
                  onChange={(e) => setHometown(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. London, UK"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px]"
                  placeholder="Tell people about your band..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Genres
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableGenres.map((genre) => (
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
          </div>
          
          {/* Images */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Profile Images</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Profile Picture
                </label>
                <div className="flex flex-col items-center">
                  <div 
                    className="w-32 h-32 rounded-full overflow-hidden bg-slate-700 mb-4 relative"
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
                    className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm"
                  >
                    Change Profile Picture
                  </button>
                </div>
              </div>
              
              {/* Header Image */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Header Image
                </label>
                <div className="flex flex-col items-center">
                  <div 
                    className="w-full h-32 rounded-lg overflow-hidden bg-slate-700 mb-4 relative"
                    onClick={() => headerInputRef.current?.click()}
                  >
                    {headerPreview ? (
                      <img 
                        src={headerPreview} 
                        alt="Header preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-orange-500/20 to-cyan-500/20">
                        <Music className="h-12 w-12 text-slate-700" />
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
                    className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm"
                  >
                    Change Header Image
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Social Media */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Social Media</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-slate-300 mb-1">
                  Instagram
                </label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    id="instagram"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className={`w-full bg-slate-700 border ${instagramError ? 'border-red-500' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="https://instagram.com/yourbandname"
                  />
                </div>
                {instagramError && <p className="text-red-400 text-xs mt-1">{instagramError}</p>}
              </div>
              
              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-slate-300 mb-1">
                  Facebook
                </label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    id="facebook"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    className={`w-full bg-slate-700 border ${facebookError ? 'border-red-500' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="https://facebook.com/yourbandname"
                  />
                </div>
                {facebookError && <p className="text-red-400 text-xs mt-1">{facebookError}</p>}
              </div>
              
              <div>
                <label htmlFor="spotify" className="block text-sm font-medium text-slate-300 mb-1">
                  Spotify
                </label>
                <div className="relative">
                  <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    id="spotify"
                    value={spotify}
                    onChange={(e) => setSpotify(e.target.value)}
                    className={`w-full bg-slate-700 border ${spotifyError ? 'border-red-500' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="https://open.spotify.com/artist/..."
                  />
                </div>
                {spotifyError && <p className="text-red-400 text-xs mt-1">{spotifyError}</p>}
              </div>
              
              <div>
                <label htmlFor="twitter" className="block text-sm font-medium text-slate-300 mb-1">
                  Twitter
                </label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    id="twitter"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className={`w-full bg-slate-700 border ${twitterError ? 'border-red-500' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="https://twitter.com/yourbandname"
                  />
                </div>
                {twitterError && <p className="text-red-400 text-xs mt-1">{twitterError}</p>}
              </div>
              
              <div>
                <label htmlFor="youtube" className="block text-sm font-medium text-slate-300 mb-1">
                  YouTube
                </label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    id="youtube"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    className={`w-full bg-slate-700 border ${youtubeError ? 'border-red-500' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="https://youtube.com/c/yourbandname"
                  />
                </div>
                {youtubeError && <p className="text-red-400 text-xs mt-1">{youtubeError}</p>}
              </div>
              
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-slate-300 mb-1">
                  Website
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className={`w-full bg-slate-700 border ${websiteError ? 'border-red-500' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="https://yourbandname.com"
                  />
                </div>
                {websiteError && <p className="text-red-400 text-xs mt-1">{websiteError}</p>}
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className={`px-6 py-3 bg-orange-500 text-white rounded-lg font-medium ${
                (isSubmitting || isUploading) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-600'
              } transition-colors flex items-center`}
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
