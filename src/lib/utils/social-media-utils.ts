// src/lib/utils/social-media-utils.ts
// SocialMediaLinks type now comes from Artist.socialMedia in 'bndy-types'.
// import { Artist } from 'bndy-types';

/**
 * Attempts to extract a profile image URL from social media links
 * This is a simple implementation that could be expanded with actual API calls
 * in a production environment
 * 
 * @param socialMedia The social media links object
 * @returns A promise that resolves to a profile image URL or null if none found
 */
export async function extractProfileImageFromSocialMedia(
  socialMedia: {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  spotify?: string;
  website?: string;
}
): Promise<string | null> {
  // In a real implementation, we would use the APIs of the respective platforms
  // to fetch profile images. For now, we'll just return a placeholder image
  // based on which social media links are provided.
  
  // For a production implementation, you would need to:
  // 1. Register apps with each social media platform
  // 2. Use their APIs to fetch profile data
  // 3. Extract the profile image URL from the response
  
  // This is just a placeholder implementation
  if (socialMedia.instagram) {
    // In production: Use Instagram Graph API to fetch profile image
    return null;
  }
  
  if (socialMedia.facebook) {
    // In production: Use Facebook Graph API to fetch profile image
    return null;
  }
  
  if (socialMedia.twitter) {
    // In production: Use Twitter API to fetch profile image
    return null;
  }
  
  if (socialMedia.spotify) {
    // In production: Use Spotify API to fetch artist image
    return null;
  }
  
  return null;
}

/**
 * Attempts to extract a header image URL from social media links
 * This is a simple implementation that could be expanded with actual API calls
 * in a production environment
 * 
 * @param socialMedia The social media links object
 * @returns A promise that resolves to a header image URL or null if none found
 */
export async function extractHeaderImageFromSocialMedia(
  socialMedia: {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  spotify?: string;
  website?: string;
}
): Promise<string | null> {
  // Similar to profile image extraction, this would use APIs in production
  
  // This is just a placeholder implementation
  if (socialMedia.facebook) {
    // In production: Use Facebook Graph API to fetch cover photo
    return null;
  }
  
  if (socialMedia.twitter) {
    // In production: Use Twitter API to fetch banner image
    return null;
  }
  
  if (socialMedia.spotify) {
    // In production: Use Spotify API to fetch artist banner
    return null;
  }
  
  return null;
}

/**
 * Validates a social media URL to ensure it's properly formatted
 * 
 * @param url The URL to validate
 * @param platform The social media platform
 * @returns True if the URL is valid for the given platform, false otherwise
 */
export function validateSocialMediaUrl(url: string, platform: keyof {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  spotify?: string;
  website?: string;
}): boolean {
  if (!url) return true; // Empty URLs are considered valid (optional fields)
  
  try {
    // Basic URL validation
    new URL(url);
    
    // Platform-specific validation
    switch (platform) {
      case 'instagram':
        return url.includes('instagram.com');
      case 'facebook':
        return url.includes('facebook.com');
      case 'twitter':
        return url.includes('twitter.com') || url.includes('x.com');
      case 'spotify':
        return url.includes('spotify.com');
      case 'youtube':
        return url.includes('youtube.com') || url.includes('youtu.be');
      case 'website':
        return true; // Any valid URL is acceptable for website
      default:
        return false;
    }
  } catch (err) {
    return false; // Invalid URL format
  }
}
