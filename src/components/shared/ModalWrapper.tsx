'use client';

import React, { ReactNode, useEffect, useState } from 'react';

// Global variable to track if any date picker is open
// This will be updated by the EventModal component
declare global {
  interface Window {
    isDatePickerOpen?: boolean;
  }
}

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

/**
 * A reusable modal wrapper component that provides consistent styling and behavior
 * for modals throughout the application.
 */
const ModalWrapper: React.FC<ModalWrapperProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  maxWidth = 'max-w-2xl' 
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Monitor the global date picker state
  useEffect(() => {
    const checkDatePickerState = () => {
      // Check if the global variable exists
      setIsDatePickerOpen(!!window.isDatePickerOpen);
    };

    // Check initially
    checkDatePickerState();

    // Set up a MutationObserver to detect changes to the DOM that might indicate a date picker opening/closing
    const observer = new MutationObserver(() => {
      checkDatePickerState();
    });

    // Observe the entire document for changes
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto transition-opacity duration-300"
      onClick={(e) => {
        // Close the modal when clicking the backdrop, but only if no date picker is open
        if (e.target === e.currentTarget && !isDatePickerOpen) {
          console.log('Modal backdrop clicked, date picker open:', isDatePickerOpen);
          onClose();
        } else if (isDatePickerOpen) {
          console.log('Date picker is open, preventing modal close');
          e.stopPropagation();
        }
      }}
    >
      <div className={`w-full ${maxWidth} transition-transform duration-300 transform`}>
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
