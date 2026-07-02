import React from 'react';
import { Box, Chip, Paper, Skeleton, Tooltip, Typography } from '@mui/material';
import { WorkspacePremium as BadgeIcon } from '@mui/icons-material';
import type { BadgesData } from '../types/types';

interface BadgesStripProps {
  badges: BadgesData | null;
  loading: boolean;
}

const rarityColor: Record<string, string> = {
  COMMON: '#6b7280',
  RARE: '#3b82f6',
  EPIC: '#8b5cf6',
  LEGENDARY: '#f59e0b',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

const BadgesStrip: React.FC<BadgesStripProps> = ({ badges, loading }) => {
  if (loading) {
    return <Skeleton variant="rectangular" height={110} sx={{ borderRadius: 2, mb: 3 }} />;
  }

  if (!badges) return null;

  const emptySlots = badges.stats.totalAvailable - badges.stats.earned;

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 2,
        p: { xs: 2, sm: 2.5 },
        mb: 3,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <BadgeIcon sx={{ color: '#f59e0b' }} />
          <Typography variant="h6" fontWeight={600}>
            Your Badges
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {badges.stats.earned} / {badges.stats.totalAvailable} earned
        </Typography>
      </Box>

      <Box display="flex" gap={2} flexWrap="wrap">
        {/* Earned badges */}
        {badges.badges.map((b) => (
          <Tooltip
            key={b.name}
            title={`${b.name} · ${b.rarity} · Earned ${formatDate(b.earnedAt)}`}
            arrow
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'default',
              }}
            >
              <Box
                component="img"
                src={b.image}
                alt={b.name}
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  border: `2px solid ${rarityColor[b.rarity] ?? '#6b7280'}`,
                  p: 0.5,
                  bgcolor: 'white',
                }}
              />
              <Chip
                label={b.rarity}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 10,
                  bgcolor: rarityColor[b.rarity] ?? '#6b7280',
                  color: 'white',
                  fontWeight: 700,
                }}
              />
              <Typography variant="caption" textAlign="center" maxWidth={64} lineHeight={1.2}>
                {b.name}
              </Typography>
            </Box>
          </Tooltip>
        ))}

        {/* Locked / empty slots */}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <Box
            key={`empty-${i}`}
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              border: '2px dashed #d1d5db',
              bgcolor: '#f9fafb',
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default BadgesStrip;