"use client";

import { createContext, useContext, ReactNode, useEffect, useReducer } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getFirebaseAuth } from '../firebase';

// Targeted debug logging
const DEBUG = true;
const logAuth = (message: string, ...args: any[]) => {
  if (DEBUG) {
    console.log(`AUTH_FLOW: ${message}`, ...args);
  }
};

// Define our custom JWT payload interface
interface BndyJwtPayload {
  uid: string;
  email?: string;
  displayName?: string | null;
  photoURL?: string | null;
  roles?: string[] | string;
  godMode?: boolean;
  godmode?: boolean;
  GODMODE?: boolean;
  GodMode?: boolean;
  exp: number;
  iat?: number;
}

// Define user roles that match bndy-landing
export type UserRole = 'user' | 'live_admin' | 'live_builder' | 'live_giggoer' | 'bndy_band' | 'bndy_artist' | 'bndy_venue' | 'bndy_agent' | 'bndy_studio' | 'admin' | 'bndy_admin' | 'GODMODE' | string; // Allow any string role to avoid type errors

interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  roles: UserRole[];
  godMode?: boolean; // Add godMode flag to user profile
}

// Define auth state shape
type AuthState = {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  token: string | null;
  tokenProcessed: boolean;
};

// Define auth actions
type AuthAction = 
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'SET_TOKEN_PROCESSED'; payload: boolean }
  | { type: 'AUTH_RESET' }
  | { type: 'AUTH_INITIALIZED'; payload: { user: UserProfile | null; token: string | null } };

// Auth reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  logAuth(`Reducer action: ${action.type}`);
  
  switch (action.type) {
    case 'SET_USER':
      logAuth(`Setting user: ${action.payload.uid}`);
      return { ...state, user: action.payload };
    case 'CLEAR_USER':
      return { ...state, user: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_TOKEN_PROCESSED':
      return { ...state, tokenProcessed: action.payload };
    case 'AUTH_RESET':
      logAuth('Resetting auth state');
      return { ...state, user: null, token: null, error: null, tokenProcessed: false };
    case 'AUTH_INITIALIZED':
      logAuth(`Initializing auth state with user: ${action.payload.user?.uid}`);
      return { 
        ...state, 
        user: action.payload.user, 
        token: action.payload.token,
        loading: false,
        tokenProcessed: true 
      };
    default:
      return state;
  }
};

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  logout: () => void;
  getAuthToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  logout: () => {},
  getAuthToken: async () => null,
});

