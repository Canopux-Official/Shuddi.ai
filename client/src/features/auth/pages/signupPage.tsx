/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Box, ThemeProvider, CssBaseline, Typography } from '@mui/material';
import AirIcon from '@mui/icons-material/Air'; 
import { theme } from '../theme/theme';
import LeftPanel from '../components/LeftPanel';
import { SignupForm, OtpForm, OnboardingForm } from '../components/Forms'; // Your updated forms
import { useNavigate, useLocation } from 'react-router-dom';
import { type CredentialResponse } from '@react-oauth/google';
import { 
  registerUser, 
  verifyOtp, 
  onboardUser, 
  googleAuth,
 type RegisterPayload, 
  type OnboardingPayload 
} from '../../../apis/auth/auth';

type Step = 'SIGNUP' | 'OTP' | 'ONBOARDING';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>('SIGNUP');
  
  // State to hold data between steps
  const [formData, setFormData] = useState<{ email: string; password?: string }>({ email: '' });

  // --- BUG FIX 1: Retrieve Email from Navigation State ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    if (params.get('step') === 'onboarding') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentStep('ONBOARDING');

      // Check if email was passed from LoginPage (via Google Auth redirect)
      if (location.state && (location.state as any).email) {
        console.log("Hydrating Onboarding with email:", (location.state as any).email);
        setFormData(prev => ({ ...prev, email: (location.state as any).email }));
      }
    }
  }, [location]);

  // Handle Google Auth (If user starts directly on Signup Page)
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        const response = await googleAuth({ idToken: credentialResponse.credential });
        
        if (response.success && response.data) {
            if (!response.data.isOnboarded) {
                // Set email so Onboarding Form isn't blank
                setFormData({ email: response.data.user.email });
                setCurrentStep('ONBOARDING');
            } else {
                navigate('/dashboard');
            }
        } else {
            alert(response.message || "Google Signup Failed");
        }
      } catch (error) {
        console.error(error);
        alert("Google Signup Error");
      }
    }
  };

  const handleSignupSubmit = async (data: unknown) => {
    const signupData = data as RegisterPayload;
    const response = await registerUser({
      email: signupData.email,
      password: signupData.password,
      pass: ''
    });

    if (response.success) {
        setFormData({ email: signupData.email, password: signupData.password });
        setCurrentStep('OTP');
    } else {
        alert(response.message || "Signup failed");
    }
  };

  const handleOtpSubmit = async (otp: string) => {
      const response = await verifyOtp({ email: formData.email, otp: otp });
      if (response.success) {
          setCurrentStep('ONBOARDING');
      } else {
          alert(response.message || "Invalid OTP");
      }
  };

  const handleOnboardingSubmit = async (data: unknown) => {
      const onboardData = data as OnboardingPayload;
      const response = await onboardUser(onboardData);
      
      if (response.success) {
          navigate('/dashboard');
      } else {
          alert(response.message || "Onboarding failed");
      }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw', bgcolor: 'background.default', overflow: 'hidden' }}>
        <Box sx={{ width: '45%', display: { xs: 'none', md: 'block' }, height: '100%' }}>
          <LeftPanel />
        </Box>

        <Box sx={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          
          <Box sx={{ display: { xs: 'flex', md: 'none' }, p: 3, alignItems: 'center', gap: 1.5, position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 10 }}>
             <Box sx={{ bgcolor: '#134e4a', p: 0.8, borderRadius: 1.5, display: 'flex' }}>
              <AirIcon sx={{ color: 'white', fontSize: 20 }} />
             </Box>
             <Typography variant="h6" fontWeight="700" color="primary.main">shuddhi.ai</Typography>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 3, md: 6 } }}>
            <Box sx={{ width: '100%', maxWidth: 450 }}>
              
              {currentStep === 'SIGNUP' && (
                <SignupForm 
                  onNext={handleSignupSubmit}
                  onGoogleSuccess={handleGoogleSuccess} // Assuming you updated SignupForm to accept this
                  onGoogleError={function (): void {
                    throw new Error('Function not implemented.');
                  } }                />
              )}

              {currentStep === 'OTP' && (
                <OtpForm 
                    email={formData.email} 
                    onNext={(data: any) => handleOtpSubmit(data.otp)} 
                    onBack={() => setCurrentStep('SIGNUP')} 
                />
              )}

              {currentStep === 'ONBOARDING' && (
                <OnboardingForm 
                    onNext={handleOnboardingSubmit} 
                    // CRITICAL: initialData now contains the email from location.state
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

export default SignupPage;