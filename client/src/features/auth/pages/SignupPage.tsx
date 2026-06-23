/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Box, ThemeProvider, CssBaseline, Typography } from '@mui/material';
import AirIcon from '@mui/icons-material/Air';
import { theme } from '../theme/theme';
import LeftPanel from '../components/LeftPanel';
import { SignupForm, OtpForm, OnboardingForm } from '../components/Forms';
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
import CreatePasswordDialog from '../components/CreatePasswordDialog';

type Step = 'SIGNUP' | 'OTP' | 'ONBOARDING';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>('SIGNUP');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const [formData, setFormData] = useState<{ email: string; password?: string }>({ email: '' });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('step') === 'onboarding') {
      // Logic to check token could go here
    }
  }, [location]);

  const handleSignupSubmit = async (data: unknown) => {
    const payload = data as RegisterPayload;
    setFormData({ email: payload.email, password: payload.password });

    const response = await registerUser(payload);

    if (response.success) {
      setCurrentStep('OTP');
    } else {
      alert(response.message || "Signup failed");
    }
  };

  const handleOtpSubmit = async (otp: string) => {
    if (!formData.email) return;

    const response = await verifyOtp({ email: formData.email, otp });

    if (response.success && response.data) {
      if (response.data.isOnboarded) {
        navigate('/dashboard');
      } else {
        setCurrentStep('ONBOARDING');
      }
    } else {
      alert(response.message || "OTP Verification failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const response = await googleAuth({ idToken: credentialResponse.credential });

      if (response.success && response.data) {
        setFormData({ email: response.data.user.email });

        // Show password creation dialog if they don't have one yet
        if (!response.data.hasPassword) {
          setShowPasswordDialog(true);
        }

        if (response.data.isOnboarded) {
          navigate('/dashboard');
        } else {
          setCurrentStep('ONBOARDING');
        }
      } else {
        alert(response.message || "Google auth failed");
      }
    }
  };

  const handleOnboardingSubmit = async (data: unknown) => {
    const payload = data as OnboardingPayload;
    const response = await onboardUser(payload);

    if (response.success) {
      navigate('/dashboard');
    } else {
      alert(response.message || "Onboarding failed");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>

        <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' } }}>
          <LeftPanel />
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', bgcolor: 'background.default' }}>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
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
                  onGoogleSuccess={handleGoogleSuccess}
                  onGoogleError={() => console.error("Google Signup Failed")}
                />
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
                  initialData={{ email: formData.email }}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <CreatePasswordDialog
        open={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
      />
    </ThemeProvider>
  );
};

export default SignupPage;