// File: src/components/Profile/HowVerificationWorks.tsx
import React from 'react';
import { Box } from '@mui/material';

const HowVerificationWorks: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        mb: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: '#666',
          fontSize: '13px',
          cursor: 'pointer',
          '&:hover': { color: '#4caf50' },
        }}
      >
        <Box sx={{ fontSize: '16px' }}>ℹ️</Box>
        How verification works
      </Box>
    </Box>
  );
};

export default HowVerificationWorks;