'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, AlertTriangle } from 'lucide-react';

// Function to render the pink exclamation mark for unimplemented features
export const NotImplementedMark = () => (
  <div className="absolute top-2 right-2">
    <AlertTriangle className="h-6 w-6 text-pink-500" />
  </div>
);

interface FeatureCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  count: number;
  isImplemented: boolean;
}

export const FeatureCard = ({ 
  name, 
  description, 
  icon, 
  href, 
  count, 
  isImplemented 
}: FeatureCardProps) => {
  return (
    <Link 
      href={href}
      className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex flex-col items-center text-center relative"
    >
      {icon}
      <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">{name}</h3>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>
      {count > 0 && (
        <span className="mt-2 px-2 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300 rounded-full text-xs">
          {count} {name.toLowerCase()}
        </span>
      )}
      {!isImplemented && <NotImplementedMark />}
    </Link>
  );
};

export default FeatureCard;
