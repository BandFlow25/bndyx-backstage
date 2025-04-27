'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clock, Check, X } from 'lucide-react';

interface BndyTimePickerProps {
  /**
   * The currently selected time in 24-hour format (HH:MM)
   */
  time: string;
  
  /**
   * Callback when time is selected
   */
  onTimeChange: (time: string) => void;
  
  /**
   * Label for the time picker button
   */
  label?: string;
  
  /**
   * Whether to use dark mode styling
   */
  darkMode?: boolean;
}

export function BndyTimePicker({
  time,
  onTimeChange,
  label = 'Select Time',
  darkMode = false
}: BndyTimePickerProps) {
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [selectedHour, setSelectedHour] = useState<number>(0);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [isSelectingHour, setIsSelectingHour] = useState<boolean>(true);
  const [isPm, setIsPm] = useState<boolean>(false);
  const timePickerRef = useRef<HTMLDivElement>(null);
  const clockFaceRef = useRef<HTMLDivElement>(null);

  // Initialize time state from props
  useEffect(() => {
    if (time) {
      const [hoursStr, minutesStr] = time.split(':');
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      
      setSelectedHour(hours >= 12 ? (hours === 12 ? 12 : hours - 12) : (hours === 0 ? 12 : hours));
      setSelectedMinute(Math.round(minutes / 5) * 5); // Round to nearest 5 minutes
      setIsPm(hours >= 12);
      setIsSelectingHour(true);
    }
  }, [time]);

  // Open the time picker dialog
  const openTimePicker = (): void => {
    // Parse current time
    const [hoursStr, minutesStr] = time.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    setSelectedHour(hours >= 12 ? (hours === 12 ? 12 : hours - 12) : (hours === 0 ? 12 : hours));
    setSelectedMinute(Math.round(minutes / 5) * 5); // Round to nearest 5 minutes
    setIsPm(hours >= 12);
    setIsSelectingHour(true);
    setShowTimePicker(true);
  };

  // Handle clock face click
  const handleClockFaceClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!clockFaceRef.current) return;
    
    const rect = clockFaceRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    // Calculate angle in radians
    let angle = Math.atan2(y, x);
    // Convert to degrees and adjust to start from 12 o'clock position
    let degrees = (angle * 180 / Math.PI + 90) % 360;
    if (degrees < 0) degrees += 360;
    
    if (isSelectingHour) {
      // 30 degrees per hour (360 / 12)
      let hour = Math.round(degrees / 30);
      if (hour === 0) hour = 12;
      setSelectedHour(hour);
      
      // After selecting hour, move to minute selection
      setTimeout(() => setIsSelectingHour(false), 300);
    } else {
      // 6 degrees per minute (360 / 60)
      // Round to nearest 5 minutes
      let minute = Math.round(degrees / 6);
      minute = Math.round(minute / 5) * 5;
      if (minute === 60) minute = 0;
      setSelectedMinute(minute);
    }
  };

  // Handle confirm time selection
  const handleConfirmTime = (): void => {
    // Convert 12-hour to 24-hour format
    let hours = selectedHour;
    if (isPm && hours !== 12) hours += 12;
    if (!isPm && hours === 12) hours = 0;
    
    const newTime = `${String(hours).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    onTimeChange(newTime);
    setShowTimePicker(false);
  };

  // Handle cancel
  const handleCancel = (): void => {
    setShowTimePicker(false);
  };

  // Format time for display (24h to 12h)
  const formatTime = (time24: string): string => {
    if (!time24) return '';
    
    const [hours, minutes] = time24.split(':').map(Number);
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const period = hours >= 12 ? 'PM' : 'AM';
    
    return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  // Handle outside click to close picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowTimePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate clock face hour markers
  const generateHourMarkers = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const hour = i + 1;
      const angle = (hour * 30) - 90; // 30 degrees per hour, starting at 12 o'clock (-90 degrees)
      const radian = angle * (Math.PI / 180);
      const radius = 80; // Distance from center
      
      const x = Math.cos(radian) * radius;
      const y = Math.sin(radian) * radius;
      
      return (
        <div 
          key={hour}
          className={`absolute flex items-center justify-center rounded-full text-sm font-medium cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 z-10
            ${selectedHour === hour && isSelectingHour ? 'bg-orange-500 text-white' : 'text-slate-800 dark:text-white'}`}
          style={{
            width: '30px',
            height: '30px',
            transform: `translate(${x}px, ${y}px)`,
            left: 'calc(50% - 15px)',
            top: 'calc(50% - 15px)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedHour(hour);
            setTimeout(() => setIsSelectingHour(false), 300);
          }}
        >
          {hour}
        </div>
      );
    });
  };

  // Generate clock face minute markers
  const generateMinuteMarkers = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const minute = i * 5;
      const angle = (minute * 6) - 90; // 6 degrees per minute, starting at 12 o'clock (-90 degrees)
      const radian = angle * (Math.PI / 180);
      const radius = 80; // Distance from center
      
      const x = Math.cos(radian) * radius;
      const y = Math.sin(radian) * radius;
      
      return (
        <div 
          key={minute}
          className={`absolute flex items-center justify-center rounded-full text-sm font-medium cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 z-10
            ${selectedMinute === minute && !isSelectingHour ? 'bg-orange-500 text-white' : 'text-slate-800 dark:text-white'}`}
          style={{
            width: '30px',
            height: '30px',
            transform: `translate(${x}px, ${y}px)`,
            left: 'calc(50% - 15px)',
            top: 'calc(50% - 15px)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedMinute(minute);
          }}
        >
          {minute === 0 ? '00' : minute}
        </div>
      );
    });
  };

  // Generate clock hand
  const generateClockHand = () => {
    let angle;
    if (isSelectingHour) {
      angle = (selectedHour * 30) - 90; // 30 degrees per hour
    } else {
      angle = (selectedMinute * 6) - 90; // 6 degrees per minute
    }
    
    // Calculate end point of the hand
    const handLength = isSelectingHour ? 60 : 75; // Shorter for hours, longer for minutes
    const radians = angle * (Math.PI / 180);
    const endX = Math.cos(radians) * handLength;
    const endY = Math.sin(radians) * handLength;
    
    return (
      <>
        {/* Line from center to selected value */}
        <div 
          className="absolute left-1/2 top-1/2 h-px bg-orange-500 z-10"
          style={{
            width: `${handLength}px`,
            transform: `rotate(${angle}deg)`,
            transformOrigin: '0 0',
          }}
        />
        
        {/* Center dot */}
        <div className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full bg-orange-500 transform -translate-x-1/2 -translate-y-1/2 z-20" />
      </>
    );
  };

  // Toggle AM/PM
  const toggleAmPm = () => {
    setIsPm(!isPm);
  };

  return (
    <div className="relative">
      <label className="block mb-1 font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>
      
      {/* Time display button */}
      <button
        type="button"
        className="w-full flex items-center justify-between p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        onClick={openTimePicker}
      >
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2 text-slate-500 dark:text-slate-300" />
          <span>{formatTime(time)}</span>
        </div>
      </button>
      
      {/* Time picker dialog */}
      {showTimePicker && (
        <div 
          ref={timePickerRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-xs w-full mx-auto p-4 border border-slate-200 special-time-picker">
            <div className="text-center font-bold text-slate-800 dark:text-white mb-4 special-time-picker-header">
              SELECT TIME
            </div>
            
            {/* Time display */}
            <div className="flex justify-center items-center mb-6 text-3xl font-medium">
              <div 
                className={`px-4 py-2 rounded cursor-pointer ${isSelectingHour ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200' : 'text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                onClick={() => setIsSelectingHour(true)}
              >
                <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  {selectedHour}
                </span>
              </div>
              <div className="mx-1 text-3xl font-bold text-slate-800 dark:text-slate-100">:</div>
              <div 
                className={`px-4 py-2 rounded cursor-pointer ${!isSelectingHour ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200' : 'text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                onClick={() => setIsSelectingHour(false)}
              >
                <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  {String(selectedMinute).padStart(2, '0')}
                </span>
              </div>
              <div 
                className="ml-2 px-2 py-1 text-base rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 text-orange-500 dark:text-orange-400 font-bold"
                onClick={toggleAmPm}
              >
                {isPm ? 'PM' : 'AM'}
              </div>
            </div>
            
            {/* Clock face */}
            <div 
              ref={clockFaceRef}
              className="relative w-64 h-64 mx-auto mb-6 rounded-full bg-slate-100 cursor-pointer special-time-picker-clock"
              onClick={handleClockFaceClick}
            >
              {/* Clock markers */}
              {isSelectingHour ? generateHourMarkers() : generateMinuteMarkers()}
              
              {/* Clock hand */}
              {generateClockHand()}
              
              {/* Selected value indicator */}
              <div 
                className="absolute w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold z-30"
                style={{
                  left: 'calc(50% - 16px)',
                  top: 'calc(50% - 16px)',
                  transform: isSelectingHour
                    ? `rotate(${(selectedHour * 30) - 90}deg) translate(80px) rotate(${-((selectedHour * 30) - 90)}deg)`
                    : `rotate(${(selectedMinute * 6) - 90}deg) translate(80px) rotate(${-((selectedMinute * 6) - 90)}deg)`,
                }}
              >
                {isSelectingHour ? selectedHour : selectedMinute === 0 ? '00' : selectedMinute}
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                className="px-4 py-2 text-orange-500 dark:text-orange-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md cursor-pointer font-bold"
                onClick={handleCancel}
              >
                CANCEL
              </button>
              <button
                type="button"
                className="px-4 py-2 text-orange-500 dark:text-orange-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md cursor-pointer font-bold"
                onClick={handleConfirmTime}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
