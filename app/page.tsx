'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageGallery from './components/ImageGallery';
import { ImageType } from './types';

// Sample images for demo purposes
const demoImages: ImageType[] = [
  {
    id: '1',
    url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
    title: 'Sample Image 1',
    publicId: 'sample',
    width: 864,
    height: 576,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    url: 'https://res.cloudinary.com/demo/image/upload/v1696496183/cld-sample-2.jpg',
    title: 'Sample Image 2',
    publicId: 'cld-sample-2',
    width: 800,
    height: 600,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    url: 'https://res.cloudinary.com/demo/image/upload/v1696496182/cld-sample-3.jpg',
    title: 'Sample Image 3',
    publicId: 'cld-sample-3',
    width: 800,
    height: 600,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    url: 'https://res.cloudinary.com/demo/image/upload/v1696496183/cld-sample-4.jpg',
    title: 'Sample Image 4',
    publicId: 'cld-sample-4',
    width: 800,
    height: 600,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    url: 'https://res.cloudinary.com/demo/image/upload/v1696496183/cld-sample-5.jpg',
    title: 'Sample Image 5',
    publicId: 'cld-sample-5',
    width: 800,
    height: 600,
    createdAt: new Date().toISOString(),
  },
];

const STORAGE_KEY = 'gallery_images';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState<ImageType[]>([]);
  
  // Load images from localStorage on initial render
  useEffect(() => {
    const loadImagesFromStorage = () => {
      try {
        const savedImages = localStorage.getItem(STORAGE_KEY);
        if (savedImages) {
          const parsedImages = JSON.parse(savedImages) as ImageType[];
          setImages([...parsedImages, ...demoImages]);
        } else {
          setImages(demoImages);
        }
      } catch (error) {
        console.error('Error loading images from localStorage:', error);
        setImages(demoImages);
      }
    };
    
    loadImagesFromStorage();
  }, []);
  
  // Save images to localStorage whenever they change
  useEffect(() => {
    if (images.length === 0) return;
    
    try {
      // Only save user-uploaded images, not the demo ones
      const userImages = images.filter(img => 
        !demoImages.some(demoImg => demoImg.id === img.id)
      );
      
      console.log('Saving to localStorage:', userImages.length, 'images');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userImages));
    } catch (error) {
      console.error('Error saving images to localStorage:', error);
    }
  }, [images]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleImagesUploaded = (newImages: ImageType[]) => {
    if (newImages.length === 0) {
      // This is a special case for deletion - we don't want to add anything,
      // Just refresh the gallery with what we have in localStorage
      console.log('Refresh gallery requested after deletion');
      
      try {
        const savedImages = localStorage.getItem(STORAGE_KEY);
        if (savedImages) {
          const parsedImages = JSON.parse(savedImages) as ImageType[];
          setImages([...parsedImages, ...demoImages]);
        } else {
          setImages(demoImages);
        }
      } catch (error) {
        console.error('Error loading images from localStorage after deletion:', error);
      }
    } else {
      // Normal case - adding new images
      console.log('Adding', newImages.length, 'new images to gallery');
      setImages(prevImages => [...newImages, ...prevImages]);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header 
        onSearch={handleSearch} 
        onImagesUploaded={handleImagesUploaded} 
      />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          bgcolor: 'background.default'
        }}
      >
        <ImageGallery 
          initialImages={images} 
          searchTerm={searchTerm}
          onAddImages={handleImagesUploaded}
        />
      </Box>
      
      <Footer />
    </Box>
  );
}
