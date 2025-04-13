'use client';

import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  useTheme,
  Skeleton,
  Slide,
  Backdrop,
  Fade,
  Zoom
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import { useState, useEffect, useMemo } from 'react';
import { ImageType } from '../types';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';

const SlideTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ImagePreviewProps {
  open: boolean;
  onClose: () => void;
  image: ImageType | null;
  images: ImageType[];
}

const ImagePreview = ({ open, onClose, image, images }: ImagePreviewProps) => {
  const [loaded, setLoaded] = useState(false);
  const [currentImage, setCurrentImage] = useState<ImageType | null>(null);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [sliding, setSliding] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const theme = useTheme();
  
  const currentIndex = currentImage ? images.findIndex(img => img.id === currentImage.id) : -1;
  
  useEffect(() => {
    setCurrentImage(image);
    setLoaded(false);
  }, [image]);
  
  const handlePrevious = () => {
    if (currentIndex > 0 && !sliding) {
      setSlideDirection('right');
      setSliding(true);
      setLoaded(false);
      
      setTimeout(() => {
        setCurrentImage(images[currentIndex - 1]);
        setSliding(false);
      }, 300);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < images.length - 1 && !sliding) {
      setSlideDirection('left');
      setSliding(true);
      setLoaded(false);
      
      setTimeout(() => {
        setCurrentImage(images[currentIndex + 1]);
        setSliding(false);
      }, 300);
    }
  };
  
  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        if (fullScreen) {
          setFullScreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'f') {
        toggleFullScreen();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, currentIndex, images, sliding, fullScreen]);
  
  if (!currentImage) return null;
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      fullScreen={fullScreen}
      TransitionComponent={SlideTransition}
      keepMounted
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(5px)'
          }
        },
      }}
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: 'rgba(15, 15, 15, 0.6)',
          borderRadius: fullScreen ? 0 : 2,
          overflow: 'hidden',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.4)',
          backgroundImage: 'linear-gradient(to bottom, rgba(25, 25, 25, 0.6), rgba(12, 12, 12, 0.6))',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16, 
            zIndex: 20,
            display: 'flex',
            gap: 1,
          }}
        >
          <IconButton
            aria-label="toggle fullscreen"
            onClick={toggleFullScreen}
            sx={{
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.4)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ZoomOutMapIcon />
          </IconButton>
          
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.4)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        {currentIndex > 0 && (
          <Fade in={true}>
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
                zIndex: 10,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-50%) scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Fade>
        )}
        
        {currentIndex < images.length - 1 && (
          <Fade in={true}>
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
                zIndex: 10,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-50%) scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Fade>
        )}
        
        <DialogContent sx={{ 
          p: 0, 
          height: fullScreen ? '100vh' : '90vh', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
        }}>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'transparent',
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {!loaded && (
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation="wave"
                sx={{ position: 'absolute', bgcolor: 'rgba(30, 30, 30, 0.3)' }}
              />
            )}
            
            <Fade in={!sliding} timeout={300}>
              <Box
                component="img"
                src={currentImage?.url || ''}
                alt={currentImage?.title || 'Image'}
                onLoad={() => setLoaded(true)}
                sx={{
                  maxWidth: '95%',
                  maxHeight: '95%',
                  objectFit: 'contain',
                  opacity: loaded && !sliding ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                  animation: sliding 
                    ? `slide${slideDirection === 'left' ? 'Out' : 'In'} 0.3s ease` 
                    : 'none',
                  '@keyframes slideOut': {
                    '0%': { transform: 'translateX(0)', opacity: 1 },
                    '100%': { transform: 'translateX(-20%)', opacity: 0 }
                  },
                  '@keyframes slideIn': {
                    '0%': { transform: 'translateX(20%)', opacity: 0 },
                    '100%': { transform: 'translateX(0)', opacity: 1 }
                  }
                }}
              />
            </Fade>
          </Box>
          
          <Fade in={true}>
            <Box
              sx={{
                p: 2,
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                bgcolor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 500 }}>
                    {currentImage.title}
                  </Typography>
                  {currentImage.tags && currentImage.tags.length > 0 && (
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 0.5 }}>
                      {currentImage.tags.map(tag => `#${tag}`).join(' ')}
                    </Typography>
                  )}
                </Box>
                
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      backgroundImage: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 500,
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(5px)',
                    }}
                  >
                    {currentIndex + 1} of {images.length}
                  </Typography>
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontStyle: 'italic'
                    }}
                  >
                    Press arrow keys to navigate • F for fullscreen • ESC to close
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Fade>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default ImagePreview; 