// File: src/components/Profile/ImpactOverview.tsx
import React from 'react';
import { Box } from '@mui/material';

interface ImpactStat {
  label: string;
  value: number;
  icon: string;
  color: string;
}

const ImpactOverview: React.FC = () => {
  const stats: ImpactStat[] = [
    { label: 'Environment', value: 450, icon: '🌱', color: '#e8f5e9' },
    { label: 'Cleanup', value: 380, icon: '🧹', color: '#e3f2fd' },
    { label: 'Water', value: 280, icon: '💧', color: '#e1f5fe' },
    { label: 'Community', value: 140, icon: '👥', color: '#f3e5f5' },
  ];
  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        mb: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <Box sx={{ fontSize: '16px', fontWeight: 700, mb: 2 }}>Impact Overview</Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
          gap: 1.5,
        }}
      >
        {stats.map((stat) => (
          <Box
            key={stat.label}
            sx={{
              p: 2,
              bgcolor: stat.color,
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Box sx={{ fontSize: '32px', mb: 0.5 }}>{stat.icon}</Box>
            <Box sx={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a', mb: 0.3 }}>
              {stat.value}
            </Box>
            <Box sx={{ fontSize: '12px', color: '#666' }}>{stat.label}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ImpactOverview;