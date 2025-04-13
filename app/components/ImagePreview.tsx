'use client';

import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  useTheme,
  Skeleton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState } from 'react';
import { ImageType } from '../types';

interface ImagePreviewProps {
  open: boolean;
  onClose: () => void;
  image: ImageType | null;
  images: ImageType[];
}

const ImagePreview = ({ open, onClose, image, images }: ImagePreviewProps) => {
  const [loaded, setLoaded] = useState(false);
  const theme = useTheme();
  
  // Find current image index
  const currentIndex = image ? images.findIndex(img => img.id === image.id) : -1;
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setLoaded(false);
      const prevIndex = currentIndex - 1;
      // This would typically change the selected image in the parent component
      // Emit an event to change the selected image
    }
  };
  
  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setLoaded(false);
      const nextIndex = currentIndex + 1;
      // This would typically change the selected image in the parent component
      // Emit an event to change the selected image
    }
  };
  
  if (!image) return null;
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      fullScreen={false}
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: 'background.default',
          borderRadius: 2,
          overflow: 'hidden',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1,
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.6)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        
        {currentIndex > 0 && (
          <IconButton
            aria-label="previous image"
            onClick={handlePrevious}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.4)',
              zIndex: 1,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.6)',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        
        {currentIndex < images.length - 1 && (
          <IconButton
            aria-label="next image"
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.4)',
              zIndex: 1,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.6)',
              },
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        )}
        
        <DialogContent sx={{ p: 0, height: '70vh', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'black',
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            {!loaded && (
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation="wave"
                sx={{ position: 'absolute', bgcolor: 'grey.900' }}
              />
            )}
            <Box
              component="img"
              src={image.url}
              alt={image.title}
              onLoad={() => setLoaded(true)}
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                opacity: loaded ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            />
          </Box>
          
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="h6">{image.title}</Typography>
            {image.tags && image.tags.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Tags: {image.tags.join(', ')}
              </Typography>
            )}
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default ImagePreview; 