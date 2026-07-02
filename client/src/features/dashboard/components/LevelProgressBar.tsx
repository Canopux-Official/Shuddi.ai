import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface LevelProgressBarProps {
  level: number;
  progressPercentage: number;
}

const LevelProgressBar: React.FC<LevelProgressBarProps> = ({ level, progressPercentage }) => (
  <Box mb={3}>
    <Box display="flex" justifyContent="space-between" mb={0.5}>
      <Typography variant="caption" color="text.secondary">
        Level {level} progress
      </Typography>
      <Typography variant="caption" fontWeight={600} color="primary">
        {progressPercentage.toFixed(0)}%
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={progressPercentage}
      sx={{
        height: 8,
        borderRadius: 4,
        bgcolor: '#e5e7eb',
        '& .MuiLinearProgress-bar': { bgcolor: '#134e4a', borderRadius: 4 },
      }}
    />
  </Box>
);

export default LevelProgressBar;