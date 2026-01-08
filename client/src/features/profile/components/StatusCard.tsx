// File: src/components/Profile/StatsCard.tsx
import React from 'react';
import { Box } from '@mui/material';

const StatsCard: React.FC = () => {
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
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 3,
        }}
      >
        <Box>
          <Box sx={{ fontSize: '12px', color: '#888', mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            📊 Impact Score
          </Box>
          <Box sx={{ fontSize: { xs: '24px', sm: '28px' }, fontWeight: 700, color: '#4caf50' }}>
            1250
          </Box>
        </Box>
        <Box>
          <Box sx={{ fontSize: '12px', color: '#888', mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            🏆 Level
          </Box>
          <Box sx={{ fontSize: { xs: '24px', sm: '28px' }, fontWeight: 700, color: '#1a1a1a' }}>
            3
          </Box>
          <Box sx={{ fontSize: '11px', color: '#999' }}>Sapling</Box>
        </Box>
        <Box>
          <Box sx={{ fontSize: '12px', color: '#888', mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            ✅ Verified Tasks
          </Box>
          <Box sx={{ fontSize: { xs: '24px', sm: '28px' }, fontWeight: 700, color: '#4caf50' }}>
            23
          </Box>
        </Box>
      </Box>
      <Box sx={{ mb: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Box sx={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>Level 3</Box>
          <Box sx={{ fontSize: '12px', color: '#666' }}>250 / 500 IS</Box>
          <Box sx={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>Level 4</Box>
        </Box>
        <Box
          sx={{
            height: 8,
            bgcolor: '#f0f0f0',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: '50%',
              bgcolor: '#ffc107',
              borderRadius: 1,
            }}
          />
        </Box>
      </Box>
      <Box sx={{ fontSize: '11px', color: '#999', textAlign: 'center' }}>
        Based on verified contributions only
      </Box>
    </Box>
  );
};

export default StatsCard;