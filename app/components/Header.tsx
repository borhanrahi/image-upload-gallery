'use client';

import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box,
  useTheme,
  Link,
  InputBase,
  alpha,
  styled,
  IconButton,
  useMediaQuery,
  Collapse
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import UploadModal from './UploadModal';

interface HeaderProps {
  onSearch: (term: string) => void;
  onImagesUploaded: (images: any[]) => void;
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(4px)',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.common.white, 0.7)
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'white',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '18ch',
      '&:focus': {
        width: '24ch',
      },
    },
  },
}));

const Header = ({ onSearch, onImagesUploaded }: HeaderProps) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleToggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen && searchTerm) {
      setSearchTerm('');
      onSearch('');
    }
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

          {isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                onClick={handleToggleSearch}
                sx={{ color: 'white' }}
              >
                {searchOpen ? <CloseIcon /> : <SearchIcon />}
              </IconButton>
              <Collapse in={searchOpen} orientation="horizontal">
                <Search sx={{ ml: 1 }}>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    autoFocus={searchOpen}
                  />
                </Search>
              </Collapse>
            </Box>
          ) : (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Search>
          )}
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