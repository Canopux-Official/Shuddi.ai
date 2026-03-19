import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  CardGiftcard,
  Favorite,
  Campaign,
  Handshake,
} from '@mui/icons-material';
import type { HistoryItem } from '../../../utils/reward.type';

export const DonationHistoryTable: React.FC<{ history: HistoryItem[] }> = ({ history }) => {
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Foundation':
        return '#EF4444';
      case 'Campaign':
        return '#10B981';
      case 'NGO':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Foundation':
        return <Favorite sx={{ fontSize: 16 }} />;
      case 'Campaign':
        return <Campaign sx={{ fontSize: 16 }} />;
      case 'NGO':
        return <Handshake sx={{ fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Task</TableCell>
            <TableCell align="right">Credits</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {history.map((item) => (
            <TableRow key={item.id}>
              
              {/* Type */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: getTypeColor(item.type) }}>
                    {getTypeIcon(item.type)}
                  </Box>
                  <Typography variant="body2" sx={{ color: getTypeColor(item.type) }}>
                    {item.type}
                  </Typography>
                </Box>
              </TableCell>

              {/* Reason */}
              <TableCell>{item.reason}</TableCell>

              {/* Task Title */}
              <TableCell>{item.taskTitle ?? '-'}</TableCell>

              {/* Credits */}
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                  <CardGiftcard sx={{ color: '#F59E0B', fontSize: 16 }} />
                  <Typography variant="body2" fontWeight="600">
                    {item.amount}
                  </Typography>
                </Box>
              </TableCell>

              {/* Date */}
              <TableCell align="right">
                {formatDate(item.createdAt)}
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};