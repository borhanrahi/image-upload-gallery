'use client';

import { useState, useEffect, useCallback } from 'react';
import { ImageType } from '../types';
import { deleteFromCloudinary } from '../utils/cloudinary';

interface UseImageGalleryProps {
  initialImages?: ImageType[];
}

interface UseImageGalleryReturn {
  images: ImageType[];
  loading: boolean;
  error: string | null;
  selectedImage: ImageType | null;
  filteredImages: ImageType[];
  hasMore: boolean;
  searchTerm: string;
  currentPage: number;
  addImages: (newImages: ImageType[]) => void;
  deleteImage: (id: string) => Promise<boolean>;
  selectImage: (image: ImageType | null) => void;
  loadMore: () => void;
  setSearchTerm: (term: string) => void;
}

// Number of images to display per "page" in infinite scroll
const IMAGES_PER_PAGE = 12;

export const useImageGallery = ({ initialImages = [] }: UseImageGalleryProps = {}): UseImageGalleryReturn => {
  const [images, setImages] = useState<ImageType[]>(initialImages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Update images when initialImages prop changes
  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  // Filter images based on search term
  const filteredImages = useCallback(() => {
    if (!searchTerm.trim()) {
      return images;
    }
    
    const term = searchTerm.toLowerCase().trim();
    return images.filter(image => {
      // Search by title
      if (image.title.toLowerCase().includes(term)) {
        return true;
      }
      
      // Search by tags if available
      if (image.tags?.some(tag => tag.toLowerCase().includes(term))) {
        return true;
      }
      
      return false;
    });
  }, [images, searchTerm]);

  // Calculate if there are more images to load
  const hasMore = currentPage * IMAGES_PER_PAGE < filteredImages().length;

  // Function to add new images to the gallery
  const addImages = useCallback((newImages: ImageType[]) => {
    setImages(prevImages => [...newImages, ...prevImages]);
  }, []);

  // Function to delete an image
  const deleteImage = useCallback(async (id: string) => {
    try {
      setError(null);
      
      // Find the image to get its publicId
      const imageToDelete = images.find(img => img.id === id);
      
      if (!imageToDelete) {
        throw new Error('Image not found');
      }
      
      // Delete from Cloudinary
      const success = await deleteFromCloudinary(imageToDelete.publicId);
      
      if (success) {
        // Remove from state if successful
        setImages(prevImages => prevImages.filter(img => img.id !== id));
        
        // If the deleted image was selected, clear selection
        if (selectedImage?.id === id) {
          setSelectedImage(null);
        }
        
        return true;
      } else {
        setError('Failed to delete image');
        return false;
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Error deleting image');
      return false;
    }
  }, [images, selectedImage]);

  // Function to select an image for preview
  const selectImage = useCallback((image: ImageType | null) => {
    setSelectedImage(image);
  }, []);

  // Function to load more images for infinite scroll
  const loadMore = useCallback(() => {
    setCurrentPage(prevPage => prevPage + 1);
  }, []);

  // Get current images to display based on page
  const getCurrentImages = useCallback(() => {
    return filteredImages().slice(0, currentPage * IMAGES_PER_PAGE);
  }, [filteredImages, currentPage]);

  return {
    images,
    loading,
    error,
    selectedImage,
    filteredImages: getCurrentImages(),
    hasMore,
    searchTerm,
    currentPage,
    addImages,
    deleteImage,
    selectImage,
    loadMore,
    setSearchTerm,
  };
}; 