// File: src/components/Profile/Ranking.tsx
import React from 'react';
import { Box } from '@mui/material';

const Ranking: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: 3,
        p: { xs: 2, sm: 2.5 },
        mb: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ fontSize: '14px', color: '#888' }}>Your Standing</Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ fontSize: '18px' }}>🏆</Box>
            <Box sx={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a' }}>
              Rank #56
            </Box>
          </Box>
          <Box
            sx={{
              px: 1,
              py: 0.3,
              bgcolor: '#f5f5f5',
              borderRadius: 1,
              fontSize: '11px',
              color: '#666',
            }}
          >
            Bhubaneswar — This month
          </Box>
        </Box>
        <Box
          sx={{
            fontSize: '13px',
            color: '#4caf50',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          View full leaderboard →
        </Box>
      </Box>
    </Box>
  );
};

export default Ranking;