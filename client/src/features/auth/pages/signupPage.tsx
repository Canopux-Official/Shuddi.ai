import React, { useState } from 'react';
import { Box, ThemeProvider, CssBaseline,  Typography } from '@mui/material';
import AirIcon from '@mui/icons-material/Air'; 
import { theme } from '../theme/theme';
import LeftPanel from '../components/LeftPanel';
import { SignupForm, OtpForm, OnboardingForm } from '../components/Forms';

type Step = 'SIGNUP' | 'OTP' | 'ONBOARDING';

const SignupPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('SIGNUP');
  const [formData, setFormData] = useState<{ email: string; name?: string }>({ email: '' });

  const handleSignupSubmit = (data: unknown) => {
    const signupData = data as { email: string };
    setFormData({ ...formData, email: signupData.email });
    setCurrentStep('OTP');
  };

  const handleGoogleAuth = () => {
    setFormData({ email: 'user@gmail.com', name: 'Google User' });
    setCurrentStep('ONBOARDING');
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
            top: 0,
            left: 0,
            width: '100%',
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
              {currentStep === 'SIGNUP' && (
                <SignupForm onNext={handleSignupSubmit} onGoogleClick={handleGoogleAuth} />
              )}

              {currentStep === 'OTP' && (
                <OtpForm email={formData.email} onNext={() => setCurrentStep('ONBOARDING')} onBack={() => setCurrentStep('SIGNUP')} />
              )}

              {currentStep === 'ONBOARDING' && (
                <OnboardingForm onNext={() => {}} initialData={formData} />
              )}
            </Box>
          </Box>
          
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SignupPage;