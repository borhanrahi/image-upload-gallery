'use client';

import { Box, Container, Typography, Link, Stack, Zoom, useScrollTrigger, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import ImageIcon from '@mui/icons-material/Image';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const footerLinks = [
  {
    title: "Resources",
    links: [
      { text: "Documentation", href: "#" },
      { text: "Pricing", href: "#" },
      { text: "API", href: "#" }
    ]
  },
  {
    title: "Company",
    links: [
      { text: "About", href: "#" },
      { text: "Blog", href: "#" },
      { text: "Contact", href: "#" }
    ]
  },
  {
    title: "Legal",
    links: [
      { text: "Privacy", href: "#" },
      { text: "Terms", href: "#" },
      { text: "Cookies", href: "#" }
    ]
  }
];

const socialLinks = [
  { Icon: InstagramIcon, href: "#", ariaLabel: "Instagram" },
  { Icon: TwitterIcon, href: "#", ariaLabel: "Twitter" },
  { Icon: GitHubIcon, href: "https://github.com/borhanrahi", ariaLabel: "GitHub" }
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const linkStyles = {
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover': {
      color: 'white',
    },
    transition: 'color 0.2s ease',
    fontSize: { xs: '0.8rem', sm: '0.875rem' }
  };

  const sectionTitleStyles = { 
    fontWeight: 600, 
    mb: { xs: 1, md: 2 },
    color: 'white',
    fontSize: { xs: '0.9rem', sm: '1rem' }
  };

  const socialIconStyles = { 
    color: 'text.secondary',
    '&:hover': {
      color: '#FF5370',
      backgroundColor: 'rgba(255, 83, 112, 0.08)',
    }
  };
  
  return (
    <Box
      component="footer"
      sx={{
        pt: { xs: 4, md: 6 },
        pb: { xs: 3, md: 4 },
        mt: { xs: 4, md: 6 },
        backgroundColor: 'rgba(22, 34, 42, 0.95)',
        color: 'rgba(255, 255, 255, 0.9)',
        backgroundImage: 'linear-gradient(to bottom, rgba(58, 96, 115, 0.95), rgba(22, 34, 42, 0.98))',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ 
            flex: { md: '0 0 350px' }, 
            mb: { xs: 4, md: 0 }, 
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' }
          }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 2
              }}
            >
              <ImageIcon sx={{ mr: 1, fontSize: 28, color: '#FF5370' }} />
              <Typography
                variant="h5"
                component="div"
                sx={{ 
                  fontWeight: 700, 
                  letterSpacing: '0.02em',
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                Modern Gallery
              </Typography>
            </Box>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                textAlign: { xs: 'center', md: 'left' },
                maxWidth: '300px',
                mb: 2
              }}
            >
              A beautiful and responsive image gallery for showcasing your favorite memories and creative work.
            </Typography>
            
            <Stack direction="row" spacing={1}>
              {socialLinks.map(({ Icon, href, ariaLabel }, index) => (
                <IconButton
                  key={index}
                  size="small"
                  href={href}
                  target={href !== "#" ? "_blank" : undefined}
                  rel={href !== "#" ? "noopener noreferrer" : undefined}
                  aria-label={ariaLabel}
                  sx={socialIconStyles}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Box>
          
          <Box sx={{ 
            flex: '1 1 auto', 
            display: 'flex',
            justifyContent: { xs: 'space-between', md: 'flex-end' },
          }}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'row', md: 'row' },
              width: '100%',
              justifyContent: { xs: 'space-between', md: 'flex-end' },
              gap: { xs: 2, md: 8 },
              pr: { md: 2 }
            }}>
              {footerLinks.map((section, sectionIndex) => (
                <Box key={sectionIndex}>
                  <Typography 
                    variant="subtitle1" 
                    sx={sectionTitleStyles}
                  >
                    {section.title}
                  </Typography>
                  <Stack spacing={{ xs: 1, md: 1.5 }}>
                    {section.links.map((link, linkIndex) => (
                      <Link 
                        key={linkIndex}
                        href={link.href} 
                        underline="none"
                        sx={linkStyles}
                      >
                        {link.text}
                      </Link>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        
        <Box 
          sx={{ 
            mt: { xs: 3, md: 4 }, 
            pt: { xs: 2, md: 3 },
            textAlign: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            © {new Date().getFullYear()} Modern Gallery. All rights reserved by Borhan.
          </Typography>
        </Box>
      </Container>
      
      <Zoom in={trigger}>
        <Box
          role="presentation"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={scrollToTop}
            aria-label="scroll back to top"
            sx={{
              backgroundColor: 'rgba(58, 96, 115, 0.9)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: 'rgba(58, 96, 115, 1)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
                transform: 'translateY(-4px)',
              },
              transition: 'all 0.3s ease',
              padding: { xs: 1, md: 1.5 },
            }}
          >
            <ArrowUpwardIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      </Zoom>
    </Box>
  );
};

export default Footer;