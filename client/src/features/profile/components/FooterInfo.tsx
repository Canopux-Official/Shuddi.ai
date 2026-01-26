// File: src/components/Profile/FooterInfo.tsx
import React from 'react';
import { Box } from '@mui/material';

const FooterInfo: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        fontSize: '12px',
        color: '#999',
        lineHeight: 1.6,
      }}
    >
      All activities shown here are verified through AI checks and partner review. Your Impact Score, Level, and Badges are earned through verified contributions only, ensuring trust and transparency across the platform.
    </Box>
  );
};

export default FooterInfo;