// File: src/components/Profile/Rewards.tsx
import React from 'react';
import { Box } from '@mui/material';

const Rewards: React.FC = () => {
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ fontSize: '16px', fontWeight: 700 }}>Rewards</Box>
        <Box
          sx={{
            fontSize: '13px',
            color: '#4caf50',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Go to Rewards →
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
        <Box
          sx={{
            p: 2.5,
            bgcolor: '#fff8e1',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ fontSize: '36px' }}>🎁</Box>
          <Box>
            <Box sx={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a' }}>150</Box>
            <Box sx={{ fontSize: '13px', color: '#666' }}>Credits Available</Box>
          </Box>
        </Box>
        <Box
          sx={{
            p: 2.5,
            bgcolor: '#e8f5e9',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ fontSize: '36px' }}>🎖️</Box>
          <Box>
            <Box sx={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a' }}>2</Box>
            <Box sx={{ fontSize: '13px', color: '#666' }}>Certificates Earned</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Rewards;