// src/components/CommunityFeedItem.tsx
import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { CheckCircle as  CheckCircleIcon} from '@mui/icons-material';
import type { CommunityFeedItem as CommunityFeedItemType } from '../types/types';

interface CommunityFeedItemProps {
  item: CommunityFeedItemType;
}

const CommunityFeed: React.FC<CommunityFeedItemProps> = ({ item }) => {
  return (
    <Box display="flex" gap={2} p={2} sx={{ '&:not(:last-child)': { borderBottom: '1px solid #f0f0f0' } }}>
      <Avatar src={item.image} sx={{ width: 56, height: 56, borderRadius: 2 }} />
      <Box flex={1}>
        <Typography variant="body1" fontWeight={600}>
          <strong>{item.name}</strong> {item.action} in {item.location}.
        </Typography>
        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
          <CheckCircleIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
          <Typography variant="body2" color="text.secondary">
            Verified by {item.verifiedBy}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CommunityFeed;