'use client';

import React from 'react';
import { useTheme } from '@/lib/context/theme-context';

interface ThemeAwareComponentProps {
  /** Primary content or label */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Optional variant */
  variant?: 'default' | 'primary' | 'secondary';
  /** Optional size */
  size?: 'sm' | 'md' | 'lg';
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * A template for creating theme-aware components
 * 
 * This component demonstrates best practices for implementing
 * theme support in bndy-core components.
 */
const ThemeAwareComponent: React.FC<ThemeAwareComponentProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  onClick,
}) => {
  // Access the theme context to get current theme state
  const { isDarkMode } = useTheme();

  // Determine base classes based on variant
  const variantClasses = {
    default: 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700',
    primary: 'bg-orange-500 text-white border border-orange-500 hover:bg-orange-600 hover:border-orange-600',
    secondary: 'bg-cyan-500 text-white border border-cyan-500 hover:bg-cyan-600 hover:border-cyan-600',
  };

  // Determine size classes
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  // Combine all classes
  const combinedClasses = `
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    rounded-lg
    transition-colors duration-300
    ${className}
  `;

  // Example of dynamic styles based on theme
  const dynamicStyles = {
    // Only apply these styles in specific scenarios
    boxShadow: isDarkMode 
      ? '0 2px 4px rgba(0, 0, 0, 0.3)' 
      : '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div 
      className={combinedClasses}
      style={dynamicStyles}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ThemeAwareComponent;
