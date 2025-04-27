'use client';

import React, { ReactNode } from 'react';

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
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto transition-opacity duration-300"
      onClick={(e) => {
        // Close the modal when clicking the backdrop
        if (e.target === e.currentTarget) {
          onClose();
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
