'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Alert, 
  Snackbar,
  Pagination,
  Container,
  useMediaQuery,
  Theme,
  CircularProgress,
  Paper,
  Fade,
  Zoom
} from '@mui/material';
import ImageCard from './ImageCard';
import ImagePreview from './ImagePreview';
import { ImageType } from '../types';
import { useImageGallery } from '../hooks/useImageGallery';

export interface ImageGalleryProps {
  initialImages: ImageType[];
  searchTerm: string;
  onAddImages: (images: ImageType[]) => void;
  onImageDeleted: (id: string) => void;
}

const IMAGES_PER_PAGE = 8; // 4 columns x 2 rows

export default function ImageGallery({ 
  initialImages, 
  searchTerm, 
  onAddImages,
  onImageDeleted
}: ImageGalleryProps) {
  const { images, loading, error, deleteImage } = useImageGallery({
    initialImages
  });
  
  const [filteredImages, setFilteredImages] = useState<ImageType[]>([]);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedImages, setPaginatedImages] = useState<ImageType[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'));
  
  useEffect(() => {
    if (!images) return;
    
    const filtered = searchTerm
      ? images.filter(img => 
          img.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : images;
    
    setFilteredImages(filtered);
    setTotalPages(Math.ceil(filtered.length / IMAGES_PER_PAGE));
    setCurrentPage(1); 
  }, [images, searchTerm]);
  
  useEffect(() => {
    const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
    setPaginatedImages(filteredImages.slice(startIndex, startIndex + IMAGES_PER_PAGE));
  }, [filteredImages, currentPage]);
  
  const handleDeleteImage = async (id: string) => {
    console.log('Starting image deletion for ID:', id);
    setDeleteError(null);
    
    try {
      const success = await deleteImage(id);
      
      if (success) {
        console.log('Image deleted successfully, notifying parent component');
        onImageDeleted(id);
      } else {
        console.error('Failed to delete image');
        setDeleteError('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setDeleteError('Error deleting image');
    }
  };
  
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top
  };

  const getGridColumns = () => {
    if (isSmallScreen) return 'repeat(1, 1fr)';
    if (isMediumScreen) return 'repeat(2, 1fr)';
    return 'repeat(4, 1fr)';
  };
  
  const handlePreviewOpen = (image: ImageType) => {
    setSelectedImage(image);
  };
  
  const handlePreviewClose = () => {
    setSelectedImage(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert 
          severity="error" 
          variant="filled" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(211, 47, 47, 0.15)'
          }}
        >
          {error}
        </Alert>
      )}
      
      {deleteError && (
        <Snackbar 
          open={!!deleteError} 
          autoHideDuration={6000} 
          onClose={() => setDeleteError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          TransitionComponent={Fade}
        >
          <Alert 
            severity="error" 
            variant="filled" 
            sx={{ 
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              borderRadius: 2
            }}
          >
            {deleteError}
          </Alert>
        </Snackbar>
      )}
      
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          p: 10,
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#FF5370' }} />
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 500,
              animation: 'pulse 1.5s infinite ease-in-out',
              '@keyframes pulse': {
                '0%': { opacity: 0.6 },
                '50%': { opacity: 1 },
                '100%': { opacity: 0.6 }
              }
            }}
          >
            Loading gallery...
          </Typography>
        </Box>
      ) : filteredImages.length === 0 ? (
        <Paper elevation={0} 
          sx={{ 
            textAlign: 'center', 
            p: 8, 
            borderRadius: 2,
            background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          <Zoom in={true} style={{ transitionDelay: '150ms' }}>
            <Box>
              <Box 
                component="img" 
                src="/empty-gallery.svg" 
                alt="No images" 
                sx={{ 
                  width: '180px', 
                  height: 'auto', 
                  mb: 3,
                  opacity: 0.7,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                }} 
              />
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{ 
                  fontWeight: 700,
                  mb: 1,
                  background: 'linear-gradient(90deg, #FF5370, #ff8787)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {searchTerm ? 'No images matching your search' : 'Your gallery is empty'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, maxWidth: '500px', mx: 'auto', color: 'text.secondary' }}>
                {searchTerm 
                  ? 'Try a different search term or clear your search to see all images'
                  : 'Upload some beautiful images to start building your collection'
                }
              </Typography>
            </Box>
          </Zoom>
        </Paper>
      ) : (
        <Box sx={{ my: 2 }}>
          {/* Gallery Header */}
          <Box 
            sx={{ 
              mb: 3, 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              px: 1
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: '#1E1E2F',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 24,
                  bgcolor: '#FF5370',
                  display: 'inline-block',
                  mr: 2,
                  borderRadius: 1,
                }}
              />
              {searchTerm ? 'Search Results' : 'Gallery Items'}
              <Box
                component="span"
                sx={{
                  ml: 2,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  backgroundColor: 'rgba(30, 30, 47, 0.05)',
                  fontWeight: 700,
                }}
              >
                {filteredImages.length}
              </Box>
            </Typography>
          </Box>
          

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: getGridColumns(),
            gap: 3,
            py: 1
          }}>
            {paginatedImages.map((image, index) => (
              <Zoom 
                in={true} 
                style={{ 
                  transitionDelay: `${index * 50}ms`,
                  transitionDuration: '350ms'
                }}
                key={image.id}
              >
                <Box sx={{ 
                  transform: 'perspective(1000px)',
                  transformStyle: 'preserve-3d',
                  height: '100%'
                }}>
                  <ImageCard
                    image={image}
                    onOpenPreview={handlePreviewOpen}
                    onDelete={handleDeleteImage}
                  />
                </Box>
              </Zoom>
            ))}
          </Box>
          
          {totalPages > 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 5,
              pt: 3,
              borderTop: '1px solid rgba(0,0,0,0.06)'
            }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size={isSmallScreen ? "medium" : "large"}
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                    mx: 0.5,
                    transition: 'all 0.3s ease',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 83, 112, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
                    },
                  },
                  '& .Mui-selected': {
                    backgroundColor: '#FF5370 !important',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(255, 83, 112, 0.3)',
                    '&:hover': {
                      backgroundColor: '#ff4060 !important',
                      boxShadow: '0 6px 15px rgba(255, 83, 112, 0.4)',
                    }
                  }
                }}
              />
            </Box>
          )}
        </Box>
      )}
      
      <ImagePreview 
        open={!!selectedImage} 
        onClose={handlePreviewClose}
        image={selectedImage}
        images={filteredImages}
      />
    </Container>
  );
} 