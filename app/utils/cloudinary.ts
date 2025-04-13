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
    
    // Format the response to our ImageType
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

// Function to delete image from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    console.log('Attempting to delete Cloudinary image with publicId:', publicId);
    
    // For demo purposes - if the publicId starts with 'demo' or equals 'sample', 
    // we'll pretend the delete was successful without calling the API
    if (publicId.startsWith('demo/') || publicId === 'sample' || publicId.includes('cld-sample')) {
      console.log('Demo image detected, simulating successful deletion');
      return true;
    }
    
    // This would typically be a server-side operation due to API key security
    // For a real implementation, this should be an API call to your backend
    const response = await fetch('/api/delete-image', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server responded with error:', response.status, errorText);
      return false;
    }
    
    const data = await response.json();
    console.log('Delete API response:', data);
    
    return data.success;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}; 