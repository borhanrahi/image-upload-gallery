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
  Zoom,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
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

const FALLBACK_IMAGES = {
  default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
  dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
  nature: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e'
};

const slideAnimations = {
  slideIn: `
    @keyframes slideIn {
      0% { transform: translateX(20%); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
  `,
  slideOut: `
    @keyframes slideOut {
      0% { transform: translateX(0); opacity: 1; }
      100% { transform: translateX(-20%); opacity: 0; }
    }
  `,
  slideInRight: `
    @keyframes slideInRight {
      0% { transform: translateX(-20%); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
  `,
  slideOutRight: `
    @keyframes slideOutRight {
      0% { transform: translateX(0); opacity: 1; }
      100% { transform: translateX(20%); opacity: 0; }
    }
  `
};

const ImagePreview = ({ open, onClose, image, images }: ImagePreviewProps) => {
  const [loaded, setLoaded] = useState(false);
  const [currentImage, setCurrentImage] = useState<ImageType | null>(null);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [sliding, setSliding] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();
  
  const currentIndex = currentImage ? images.findIndex(img => img.id === currentImage.id) : -1;
  
  useEffect(() => {
    if (image) {
      setCurrentImage(image);
      setLoaded(false);
      setImageError(false);
      setSliding(false);
    }
  }, [image]);

  const fallbackImageUrl = useMemo(() => {
    if (!imageError || !currentImage) return '';
    
    const title = currentImage.title?.toLowerCase() || '';
    const tags = currentImage.tags || [];
    
    for (const category of Object.keys(FALLBACK_IMAGES)) {
      if (category === 'default') continue;
      
      if (title.includes(category) || tags.some(tag => tag.toLowerCase().includes(category))) {
        return FALLBACK_IMAGES[category as keyof typeof FALLBACK_IMAGES];
      }
    }
    
    return FALLBACK_IMAGES.default;
  }, [imageError, currentImage]);
  
  const NAVIGATION_DELAY = 300; 
  
  const handlePrevious = () => {
    if (currentIndex > 0 && !sliding) {
      setSlideDirection('right');
      setSliding(true);
      setLoaded(false);
      setImageError(false);
      
      const previousIndex = currentIndex - 1;
      const previousImage = images[previousIndex];
      
      if (previousImage) {
        const preloadImg = new Image();
        preloadImg.src = previousImage.url;
        
        setTimeout(() => {
          setCurrentImage(previousImage);
          setTimeout(() => setSliding(false), 50);
        }, NAVIGATION_DELAY);
      }
    }
  };
  
  const handleNext = () => {
    if (currentIndex < images.length - 1 && !sliding) {
      setSlideDirection('left');
      setSliding(true);
      setLoaded(false);
      setImageError(false);
      
      const nextIndex = currentIndex + 1;
      const nextImage = images[nextIndex];
      
      if (nextImage) {
        const preloadImg = new Image();
        preloadImg.src = nextImage.url;
        
        setTimeout(() => {
          setCurrentImage(nextImage);
          setTimeout(() => setSliding(false), 50);
        }, NAVIGATION_DELAY);
      }
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
        }
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
            {!loaded && !imageError && (
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation="wave"
                sx={{ position: 'absolute', bgcolor: 'rgba(30, 30, 30, 0.3)' }}
              />
            )}
            
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <Fade in={!sliding || sliding} timeout={{ enter: 400, exit: 300 }}>
                <Box
                  component="img"
                  src={imageError ? fallbackImageUrl : (currentImage?.url || '')}
                  alt={currentImage?.title || 'Image'}
                  onLoad={() => setLoaded(true)}
                  onError={(e) => {
                    console.error('Image failed to load:', currentImage?.url);
                    setImageError(true);
                    if (fallbackImageUrl) {
                      (e.target as HTMLImageElement).src = fallbackImageUrl;
                    } else {
                      setLoaded(true);
                    }
                  }}
                  sx={{
                    maxWidth: '90%',
                    maxHeight: '90%',
                    objectFit: 'contain',
                    transition: slideDirection === 'left' 
                      ? 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                      : 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: sliding ? 0 : (loaded ? 1 : 0),
                    transform: sliding 
                      ? (slideDirection === 'left' ? 'translateX(-30%)' : 'translateX(30%)')
                      : 'translateX(0)',
                    position: 'absolute',
                  }}
                />
              </Fade>
            </Box>
            
            {imageError && !fallbackImageUrl && (
              <Box 
                sx={{ 
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  p: 3,
                  borderRadius: 2,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(5px)',
                  color: 'white',
                  zIndex: 3
                }}
              >
                <ErrorOutlineIcon sx={{ fontSize: 48, color: '#ff5252' }} />
                <Typography variant="h6">
                  Image could not be loaded
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7, maxWidth: 400, textAlign: 'center' }}>
                  The image appears to be unavailable or the URL may be incorrect
                </Typography>
              </Box>
            )}
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