// src/components/ProgressStats.tsx
import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { CheckCircle as CheckCircleIcon, AccessTime as AccessTimeIcon, Search as SearchIcon } from '@mui/icons-material';

import type { ProgressStat } from '../types/types';

const ProgressStats: React.FC = () => {
  const stats: ProgressStat[] = [
    { label: 'Completed Tasks', count: 12, icon: <CheckCircleIcon />, color: 'success.main' },
    { label: 'Pending Verification', count: 2, icon: <AccessTimeIcon />, color: 'warning.main' },
    { label: 'Under Review', count: 1, icon: <SearchIcon />, color: 'info.main' },
  ];
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, flexWrap: 'wrap' }}>
      {stats.map((stat) => (
        <Box
          key={stat.label}
          sx={{
            flex: { xs: 'none', sm: 1 },
            minWidth: 0,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ color: stat.color }}>{stat.icon}</Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>{stat.count}</Typography>
              <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
            </Box>
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default ProgressStats;