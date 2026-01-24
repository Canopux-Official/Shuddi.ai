

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  CardGiftcard,
} from '@mui/icons-material';


export const CreditBalance: React.FC<{ balance: number }> = ({ balance }) => (
  <Card sx={{ mb: 3, bgcolor: '#FFF9E6', boxShadow: 1 }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          bgcolor: '#FFE5B4',
          p: 1.5,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CardGiftcard sx={{ color: '#F59E0B', fontSize: 32 }} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Your Credit Balance
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          {balance.toLocaleString()}
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 120 }}>
        Earn more by completing tasks
      </Typography>
    </CardContent>
  </Card>
);