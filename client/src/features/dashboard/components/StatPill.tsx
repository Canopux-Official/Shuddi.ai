import React from 'react';
import { Box, Typography } from '@mui/material';

interface StatPillProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
}

const StatPill: React.FC<StatPillProps> = ({ icon, label, value, color = '#134e4a' }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      bgcolor: 'rgba(255,255,255,0.12)',
      backdropFilter: 'blur(6px)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: 2,
      px: 2,
      py: 1,
    }}
  >
    <Box sx={{ color, display: 'flex' }}>{icon}</Box>
    <Box>
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={700} color="white" lineHeight={1.2}>
        {value}
      </Typography>
    </Box>
  </Box>
);

export default StatPill;