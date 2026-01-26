// src/components/RewardsSection.tsx
import React from 'react';
import { Paper, Box, Typography, Button } from '@mui/material';
import { EmojiEvents as TrophyIcon, CardGiftcard as GiftIcon } from '@mui/icons-material';

const RewardsSection: React.FC = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        Your Rewards
      </Typography>
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <TrophyIcon sx={{ fontSize: 40, color: '#ffd700' }} />
          <Typography variant="body1" fontWeight={600}>Impact Certificate</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <GiftIcon sx={{ fontSize: 40, color: '#ff6b6b' }} />
          <Box>
            <Typography variant="body1" fontWeight={600}>200 Points</Typography>
            <Typography variant="body2" color="text.secondary">Available</Typography>
          </Box>
        </Box>
        <Button variant="contained" fullWidth sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}>
          Redeem Rewards
        </Button>
      </Box>
    </Paper>
  );
};

export default RewardsSection;