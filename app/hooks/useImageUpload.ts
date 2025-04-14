'use client';

import { useState, useRef } from 'react';
import { ImageType } from '../types';
import { uploadToCloudinary } from '../utils/cloudinary';

interface UseImageUploadReturn {
  uploading: boolean;
  uploadProgress: number;
  uploadImage: (file: File) => Promise<ImageType | null>;
  uploadMultipleImages: (files: File[]) => Promise<ImageType[]>;
  error: string | null;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const clearProgressInterval = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const animateProgressTo = (targetValue: number, duration: number = 500) => {
    clearProgressInterval();
    
    const startValue = uploadProgress;
    const startTime = Date.now();
    const difference = targetValue - startValue;
    
    progressIntervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const newValue = startValue + difference * easedProgress;
      
      setUploadProgress(newValue);
      
      if (progress >= 1) {
        clearProgressInterval();
      }
    }, 16); 
  };

  const uploadImage = async (file: File): Promise<ImageType | null> => {
    try {
      setUploading(true);
      setError(null);
      
      const startProgress = uploadProgress;
      const targetProgress = Math.min(95, startProgress + (100 - startProgress) / (file.size / 100000));
      
      animateProgressTo(targetProgress);

      const image = await uploadToCloudinary(file);
      return image;
    } catch (err) {
      setError('Failed to upload image');
      console.error('Upload error:', err);
      return null;
    }
  };

  const uploadMultipleImages = async (files: File[]): Promise<ImageType[]> => {
    setUploadProgress(0);
    clearProgressInterval();
    
    const totalFiles = files.length;
    const images: ImageType[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const fileProgress = (i / totalFiles) * 95;
        setUploadProgress(fileProgress);
        
        const image = await uploadImage(files[i]);
        if (image) {
          images.push(image);
        }
      }
      
      animateProgressTo(100, 300);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return images;
    } finally {
      clearProgressInterval();
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadProgress,
    uploadImage,
    uploadMultipleImages,
    error,
  };
}; 