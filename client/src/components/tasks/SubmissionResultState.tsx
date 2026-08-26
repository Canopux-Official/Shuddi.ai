import React from 'react';
import { Box, Typography, Button, Alert, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const GREEN_PRIMARY = '#1b5e20';

interface Props {
  variant: 'approved' | 'rejected' | 'cooldown';
  points?: number;
  rejectionReason?: string | null;
  /** ISO string — cooldown-until, or evidence resubmission deadline */
  expiresAt?: string | null;
  onRetry?: () => void;
  onFindAnother?: () => void;
}

const formatRelative = (iso?: string | null) => {
  if (!iso) return null;
  const target = new Date(iso).getTime();
  const diffMs = target - Date.now();
  if (diffMs <= 0) return 'shortly';
  const hours = Math.round(diffMs / (1000 * 60 * 60));
  if (hours < 1) return 'in under an hour';
  if (hours === 1) return 'in about 1 hour';
  if (hours < 24) return `in about ${hours} hours`;
  const days = Math.round(hours / 24);
  return `in about ${days} day${days > 1 ? 's' : ''}`;
};

export const SubmissionResultState: React.FC<Props> = ({
  variant,
  points,
  rejectionReason,
  expiresAt,
  onRetry,
  onFindAnother,
}) => {
  if (variant === 'approved') {
    return (
      <Box textAlign="center" py={2}>
        <CheckCircleIcon sx={{ fontSize: 56, color: GREEN_PRIMARY, mb: 1 }} />
        <Typography variant="h6" fontWeight={800} gutterBottom>
          Approved
        </Typography>
        <Typography color="text.secondary" mb={2}>
          {typeof points === 'number'
            ? `Your submission was verified — +${points} XP added to your account.`
            : 'Your submission was verified.'}
        </Typography>
        {onFindAnother && (
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={onFindAnother}
            sx={{ bgcolor: GREEN_PRIMARY, '&:hover': { bgcolor: '#144a18' } }}
          >
            Find Another Task
          </Button>
        )}
      </Box>
    );
  }

  if (variant === 'rejected') {
    return (
      <Box py={1}>
        <Box textAlign="center" mb={2}>
          <CancelIcon sx={{ fontSize: 56, color: 'error.main', mb: 1 }} />
          <Typography variant="h6" fontWeight={800} gutterBottom>
            Not Approved
          </Typography>
        </Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {rejectionReason || 'Your submission didn\u2019t meet the requirements for this task.'}
        </Alert>
        <Typography color="text.secondary" mb={2} textAlign="center">
          You can submit new proof for this task.
        </Typography>
        {onRetry && (
          <Box textAlign="center">
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              sx={{ bgcolor: GREEN_PRIMARY, '&:hover': { bgcolor: '#144a18' } }}
            >
              Submit New Proof
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  // cooldown
  const relative = formatRelative(expiresAt);
  return (
    <Box textAlign="center" py={2}>
      <HourglassBottomIcon sx={{ fontSize: 56, color: 'warning.main', mb: 1 }} />
      <Typography variant="h6" fontWeight={800} gutterBottom>
        On Cooldown
      </Typography>
      <Typography color="text.secondary" mb={1}>
        You've already completed this task recently.
      </Typography>
      {relative && (
        <Chip
          label={`Available again ${relative}`}
          sx={{ mb: 2, bgcolor: '#fff3e0', color: '#ef6c00', fontWeight: 600 }}
        />
      )}
      {onFindAnother && (
        <Box>
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            onClick={onFindAnother}
            sx={{ borderColor: GREEN_PRIMARY, color: GREEN_PRIMARY }}
          >
            Find Another Task
          </Button>
        </Box>
      )}
    </Box>
  );
};