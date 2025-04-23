// src/lib/services/user-service.ts
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getFirebaseFirestore, getFirebaseStorage } from '../firebase';
import { COLLECTIONS } from '../firebase/collections';
import { updateProfile } from 'firebase/auth';
import { getFirebaseAuth } from '../firebase';
import { UserProfile, Instrument } from 'bndy-types';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Get the Firestore instance
const db = getFirebaseFirestore();
const auth = getFirebaseAuth();
const storage = getFirebaseStorage();

/**
 * Validate profile image dimensions and size
 * @param file - The image file to validate
 * @returns Promise with validation result
 */
export const validateProfileImage = async (file: File): Promise<{ valid: boolean; message?: string }> => {
  try {
    // Check file size (2MB max)
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_FILE_SIZE) {
      return { 
        valid: false, 
        message: `Image size exceeds the 2MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB` 
      };
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return { 
        valid: false, 
        message: 'Only image files are allowed' 
      };
    }

    // Check image dimensions
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const MAX_DIMENSION = 2000; // 2000px max width or height
        
        if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
          resolve({ 
            valid: false, 
            message: `Image dimensions too large. Maximum allowed is ${MAX_DIMENSION}x${MAX_DIMENSION}px` 
          });
        } else {
          resolve({ valid: true });
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        resolve({ valid: false, message: 'Failed to load image for validation' });
      };
      
      img.src = URL.createObjectURL(file);
    });
  } catch (error) {
    console.error('Error validating profile image:', error);
    return { valid: false, message: 'Failed to validate image' };
  }
};

/**
 * Upload a profile image to Firebase Storage
 * @param userId - The user ID
 * @param file - The image file to upload
 * @returns Promise with the download URL
 */
export const uploadProfileImage = async (userId: string, file: File): Promise<string> => {
  try {
    console.log('Starting profile image upload for user:', userId);
    
    // Validate the image before uploading
    const validation = await validateProfileImage(file);
    if (!validation.valid) {
      throw new Error(validation.message || 'Invalid image file');
    }
    
    // Create a storage reference
    const storageRef = ref(storage, `profile_images/${userId}/${Date.now()}_${file.name}`);
    console.log('Storage reference created:', storageRef.fullPath);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    console.log('File uploaded successfully:', snapshot.ref.fullPath);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Download URL obtained:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw new Error(typeof error === 'string' ? error : 
      error instanceof Error ? error.message : 
      'Failed to upload profile image. Please try again.');
  }
};

/**
 * Get user profile data by user ID
 */
export const getUserById = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log('Fetching user profile for ID:', userId);
    console.log('Using collection:', COLLECTIONS.USERS);
    
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    console.log('User document reference:', userRef.path);
    
    const userDoc = await getDoc(userRef);
    console.log('Document exists?', userDoc.exists());
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as Omit<UserProfile, 'uid'>;
      console.log('User data retrieved:', JSON.stringify(userData, null, 2));
      
      return {
        uid: userId,
        ...userData,
      };
    }
    
    console.log('No user document found for ID:', userId);
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Get the current user's profile
 */
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  console.log('Getting current user profile');
  console.log('Auth state:', auth ? 'Auth initialized' : 'Auth not initialized');
  const currentUser = auth.currentUser;
  console.log('Current user from auth:', currentUser ? `User ID: ${currentUser.uid}` : 'No current user');
  
  if (!currentUser) {
    console.log('No current user in auth, checking localStorage token');
    // Try to get user from token as fallback
    const token = localStorage.getItem('bndyAuthToken');
    if (token) {
      try {
        console.log('Found token in localStorage, attempting to decode');
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded && decoded.uid) {
          console.log('Successfully decoded token, user ID:', decoded.uid);
          return getUserById(decoded.uid);
        }
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
    
    console.log('No authentication source found');
    return null;
  }
  
  console.log('Fetching profile for current user ID:', currentUser.uid);
  return getUserById(currentUser.uid);
};

/**
 * Get the current user's ID
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  console.log('Getting current user ID');
  console.log('Auth state:', auth ? 'Auth initialized' : 'Auth not initialized');
  const currentUser = auth.currentUser;
  console.log('Current user from auth:', currentUser ? `User ID: ${currentUser.uid}` : 'No current user');
  
  if (!currentUser) {
    console.log('No current user in auth, checking localStorage token');
    // Try to get user from token as fallback
    const token = localStorage.getItem('bndyAuthToken');
    if (token) {
      try {
        console.log('Found token in localStorage, attempting to decode');
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded && decoded.uid) {
          console.log('Successfully decoded token, user ID:', decoded.uid);
          return decoded.uid;
        }
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
    
    console.log('No authentication source found');
    return null;
  }
  
  console.log('Returning current user ID:', currentUser.uid);
  return currentUser.uid;
};

/**
 * Update user profile data
 */
