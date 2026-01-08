// src/components/TaskCard.tsx
import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import type { Task } from '../types/types';



interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="180"
        image={task.image}
        alt={task.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
          {task.title} <span>{task.icon}</span>
        </Typography>
        <Box display="flex" gap={1} mb={2}>
          <Chip 
            label={task.difficulty} 
            size="small" 
            color={task.difficulty === 'Easy' ? 'success' : task.difficulty === 'Medium' ? 'warning' : 'error'} 
          />
          <Chip label={`${task.points} Points`} size="small" variant="outlined" />
        </Box>
        <Button variant="contained" fullWidth sx={{ mt: 'auto', textTransform: 'none', fontWeight: 600 }}>
          Start Task
        </Button>
      </CardContent>
    </Card>
  );
};

export default TaskCard;