import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import type { Foundation } from '../types/types';

type FoundationCardProps = {
  foundation: Foundation;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onDonateClick: (foundation: Foundation) => void; // 👈 NEW
};

export const FoundationCard: React.FC<FoundationCardProps> = ({
  foundation,
  favorites,
  onToggleFavorite,
  onDonateClick,
}) => {
  const isFavorited = favorites.has(foundation.id);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 1 }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <IconButton
            size="small"
            sx={{ color: isFavorited ? '#EF4444' : '#9CA3AF' }}
            onClick={() => onToggleFavorite(foundation.id)}
          >
            {isFavorited ? <Favorite /> : <FavoriteBorder />}
          </IconButton>

          {foundation.verified && (
            <Chip
              label="Verified"
              size="small"
              sx={{ bgcolor: '#D1FAE5', color: '#10B981', fontWeight: 500 }}
            />
          )}
        </Box>

        {/* Content */}
        <Typography variant="h6" fontWeight="600" gutterBottom>
          {foundation.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
          {foundation.description}
        </Typography>

        {/* Donate Button */}
        <Button
          variant="outlined"
          fullWidth
          sx={{ textTransform: 'none' }}
          onClick={() => onDonateClick(foundation)}
        >
          Donate
        </Button>
      </CardContent>
    </Card>
  );
};
