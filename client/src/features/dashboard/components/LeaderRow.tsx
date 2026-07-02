import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import type { LeaderboardEntry } from '../types/types';

interface LeaderRowProps {
  entry: LeaderboardEntry;
  isMe: boolean;
}

const rankColors = ['#f59e0b', '#94a3b8', '#cd7f32'];

const LeaderRow: React.FC<LeaderRowProps> = ({ entry, isMe }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      px: 2,
      py: 1,
      borderRadius: 1.5,
      bgcolor: isMe ? 'rgba(19,78,74,0.08)' : 'transparent',
      border: isMe ? '1px solid rgba(19,78,74,0.2)' : '1px solid transparent',
      transition: 'background 0.15s',
    }}
  >
    <Typography
      variant="body2"
      fontWeight={700}
      sx={{
        width: 22,
        color: entry.rank <= 3 ? rankColors[entry.rank - 1] : 'text.secondary',
      }}
    >
      {entry.rank}
    </Typography>

    <Avatar
      src={entry.avatar || undefined}
      sx={{ width: 28, height: 28, bgcolor: '#134e4a', fontSize: 12 }}
    >
      {entry.username?.[0]?.toUpperCase()}
    </Avatar>

    <Typography variant="body2" fontWeight={isMe ? 700 : 500} sx={{ flex: 1 }} noWrap>
      {isMe ? `${entry.username} (you)` : entry.username}
    </Typography>

    <Typography variant="body2" fontWeight={600} color="primary">
      {entry.points.toLocaleString()} XP
    </Typography>
  </Box>
);

export default LeaderRow;