export const updateUserProfile = async (
  userId: string, 
  profileData: Partial<UserProfile>,
  avatarFile?: File | null
): Promise<UserProfile> => {
  try {
    console.log('Updating user profile for ID:', userId);
    console.log('Profile data to update:', JSON.stringify(profileData, null, 2));
    console.log('Avatar file provided?', avatarFile ? 'Yes' : 'No');
    
    // Get the authenticated user ID
    const authenticatedUserId = await getCurrentUserId();
    
    // Check if user is authenticated
    if (!authenticatedUserId) {
      console.error('Authentication error: No authenticated user found');
      throw new Error('User must be authenticated to update profile');
    }
    
    // Verify the user is updating their own profile
    if (authenticatedUserId !== userId) {
      console.error('Permission denied: Users can only update their own profiles');
      console.log('Authenticated user ID:', authenticatedUserId);
      console.log('Requested update user ID:', userId);
      throw new Error('Permission denied: You can only update your own profile');
    }
    
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    console.log('User document reference:', userRef.path);
    
    const userDoc = await getDoc(userRef);
    console.log('Document exists?', userDoc.exists());
    
    // Prepare data for update
    const updateData: Partial<UserProfile> & { 
      updatedAt?: Date;
      createdAt?: Date; 
    } = {
      ...profileData,
    };
    
    // Remove uid from update data if present
    if ('uid' in updateData) {
      delete updateData.uid;
      console.log('Removed uid from update data');
    }
    
    // Handle avatar file upload if provided
    if (avatarFile) {
      try {
        console.log('Uploading avatar file');
        const downloadURL = await uploadProfileImage(userId, avatarFile);
        updateData.photoURL = downloadURL;
        console.log('Avatar URL added to update data:', downloadURL);
      } catch (uploadError) {
        console.error('Error uploading profile image:', uploadError);
        throw new Error('Failed to upload profile image. Please try again.');
      }
    }
    
    // Add timestamp for when the profile was last updated
    updateData.updatedAt = new Date();
    
    console.log('Final update data:', JSON.stringify(updateData, null, 2));
    
    if (userDoc.exists()) {
      console.log('Updating existing document');
      await updateDoc(userRef, updateData);
      console.log('Document updated successfully');
    } else {
      console.log('Creating new document');
      // Create new document with creation timestamp
      const newUserData = {
        ...updateData,
        createdAt: new Date(),
      };
      await setDoc(userRef, newUserData);
      console.log('Document created successfully');
    }
    
    // If updating auth profile (display name or photo), also update auth profile
    if (profileData.displayName || profileData.photoURL) {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          console.log('Updating Firebase Auth profile');
          await updateProfile(currentUser, {
            displayName: profileData.displayName || undefined,
            photoURL: profileData.photoURL || undefined,
          });
          console.log('Firebase Auth profile updated successfully');
        } else {
          console.log('Cannot update Firebase Auth profile: No current user in auth');
        }
      } catch (authUpdateError) {
        console.error('Error updating auth profile:', authUpdateError);
        // Don't throw here, as the Firestore update was successful
      }
    }
    
    // Fetch the updated profile
    console.log('Fetching updated profile');
    const updatedProfile = await getUserById(userId);
    if (!updatedProfile) {
      throw new Error('Failed to retrieve updated profile');
    }
    
    console.log('Profile update complete');
    return updatedProfile;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Update current user's profile
 */
export const updateCurrentUserProfile = async (
  profileData: Partial<UserProfile>,
  avatarFile?: File | null
): Promise<UserProfile | null> => {
  console.log('Updating current user profile');
  console.log('Auth state:', auth ? 'Auth initialized' : 'Auth not initialized');
  
  // First try to get the current user from Firebase Auth
  const currentUser = auth.currentUser;
  console.log('Current user from auth:', currentUser ? `User ID: ${currentUser.uid}` : 'No current user');
  
  if (!currentUser) {
    console.log('No current user in auth, checking localStorage token');
    // Fallback to token authentication
    
    // If we don't have a current user, check if we have a token in localStorage
    // This is a fallback mechanism when Firebase Auth isn't fully initialized
    const token = localStorage.getItem('bndyAuthToken');
    if (token) {
      try {
        console.log('Found token in localStorage, attempting to decode');
        // Try to decode the token to get the user ID
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded && decoded.uid) {
          console.log('Successfully decoded token, user ID:', decoded.uid);
          // Using UID from token
          return updateUserProfile(decoded.uid, profileData, avatarFile);
        }
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
    
    console.error('No authenticated user found');
    throw new Error('No authenticated user found. Please try refreshing the page.');
  }
  
  console.log('Updating profile for current user ID:', currentUser.uid);
  return updateUserProfile(currentUser.uid, profileData, avatarFile);
};
