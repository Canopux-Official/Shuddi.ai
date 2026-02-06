import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

export interface AvailableCommunityTask {
  communityTaskId: string;
  taskId: string;
  title: string;
  description: string;
  startAt?: string;
  endAt?: string;
  maxParticipants: number | null;
}

interface TaskCardProps {
  task: AvailableCommunityTask;
}

const GREEN_PRIMARY = '#1b5e20';
const GREEN_LIGHT = '#e8f5e9';

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const navigate = useNavigate();

  const formatDate = (date?: string) => {
    if (!date) return "No schedule";
    return new Date(date).toLocaleString();
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '1px solid #e0e0e0',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
          borderColor: GREEN_PRIMARY
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>

        {/* Title */}
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
        >
          {task.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            mb: 2
          }}
        >
          {task.description}
        </Typography>

        {/* Schedule */}
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <AccessTimeIcon fontSize="small" />
          <Typography variant="caption" color="text.secondary">
            {formatDate(task.startAt)} - {formatDate(task.endAt)}
          </Typography>
        </Box>

        {/* Capacity */}
        <Box display="flex" alignItems="center" gap={1}>
          <GroupsIcon fontSize="small" />
          <Chip
            label={
              task.maxParticipants
                ? `Max ${task.maxParticipants} participants`
                : "Unlimited participants"
            }
            size="small"
            sx={{
              bgcolor: GREEN_LIGHT,
              color: GREEN_PRIMARY,
              fontWeight: 600
            }}
          />
        </Box>

      </CardContent>

      {/* Action */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate(`/tasks/${task.communityTaskId}`)}
          sx={{
            bgcolor: GREEN_PRIMARY,
            '&:hover': { bgcolor: '#144a18' }
          }}
        >
          View Task
        </Button>
      </Box>
    </Card>
  );
};
