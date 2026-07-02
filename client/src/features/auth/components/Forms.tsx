import React from 'react';
import {
  Box, Typography, TextField, Button, IconButton, Stack, InputAdornment, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FadeSlide } from './FadeSlide';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import {
  signupSchema, otpSchema, onboardingSchema,
  type SignupFormData, type OtpFormData, type OnboardingFormData
} from '../schemas/schemas';
import { CityAutocomplete } from './CityAutocomplete';

// --- TYPES ---
interface CommonProps {
  onNext: (data: unknown) => void;
  loading?: boolean;
}

// Interface specific for Signup to include Google handlers
interface SignupProps extends CommonProps {
  onGoogleSuccess: (credentialResponse: CredentialResponse) => void;
  onGoogleError: () => void;
}

// --- SIGNUP FORM ---
export const SignupForm: React.FC<SignupProps> = ({ onNext, onGoogleSuccess, onGoogleError }) => {
  const [showPass, setShowPass] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  return (
    <FadeSlide>
      <Box sx={{ maxWidth: 400, mx: 'auto' }}>
        <Box mb={4}>
          <Typography variant="h4" gutterBottom>Get Started</Typography>
          <Typography variant="body1" color="text.secondary">
            Create your account to start contributing.
          </Typography>
        </Box>

        <Stack component="form" onSubmit={handleSubmit(onNext)} spacing={2.5}>
          <TextField
            fullWidth label="Email"
            placeholder="name@company.com"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth label="Password" type={showPass ? "text" : "password"}
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth label="Confirm Password" type="password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <Button
            fullWidth type="submit" variant="contained" size="large"
            sx={{ height: 52, fontSize: '1rem' }}
          >
            Create Account
          </Button>
        </Stack>

        {/* Divider and Google Button */}
        <Box sx={{ my: 3 }}>
          <Divider sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>Or sign up with</Divider>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={onGoogleError}
            text="signup_with"
            width="400"
            theme="outline"
            size="large"
          />
        </Box>
      </Box>
    </FadeSlide>
  );
};

// --- OTP FORM ---
export const OtpForm: React.FC<CommonProps & { onBack: () => void, email: string }> = ({ onNext, onBack, email }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  return (
    <FadeSlide>
      <Box sx={{ maxWidth: 400, mx: 'auto' }}>
        <IconButton onClick={onBack} sx={{ mb: 2, ml: -1, color: 'text.secondary' }}><ArrowBackIcon /></IconButton>

        <Box mb={4}>
          <Typography variant="h4" gutterBottom>Check your email</Typography>
          <Typography variant="body1" color="text.secondary">
            We sent a 6-digit code to <strong style={{ color: '#0f172a' }}>{email}</strong>
          </Typography>
        </Box>

        <Stack component="form" onSubmit={handleSubmit(onNext)} spacing={3}>
          <TextField
            fullWidth
            placeholder="1 2 3 4 5 6"
            inputProps={{
              style: { textAlign: 'center', fontSize: 24, letterSpacing: 12 },
              maxLength: 6
            }}
            {...register("otp")}
            error={!!errors.otp}
            helperText={errors.otp?.message || "Enter the 6-digit code"}
          />

          <Button fullWidth type="submit" variant="contained" size="large" sx={{ height: 52 }}>
            Verify Email
          </Button>
        </Stack>

        <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
          Didn't receive it? <strong style={{ color: '#134e4a', cursor: 'pointer' }}>Resend</strong>
        </Typography>
      </Box>
    </FadeSlide>
  );
};

// --- ONBOARDING FORM ---
// Updated Interface to accept email
interface OnboardingFormProps extends CommonProps {
  initialData?: {
    name?: string;
    email?: string; // Added email here
  };
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ onNext, initialData }) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      username: initialData?.name || '',
      country: 'India',
      city: '',
    }
  });

  return (
    <FadeSlide>
      <Box sx={{ maxWidth: 400, mx: 'auto' }}>
        <Box mb={4}>
          <Typography variant="h4" gutterBottom>Welcome aboard!</Typography>
          <Typography variant="body1" color="text.secondary">
            Let's set up your profile for the dashboard.
          </Typography>
          {/* Display email if present so user knows which account is being set up */}
          {initialData?.email && (
            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'primary.main', fontWeight: 500 }}>
              Setting up as: {initialData.email}
            </Typography>
          )}
        </Box>

        <Stack component="form" onSubmit={handleSubmit(onNext)} spacing={2.5}>
          <TextField
            fullWidth label="Username"
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth label="Country"
              {...register("country")}
              error={!!errors.country}
              helperText={errors.country?.message}
            />
            <TextField
              fullWidth label="State"
              {...register("state")}
              error={!!errors.state}
              helperText={errors.state?.message}
            />
          </Stack>

          <CityAutocomplete control={control} errors={errors} />

          <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 2, height: 52 }}>
            Complete Setup
          </Button>
        </Stack>
      </Box>
    </FadeSlide>
  );
};