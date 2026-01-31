import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Button } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { type Task } from '../utils/taskData';

// Theme constants matching your Auth style
const GREEN_PRIMARY = '#1b5e20'; // Deep Green
const GREEN_LIGHT = '#e8f5e9';   // Light background

export const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const navigate = useNavigate();

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
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="180"
          image={task.image}
          alt={task.title}
          sx={{ filter: 'brightness(0.95)' }}
        />
        <Chip 
          label={task.category} 
          size="small"
          sx={{ 
            position: 'absolute', 
            top: 12, 
            left: 12, 
            bgcolor: 'rgba(255,255,255,0.9)', 
            fontWeight: 600,
            backdropFilter: 'blur(4px)'
          }} 
        />
        <Chip 
          label={`+${task.points} XP`} 
          size="small"
          sx={{ 
            position: 'absolute', 
            top: 12, 
            right: 12, 
            bgcolor: GREEN_PRIMARY, 
            color: 'white',
            fontWeight: 700
          }} 
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
           <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
             <AccessTimeIcon fontSize="inherit" /> {task.timeEstimate}
           </Typography>
           <Typography variant="caption" sx={{ color: task.difficulty === 'Easy' ? 'success.main' : 'warning.main', fontWeight: 600 }}>
             {task.difficulty.toUpperCase()}
           </Typography>
        </Box>
        
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ lineHeight: 1.3 }}>
          {task.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ 
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          mb: 2
        }}>
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
            '&:hover': {
              bgcolor: GREEN_LIGHT,
              borderColor: GREEN_PRIMARY
            }
          }}
        >
          Start Task
        </Button>
      </Box>
    </Card>
  );
};