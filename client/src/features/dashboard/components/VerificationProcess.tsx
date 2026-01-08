import React, { useState } from 'react';
import { Paper, Box, Typography, IconButton, Collapse } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const VerificationProcess: React.FC = () => {
  const [open, setOpen] = useState(false); // State to handle opening and closing

  const steps = [
    { icon: '🤖', label: 'AI Analysis' },
    { icon: '✓', label: 'NGO Review' },
    { icon: '📊', label: 'Impact Recorded' },
  ];

  const handleToggle = () => {
    setOpen(!open); // Toggle the state on button click
  };

  return (
    <Paper sx={{ p: 1, mt: 0 }}>
      <Box display="flex" alignItems="center" gap={1}> {/* Align items horizontally with gap */}
        <Typography variant="h6" gutterBottom fontWeight={600}>
          How Verification Works
        </Typography>
        {/* Info icon to toggle the process flow visibility */}
        <IconButton onClick={handleToggle} size="small" sx={{ p: 0 }}> {/* Removed padding from icon */}
          <InfoIcon />
        </IconButton>
      </Box>
      
      {/* Collapse section for the verification steps */}
      <Collapse in={open}>
        <Box display="flex" justifyContent="space-around" alignItems="center" mt={3} flexWrap="wrap" gap={2}>
          {steps.map((step, index) => (
            <React.Fragment key={step.label}>
              <Box textAlign="center">
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: index === 1 ? 'secondary.main' : 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    mb: 1,
                    mx: 'auto',
                  }}
                >
                  {step.icon}
                </Box>
                <Typography variant="body2" fontWeight={600}>{step.label}</Typography>
              </Box>
              {index < steps.length - 1 && (
                <Box sx={{ width: { xs: 0, sm: 80 }, height: 2, bgcolor: '#e0e0e0', display: { xs: 'none', sm: 'block' } }} />
              )}
            </React.Fragment>
          ))}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default VerificationProcess;
