'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Container, 
  useTheme
} from '@mui/material';
import { useImageGallery } from '../hooks/useImageGallery';
import ImageCard from './ImageCard';
import ImagePreview from './ImagePreview';
import { ImageType } from '../types';

interface ImageGalleryProps {
  initialImages?: ImageType[];
  searchTerm: string;
  onAddImages: (images: ImageType[]) => void;
}

const ImageGallery = ({ initialImages = [], searchTerm, onAddImages }: ImageGalleryProps) => {
  const {
    images,
    loading,
    error,
    selectedImage,
    filteredImages,
    hasMore,
    loadMore,
    deleteImage,
    selectImage,
    setSearchTerm,
  } = useImageGallery({ initialImages });
  
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const theme = useTheme();
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Set up the search term from props
  useEffect(() => {
    setSearchTerm(searchTerm);
  }, [searchTerm, setSearchTerm]);
  
  // Set up the intersection observer for infinite scroll
  const lastImageElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    
    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore, loadMore]);
  
  const handlePreviewOpen = (image: ImageType) => {
    selectImage(image);
  };
  
  const handlePreviewClose = () => {
    selectImage(null);
  };
  
  const handleDeleteImage = async (id: string) => {
    try {
      setDeleteError(null);
      console.log('Starting deletion process for image with ID:', id);
      
      // Attempt to delete the image
      const success = await deleteImage(id);
      
      if (success) {
        console.log('Image successfully removed from UI');
        // In the simplified approach, we're always returning true from deleteImage
        // Notify parent to update localStorage
        onAddImages([]);
      } else {
        setDeleteError('Failed to delete image. Please try again.');
      }
    } catch (err) {
      console.error('Error in image deletion process:', err);
      setDeleteError('An error occurred during deletion. Please try again.');
    }
  };
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {deleteError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setDeleteError(null)}>
          {deleteError}
        </Alert>
      )}
      
      {filteredImages.length === 0 && !loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" gutterBottom>
            No images found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {searchTerm 
              ? 'Try a different search term or upload some images' 
              : 'Get started by uploading some images'}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: 2 
        }}>
          {filteredImages.map((image, index) => {
            const isLastElement = index === filteredImages.length - 1;
            
            return (
              <Box key={image.id} ref={isLastElement ? lastImageElementRef : undefined}>
                <ImageCard
                  image={image}
                  onOpenPreview={handlePreviewOpen}
                  onDelete={handleDeleteImage}
                />
              </Box>
            );
          })}
        </Box>
      )}
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      <ImagePreview 
        open={!!selectedImage} 
        onClose={handlePreviewClose}
        image={selectedImage}
        images={images}
      />
    </Container>
  );
};

export default ImageGallery; 