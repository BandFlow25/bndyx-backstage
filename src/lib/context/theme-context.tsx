"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { applyTheme as applyThemeUtil, initializeTheme, forceRepaint } from "@/lib/utils/theme-utils";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  isLoaded: false
});

// Use this hook to access the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Theme state - Default to false initially to match SSR
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  // Track if the component has mounted to avoid hydration mismatch
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Helper function to apply theme to document
  const applyTheme = useCallback((dark: boolean) => {
    if (typeof window === 'undefined') return;
    
    try {
      // Get the HTML element
      const htmlElement = document.documentElement;
      
      // Apply the dark class
      if (dark) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }
      
      // Add the js-loaded class to enable transitions
      if (!htmlElement.classList.contains('js-loaded')) {
        setTimeout(() => {
          htmlElement.classList.add('js-loaded');
        }, 100);
      }
      
      // Theme applied
    } catch (e) {
      // Error handling silenced
    }
  }, []);

  // Function to toggle theme and save preference
  const toggleTheme = useCallback(() => {
    if (!isLoaded) return;
    
    // Toggling theme
    
    // Save to localStorage before updating state
    try {
      localStorage.setItem("bndy-theme-preference", !isDarkMode ? "dark" : "light");
    } catch (e) {
      // Error handling silenced
    }
    
    // Update state (will trigger the useEffect to apply the theme)
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode, isLoaded]);

  // Initialize theme handling and detect initial theme - only runs client-side
  useEffect(() => {
    // Mark component as mounted
    setIsLoaded(true);
    
    // Safely detect theme preference
    try {
      // Load theme preference
      const savedTheme = localStorage.getItem("bndy-theme-preference");
      
      // If no preference is saved, check system preference, fallback to light
      let shouldUseDarkMode = false;
      
      if (savedTheme === null) {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          shouldUseDarkMode = true;
        }
      } else {
        // Use saved preference
        shouldUseDarkMode = savedTheme === "dark";
      }
      
      // Set the theme state
      setIsDarkMode(shouldUseDarkMode);
      
      // Apply the theme
      applyTheme(shouldUseDarkMode);
    } catch (e) {
      // Error handling silenced
    }
  }, [applyTheme]);

  // Apply theme whenever isDarkMode changes after initial load
  useEffect(() => {
    if (isLoaded) {
      applyTheme(isDarkMode);
    }
  }, [isDarkMode, isLoaded, applyTheme]);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        isLoaded
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// This function is now defined at the top of the file
