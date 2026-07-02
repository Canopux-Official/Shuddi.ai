import React from 'react';
import {
  Box,
  Paper,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  MyLocation as RegionalIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { fetchLeaderboard } from '../../../apis/dashboard/dashboardApi';
import LeaderRow from './LeaderRow';
import type { LeaderboardData } from '../types/types';

interface LeaderboardPanelProps {
  leaderboard: LeaderboardData | null;
  myUsername?: string;
  loading: boolean;
  onLeaderboardChange: (data: LeaderboardData) => void;
}

const LeaderboardPanel: React.FC<LeaderboardPanelProps> = ({
  leaderboard,
  myUsername,
  loading,
  onLeaderboardChange,
}) => {
  const [leaderType, setLeaderType] = React.useState<'global' | 'regional'>('global');

  const handleTypeChange = async (
    _: React.MouseEvent,
    val: 'global' | 'regional' | null
  ) => {
    if (!val) return;
    setLeaderType(val);
    try {
      const data = await fetchLeaderboard(val);
      onLeaderboardChange(data);
    } catch {
      toast.error('Could not switch leaderboard.');
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 2,
        overflow: 'hidden',
        mb: 3,
      }}
    >
      {/* Header */}
      <Box
        px={2}
        pt={2}
        pb={1.5}
        borderBottom="1px solid #f0f0f0"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center" gap={1}>
          <TrophyIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
          <Typography variant="h6" fontWeight={600}>
            Leaderboard
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={leaderType}
          exclusive
          onChange={handleTypeChange}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              py: 0.25,
              px: 1,
              fontSize: 11,
              textTransform: 'none',
              border: '1px solid #e5e7eb',
              '&.Mui-selected': {
                bgcolor: '#134e4a',
                color: 'white',
                '&:hover': { bgcolor: '#0f3d39' },
              },
            },
          }}
        >
          <ToggleButton value="global">
            <PublicIcon sx={{ fontSize: 13, mr: 0.5 }} />
            Global
          </ToggleButton>
          <ToggleButton value="regional">
            <RegionalIcon sx={{ fontSize: 13, mr: 0.5 }} />
            Regional
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* My rank summary */}
      {!loading && leaderboard && (
        <Box
          sx={{
            mx: 2,
            mt: 1.5,
            mb: 1,
            p: 1.5,
            borderRadius: 2,
            bgcolor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Global rank
            </Typography>
            <Typography variant="body1" fontWeight={700} color="#134e4a">
              #{leaderboard.myRank.global}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="caption" color="text.secondary">
              Regional rank
            </Typography>
            <Typography variant="body1" fontWeight={700} color="#134e4a">
              #{leaderboard.myRank.regional}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Rows */}
      <Box py={0.5}>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Box key={i} px={2} py={0.75}>
                <Skeleton variant="rectangular" height={36} sx={{ borderRadius: 1.5 }} />
              </Box>
            ))
          : leaderboard?.leaderboard.map((entry) => (
              <LeaderRow
                key={entry.rank}
                entry={entry}
                isMe={!!myUsername && entry.username === myUsername}
              />
            ))}
      </Box>
    </Paper>
  );
};

export default LeaderboardPanel;