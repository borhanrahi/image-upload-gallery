'use client';

import { useState } from 'react';
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

interface ImageCardProps {
  image: ImageType;
  onOpenPreview: (image: ImageType) => void;
  onDelete: (id: string) => void;
}

const ImageCard = ({ image, onOpenPreview, onDelete }: ImageCardProps) => {
  const [loaded, setLoaded] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          '&:hover .MuiCardActions-root': {
            transform: 'translateY(0)',
            opacity: 1,
          },
        }}
      >
        <Box sx={{ position: 'relative', paddingTop: '75%', width: '100%' }}>
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
                backgroundColor: 'grey.200',
              }} 
            />
          )}
          <CardMedia
            component="img"
            image={image.url}
            alt={image.title}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
            onLoad={() => setLoaded(true)}
          />
        </Box>
        
        <Box sx={{ p: 1, flexGrow: 1 }}>
          <Tooltip title={image.title} placement="top">
            <Typography variant="body2" noWrap>
              {image.title}
            </Typography>
          </Tooltip>
        </Box>
        
        <CardActions
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            p: 0.5,
            transform: 'translateY(100%)',
            opacity: 0,
            transition: 'all 0.3s ease',
            justifyContent: 'space-between',
          }}
        >
          <IconButton 
            size="small" 
            onClick={() => onOpenPreview(image)}
            sx={{ color: 'white' }}
          >
            <ZoomInIcon />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={handleDeleteClick}
            sx={{ color: 'white' }}
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogContent>
          <Typography id="delete-dialog-description">
            Are you sure you want to delete this image? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImageCard; 