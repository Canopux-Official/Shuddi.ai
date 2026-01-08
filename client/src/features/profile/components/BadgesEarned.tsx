// File: src/components/Profile/BadgesEarned.tsx
import React from 'react';
import { Box } from '@mui/material';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

const BadgesEarned: React.FC = () => {
  const earnedBadges: Badge[] = [
    { id: '1', name: 'First Step', description: 'Complete your first task', icon: '🌱', earned: true },
    { id: '2', name: 'Tree Hugger', description: 'Plant 5 trees', icon: '🌳', earned: true },
    { id: '3', name: 'Clean Streak', description: '7 day streak', icon: '🔥', earned: true },
  ];
  const upcomingBadges: Badge[] = [
    { id: '4', name: 'Water Guardian', description: 'Complete water tasks', icon: '💧', earned: false },
    { id: '5', name: 'Community Leader', description: 'Lead 10 community events', icon: '👥', earned: false },
    { id: '6', name: 'Eco Champion', description: 'Reach 1000 Impact Score', icon: '🏅', earned: false },
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
      <Box sx={{ fontSize: '16px', fontWeight: 700, mb: 2 }}>Badges Earned</Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 1.5, mb: 3 }}>
        {earnedBadges.map((badge) => (
          <Box
            key={badge.id}
            sx={{
              p: 2,
              bgcolor: '#f9fafb',
              borderRadius: 2,
              textAlign: 'left',
            }}
          >
            <Box sx={{ fontSize: '28px', mb: 0.5 }}>{badge.icon}</Box>
            <Box sx={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', mb: 0.3 }}>
              {badge.name}
            </Box>
            <Box sx={{ fontSize: '11px', color: '#999' }}>{badge.description}</Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ fontSize: '13px', color: '#888', mb: 1.5 }}>Upcoming badges</Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 1.5 }}>
        {upcomingBadges.map((badge) => (
          <Box
            key={badge.id}
            sx={{
              p: 2,
              bgcolor: '#f9fafb',
              borderRadius: 2,
              textAlign: 'left',
              opacity: 0.5,
            }}
          >
            <Box sx={{ fontSize: '28px', mb: 0.5, filter: 'grayscale(1)' }}>{badge.icon}</Box>
            <Box sx={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', mb: 0.3 }}>
              {badge.name}
            </Box>
            <Box sx={{ fontSize: '11px', color: '#999' }}>{badge.description}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BadgesEarned;