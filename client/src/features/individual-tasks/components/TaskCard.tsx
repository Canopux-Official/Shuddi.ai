import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { getCategoryTheme, getDifficultyTheme } from '../../../config/taskTheme';
import type { TaskListItem } from '../../../utils/individualTask.type';

const GREEN_PRIMARY = '#1b5e20';
const GREEN_LIGHT = '#e8f5e9';

interface Props {
  task: TaskListItem;
  timeEstimate?: string;
}

export const TaskCard: React.FC<Props> = ({ task, timeEstimate }) => {
  const navigate = useNavigate();
  const categoryTheme = getCategoryTheme(task.category);
  const difficultyTheme = getDifficultyTheme(task.difficulty);
  const CategoryIcon = categoryTheme.icon;

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
          borderColor: GREEN_PRIMARY,
        },
      }}
    >
      {/* Icon panel replaces the old CardMedia image */}
      <Box
        sx={{
          position: 'relative',
          height: 140,
          background: categoryTheme.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CategoryIcon sx={{ fontSize: 56, color: 'rgba(255,255,255,0.9)' }} />
        <Chip
          label={categoryTheme.label}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: 'rgba(255,255,255,0.9)',
            fontWeight: 600,
            backdropFilter: 'blur(4px)',
          }}
        />
        <Chip
          label={`+${task.points} XP`}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'rgba(0,0,0,0.35)',
            color: 'white',
            fontWeight: 700,
            backdropFilter: 'blur(4px)',
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          {timeEstimate ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <AccessTimeIcon fontSize="inherit" /> {timeEstimate}
            </Typography>
          ) : (
            <span />
          )}
          <Typography
            variant="caption"
            sx={{ color: difficultyTheme.color, fontWeight: 700 }}
          >
            {difficultyTheme.label.toUpperCase()}
          </Typography>
        </Box>

        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ lineHeight: 1.3 }}>
          {task.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            mb: 2,
          }}
        >
          {task.description}
        </Typography>
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate(`/tasks/${task.id}`)}
          sx={{
            borderRadius: 2,
            borderColor: GREEN_PRIMARY,
            color: GREEN_PRIMARY,
            '&:hover': { bgcolor: GREEN_LIGHT, borderColor: GREEN_PRIMARY },
          }}
        >
          Start Task
        </Button>
      </Box>
    </Card>
  );
};