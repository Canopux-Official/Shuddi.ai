import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { Bolt as BoltIcon } from '@mui/icons-material';
import type { ActivityData } from '../types/types';

interface ActivityGraphProps {
  activity: ActivityData;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

const ActivityGraph: React.FC<ActivityGraphProps> = ({ activity }) => {
  const { history, engagementLevel } = activity;
  const max = Math.max(...history.map((d) => d.actions), 1);

  return (
    <Box mb={3}>
      <Typography variant="body2" fontWeight={600} color="text.secondary" mb={1}>
        Last {history.length} days activity
      </Typography>

      {/* Bars */}
      <Box display="flex" alignItems="flex-end" gap={0.75} height={56}>
        {history.map((day) => (
          <Tooltip
            key={day.date}
            title={`${formatDate(day.date)}: ${day.actions} action${day.actions !== 1 ? 's' : ''}`}
            arrow
          >
            <Box
              sx={{
                flex: 1,
                bgcolor: day.actions > 0 ? '#134e4a' : '#e5e7eb',
                borderRadius: '4px 4px 0 0',
                height: `${Math.max((day.actions / max) * 100, 8)}%`,
                cursor: 'default',
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 0.75 },
              }}
            />
          </Tooltip>
        ))}
      </Box>

      {/* Day labels */}
      <Box display="flex" justifyContent="space-between" mt={0.5}>
        {history.map((day) => (
          <Typography
            key={day.date}
            variant="caption"
            sx={{ flex: 1, textAlign: 'center', color: 'text.secondary', fontSize: 10 }}
          >
            {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short' }).slice(0, 2)}
          </Typography>
        ))}
      </Box>

      {/* Engagement score */}
      <Box mt={1.5} display="flex" alignItems="center" gap={1}>
        <BoltIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
        <Typography variant="caption" color="text.secondary">
          Engagement score:{' '}
          <strong style={{ color: '#134e4a' }}>{engagementLevel.toFixed(1)}</strong>
        </Typography>
      </Box>
    </Box>
  );
};

export default ActivityGraph;