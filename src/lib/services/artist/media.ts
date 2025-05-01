// src/lib/services/artist/media.ts
import { 
  doc, 
  updateDoc, 
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { firestore, storage } from '../../firebase';
import { COLLECTIONS } from '../../firebase/collections';

/**
 * Upload an artist avatar image
 * @param artistId The artist ID
 * @param file The image file
 * @returns The URL of the uploaded image
 */
export async function uploadAvatarImage(artistId: string, file: File): Promise<string> {
  const fileExtension = file.name.split('.').pop();
  const fileName = `avatar_${Date.now()}.${fileExtension}`;
  const storageRef = ref(storage, `artists/${artistId}/images/${fileName}`);
  
  // Upload the file
  await uploadBytes(storageRef, file);
  
  // Get the download URL
  const downloadUrl = await getDownloadURL(storageRef);
  
  // Update the artist document with the new avatar URL
  const artistRef = doc(firestore, COLLECTIONS.ARTISTS, artistId);
  await updateDoc(artistRef, {
    avatarUrl: downloadUrl,
    updatedAt: serverTimestamp()
  });
  
  return downloadUrl;
}

/**
 * Upload an artist header image
 * @param artistId The artist ID
 * @param file The image file
 * @returns The URL of the uploaded image
 */
export async function uploadHeaderImage(artistId: string, file: File): Promise<string> {
  const fileExtension = file.name.split('.').pop();
  const fileName = `header_${Date.now()}.${fileExtension}`;
  const storageRef = ref(storage, `artists/${artistId}/images/${fileName}`);
  
  // Upload the file
  await uploadBytes(storageRef, file);
  
  // Get the download URL
  const downloadUrl = await getDownloadURL(storageRef);
  
  // Update the artist document with the new header image URL
  const artistRef = doc(firestore, COLLECTIONS.ARTISTS, artistId);
  await updateDoc(artistRef, {
    headerImageUrl: downloadUrl,
    updatedAt: serverTimestamp()
  });
  
  return downloadUrl;
}

/**
 * Delete an artist image from storage
 * @param imageUrl The URL of the image to delete
 */
export async function deleteArtistImage(imageUrl: string): Promise<void> {
  try {
    // Extract the path from the URL
    const decodedUrl = decodeURIComponent(imageUrl);
    const startIndex = decodedUrl.indexOf('artists/');
    
    if (startIndex === -1) {
      console.error('Invalid image URL format:', imageUrl);
      return;
    }
    
    const path = decodedUrl.substring(startIndex);
    const storageRef = ref(storage, path);
    
    // Delete the file
    await deleteObject(storageRef);
    console.log('Image deleted successfully:', path);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw the error to prevent UI from crashing
  }
}
