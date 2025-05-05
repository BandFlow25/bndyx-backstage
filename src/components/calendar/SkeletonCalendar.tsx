'use client';

import React from 'react';

/**
 * Skeleton loading component for the calendar
 * Shows a loading placeholder for the calendar grid
 */
const SkeletonCalendar: React.FC = () => {
  // Create a 6x7 grid for a month view (6 weeks, 7 days per week)
  const weeks = 6;
  const daysPerWeek = 7;
  
  // Performance tracking
  const renderStartTime = performance.now();
  console.log(`[PERF][${new Date().toISOString()}] SkeletonCalendar - Rendering skeleton`);
  
  // Generate skeleton grid
  const skeletonGrid = Array(weeks).fill(0).map((_, weekIndex) => (
    <div key={`week-${weekIndex}`} className="grid grid-cols-7 gap-1">
      {Array(daysPerWeek).fill(0).map((_, dayIndex) => (
        <div 
          key={`day-${weekIndex}-${dayIndex}`} 
          className="h-24 p-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 animate-pulse"
        >
          {/* Day number skeleton */}
          <div className="h-5 w-5 mb-2 rounded-full bg-gray-200 dark:bg-gray-700" />
          
          {/* Event dots skeleton */}
          <div className="space-y-1">
            <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-2 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
            {weekIndex % 2 === 0 && dayIndex % 3 === 0 && (
              <div className="h-2 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
            )}
          </div>
        </div>
      ))}
    </div>
  ));
  
  // Calendar header skeleton
  const skeletonHeader = (
    <div className="flex justify-between items-center mb-4">
      <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="flex space-x-2">
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  );
  
  // Day names skeleton
  const skeletonDayNames = (
    <div className="grid grid-cols-7 gap-1 mb-1">
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
        <div key={day} className="text-center">
          <div className="h-5 w-8 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
  
  const renderEndTime = performance.now();
  console.log(`[PERF][${new Date().toISOString()}] SkeletonCalendar - Render completed in ${(renderEndTime - renderStartTime).toFixed(2)}ms`);
  
  return (
    <div className="w-full">
      {skeletonHeader}
      {skeletonDayNames}
      <div className="space-y-1">
        {skeletonGrid}
      </div>
    </div>
  );
};

export default SkeletonCalendar;
