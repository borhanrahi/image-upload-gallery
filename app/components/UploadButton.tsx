'use client';

import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface UploadButtonProps {
  onClick: () => void;
  variant?: 'contained' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  className?: string;
  label?: string;
}

const UploadButton = ({ 
  onClick, 
  variant = 'contained', 
  size = 'medium',
  fullWidth = false,
  className,
  label = 'Upload'
}: UploadButtonProps) => {
  return (
    <Button
      variant={variant}
      startIcon={<CloudUploadIcon />}
      onClick={onClick}
      fullWidth={fullWidth}
      className={className}
      sx={{
        px: size === 'small' ? 2 : size === 'large' ? 3 : 2.5,
        py: size === 'small' ? 0.8 : size === 'large' ? 1.2 : 1,
        fontWeight: 600,
        textTransform: 'none',
        fontSize: size === 'small' ? '0.85rem' : size === 'large' ? '1.1rem' : '0.95rem',
        borderRadius: size === 'large' ? '50px' : 2.5,
        ...(variant === 'contained' && {
          backgroundImage: 'linear-gradient(45deg, #FF5370 0%, #ff8787 100%)',
          boxShadow: '0 4px 12px rgba(255, 83, 112, 0.3)',
          border: 'none',
          color: 'white',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(255, 83, 112, 0.4)',
            transform: 'translateY(-2px)',
            backgroundImage: 'linear-gradient(45deg, #ff4060 0%, #ff7a7a 100%)',
          },
        }),
        ...(variant === 'outlined' && {
          borderColor: 'rgba(255, 255, 255, 0.3)',
          color: 'white',
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }),
        transition: 'all 0.3s ease',
      }}
    >
      {label}
    </Button>
  );
};

export default UploadButton; 