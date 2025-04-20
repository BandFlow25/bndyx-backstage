"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type UserRole = 'user' | 'profile_owner' | 'builder';

interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: UserRole;
  profileType?: 'artist' | 'band' | 'venue';
  profileId?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Mock user data for development
const mockUser: UserProfile = {
  uid: 'mock-user-id',
  displayName: 'Demo User',
  email: 'demo@example.com',
  photoURL: 'https://via.placeholder.com/150',
  role: 'profile_owner',
  profileType: 'band',
  profileId: 'mock-profile-id',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate authentication loading
  useEffect(() => {
    const timer = setTimeout(() => {
      // For development, we'll auto-login with the mock user
      // In production, this would check Firebase auth state
      setUser(mockUser);
      setLoading(false);
    }, 1500); // Simulate a delay for auth checking

    return () => clearTimeout(timer);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // In production, this would call Firebase auth
      // For development, we'll just set the mock user
      setUser(mockUser);
      setError(null);
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login');
    } finally {
      setLoading(false);
    }
  };

  // Mock logout function
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
