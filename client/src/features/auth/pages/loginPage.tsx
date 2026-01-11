import React from 'react';
import { Box, ThemeProvider, CssBaseline, Typography } from '@mui/material';
import AirIcon from '@mui/icons-material/Air'; 
import { theme } from '../theme/theme';     
import LeftPanel from '../components/LeftPanel';
import { LoginForm } from '../components/LoginForm'; 

const LoginPage: React.FC = () => {

  const handleLogin = (data: unknown) => {
    console.log("Logging in...", data);
  };

  const handleGoogleAuth = () => {
    console.log("Google Auth Triggered");
  };

  const handleNavigateToSignup = () => {
    console.log("Redirect to /signup");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <Box sx={{ 
        display: 'flex', 
        height: '100vh', 
        width: '100vw', 
        bgcolor: 'background.default',
        overflow: 'hidden'
      }}>

        <Box sx={{ 
          width: '45%', 
          display: { xs: 'none', md: 'block' },
          height: '100%' 
        }}>
          <LeftPanel />
        </Box>

        <Box sx={{ 
          flex: 1, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative'
        }}>

          <Box sx={{ 
            display: { xs: 'flex', md: 'none' }, 
            p: 3, 
            alignItems: 'center', 
            gap: 1.5,
            position: 'absolute',
            top: 0, left: 0, width: '100%',
            zIndex: 10
          }}>
             <Box sx={{ bgcolor: '#134e4a', p: 0.8, borderRadius: 1.5, display: 'flex' }}>
              <AirIcon sx={{ color: 'white', fontSize: 20 }} />
             </Box>
             <Typography variant="h6" fontWeight="700" color="primary.main">shuddhi.ai</Typography>
          </Box>

          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, md: 6 }
          }}>
            <Box sx={{ width: '100%', maxWidth: 450 }}>
              <LoginForm 
                onLogin={handleLogin}
                onGoogleClick={handleGoogleAuth}
                onForgotPassword={() => alert("Redirect to Forgot Password Page")}
                onSignupClick={handleNavigateToSignup}
              />
            </Box>
          </Box>
          
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;