import SpotifyWebApi from 'spotify-web-api-js';

// Initialize the Spotify Web API client
const spotifyApi = new SpotifyWebApi();

// Cache for Spotify track metadata to limit API calls
interface TrackMetadataCache {
  [trackId: string]: {
    name: string;
    artists: string[];
    album: string;
    duration_ms: number;
    tempo?: number;
    key?: number;
    timeAdded: number;
  };
}

// In-memory cache with 24-hour expiration
const metadataCache: TrackMetadataCache = {};
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Set the access token for the Spotify API
 */
export const setSpotifyAccessToken = (token: string) => {
  spotifyApi.setAccessToken(token);
};

/**
 * Get cached track metadata or fetch from Spotify API
 */
export const getTrackMetadata = async (trackId: string) => {
  const now = Date.now();
  
  // Check if track is in cache and not expired
  if (metadataCache[trackId] && (now - metadataCache[trackId].timeAdded) < CACHE_EXPIRATION) {
    return metadataCache[trackId];
  }
  
  // Fetch from Spotify API
  try {
    const trackData = await spotifyApi.getTrack(trackId);
    const audioFeatures = await spotifyApi.getAudioFeaturesForTrack(trackId);
    
    // Store in cache
    metadataCache[trackId] = {
      name: trackData.name,
      artists: trackData.artists.map(artist => artist.name),
      album: trackData.album.name,
      duration_ms: trackData.duration_ms,
      tempo: audioFeatures.tempo,
      key: audioFeatures.key,
      timeAdded: now
    };
    
    return metadataCache[trackId];
  } catch (error) {
    console.error('Error fetching track metadata from Spotify:', error);
    throw error;
  }
};

/**
 * Create a playlist on Spotify
 */
export const createPlaylist = async (userId: string, name: string, description: string = '') => {
  try {
    const response = await spotifyApi.createPlaylist(userId, {
      name,
      description,
      public: false
    });
    return response;
  } catch (error) {
    console.error('Error creating Spotify playlist:', error);
    throw error;
  }
};

/**
 * Add tracks to a Spotify playlist
 */
export const addTracksToPlaylist = async (playlistId: string, trackUris: string[]) => {
  try {
    const response = await spotifyApi.addTracksToPlaylist(playlistId, trackUris);
    return response;
  } catch (error) {
    console.error('Error adding tracks to Spotify playlist:', error);
    throw error;
  }
};

/**
 * Get user's playlists
 */
export const getUserPlaylists = async () => {
  try {
    const response = await spotifyApi.getUserPlaylists();
    return response;
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    throw error;
  }
};

/**
 * Get tracks from a playlist
 */
export const getPlaylistTracks = async (playlistId: string) => {
  try {
    const response = await spotifyApi.getPlaylistTracks(playlistId);
    return response;
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    throw error;
  }
};

/**
 * Search for tracks on Spotify
 */
export const searchTracks = async (query: string, limit: number = 10) => {
  try {
    const response = await spotifyApi.searchTracks(query, { limit });
    return response;
  } catch (error) {
    console.error('Error searching Spotify tracks:', error);
    throw error;
  }
};

export default spotifyApi;
