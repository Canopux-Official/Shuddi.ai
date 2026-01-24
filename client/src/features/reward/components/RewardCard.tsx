
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  CardGiftcard,
  ShoppingBag,
  LocalCafe,
  WorkspacePremium,
} from '@mui/icons-material';
import GrassIcon from '@mui/icons-material/Grass';
import type { RewardItem } from '../types/types';

const RewardCard: React.FC<{ reward: RewardItem }> = ({ reward }) => {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'bag':
        return <ShoppingBag sx={{ fontSize: 40, color: '#10B981' }} />;
      case 'tree':
        return <GrassIcon sx={{ fontSize: 40, color: '#10B981' }} />;
      case 'cafe':
        return <LocalCafe sx={{ fontSize: 40, color: '#10B981' }} />;
      case 'workshop':
        return <WorkspacePremium sx={{ fontSize: 40, color: '#10B981' }} />;
      default:
        return <CardGiftcard sx={{ fontSize: 40, color: '#10B981' }} />;
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 1 }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2 }}>{getIcon(reward.icon)}</Box>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          {reward.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
          {reward.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CardGiftcard sx={{ color: '#F59E0B', fontSize: 20 }} />
            <Typography variant="h6" color="#F59E0B" fontWeight="600">
              {reward.credits}
            </Typography>
          </Box>
          <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>
            Redeem
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RewardCard;