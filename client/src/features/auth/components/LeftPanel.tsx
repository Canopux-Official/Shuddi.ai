import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import AirIcon from '@mui/icons-material/Air';

const LeftPanel: React.FC = () => {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        background: 'linear-gradient(150deg, #0f3935 0%, #134e4a 100%)',
        color: 'white',
        p: 8,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{
        position: 'absolute', top: -100, right: -100, width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(45,212,191,0.15) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      <Stack direction="row" alignItems="center" spacing={2} sx={{ zIndex: 2 }}>
        <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', p: 1, borderRadius: 2, backdropFilter: 'blur(10px)' }}>
          <AirIcon sx={{ color: '#2dd4bf', fontSize: 30 }} />
        </Box>
        <Typography variant="h5" fontWeight="bold">shuddhi.ai</Typography>
      </Stack>

      <Box sx={{ zIndex: 2, maxWidth: 480 }}>
        <Typography variant="h3" sx={{ mb: 3, lineHeight: 1.1 }}>
          Data-driven <br />
          <span style={{ color: '#2dd4bf' }}>Clean Air</span> Action.
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>
          Join the largest community-driven network monitoring air quality in real-time.
        </Typography>
      </Box>

      {/* Footer */}
      <Stack direction="row" spacing={3} sx={{ zIndex: 2, opacity: 0.6 }}>
        <Typography variant="body2">© 2026 Shuddhi Inc.</Typography>
        <Typography variant="body2">Privacy Policy</Typography>
      </Stack>
    </Box>
  );
};

export default LeftPanel;