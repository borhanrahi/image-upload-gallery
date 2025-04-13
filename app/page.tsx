'use client';

import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Container, Divider, Paper, Button, IconButton } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageGallery from './components/ImageGallery';
import { ImageType } from './types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import UploadModal from './components/UploadModal';
import UploadButton from './components/UploadButton';

// Factory function to create demo images with consistent properties
const createDemoImage = (id: string, filename: string, title: string): ImageType => ({
  id,
  url: `https://res.cloudinary.com/demo/image/upload/v1696496183/${filename}`,
  title,
  publicId: filename,
  width: 800,
  height: 600,
  createdAt: '2023-01-01T00:00:00Z',
  date: '2023-01-01',
});

// Demo images created using the factory function
const demoImages: ImageType[] = [
  createDemoImage('1', 'sample', 'Sample Image 1'),
  createDemoImage('2', 'cld-sample-2', 'Sample Image 2'),
  createDemoImage('3', 'cld-sample-3', 'Sample Image 3'),
  createDemoImage('4', 'cld-sample-4', 'Sample Image 4'),
  createDemoImage('5', 'cld-sample-5', 'Sample Image 5'),
  createDemoImage('6', 'flowers', 'Flowers'),
  createDemoImage('7', 'shoes', 'Shoes'),
  createDemoImage('8', 'animals/cat', 'Cat'),
  createDemoImage('9', 'animals/dog', 'Dog'),
  createDemoImage('10', 'forest', 'Forest'),
  createDemoImage('11', 'beach', 'Beach'),
  createDemoImage('12', 'city', 'City'),
];

