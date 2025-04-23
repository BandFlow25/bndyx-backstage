'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth, ToastProvider, useToast } from 'bndy-ui';
import { BndySpinner, PlaceLookup } from 'bndy-ui';
import { Instrument, UserProfile } from 'bndy-types';
import { getCurrentUserProfile, updateCurrentUserProfile } from '@/lib/services/user-service';
import { User, Music, MapPin, Upload, Check } from 'lucide-react';
import Link from 'next/link';

// Wrap the profile page content with ToastProvider
function ProfileContent() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [displayName, setDisplayName] = useState<string>('');
  const [hometown, setHometown] = useState<string>('');
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) {
        console.log('No current user, redirecting to login');
        router.push('/login');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching profile for user:', currentUser.uid);
        const userProfile = await getCurrentUserProfile();
        
        if (userProfile) {
          console.log('Profile loaded successfully:', userProfile);
          setDisplayName(userProfile.displayName || currentUser.displayName || '');
          setAvatarPreview(userProfile.photoURL || currentUser.photoURL || '');
          setHometown(userProfile.hometown || '');
          setSelectedInstruments(userProfile.instruments || []);
        } else {
          console.log('No existing profile found, initializing with auth data');
          // Initialize with data from auth user if profile doesn't exist
          setDisplayName(currentUser.displayName || '');
          setAvatarPreview(currentUser.photoURL || '');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser, router]);

  // Handle avatar image selection
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Import the validation function
      const { validateProfileImage } = await import('@/lib/services/user-service');
      
      // Validate the image before setting it
      const validation = await validateProfileImage(file);
      if (!validation.valid) {
        setValidationErrors({
          ...validationErrors,
          avatar: validation.message || 'Invalid image file'
        });
        return;
      }
      
      // Clear any previous validation errors
      const newErrors = {...validationErrors};
      delete newErrors.avatar;
      setValidationErrors(newErrors);
      
      // Set the avatar file and preview
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error handling avatar change:', err);
      setValidationErrors({
        ...validationErrors,
        avatar: 'Failed to process the selected image'
      });
    }
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    // Validate display name
    if (!displayName.trim()) {
      errors.displayName = 'Display name is required';
    } else if (displayName.length > 50) {
      errors.displayName = 'Display name must be less than 50 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save profile changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      console.log('No current user, redirecting to login');
      router.push('/login');
      return;
    }
    
    // Validate form before submitting
    if (!validateForm()) {
      console.log('Form validation failed:', validationErrors);
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const profileData: Partial<UserProfile> = {
        displayName,
        hometown,
        instruments: selectedInstruments,
      };
      
      console.log('Updating profile with data:', profileData);
      console.log('Avatar file included:', avatarFile ? 'Yes' : 'No');
      
      // Pass the avatar file to the service function for upload to Firebase Storage
      await updateCurrentUserProfile(profileData, avatarFile);
      
      // Show toast notification instead of setting success message in the UI
      showToast('Profile updated successfully!', 'success');
      
      // Reset the avatar file state after successful upload
      setAvatarFile(null);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMessage = typeof err === 'string' ? err : 
        err instanceof Error ? err.message : 
        'Failed to update profile. Please try again.';
      
      // Show error toast instead of setting error in the UI
      showToast(errorMessage, 'error');
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Toggle instrument selection
  const toggleInstrument = (instrument: Instrument) => {
    if (selectedInstruments.includes(instrument)) {
      // Remove instrument if already selected
      setSelectedInstruments(selectedInstruments.filter(i => i !== instrument));
    } else {
      // Add instrument if not already selected
      setSelectedInstruments([...selectedInstruments, instrument]);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-700 dark:border-slate-800 pb-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
            <User className="mr-2 h-8 w-8" />
            My Profile
          </h1>
          <Link 
            href="/dashboard" 
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <BndySpinner />
          </div>
        ) : (
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300">
            {error && (
              <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg mb-6 transition-colors duration-300">
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div>
                <div className="mb-6">
                  <label htmlFor="displayName" className="block text-slate-900 dark:text-white font-medium mb-2 transition-colors duration-300">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className={`w-full bg-slate-100 dark:bg-slate-700 border ${validationErrors.displayName ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300`}
                    maxLength={50}
                  />
                  {validationErrors.displayName && (
                    <p className="mt-1 text-red-500 text-sm">{validationErrors.displayName}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="hometown" className="block text-slate-900 dark:text-white font-medium mb-2 transition-colors duration-300">
                    Hometown (UK City/Town)
                  </label>
                  <div className="relative">
                    <PlaceLookup
                      value={hometown}
                      onChange={(value) => {
                        console.log('Profile Page - PlaceLookup onChange called with value:', value);
                        setHometown(value);
                      }}
                      placeholder="Start typing a UK city or town"
                      id="hometown"
                      className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-slate-900 dark:text-white font-semibold mb-2 transition-colors duration-300">
                    Instruments Played <span className="text-slate-500 dark:text-white text-sm transition-colors duration-300">(Select all that apply)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(Instrument).map((instrument) => (
                      <button
                        key={instrument}
                        type="button"
                        onClick={() => toggleInstrument(instrument)}
                        className={`px-3 py-1 rounded-full text-sm font-semibold genre-button ${selectedInstruments.includes(instrument) ? 'bg-orange-500 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-800 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors duration-300'}`}
                      >
                        {instrument}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column - Profile Image */}
              <div>
                <div className="mb-6">
                  <label className="block text-slate-900 dark:text-white font-semibold mb-2 transition-colors duration-300">
                    Profile Image
                  </label>
                  <div 
                    className={`bg-slate-200 dark:bg-slate-700 border ${validationErrors.avatar ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-lg p-4 text-center cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-300`}
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    {avatarPreview ? (
                      <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
                        <img 
                          src={avatarPreview} 
                          alt="Avatar preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 mx-auto rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center transition-colors duration-300">
                        <div className="w-16 h-16 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center">
                          <Upload className="h-8 w-8 text-slate-600 dark:text-white" />
                        </div>
                      </div>
                    )}
                    <p className="mt-2 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-colors duration-300 upload-label">Profile Image</p>
                    {validationErrors.avatar && (
                      <p className="mt-1 text-red-500 text-sm">{validationErrors.avatar}</p>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Max size: 2MB. Max dimensions: 2000x2000px.
                  </p>
                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
              >
                {saving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </MainLayout>
  );
}

// Export the page with ToastProvider
export default function ProfilePage() {
  return (
    <ToastProvider position="top-right" maxToasts={3}>
      <ProfileContent />
    </ToastProvider>
  );
}
