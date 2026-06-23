import React, { useState, useRef } from 'react';
import { Box, ThemeProvider, CssBaseline, Typography } from '@mui/material';
import AirIcon from '@mui/icons-material/Air';
import { theme } from '../theme/theme';
import LeftPanel from '../components/LeftPanel';
import { OnboardingForm } from '../components/Forms';
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
import CreatePasswordDialog from '../components/CreatePasswordDialog';

type Step = 'LOGIN' | 'ONBOARDING';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<Step>('LOGIN');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const pendingNavigation = useRef<string | null>(null);
  const [formData, setFormData] = useState<{ email: string }>({ email: '' });

  const handleLogin = async (data: unknown) => {
    const loginData = data as LoginPayload;

    const response = await loginUser(loginData);

    if (response.success && response.data) {
      const { user } = response.data;


      if (user.role === "SUPER_ADMIN") {
        navigate('/admin-dashboard');
        return;
      }
      if (response.data.isOnboarded) {
        navigate('/dashboard');
      } else {
        setFormData({ email: response.data.user.email });
        setCurrentStep('ONBOARDING');
      }
    } else {
      alert(response.message || "Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const response = await googleAuth({ idToken: credentialResponse.credential });

      if (response.success && response.data) {
        setFormData({ email: response.data.user.email });

        // Determine where to go next
        const destination = response.data.isOnboarded ? '/dashboard' : null;

        if (!response.data.hasPassword) {
          // Store destination, show dialog first — navigation happens on dialog close
          pendingNavigation.current = destination;
          setShowPasswordDialog(true);
          if (!destination) setCurrentStep('ONBOARDING'); // still update step if going to onboarding
        } else {
          // No dialog needed, navigate immediately
          if (destination) {
            navigate(destination);
          } else {
            setCurrentStep('ONBOARDING');
          }
        }
      } else {
        alert(response.message || "Google auth failed");
      }
    }
  };
  const handleNavigateToSignup = () => {
    navigate('/auth/signup');
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
                  initialData={{ email: formData.email }}
                />
              )}

            </Box>
          </Box>
        </Box>
      </Box>
      <CreatePasswordDialog
        open={showPasswordDialog}
        onClose={() => {
          setShowPasswordDialog(false);
          if (pendingNavigation.current) {
            navigate(pendingNavigation.current);
            pendingNavigation.current = null;
          }
          // If no pending navigation, the step is already set to ONBOARDING above
        }}
      />
    </ThemeProvider>
  );
};

export default LoginPage;