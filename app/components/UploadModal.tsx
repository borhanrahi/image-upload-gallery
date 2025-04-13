"use client"
import { useState, useCallback } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  LinearProgress,
  Alert,
  Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useImageUpload } from '../hooks/useImageUpload';
import { ImageType } from '../types';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onImagesUploaded: (images: ImageType[]) => void;
}

const UploadModal = ({ open, onClose, onImagesUploaded }: UploadModalProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { uploading, uploadProgress, uploadMultipleImages, error } = useImageUpload();

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
      setSelectedFiles(filesArray);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files).filter(file => 
        file.type.startsWith('image/')
      );
      setSelectedFiles(filesArray);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length > 0) {
      const uploadedImages = await uploadMultipleImages(selectedFiles);
      if (uploadedImages.length > 0) {
        onImagesUploaded(uploadedImages);
        setSelectedFiles([]);
        onClose();
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
          maxWidth: 600,
          p: 4,
          outline: 'none',
          borderRadius: 2,
        }}
      >
        <Typography id="upload-modal-title" variant="h5" component="h2" gutterBottom>
          Upload Images
        </Typography>
        
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
            mb: 2,
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
            </Box>
          </label>
        </Box>
        
        {selectedFiles.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected
            </Typography>
            <Stack spacing={1} sx={{ maxHeight: 100, overflowY: 'auto' }}>
              {selectedFiles.map((file, index) => (
                <Typography key={index} variant="body2" noWrap>
                  {file.name} ({Math.round(file.size / 1024)} KB)
                </Typography>
              ))}
            </Stack>
          </Box>
        )}
        
        {uploading && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Uploading... {Math.round(uploadProgress)}%
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
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
          >
            Upload
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default UploadModal; 