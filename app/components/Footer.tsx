'use client';

import { Box, Container, Typography, Link, Divider } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'primary.main',
        color: 'white',
      }}
    >
      <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Box sx={{ mb: { xs: 2, md: 0 } }}>
            <Typography variant="h6" gutterBottom>
              Modern Gallery
            </Typography>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
              A beautiful place to showcase your images
            </Typography>
          </Box>
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 4 },
              alignItems: { xs: 'center', md: 'flex-start' },
            }}
          >
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Resources
              </Typography>
              <Box 
                component="ul" 
                sx={{ 
                  listStyle: 'none', 
                  p: 0, 
                  m: 0, 
                  '& li': { mb: 0.5 } 
                }}
              >
                <li>
                  <Link href="#" color="inherit" underline="hover">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" color="inherit" underline="hover">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" color="inherit" underline="hover">
                    API
                  </Link>
                </li>
              </Box>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Company
              </Typography>
              <Box 
                component="ul" 
                sx={{ 
                  listStyle: 'none', 
                  p: 0, 
                  m: 0, 
                  '& li': { mb: 0.5 } 
                }}
              >
                <li>
                  <Link href="#" color="inherit" underline="hover">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" color="inherit" underline="hover">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" color="inherit" underline="hover">
                    Contact
                  </Link>
                </li>
              </Box>
            </Box>
          </Box>
        </Box>
        
        <Box 
          sx={{ 
            mt: 3, 
            textAlign: 'center',
            borderTop: 1,
            borderColor: 'rgba(255, 255, 255, 0.12)',
            pt: 2,
          }}
        >
          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
            © {new Date().getFullYear()} Modern Gallery. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 