// src/components/ActionAlert.tsx
import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AlertItem from './AlertItem';

interface AlertItemData {
  text: string;
}

interface ActionAlertProps {
  title: string;
  items: AlertItemData[];
  buttonText?: string;
  onButtonClick?: () => void;
}

const ActionAlert: React.FC<ActionAlertProps> = ({
  title,
  items,
  buttonText = 'Fix & Resubmit',
  onButtonClick
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: '#fef3f2',
        border: '1px solid #fecdca',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 2
      }}
    >
      <Box sx={{ display: 'flex', gap: 1.5, flex: 1 }}>
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: '#c94a3f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px'
          }}
        >
          <ErrorOutlineIcon
            sx={{
              color: '#fff',
              fontSize: 16
            }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: '#333',
              marginBottom: '8px',
              fontSize: '15px'
            }}
          >
            Action needed{' '}
            <Typography
              component="span"
              variant="inherit"
              sx={{ fontWeight: 400 }}
            >
              {title}
            </Typography>
          </Typography>
          <Box sx={{ padding: 0, margin: 0 }}>
            {items.map((item, index) => (
              <AlertItem key={index} text={item.text} />
            ))}
          </Box>
        </Box>
      </Box>
      <Button
        variant="contained"
        onClick={onButtonClick}
        sx={{
          backgroundColor: '#f7a942',
          color: '#000',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '14px',
          padding: '8px 20px',
          borderRadius: '6px',
          boxShadow: 'none',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          '&:hover': {
            backgroundColor: '#e89a35',
            boxShadow: 'none'
          }
        }}
      >
        {buttonText}
      </Button>
    </Paper>
  );
};

export default ActionAlert;