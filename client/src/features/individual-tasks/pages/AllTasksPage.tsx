import { useState, useEffect } from 'react';
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
import { getAllTasks } from '../../../apis/task/individual/individual.api';
import type { Task, TaskListItem } from '../../../utils/individualTask.type';


// Theme Constants
const GREEN_GRADIENT = 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)';
const GREEN_PRIMARY = '#1b5e20';

// helper to format enum text
const formatText = (text: string) =>
  text.charAt(0) + text.slice(1).toLowerCase();

// mapper function
const mapTaskToListItem = (task: Task): TaskListItem => ({
  id: task.id,
  title: task.title,
  description: task.description,
  category: task.individualTask.category,
  difficulty: task.individualTask.difficulty,
  points: task.baseScore,
});

export default function AllTasksPage() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<TaskListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getAllTasks();

        const formattedTasks = res
          .filter((task: Task) => task.isActive) // only active tasks
          .map(mapTaskToListItem);

        setTasks(formattedTasks);
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All' ||
      task.category.toLowerCase() === categoryFilter.toLowerCase();

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

  if (loading) {
    return (
      <Box p={4}>
        <Typography>Loading tasks...</Typography>
      </Box>
    );
  }

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
        
        {/* Filters */}
        <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 2, border: '1px solid #e0e0e0', display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />

          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
              startAdornment={<FilterListIcon sx={{ mr: 1 }} />}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Sustainability">Sustainability</MenuItem>
              <MenuItem value="Community">Community</MenuItem>
              <MenuItem value="Education">Education</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {/* TABLE */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>TASK</TableCell>
                <TableCell>CATEGORY</TableCell>
                <TableCell>DIFFICULTY</TableCell>
                <TableCell align="right">REWARD</TableCell>
                <TableCell align="center">ACTION</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow key={task.id} hover>
                    <TableCell>
                      <Box>
                        <Typography fontWeight={700}>
                          {task.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {task.description}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip label={task.category} />
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ color: getDifficultyColor(formatText(task.difficulty)) }}>
                        {formatText(task.difficulty)}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Typography fontWeight={700}>
                        +{task.points}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      >
                        Start
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No tasks found
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

/**OK since the code has already been written lets go with it. 
 * First of all, I need to create the api for fetching all the tasks. All those tasks will be shown here. There is an option like
 * category so instead of daily tasks all other task will be shown categorically.
 * For the daily task I need to think how to fetch 1 task from the server every day.
 * And then I will need to integrate all the apis and test for edge cases as well. Lot of work.
 * It is not that simple, it's not just to integrate the already made apis I need to show all the stages well enough. This will take some while
 * and even now I am not that clear as to how to proceed so need to work step by step.
 */