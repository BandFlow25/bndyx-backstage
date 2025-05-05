// src/lib/services/cache/artist-cache.ts
import { Artist } from '../artist/types';
import { getArtistsByUserId } from '../artist/user-artists';

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const CACHE_ENABLED = true; // Can be toggled for debugging

// Cache structure
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// In-memory cache
const artistCache = new Map<string, CacheEntry<Artist[]>>();

/**
 * Get artists for a user with caching
 * This function will cache results to reduce database queries
 * 
 * @param userId The user ID to get artists for
 * @param forceRefresh Force a refresh of the cache
 * @returns Promise<Artist[]> Array of artists the user is a member of
 */
export async function getCachedArtistsByUserId(
  userId: string,
  forceRefresh = false
): Promise<Artist[]> {
  const startTime = performance.now();
  const cacheKey = `artists_${userId}`;
  
  // Log cache status
  console.log(`[PERF][${new Date().toISOString()}] ArtistCache - Cache ${CACHE_ENABLED ? 'enabled' : 'disabled'}`);
  
  // Check if caching is enabled and we have a valid cache entry
  if (CACHE_ENABLED && !forceRefresh) {
    const cachedData = artistCache.get(cacheKey);
    
    // Check if cache entry exists and is still valid
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
      const endTime = performance.now();
      console.log(`[PERF][${new Date().toISOString()}] ArtistCache - Cache HIT for user ${userId} - Returned ${cachedData.data.length} artists in ${(endTime - startTime).toFixed(2)}ms`);
      return cachedData.data;
    }
    
    // Log cache miss reason
    if (!cachedData) {
      console.log(`[PERF][${new Date().toISOString()}] ArtistCache - Cache MISS for user ${userId} - No cache entry`);
    } else {
      console.log(`[PERF][${new Date().toISOString()}] ArtistCache - Cache MISS for user ${userId} - Cache expired (${Math.floor((Date.now() - cachedData.timestamp) / 1000)}s old)`);
    }
  } else if (forceRefresh) {
    console.log(`[PERF][${new Date().toISOString()}] ArtistCache - Force refresh requested for user ${userId}`);
  }
  
  // Fetch fresh data
  console.log(`[PERF][${new Date().toISOString()}] ArtistCache - Fetching fresh data for user ${userId}`);
  const artists = await getArtistsByUserId(userId);
  
  // Update cache if caching is enabled
  if (CACHE_ENABLED) {
    artistCache.set(cacheKey, {
      data: artists,
      timestamp: Date.now()
    });
    console.log(`[PERF][${new Date().toISOString()}] ArtistCache - Updated cache for user ${userId} with ${artists.length} artists`);
  }
  
  const endTime = performance.now();
  console.log(`[PERF][${new Date().toISOString()}] ArtistCache - Returned ${artists.length} artists in ${(endTime - startTime).toFixed(2)}ms (from database)`);
  
  return artists;
}

/**
 * Clear the artist cache for a specific user
 * Call this when user's artist memberships change
 * 
 * @param userId The user ID to clear cache for
 */
export function clearArtistCache(userId: string): void {
  const cacheKey = `artists_${userId}`;
  const hadCache = artistCache.has(cacheKey);
  
  artistCache.delete(cacheKey);
  
  console.log(`[PERF][${new Date().toISOString()}] ArtistCache - Cache ${hadCache ? 'cleared' : 'was already empty'} for user ${userId}`);
}

/**
 * Clear the entire artist cache
 * Call this when major changes happen or during testing
 */
export function clearAllArtistCache(): void {
  const cacheSize = artistCache.size;
  
  artistCache.clear();
  
  console.log(`[PERF][${new Date().toISOString()}] ArtistCache - Cleared entire cache (${cacheSize} entries)`);
}