const STORAGE_KEY = 'gallery_images';
const DELETED_IMAGES_KEY = 'deleted_images'; 

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState<ImageType[]>(demoImages);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleOpenUploadModal = () => {
    setUploadModalOpen(true);
  };

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!isClient) return;
    
    const loadImagesFromStorage = () => {
      try {
        const savedImages = localStorage.getItem(STORAGE_KEY);
        let userImages: ImageType[] = [];
        
        if (savedImages) {
          userImages = JSON.parse(savedImages) as ImageType[];
        }

        const deletedImages = localStorage.getItem(DELETED_IMAGES_KEY);
        let deletedIds: string[] = [];
        
        if (deletedImages) {
          deletedIds = JSON.parse(deletedImages) as string[];
          setDeletedImageIds(deletedIds);
        }
        
        const filteredDemoImages = demoImages.filter(
          img => !deletedIds.includes(img.id)
        );
        
        setImages([...userImages, ...filteredDemoImages]);
      } catch (error) {
        console.error('Error loading images from localStorage:', error);
      }
    };
    
    loadImagesFromStorage();
  }, [isClient]);
  
  useEffect(() => {
    if (!isClient || deletedImageIds.length === 0) return;
    
    try {
      localStorage.setItem(DELETED_IMAGES_KEY, JSON.stringify(deletedImageIds));
    } catch (error) {
      console.error('Error saving deleted image IDs to localStorage:', error);
    }
  }, [deletedImageIds, isClient]);
  
  useEffect(() => {
    if (!isClient || images.length === 0) return;
    
    try {
      const userImages = images.filter(img => 
        !demoImages.some(demoImg => demoImg.id === img.id)
      );
      
      console.log('Saving to localStorage:', userImages.length, 'images');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userImages));
    } catch (error) {
      console.error('Error saving images to localStorage:', error);
    }
  }, [images, isClient]);

  const handleImagesUploaded = (newImages: ImageType[]) => {
    if (!isClient) return;
    
    setUploadModalOpen(false);
    
    if (newImages.length === 0) {
      console.log('Refresh gallery requested after deletion');
      
      try {
        const savedImages = localStorage.getItem(STORAGE_KEY);
        let userImages: ImageType[] = [];
        
        if (savedImages) {
          userImages = JSON.parse(savedImages) as ImageType[];
        }
        
        const filteredDemoImages = demoImages.filter(
          img => !deletedImageIds.includes(img.id)
        );
        
        setImages([...userImages, ...filteredDemoImages]);
      } catch (error) {
        console.error('Error loading images from localStorage after deletion:', error);
      }
    } else {
      console.log('Adding', newImages.length, 'new images to gallery');
      setImages(prevImages => [...newImages, ...prevImages]);
    }
  };
  
  const handleImageDeleted = (id: string) => {
    const isDemoImage = demoImages.some(img => img.id === id);
    
    if (isDemoImage) {
      setDeletedImageIds(prev => [...prev, id]);
    }
    
    setImages(prev => prev.filter(img => img.id !== id));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onSearch={handleSearch} onImagesUploaded={handleImagesUploaded} />

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 8, md: 12 },
          backgroundImage: 'linear-gradient(135deg, #1E1E2F 0%, #2D3250 100%)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: { xs: '65vh', md: '75vh' },
          boxShadow: 'inset 0 -10px 20px -10px rgba(0,0,0,0.2)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("https://images.unsplash.com/photo-1545239352-8cf6abbb5188?q=80&w=2574")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.07,
            zIndex: 0,
          }
        }}
      >
        {/* Floating Elements */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(255,83,112,0.15) 0%, rgba(255,83,112,0) 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            animation: 'float 8s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0) scale(1)' },
              '50%': { transform: 'translateY(-20px) scale(1.1)' },
            },
          }} 
        />
        
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: '15%',
            right: '8%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(94,114,228,0.15) 0%, rgba(94,114,228,0) 70%)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            animation: 'float2 10s ease-in-out infinite',
            '@keyframes float2': {
              '0%, 100%': { transform: 'translateY(0) scale(1)' },
              '50%': { transform: 'translateY(30px) scale(1.1)' },
            },
          }} 
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box 
            sx={{ 
              display: 'inline-flex',
              alignItems: 'center', 
              px: 2, 
              py: 1, 
              mb: 4, 
              borderRadius: '30px',
              backgroundColor: 'rgba(255, 83, 112, 0.15)',
              border: '1px solid rgba(255, 83, 112, 0.3)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: '#FF5370', 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '0.75rem'
              }}
            >
              Beautiful & Responsive Image Gallery
            </Typography>
          </Box>
          
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{ 
              fontWeight: 800, 
              mb: 3,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              color: 'white',
              textShadow: '0 5px 15px rgba(0,0,0,0.3)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #d0d0d0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Modern Image Gallery
          </Typography>

          <Typography 
            variant="h5" 
            component="p" 
            sx={{ 
              mb: 6, 
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '800px',
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.6,
              fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
            }}
          >
            Showcase your favorite photos in a beautiful, responsive layout with powerful search and organization features
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              onClick={() => window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' })}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '50px',
                backgroundColor: '#FF5370',
                backgroundImage: 'linear-gradient(45deg, #FF5370 0%, #ff8787 100%)',
                boxShadow: '0 4px 20px rgba(255, 83, 112, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(255, 83, 112, 0.5)',
                  backgroundImage: 'linear-gradient(45deg, #ff4060 0%, #ff7a7a 100%)',
                },
              }}
            >
              Browse Gallery
            </Button>
            
            <UploadButton 
              variant="outlined" 
              onClick={handleOpenUploadModal}
              size="large"
              label="Upload Images"
            />
          </Box>
          
          <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <IconButton 
              onClick={() => window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' })}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(5px)',
                color: 'white',
                animation: 'bounce 2s infinite',
                '@keyframes bounce': {
                  '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                  '40%': { transform: 'translateY(-20px)' },
                  '60%': { transform: 'translateY(-10px)' },
                },
              }}
            >
              <KeyboardArrowDownIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>
      
      {/* Gallery Section */}
      <Box sx={{ flex: 1, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#16222A',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 60,
                    height: 3,
                    background: 'linear-gradient(90deg, #3A6073 0%, #16222A 100%)',
                    borderRadius: 4,
                  }
                }}
              >
                Photo Gallery
              </Typography>
              <Box sx={{ flex: 1 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Showing {images.length} images
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              Browse through our collection of high-quality images. Click on any image for a detailed view.
            </Typography>
          </Box>
          
          <ImageGallery 
            initialImages={images} 
            searchTerm={searchTerm} 
            onAddImages={handleImagesUploaded} 
            onImageDeleted={handleImageDeleted} 
          />
        </Container>
      </Box>
      
      {/* Additional Gallery Information */}
      <Box sx={{ py: 6, bgcolor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              textAlign: 'center', 
              mb: 4,
              fontWeight: 600,
              color: '#16222A'
            }}
          >
            About This Gallery
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
          }}>
            <Paper 
              elevation={0} 
              sx={{ 
                flex: 1, 
                p: 3, 
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                  borderColor: '#3A6073',
                }
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: '#16222A' }}>
                Features
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                • Responsive gallery layout
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                • Full-screen image previews
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                • Image uploads with drag-and-drop
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                • Quick search functionality
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • Smooth animations and transitions
              </Typography>
            </Paper>
            
            <Paper 
              elevation={0} 
              sx={{ 
                flex: 1, 
                p: 3, 
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                  borderColor: '#3A6073',
                }
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: '#16222A' }}>
                Technology
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                • Built with Next.js and React
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                • Material-UI components
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                • Responsive design for all devices
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                • Cloud image storage
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • Modern JavaScript technologies
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>
      
      <Footer />
      
      <UploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onImagesUploaded={handleImagesUploaded}
      />
    </Box>
  );
}
