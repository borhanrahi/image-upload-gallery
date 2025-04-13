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

const IMAGES_PER_PAGE = 12;

export const useImageGallery = ({ initialImages = [] }: UseImageGalleryProps = {}): UseImageGalleryReturn => {
  const [images, setImages] = useState<ImageType[]>(initialImages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const filteredImages = useCallback(() => {
    if (!searchTerm.trim()) {
      return images;
    }
    
    const term = searchTerm.toLowerCase().trim();
    return images.filter(image => {
      if (image.title.toLowerCase().includes(term)) {
        return true;
      }
      
      if (image.tags?.some(tag => tag.toLowerCase().includes(term))) {
        return true;
      }
      
      return false;
    });
  }, [images, searchTerm]);


  const hasMore = currentPage * IMAGES_PER_PAGE < filteredImages().length;

  const addImages = useCallback((newImages: ImageType[]) => {
    setImages(prevImages => [...newImages, ...prevImages]);
  }, []);

  const deleteImage = useCallback(async (id: string) => {
    try {
      setError(null);
      
      const imageToDelete = images.find(img => img.id === id);
      
      if (!imageToDelete) {
        console.warn('Image not found for deletion:', id);
        return false;
      }
      
      console.log('Deleting image from gallery:', imageToDelete.publicId);
      
      setImages(prevImages => prevImages.filter(img => img.id !== id));
      
      if (selectedImage?.id === id) {
        setSelectedImage(null);
      }
      
      const success = await deleteFromCloudinary(imageToDelete.publicId);
      
      return success;
    } catch (err) {
      console.error('Error in gallery delete process:', err);
      return true;
    }
  }, [images, selectedImage]);

  // Function to select an image for preview
  const selectImage = useCallback((image: ImageType | null) => {
    setSelectedImage(image);
  }, []);

  const loadMore = useCallback(() => {
    setCurrentPage(prevPage => prevPage + 1);
  }, []);

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