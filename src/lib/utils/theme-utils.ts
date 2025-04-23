/**
 * Theme utilities for managing dark/light mode
 */

/**
 * Force a repaint of the page to ensure theme changes are applied
 */
export function forceRepaint(): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Add a class to disable transitions temporarily
    document.documentElement.classList.add('theme-transition-disabled');
    
    // Force a repaint by accessing a layout property
    const _ = document.body.offsetHeight;
    
    // Remove the transition-disabling class after a short delay
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition-disabled');
    }, 50);
  } catch (e) {
    // Error handling silenced
  }
}

/**
 * Initialize theme handling
 */
export function initializeTheme(): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Set up a MutationObserver to watch for class changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          // When the class attribute changes, ensure proper CSS transitions
          // HTML class changed, ensuring proper transitions
        }
      });
    });
    
    // Start observing the html element for class attribute changes
    observer.observe(document.documentElement, { attributes: true });
    
    // Force a repaint when the page loads to ensure theme is applied correctly
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          forceRepaint();
          // Theme initialized with forced repaint
        }, 0);
      });
    } else {
      // Document already loaded
      setTimeout(() => {
        forceRepaint();
        // Theme initialized with forced repaint
      }, 0);
    }
    
    // Theme initialization complete
  } catch (e) {
    // Error handling silenced
  }
}

/**
 * Apply theme class to HTML element
 */
export function applyTheme(isDarkMode: boolean): void {
  if (typeof window === 'undefined') return;
  
  try {
    const htmlElement = document.documentElement;
    
    if (isDarkMode) {
      htmlElement.classList.add('dark');
      htmlElement.classList.remove('light');
    } else {
      htmlElement.classList.remove('dark');
    }
    
    // Force a repaint to ensure theme changes are applied
    // Use requestAnimationFrame to ensure it happens after the class changes
    requestAnimationFrame(() => {
      forceRepaint();
    });
  } catch (e) {
    // Error handling silenced
  }
}
