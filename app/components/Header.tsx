'use client';

import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  InputBase, 
  Box, 
  alpha,
  useTheme,
  styled
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadModal from './UploadModal';

interface HeaderProps {
  onSearch: (term: string) => void;
  onImagesUploaded: (images: any[]) => void;
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header = ({ onSearch, onImagesUploaded }: HeaderProps) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const theme = useTheme();

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

  return (
    <>
      <AppBar position="sticky" color="primary" elevation={2}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 700 }}
          >
            Modern Gallery
          </Typography>
          
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={(e) => onSearch(e.target.value)}
            />
          </Search>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CloudUploadIcon />}
            onClick={handleOpenUploadModal}
            sx={{
              px: 2,
              py: 1,
              fontWeight: 600,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            Upload
          </Button>
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