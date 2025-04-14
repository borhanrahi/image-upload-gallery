'use client';

import { useState, useEffect, useCallback } from 'react';
import { ImageType } from '../types';
import { deleteFromCloudinary } from '../utils/cloudinary';
import toast from 'react-hot-toast';

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

export const useImageGallery = ({ initialImages = [] }: UseImageGalleryProps): UseImageGalleryReturn => {
  const [images, setImages] = useState<ImageType[]>(initialImages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [filteredImages, setFilteredImages] = useState<ImageType[]>(images);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  useEffect(() => {
    const filtered = searchTerm 
      ? images.filter(img => 
          img.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : images;
    
    setFilteredImages(filtered);
    setHasMore(filtered.length > currentPage * IMAGES_PER_PAGE);
  }, [images, searchTerm, currentPage]);

  const addImages = useCallback((newImages: ImageType[]) => {
    setImages(prev => [...newImages, ...prev]);
    toast.success(`Added ${newImages.length} new ${newImages.length === 1 ? 'image' : 'images'}`);
  }, []);

  const deleteImage = useCallback(async (id: string): Promise<boolean> => {
    try {
      const imageToDelete = images.find(img => img.id === id);
      
      if (!imageToDelete) {
        setError('Image not found');
        toast.error('Image not found');
        return false;
      }
      
      setImages(prev => prev.filter(img => img.id !== id));
      toast.success('Image deleted successfully');
      
      if (imageToDelete.publicId) {
        try {
          const success = await deleteFromCloudinary(imageToDelete.publicId);
          
          if (!success) {
            console.error('Failed to delete image from cloud storage, but removed from gallery');
          }
        } catch (error) {
          console.error('Error deleting from Cloudinary:', error);
        }
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('An error occurred while deleting the image');
      toast.error('An error occurred while deleting the image');
      return false;
    }
  }, [images]);

  const selectImage = useCallback((image: ImageType | null) => {
    setSelectedImage(image);
  }, []);

  const loadMore = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  const getCurrentImages = useCallback(() => {
    return filteredImages.slice(0, currentPage * IMAGES_PER_PAGE);
  }, [filteredImages, currentPage]);

  return {
    images,
    loading,
    error,
    selectedImage,
    filteredImages,
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