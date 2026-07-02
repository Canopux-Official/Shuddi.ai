import React from 'react';
import { Box, Button } from '@mui/material';
import {
  Bolt as BoltIcon,
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  AccountBalanceWallet as WalletIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StatPill from './StatPill';
import type { OverviewData } from '../types/types';

interface StatPillsBarProps {
  overview: OverviewData;
  balance: number | null;
}

const StatPillsBar: React.FC<StatPillsBarProps> = ({ overview, balance }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        mt: -1,
        mb: 3,
        px: 2,
        py: 1.5,
        bgcolor: '#134e4a',
        borderRadius: '0 0 16px 16px',
      }}
    >
      <StatPill
        icon={<BoltIcon sx={{ fontSize: 16 }} />}
        label="XP"
        value={`${overview.xp.toLocaleString()} XP`}
        color="#fbbf24"
      />
      <StatPill
        icon={<TrophyIcon sx={{ fontSize: 16 }} />}
        label="Level"
        value={`Lv. ${overview.level}`}
        color="#a3e635"
      />
      <StatPill
        icon={<FireIcon sx={{ fontSize: 16 }} />}
        label="Streak"
        value={`${overview.streaks.current} days`}
        color="#fb923c"
      />
      <StatPill
        icon={<WalletIcon sx={{ fontSize: 16 }} />}
        label="Credits"
        value={balance !== null ? balance : overview.walletBalance}
        color="#38bdf8"
      />
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate('/all-tasks')}
          sx={{
            bgcolor: 'white',
            color: '#134e4a',
            fontWeight: 700,
            borderRadius: 2,
            textTransform: 'none',
            px: 2.5,
            '&:hover': { bgcolor: '#f0fdf4' },
          }}
        >
          Browse Tasks
        </Button>
      </Box>
    </Box>
  );
};

export default StatPillsBar;