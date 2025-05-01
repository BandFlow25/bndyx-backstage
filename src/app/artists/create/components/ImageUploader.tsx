'use client';

import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  title: string;
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  aspectRatio?: string;
  required?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  title,
  imagePreview,
  handleImageChange,
  inputRef,
  aspectRatio = "w-full h-40",
  required = false
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">
        {title} {required && <span className="text-red-500">*</span>}
      </label>
      <div 
        className={`${aspectRatio} border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden`}
        onClick={() => inputRef.current?.click()}
      >
        {imagePreview ? (
          <img 
            src={imagePreview} 
            alt={`${title} preview`} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <>
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Click to upload {title.toLowerCase()}</p>
          </>
        )}
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
          ref={inputRef}
        />
      </div>
    </div>
  );
};
