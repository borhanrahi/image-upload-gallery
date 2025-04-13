'use client';

import { useState } from 'react';
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

  const uploadImage = async (file: File): Promise<ImageType | null> => {
    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      // Simulate upload progress (in a real app, you'd use actual progress events)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200);

      const image = await uploadToCloudinary(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      return image;
    } catch (err) {
      setError('Failed to upload image');
      console.error('Upload error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadMultipleImages = async (files: File[]): Promise<ImageType[]> => {
    const images: ImageType[] = [];
    
    // Simple implementation that uploads sequentially
    // In a real app, you might want to use Promise.all with a limit
    for (const file of files) {
      const image = await uploadImage(file);
      if (image) {
        images.push(image);
      }
    }
    
    return images;
  };

  return {
    uploading,
    uploadProgress,
    uploadImage,
    uploadMultipleImages,
    error,
  };
}; 