"use client"
import { useState, useCallback, useRef } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  LinearProgress,
  Alert,
  Stack,
  IconButton,
  Grid,
  Card,
  CardMedia,
  Tooltip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useImageUpload } from '../hooks/useImageUpload';
import { ImageType } from '../types';
import toast from 'react-hot-toast';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onImagesUploaded: (images: ImageType[]) => void;
}

const UploadModal = ({ open, onClose, onImagesUploaded }: UploadModalProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { uploading, uploadProgress, uploadMultipleImages, error } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      );
      
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files).filter(file => 
        file.type.startsWith('image/')
      );
      
      setSelectedFiles(prev => [...prev, ...filesArray]);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, []);

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length > 0) {
      try {
        const uploadedImages = await uploadMultipleImages(selectedFiles);
        if (uploadedImages.length > 0) {
          toast.success(`Successfully uploaded ${uploadedImages.length} images`);
          onImagesUploaded(uploadedImages);
          setSelectedFiles([]);
          onClose();
        } else {
          toast.error('Failed to upload images');
        }
      } catch (error) {
        toast.error('An error occurred during upload');
        console.error('Upload error:', error);
      }
    }
  }, [selectedFiles, uploadMultipleImages, onImagesUploaded, onClose]);

  return (
    <Modal
      open={open}
      onClose={uploading ? undefined : onClose}
      aria-labelledby="upload-modal-title"
      aria-describedby="upload-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: 800,
          p: 4,
          outline: 'none',
          borderRadius: 2,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography id="upload-modal-title" variant="h5" component="h2">
            Upload Images
          </Typography>
          <IconButton onClick={uploading ? undefined : onClose} disabled={uploading}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          sx={{
            border: '2px dashed',
            borderColor: dragActive ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 4,
            mb: 3,
            textAlign: 'center',
            backgroundColor: dragActive ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
          }}
        >
          <input
            type="file"
            id="file-upload"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          
          <label htmlFor="file-upload">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CloudUploadIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Drag &amp; Drop Images Here
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                or
              </Typography>
              <Button
                component="span"
                variant="outlined"
                color="primary"
                disabled={uploading}
              >
                Browse Files
              </Button>
              <Typography variant="caption" sx={{ mt: 2, color: 'text.secondary' }}>
                You can select multiple files at once
              </Typography>
            </Box>
          </label>
        </Box>
        
        {selectedFiles.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected
              </Typography>
              <Button 
                size="small" 
                onClick={() => setSelectedFiles([])} 
                color="error" 
                disabled={uploading}
                startIcon={<DeleteIcon />}
              >
                Remove All
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: -1 }}>
              {selectedFiles.map((file, index) => {
                const imageUrl = URL.createObjectURL(file);
                
                return (
                  <Box 
                    key={index} 
                    sx={{ 
                      width: { xs: '50%', sm: '33.33%', md: '25%' },
                      padding: 1
                    }}
                  >
                    <Card 
                      elevation={0} 
                      sx={{ 
                        position: 'relative',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={imageUrl}
                        alt={file.name}
                        sx={{ 
                          height: 140,
                          objectFit: 'cover'
                        }}
                        onLoad={() => URL.revokeObjectURL(imageUrl)}
                      />
                      <Box sx={{ 
                        p: 1, 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.02)'
                      }}>
                        <Tooltip title={file.name}>
                          <Typography 
                            variant="caption" 
                            noWrap 
                            sx={{ 
                              maxWidth: '70%', 
                              display: 'block',
                              color: 'text.secondary',
                              fontSize: '0.7rem'
                            }}
                          >
                            {file.name}
                          </Typography>
                        </Tooltip>
                        <Tooltip title="Remove">
                          <IconButton 
                            size="small" 
                            onClick={() => handleRemoveFile(index)}
                            disabled={uploading}
                            sx={{ 
                              p: 0.5,
                              color: 'text.secondary',
                              '&:hover': {
                                color: 'error.main'
                              }
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Card>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
        
        {uploading && (
          <Box sx={{ width: '100%', mb: 3 }}>
            <Typography variant="body2" fontWeight={500} gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Upload Progress</span>
              <span style={{ 
                color: uploadProgress >= 100 ? '#4caf50' : '#1976d2',
                transition: 'color 0.3s ease'
              }}>
                {Math.min(100, Math.round(uploadProgress))}%
              </span>
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(100, uploadProgress)} 
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                  backgroundImage: uploadProgress >= 100 
                    ? 'linear-gradient(45deg, #4caf50, #81c784)' 
                    : 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  transition: 'transform 0.4s ease, background-image 0.5s ease'
                }
              }}
            />
            
            <Box sx={{ 
              mt: 2, 
              py: 2, 
              px: 3, 
              borderRadius: 2, 
              backgroundColor: uploadProgress >= 100 ? 'rgba(76, 175, 80, 0.08)' : 'rgba(25, 118, 210, 0.05)',
              border: `1px solid ${uploadProgress >= 100 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(25, 118, 210, 0.1)'}`,
              transition: 'all 0.5s ease'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {uploadProgress >= 100 ? (
                    <Box 
                      component="span" 
                      sx={{ 
                        width: 20, 
                        height: 20, 
                        borderRadius: '50%', 
                        bgcolor: 'rgba(76, 175, 80, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 10, 
                          height: 10, 
                          borderRadius: '50%', 
                          bgcolor: '#4caf50' 
                        }} 
                      />
                    </Box>
                  ) : (
                    <Box sx={{ 
                      width: 14, 
                      height: 14, 
                      borderRadius: '50%', 
                      border: '2px solid rgba(25, 118, 210, 0.5)',
                      borderTopColor: 'transparent',
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' }
                      }
                    }} />
                  )}
                  <Typography variant="body2" sx={{ 
                    fontWeight: 500, 
                    color: uploadProgress >= 100 ? '#4caf50' : 'text.secondary',
                    transition: 'color 0.3s ease'
                  }}>
                    {uploadProgress < 100 
                      ? `Processing ${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''}...` 
                      : `Upload complete!`
                    }
                  </Typography>
                </Box>
                
                <Typography variant="caption" sx={{ 
                  color: uploadProgress >= 100 ? '#4caf50' : 'primary.main',
                  fontWeight: 600,
                  transition: 'color 0.3s ease'
                }}>
                  {uploadProgress < 100 ? 'Uploading...' : 'Completed'}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            onClick={onClose} 
            color="inherit" 
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            color="primary"
            disabled={selectedFiles.length === 0 || uploading}
            startIcon={<CloudUploadIcon />}
          >
            Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default UploadModal; 