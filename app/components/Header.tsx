'use client';

import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box,
  useTheme,
  Link,
  Button,
  useMediaQuery
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import UploadModal from './UploadModal';
import UploadButton from './UploadButton';

interface HeaderProps {
  onImagesUploaded: (images: any[]) => void;
}

const Header = ({ onImagesUploaded }: HeaderProps) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleImagesUploaded = (images: any[]) => {
    onImagesUploaded(images);
    handleCloseUploadModal();
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(10, 10, 25, 0.7)',
          background: 'linear-gradient(90deg, rgba(10, 10, 25, 0.8) 0%, rgba(30, 30, 60, 0.8) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar sx={{ py: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Link
            component="button"
            onClick={scrollToTop}
            underline="none"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              '&:hover': {
                color: '#FF5370',
              },
              transition: 'color 0.2s ease',
            }}
          >
            <ImageIcon sx={{ mr: 1, fontSize: 28 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                fontWeight: 700, 
                letterSpacing: '0.02em',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
                transition: 'transform 0.2s ease',
              }}
            >
              Modern Gallery
            </Typography>
          </Link>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <UploadButton 
              onClick={handleOpenUploadModal} 
              variant="outlined"
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        </Toolbar>
      </AppBar>
      
      <UploadModal
        open={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onImagesUploaded={handleImagesUploaded}
      />
    </>
  );
};

export default Header; 