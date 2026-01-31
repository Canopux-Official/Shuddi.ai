import { useState } from 'react';
import { 
  Box, Container, Typography, TextField, InputAdornment, 
  MenuItem, Select, FormControl, InputLabel, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, Chip, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';

import Header from '../../dashboard/components/Header';
import { ALL_TASKS } from '../utils/taskData';

// Theme Constants
const GREEN_GRADIENT = 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)';
const GREEN_PRIMARY = '#1b5e20';

export default function AllTasksPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredTasks = ALL_TASKS.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || task.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return 'success.main';
      case 'Medium': return 'warning.main';
      case 'Hard': return 'error.main';
      default: return 'text.secondary';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <Header />
      
      {/* Hero Header */}
      <Box sx={{ background: GREEN_GRADIENT, color: 'white', py: 6, mb: 4 }}>
        <Container maxWidth="xl">
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Action Center
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
            Browse our list of impactful tasks. Select a task from the table below to start your journey.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pb: 8 }}>
        
        {/* Filters Bar */}
        <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 2, border: '1px solid #e0e0e0', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Search tasks by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
            size="small"
          />
          
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
              startAdornment={<FilterListIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />}
            >
              <MenuItem value="All">All Categories</MenuItem>
              <MenuItem value="Sustainability">Sustainability</MenuItem>
              <MenuItem value="Community">Community</MenuItem>
              <MenuItem value="Education">Education</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {/* TASKS TABLE */}
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Table sx={{ minWidth: 650 }} aria-label="tasks table">
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>TASK NAME</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>CATEGORY</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>DIFFICULTY</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>EST. TIME</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }} align="right">REWARD</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }} align="center">ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow
                    key={task.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: 'background-color 0.2s' }}
                  >
                    {/* Task Name & Image */}
                    <TableCell component="th" scope="row">
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar 
                          variant="rounded" 
                          src={task.image} 
                          alt={task.title} 
                          sx={{ width: 56, height: 56, borderRadius: 2 }} 
                        />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#2c3e50' }}>
                            {task.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {task.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <Chip 
                        label={task.category} 
                        size="small" 
                        sx={{ 
                          bgcolor: '#e8f5e9', 
                          color: GREEN_PRIMARY, 
                          fontWeight: 600,
                          borderRadius: '6px'
                        }} 
                      />
                    </TableCell>

                    {/* Difficulty */}
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} sx={{ color: getDifficultyColor(task.difficulty) }}>
                        {task.difficulty.toUpperCase()}
                      </Typography>
                    </TableCell>

                    {/* Time */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="body2">{task.timeEstimate}</Typography>
                      </Box>
                    </TableCell>

                    {/* Points */}
                    <TableCell align="right">
                      <Typography variant="h6" color={GREEN_PRIMARY} fontWeight={800}>
                        +{task.points}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">XP</Typography>
                    </TableCell>

                    {/* Action Button */}
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        disableElevation
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate(`/tasks/${task.id}`)}
                        sx={{ 
                          textTransform: 'none', 
                          bgcolor: GREEN_PRIMARY,
                          '&:hover': { bgcolor: '#144a18' },
                          borderRadius: 2
                        }}
                      >
                        Start
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography variant="h6" color="text.secondary">No tasks found matching your filters.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

      </Container>
    </Box>
  );
}