// DO NOT USE THIS FILE. Use AuthProvider and useAuth from 'bndy-ui/components/auth'.
throw new Error('[bndy-core] Do not import useAuth from local auth-context. Use bndy-ui/components/auth instead.');

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state with useReducer
  const [authState, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
    error: null,
    token: null,
    tokenProcessed: false
  });
  
  // Log reducer initialization
  logAuth('Auth reducer initialized');
  
  // Destructure state for easier access
  const { user, loading, error, token, tokenProcessed } = authState;
  
  // Performance-optimized token processing
  const processToken = async (tokenToProcess: string): Promise<boolean> => {
    const startTime = Date.now();
    const perfMark = (stage: string) => {
      console.log(`AUTH_PERF: ${stage} - ${Date.now() - startTime}ms`);
    };
    
    logAuth(`Processing token (start)`);
    perfMark('token_process_start');
    
    if (!tokenToProcess || tokenToProcess.trim() === '') {
      logAuth('Empty token provided');
      dispatch({ type: 'SET_ERROR', payload: 'Invalid token: Empty' });
      return false;
    }
    
    // OPTIMIZATION: First check if we've already processed this exact token
    // This helps avoid redundant processing during page loads/redirects
    if (tokenToProcess === token && user) {
      logAuth('Token already processed - reusing existing user profile');
      perfMark('token_already_processed');
      return true;
    }
    
    try {
      // Use memory-efficient jwtDecode - much faster than server verification
      let decoded: BndyJwtPayload;
      try {
        perfMark('before_decode');
        decoded = jwtDecode<BndyJwtPayload>(tokenToProcess);
        perfMark('after_decode');
        logAuth(`Token decoded for user: ${decoded.uid}`);
      } catch (decodeError) {
        logAuth('Token decode failed', decodeError);
        dispatch({ type: 'SET_ERROR', payload: 'Token decode failed' });
        return false;
      }
      
      // Fast expiration check
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp > now) {
        perfMark('token_valid');
        
        // OPTIMIZATION: Process everything in memory before dispatching state updates
        // Process token roles with cached results
        let processedRoles: UserRole[] = [];
        
        if (decoded.roles) {
          if (Array.isArray(decoded.roles)) {
            processedRoles = decoded.roles as UserRole[];
          } else if (typeof decoded.roles === 'string') {
            // Fast string parsing without regex when possible
            if (decoded.roles.includes(',')) {
              processedRoles = decoded.roles.split(',').map(r => r.trim()) as UserRole[];
            } else {
              processedRoles = [decoded.roles as UserRole];
            }
          }
        } else {
          processedRoles = ['user']; // Default role
        }
        perfMark('roles_processed');
        
        // Fast boolean flags check using direct property access
        const godMode = decoded.godMode === true || 
                       decoded.godmode === true || 
                       decoded.GodMode === true || 
                       decoded.GODMODE === true;
        
        // Create user profile from token (all memory operations)
        const userFromToken: UserProfile = {
          uid: decoded.uid,
          email: decoded.email || null,
          displayName: decoded.displayName || null,
          photoURL: decoded.photoURL || null,
          roles: processedRoles,
          godMode
        };
        perfMark('user_profile_created');
        
        // Cache token in localStorage immediately for future page loads
        if (typeof window !== 'undefined') {
          localStorage.setItem('bndyAuthToken', tokenToProcess);
        }
        perfMark('token_cached');
        
        // Single atomic state update (most efficient)
        dispatch({ 
          type: 'AUTH_INITIALIZED', 
          payload: { 
            user: userFromToken, 
            token: tokenToProcess 
          } 
        });
        perfMark('state_updated');
        
        // Log completion time
        const duration = Date.now() - startTime;
        logAuth(`Token processed in ${duration}ms`);
        return true;
      } else {
        logAuth('Token expired');
        dispatch({ type: 'SET_ERROR', payload: 'Token expired' });
        // Remove expired token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('bndyAuthToken');
        }
        return false;
      }
    } catch (err) {
      logAuth('Error processing token', err);
      return false;
    }
  };
  
  // High-performance auth initialization with optimized token extraction
  useEffect(() => {
    const initAuth = async () => {
      const startTime = Date.now();
      logAuth('Authentication initialization started');
      const perf = (step: string) => {
        console.log(`AUTH_PERF: ${step} - ${Date.now() - startTime}ms`);
      };
      
      perf('init_start');
      
      // Skip SSR processing completely - only run in browser
      if (typeof window === 'undefined') {
        logAuth('Not in browser context');
        return;
      }
      
      // PERFORMANCE: Check URL params first - fastest path
      // URL params indicate we just arrived from bndy-landing with a fresh token
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');
      
      if (urlToken) {
        perf('url_token_found');
        logAuth('Found token in URL parameters - using fast path');
        
        try {
          // Process URL token immediately
          const success = await processToken(urlToken);
          perf('url_token_processed');
          
          if (success) {
            // Clean up URL by removing token parameter (security best practice)
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('token');
            
            // Use history API to update URL without full page reload
            window.history.replaceState({}, document.title, newUrl.toString());
            perf('url_cleaned');
            return; // Exit early - authentication complete
          } else {
            logAuth('URL token processing failed');
            perf('url_token_failed');
          }
        } catch (err) {
          logAuth('Error processing URL token', err);
          perf('url_token_error');
        }
      }
      
      // Check localStorage as fallback - fast but not as immediate as URL
      const storedToken = localStorage.getItem('bndyAuthToken');
      perf('localStorage_checked');
      
      if (storedToken && !tokenProcessed) {
        logAuth('Using token from localStorage');
        perf('before_stored_token_process');
        
        try {
          const success = await processToken(storedToken);
          perf('after_stored_token_process');
          
          if (!success) {
            logAuth('Stored token invalid, removing');
            localStorage.removeItem('bndyAuthToken');
            dispatch({ type: 'AUTH_RESET' });
            // Clear loading status to avoid blocking UI
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } catch (err) {
          logAuth('Error processing stored token', err);
          perf('stored_token_error');
          localStorage.removeItem('bndyAuthToken');
          dispatch({ type: 'AUTH_RESET' });
          // Always ensure UI isn't blocked
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else if (!storedToken) {
        // No authentication sources found, exit loading state
        logAuth('No authentication token found');
        dispatch({ type: 'SET_LOADING', payload: false });
      } else if (tokenProcessed && user) {
        // Already have user and token processed
        logAuth('User already authenticated, skipping initialization');
        perf('already_authenticated');
      }
      
      perf('auth_init_complete');
      logAuth(`Auth initialization completed in ${Date.now() - startTime}ms`);
    };
    
    // Execute initialization immediately
    initAuth();
  }, []); // Empty dependency array means this runs once on mount
  
  // Ultra-fast safety net to prevent UI blocking
  useEffect(() => {
    // Skip if already loaded or no window object
    if (!loading || typeof window === 'undefined') return;
    
    logAuth('Setting tiered safety timeouts for loading state');
    const start = Date.now();
    
    // OPTIMIZATION: Use multiple tiered timeouts for faster recovery
    // Tier 1: Fast recovery (500ms) - attempt minimal processing
    const fastRecovery = setTimeout(() => {
      if (loading) {
        logAuth(`⚠️ Fast recovery triggered after ${Date.now() - start}ms`);
        
        // Check URL for token first (fastest source)
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const urlToken = params.get('token');
          
          if (urlToken) {
            logAuth('RECOVERY: Found token in URL');
            // Process URL token for quick authentication
            processToken(urlToken).catch(() => {
              logAuth('Fast URL token recovery failed');
            });
          }
        }
      }
    }, 500);
    
    // Tier 2: Medium recovery (1000ms) - check localStorage
    const mediumRecovery = setTimeout(() => {
      if (loading) {
        logAuth(`⚠️ Medium recovery triggered after ${Date.now() - start}ms`);
        
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('bndyAuthToken');
          if (storedToken && !user) {
            logAuth('RECOVERY: Processing token from localStorage');
            processToken(storedToken).catch(() => {
              logAuth('Medium localStorage recovery failed');
            });
          }
        }
      }
    }, 1000);
    
    // Tier 3: Emergency recovery (1500ms) - force UI to proceed
    const emergencyRecovery = setTimeout(() => {
      if (loading) {
        logAuth(`🚨 Emergency recovery triggered after ${Date.now() - start}ms`);
        
        // Handle emergency token extraction if possible
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('bndyAuthToken');
          if (token && !user) {
            try {
              // Ultra-fast emergency processing
              const decoded = jwtDecode<BndyJwtPayload>(token);
              
              // Create minimal user profile with just essential data
              const emergencyUser: UserProfile = {
                uid: decoded.uid,
                email: decoded.email || null,
                displayName: decoded.displayName || null,
                photoURL: decoded.photoURL || null,
                roles: Array.isArray(decoded.roles) ? decoded.roles as UserRole[] : 
                       typeof decoded.roles === 'string' ? [decoded.roles as UserRole] : ['user'],
                godMode: decoded.godMode === true || decoded.godmode === true || 
                        decoded.GODMODE === true || decoded.GodMode === true
              };
              
              logAuth('EMERGENCY: Created minimal user profile');
              dispatch({ type: 'AUTH_INITIALIZED', payload: { user: emergencyUser, token } });
            } catch (err) {
              // Last resort - clear everything and exit loading state
              logAuth('EMERGENCY: All recovery attempts failed');
              localStorage.removeItem('bndyAuthToken');
              dispatch({ type: 'AUTH_RESET' });
            }
          } else {
            // No token or user already exists - just exit loading state
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
        
        // CRITICAL: Absolute last resort emergency escape
        // First, ensure we're not in an infinite loop by immediately exiting loading state
        dispatch({ type: 'SET_LOADING', payload: false });
        logAuth('CRITICAL: Forced loading state to false to prevent UI blocking');
        
        // Check if we should force a refresh as last resort
        // This is controlled by sessionStorage to prevent refresh loops
        const canRefresh = !sessionStorage.getItem('forceNoRefresh');
        const hasRefreshed = sessionStorage.getItem('authRefreshCount') === '1';
        
        // If we have a token but no auth state AND haven't refreshed yet, try one refresh
        if (canRefresh && !hasRefreshed && localStorage.getItem('bndyAuthToken')) {
          // Create an absolute time-based guard to prevent loops
          const lastRefreshTime = Number(sessionStorage.getItem('lastRefreshTime') || '0');
          const timeSinceLastRefresh = Date.now() - lastRefreshTime;
          
          // Only refresh if it's been at least 10 seconds since the last refresh
          if (timeSinceLastRefresh > 10000) {
            logAuth('LAST RESORT: Attempting final page refresh for auth sync');
            sessionStorage.setItem('authRefreshCount', '1');
            sessionStorage.setItem('lastRefreshTime', Date.now().toString());
            
            // IMPORTANT: If we're still having issues, don't try more refreshes
            setTimeout(() => window.location.reload(), 100);
          } else {
            // If we're still in trouble, set a flag to completely disable refresh attempts
            sessionStorage.setItem('forceNoRefresh', 'true');
            logAuth('CRITICAL: Multiple refresh attempts detected - disabling refresh mechanism');
          }
        } else {
          // We've already refreshed or can't refresh - log the state
          logAuth(`RECOVERY: No refresh attempted. CanRefresh: ${canRefresh}, HasRefreshed: ${hasRefreshed}`);
        }
      }
    }, 1500);

    return () => {
      clearTimeout(fastRecovery);
      clearTimeout(mediumRecovery);
      clearTimeout(emergencyRecovery);
    };
  }, [loading, user, tokenProcessed]);

  // Monitor authentication state changes and handle final escape hatch
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      logAuth(`✓ User authenticated: ${user.uid} (${user.roles.join(', ')}) on path: ${currentPath}`);
      
      // Reset emergency state since we're fully authenticated
      if (sessionStorage.getItem('authRefreshCount') === '1') {
        logAuth('Clearing emergency state flags after successful authentication');
      }
    } else if (!user && !loading && typeof window !== 'undefined') {
      logAuth('✗ No user authenticated after loading completed');
      
      // CRITICAL SAFETY: If we have a token but no user and we're not loading, 
      // clear everything to prevent future loops
      if (localStorage.getItem('bndyAuthToken')) {
        logAuth('⚠️ WARNING: Found token but no user after loading completed - clearing token');
        localStorage.removeItem('bndyAuthToken');
      }
    }
    
    // FINAL FALLBACK: Force exit loading after 5 seconds no matter what
    if (loading && typeof window !== 'undefined') {
      const absoluteTimeout = setTimeout(() => {
        logAuth('🔥 ABSOLUTE EMERGENCY: Forcing loading state to false after timeout');
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 5000);
      
      return () => clearTimeout(absoluteTimeout);
    }
  }, [user, loading]);

  // Get the current token (used by API services)
  const getAuthToken = async (): Promise<string | null> => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bndyAuthToken');
    }
    return null;
  };

  // Logout function
  const logout = () => {
    logAuth('Logout called, clearing authentication state');
    
    // Clear token and reset auth state
    localStorage.removeItem('bndyAuthToken');
    dispatch({ type: 'AUTH_RESET' });
    
    // Redirect to bndy-landing homepage
    if (typeof window !== 'undefined') {
      const landingUrl = process.env.NEXT_PUBLIC_LANDING_URL || 'https://bndy.rocks';
      logAuth(`Redirecting to landing page: ${landingUrl}`);
      window.location.href = landingUrl;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, logout, getAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};
