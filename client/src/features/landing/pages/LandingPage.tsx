import React from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 3 }}>
      <h1>Welcome to the App</h1>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Link to="/auth/login" style={{ textDecoration: 'none' }}>
          <button>Login</button>
        </Link>
        <Link to="/auth/signup" style={{ textDecoration: 'none' }}>
          <button>Signup</button>
        </Link>
      </Box>
    </Box>
  );
};

export default LandingPage;