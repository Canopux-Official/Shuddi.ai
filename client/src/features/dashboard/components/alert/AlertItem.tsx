// src/components/AlertItem.tsx
import React from 'react';
import { ListItem, ListItemText, Box } from '@mui/material';

interface AlertItemProps {
  text: string;
}

const AlertItem: React.FC<AlertItemProps> = ({ text }) => {
  return (
    <ListItem sx={{ padding: '2px 0', alignItems: 'flex-start' }}>
      <Box
        component="span"
        sx={{
          color: '#c94a3f',
          marginRight: '8px',
          fontSize: '14px',
          lineHeight: '20px',
          flexShrink: 0
        }}
      >
        •
      </Box>
      <ListItemText
        primary={text}
        primaryTypographyProps={{
          sx: {
            color: '#666',
            fontSize: '14px',
            lineHeight: '20px'
          }
        }}
      />
    </ListItem>
  );
};

export default AlertItem;