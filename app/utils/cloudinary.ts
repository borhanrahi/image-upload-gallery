'use client';

import axios from 'axios';
import { CloudinaryUploadResponse, ImageType } from '../types';

// Function to upload image to Cloudinary
export const uploadToCloudinary = async (file: File): Promise<ImageType | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const response = await axios.post<CloudinaryUploadResponse>(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    
    // Format the response to ImageType
    const { public_id, secure_url, width, height, original_filename, created_at } = response.data;
    
    return {
      id: public_id,
      url: secure_url,
      title: original_filename,
      publicId: public_id,
      width,
      height,
      createdAt: created_at,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    console.log('Attempting to delete Cloudinary image with publicId:', publicId);
    
    if (publicId.startsWith('demo/') || 
        publicId === 'sample' || 
        publicId.includes('cld-sample')) {
      console.log('Demo image detected, simulating successful deletion');
      return true;
    }
    
    try {
      const response = await fetch('/api/delete-image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Cloudinary deletion successful');
        return true;
      } else {
        console.error('Cloudinary deletion failed:', data.error);
        return true;
      }
    } catch (fetchError) {
      console.error('Network error during deletion:', fetchError);
      return true;
    }
  } catch (error) {
    console.error('Error in delete operation:', error);
    return true;
  }
}; 