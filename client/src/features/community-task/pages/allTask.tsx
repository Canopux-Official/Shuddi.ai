import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupsIcon from '@mui/icons-material/Groups';

import { useNavigate } from 'react-router-dom';

import Header from '../../dashboard/components/Header';
import { mockAvailableTasks } from '../mock/task.mock';
import type { AvailableCommunityTask } from '../mock/task.mock';

const GREEN_GRADIENT = 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)';
const GREEN_PRIMARY = '#1b5e20';

export default function AllTasksPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = mockAvailableTasks.items.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date?: string) => {
    if (!date) return "Not scheduled";
    return new Date(date).toLocaleString();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <Header />

      {/* Hero */}
      <Box sx={{ background: GREEN_GRADIENT, color: 'white', py: 6, mb: 4 }}>
        <Container maxWidth="xl">
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Community Action Center
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
            Join impactful community-driven initiatives.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pb: 8 }}>

        {/* Search */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 2,
            border: '1px solid #e0e0e0'
          }}
        >
          <TextField
            fullWidth
            placeholder="Search community tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              )
            }}
            size="small"
          />
        </Paper>

        {/* Table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}
        >
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>TASK</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>SCHEDULE</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>CAPACITY</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                  ACTION
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task: AvailableCommunityTask) => (
                  <TableRow key={task.communityTaskId} hover>

                    {/* Title + Description */}
                    <TableCell>
                      <Typography fontWeight={700}>
                        {task.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 400,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {task.description}
                      </Typography>
                    </TableCell>

                    {/* Schedule */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="body2">
                          {formatDate(task.startAt)} - {formatDate(task.endAt)}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Capacity */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <GroupsIcon fontSize="small" />
                        <Typography>
                          {task.maxParticipants ?? 'Unlimited'}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Action */}
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() =>
                          navigate(`/tasks/${task.communityTaskId}`)
                        }
                        sx={{
                          bgcolor: GREEN_PRIMARY,
                          '&:hover': { bgcolor: '#144a18' }
                        }}
                      >
                        View
                      </Button>
                    </TableCell>

                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">
                      No community tasks found.
                    </Typography>
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
