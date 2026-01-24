
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
import type { DonationHistory } from '../types/types';

export const DonationHistoryTable: React.FC<{ history: DonationHistory[] }> = ({ history }) => {
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

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Recipient</TableCell>
            <TableCell align="right">Credits</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((item) => (
            <TableRow key={item.id}>
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
              <TableCell>{item.recipient}</TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                  <CardGiftcard sx={{ color: '#F59E0B', fontSize: 16 }} />
                  <Typography variant="body2" fontWeight="600">
                    {item.credits}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right">{item.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};