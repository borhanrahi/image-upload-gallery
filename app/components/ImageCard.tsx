'use client';

import { useState, useMemo } from 'react';
import { 
  Card, 
  CardMedia, 
  CardActions, 
  IconButton, 
  Typography,
  Box, 
  Skeleton,
  Tooltip,
  Dialog,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { ImageType } from '../types';

const FALLBACK_IMAGES = {
  default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
  dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b',
  city: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
  nature: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e'
};

interface ImageCardProps {
  image: ImageType;
  onOpenPreview?: (image: ImageType) => void;
  onDelete: (id: string) => void;
}

const ImageCard = ({ image, onOpenPreview, onDelete }: ImageCardProps) => {
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [fallbackApplied, setFallbackApplied] = useState(false);

  const fallbackImageUrl = useMemo(() => {
    if (!loadError) return '';
    
    const title = image.title?.toLowerCase() || '';
    const tags = image.tags || [];
    
    for (const category of Object.keys(FALLBACK_IMAGES)) {
      if (category === 'default') continue;
      
      if (title.includes(category) || tags.some(tag => tag.toLowerCase().includes(category))) {
        return FALLBACK_IMAGES[category as keyof typeof FALLBACK_IMAGES];
      }
    }
    
    return FALLBACK_IMAGES.default;
  }, [loadError, image.title, image.tags]);
  
  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString();
  }, []);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    onDelete(image.id);
    setDeleteDialogOpen(false);
  };
  
  const handleMouseEnter = () => {
    setHovered(true);
  };
  
  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleOpen = () => {
    if (onOpenPreview) {
      if (loadError && fallbackImageUrl) {
        onOpenPreview({
          ...image,
          url: fallbackImageUrl
        });
      } else {
        onOpenPreview(image);
      }
    }
  };

  return (
    <>
      <Card
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          boxShadow: hovered 
            ? '0 20px 30px -10px rgba(0,0,0,0.2), 0 8px 20px -5px rgba(0,0,0,0.1)' 
            : '0 8px 20px rgba(0,0,0,0.06)',
          transform: hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
          transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(120deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%)',
            opacity: hovered ? 0.2 : 0,
            transition: 'opacity 0.4s ease'
          }
        }}
      >
        <Box sx={{ position: 'relative', paddingTop: '80%', width: '100%', overflow: 'hidden' }}>
          {!loaded && (
            <Skeleton 
              variant="rectangular" 
              animation="wave"
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.04)',
                borderRadius: '8px 8px 0 0',
              }} 
            />
          )}
          
          <CardMedia
            component="img"
            image={fallbackApplied ? fallbackImageUrl : (loadError ? fallbackImageUrl : image.url)}
            alt={image.title}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: loaded ? 1 : 0,
              transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              filter: hovered ? 'brightness(1.05)' : 'brightness(1)'
            }}
            onLoad={() => {
              setLoaded(true);
              if (loadError) {
                setFallbackApplied(true);
              }
            }}
            onError={() => {
              if (!loadError && !fallbackApplied) {
                console.log('Image load error, trying fallback for:', image.title);
                setLoadError(true);
              } else if (!fallbackApplied) {
                console.log('Fallback image also failed, giving up on:', image.title);
                setFallbackApplied(true);
                setLoaded(true);
              }
            }}
          />
          
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 1,
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(-10px)',
              transition: 'all 0.3s ease',
              zIndex: 2,
            }}
          >
            <Tooltip title="View" placement="top">
              <IconButton
                onClick={handleOpen}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(5px)',
                  color: '#FF5370',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: '#FF5370',
                    color: '#fff',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ZoomInIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" placement="top">
              <IconButton
                onClick={handleDeleteClick}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(5px)',
                  color: 'rgba(0,0,0,0.6)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.8)',
                    color: '#fff',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
              opacity: hovered ? 1 : 0.5,
              transition: 'opacity 0.4s ease',
            }}
          />
          
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              p: 2,
              color: 'white',
              transition: 'all 0.3s ease',
              transform: hovered ? 'translateY(0)' : 'translateY(5px)',
              opacity: hovered ? 1 : 0.9,
              textShadow: '0 1px 3px rgba(0,0,0,0.3)',
              zIndex: 2,
            }}
          >
            <Typography 
              variant="subtitle1" 
              component="h3"
              noWrap
              sx={{ 
                fontWeight: 600,
                fontSize: '1rem',
                lineHeight: 1.2,
                mb: 0.5
              }}
            >
              {image.title || 'Untitled'}
            </Typography>
            
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.8,
                fontSize: '0.75rem',
                display: 'block'
              }}
            >
              {image.date ? new Date(image.date).toLocaleDateString() : currentDate}
            </Typography>
          </Box>
        </Box>
      </Card>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            overflow: 'hidden',
          }
        }}
      >
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <Typography id="delete-dialog-title" variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Delete Image
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Are you sure you want to delete "{image.title || 'this image'}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={handleDeleteCancel} 
            sx={{ 
              fontWeight: 500,
              textTransform: 'none',
              borderRadius: 2,
              px: 2
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            sx={{ 
              fontWeight: 500,
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              boxShadow: '0 4px 10px rgba(211, 47, 47, 0.2)',
              '&:hover': {
                boxShadow: '0 6px 15px rgba(211, 47, 47, 0.3)',
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImageCard; 