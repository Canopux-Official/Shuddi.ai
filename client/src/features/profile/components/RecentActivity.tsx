// File: src/components/Profile/RecentActivity.tsx
import React from 'react';
import { Box } from '@mui/material';

interface Activity {
  id: string;
  title: string;
  date: string;
  status: 'verified' | 'under_review';
  xp: number;
  icon: string;
}

const RecentActivity: React.FC = () => {
  const activities: Activity[] = [
    { id: '1', title: 'Beach Cleanup Drive', date: 'Dec 15', status: 'verified', xp: 150, icon: '🏖️' },
    { id: '2', title: 'Tree Planting Event', date: 'Dec 10', status: 'verified', xp: 200, icon: '🌳' },
    { id: '3', title: 'Lake Cleanup Drive', date: 'Dec 18', status: 'under_review', xp: 0, icon: '💧' },
    { id: '4', title: 'Park Restoration', date: 'Nov 25', status: 'verified', xp: 180, icon: '🌲' },
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ fontSize: '16px', fontWeight: 700 }}>Recent Activity</Box>
        <Box
          sx={{
            fontSize: '13px',
            color: '#4caf50',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          View all submissions →
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {activities.map((activity) => (
          <Box
            key={activity.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1.5,
              bgcolor: '#fafafa',
              borderRadius: 2,
              '&:hover': { bgcolor: '#f5f5f5' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
              <Box sx={{ fontSize: '24px' }}>{activity.icon}</Box>
              <Box>
                <Box sx={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>
                  {activity.title}
                </Box>
                <Box sx={{ fontSize: '12px', color: '#999' }}>{activity.date}</Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {activity.status === 'verified' ? (
                <>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      bgcolor: '#e8f5e9',
                      color: '#4caf50',
                      borderRadius: 1,
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    ✓ Verified
                  </Box>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      bgcolor: '#fff3cd',
                      color: '#856404',
                      borderRadius: 1,
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {activity.xp} XP
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    bgcolor: '#fff4e6',
                    color: '#e65100',
                    borderRadius: 1,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  ⏱️ Under Review
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RecentActivity;