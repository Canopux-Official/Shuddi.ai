import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Recycling as RecyclingIcon,
} from '@mui/icons-material';
import type { ImpactData } from '../types/types';

interface ImpactStatsRowProps {
  impact: ImpactData;
}

const ImpactStatsRow: React.FC<ImpactStatsRowProps> = ({ impact }) => {
  const stats = [
    {
      icon: <RecyclingIcon sx={{ fontSize: 20, color: '#134e4a' }} />,
      label: 'Total Contributions',
      value: impact.totalContributions,
    },
    {
      icon: <span style={{ fontSize: 18 }}>⚖️</span>,
      label: 'Weight Removed (kg)',
      value: impact.totalWeightRemoved.toFixed(2),
    },
    {
      icon: <TrophyIcon sx={{ fontSize: 20, color: '#f59e0b' }} />,
      label: 'Next Milestone',
      value: `${impact.nextMilestone} kg`,
    },
  ];

  return (
    <Box mb={3}>
      {/* Stat cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr' },
          gap: 2,
          mb: 2,
        }}
      >
        {stats.map(({ icon, label, value }) => (
          <Box
            key={label}
            sx={{
              p: 1.5,
              borderRadius: 2,
              border: '1px solid #e5e7eb',
              bgcolor: 'white',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            <Box mt={0.25}>{icon}</Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                {label}
              </Typography>
              <Typography variant="body1" fontWeight={700} color="text.primary">
                {value}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Milestone progress */}
      <Box>
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="caption" color="text.secondary">
            Milestone — {impact.totalWeightRemoved.toFixed(1)} / {impact.nextMilestone} kg
          </Typography>
          <Typography variant="caption" fontWeight={600} color="primary">
            {impact.percentageToMilestone.toFixed(0)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={impact.percentageToMilestone}
          sx={{
            height: 6,
            borderRadius: 4,
            bgcolor: '#e5e7eb',
            '& .MuiLinearProgress-bar': { bgcolor: '#22c55e', borderRadius: 4 },
          }}
        />
      </Box>
    </Box>
  );
};

export default ImpactStatsRow;