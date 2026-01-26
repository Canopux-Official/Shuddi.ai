import React, { useState } from 'react';
import { Box, ThemeProvider, CssBaseline, Typography } from '@mui/material';
import AirIcon from '@mui/icons-material/Air';
import { theme } from '../theme/theme';
import LeftPanel from '../components/LeftPanel';
import { OnboardingForm } from '../components/Forms'; // Ensure OnboardingForm is exported from here
import { LoginForm } from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import { 
  loginUser, 
  googleAuth, 
  onboardUser,
  type LoginPayload,
  type OnboardingPayload 
} from '../../../apis/auth/auth';
import { type CredentialResponse } from '@react-oauth/google';

type Step = 'LOGIN' | 'ONBOARDING';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State to manage views locally like SignupPage
  const [currentStep, setCurrentStep] = useState<Step>('LOGIN');
  const [formData, setFormData] = useState<{ email: string }>({ email: '' });

  // Handle Standard Login
  const handleLogin = async (data: unknown) => {
    const loginData = data as LoginPayload;
    
    const response = await loginUser(loginData);

    if (response.success && response.data) {
      if (response.data.isOnboarded) {
        navigate('/dashboard');
      } else {
        // STAY on page, switch to onboarding, set email
        setFormData({ email: response.data.user.email });
        setCurrentStep('ONBOARDING');
      }
    } else {
      alert(response.message || "Login failed"); 
    }
  };

  // Handle Google Login
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        const response = await googleAuth({ idToken: credentialResponse.credential });
        
        if (response.success && response.data) {
          if (response.data.isOnboarded) {
            navigate('/dashboard');
          } else {
            // STAY on page, switch to onboarding, set email
            setFormData({ email: response.data.user.email });
            setCurrentStep('ONBOARDING');
          }
        } else {
          alert(response.message || "Google Authentication Failed");
        }
      } catch (error) {
        console.error("Google Auth Error:", error);
        alert("Something went wrong with Google Login");
      }
    }
  };

  // Handle Onboarding Submission
  const handleOnboardingSubmit = async (data: unknown) => {
      const onboardData = data as OnboardingPayload;
      const response = await onboardUser(onboardData);
      
      if (response.success) {
          navigate('/dashboard');
      } else {
          alert(response.message || "Onboarding failed");
      }
  };

  const handleNavigateToSignup = () => {
    navigate('/signup');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw', bgcolor: 'background.default', overflow: 'hidden' }}>
        
        {/* Left Panel */}
        <Box sx={{ width: '45%', display: { xs: 'none', md: 'block' }, height: '100%' }}>
          <LeftPanel />
        </Box>

        {/* Right Panel */}
        <Box sx={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          
          {/* Mobile Header */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, p: 3, alignItems: 'center', gap: 1.5, position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 10 }}>
             <Box sx={{ bgcolor: '#134e4a', p: 0.8, borderRadius: 1.5, display: 'flex' }}>
              <AirIcon sx={{ color: 'white', fontSize: 20 }} />
             </Box>
             <Typography variant="h6" fontWeight="700" color="primary.main">shuddhi.ai</Typography>
          </Box>

          {/* Form Container */}
          <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 3, md: 6 } }}>
            <Box sx={{ width: '100%', maxWidth: 450 }}>
              
              {currentStep === 'LOGIN' && (
                <LoginForm 
                  onLogin={handleLogin}
                  onGoogleSuccess={handleGoogleSuccess}
                  onForgotPassword={() => alert("Redirect to Forgot Password")}
                  onSignupClick={handleNavigateToSignup} 
                  onGoogleError={() => console.error("Google Login Failed")}              
                />
              )}

              {currentStep === 'ONBOARDING' && (
                <OnboardingForm 
                  onNext={handleOnboardingSubmit}
                  // Pass the email captured during the login attempt
                  initialData={{ email: formData.email }} 
                />
              )}

            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;