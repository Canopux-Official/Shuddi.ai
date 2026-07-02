import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Assignment as TasksIcon,
  CardGiftcard as RewardsIcon,
  People as FeedIcon,
  Inbox as SubmissionsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface NavCard {
  label: string;
  description: string;
  route: string;
  icon: React.ReactNode;
  accent: string; // bg tint
  iconColor: string;
}

const NAV_CARDS: NavCard[] = [
  {
    label: 'Browse Tasks',
    description: 'Find and start eco tasks near you',
    route: '/all-tasks',
    icon: <TasksIcon />,
    accent: '#f0fdf4',
    iconColor: '#134e4a',
  },
  {
    label: 'Rewards',
    description: 'Redeem your earned credits',
    route: '/reward',
    icon: <RewardsIcon />,
    accent: '#fffbeb',
    iconColor: '#d97706',
  },
  {
    label: 'Social Feed',
    description: 'See what the community is doing',
    route: '/s',
    icon: <FeedIcon />,
    accent: '#eff6ff',
    iconColor: '#2563eb',
  },
  {
    label: 'My Submissions',
    description: 'Track your submitted tasks',
    route: '/submissions',
    icon: <SubmissionsIcon />,
    accent: '#fdf4ff',
    iconColor: '#7c3aed',
  },
];

const QuickNavCards: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
        gap: 2,
        mb: 4,
      }}
    >
      {NAV_CARDS.map(({ label, description, route, icon, accent, iconColor }) => (
        <Paper
          key={route}
          elevation={0}
          onClick={() => navigate(route)}
          sx={{
            p: 2,
            border: '1px solid rgba(0,0,0,0.07)',
            borderRadius: 2,
            cursor: 'pointer',
            transition: 'box-shadow 0.15s, transform 0.15s',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          {/* Icon circle */}
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: iconColor,
              mb: 1.5,
            }}
          >
            {icon}
          </Box>

          <Typography variant="body2" fontWeight={700} lineHeight={1.2} mb={0.5}>
            {label}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.4}>
            {description}
          </Typography>

          {/* Arrow */}
          <Box mt={1.5} display="flex" justifyContent="flex-end">
            <ArrowForwardIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default QuickNavCards;