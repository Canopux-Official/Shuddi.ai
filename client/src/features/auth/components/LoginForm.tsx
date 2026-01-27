import React from 'react';
import { 
  Box, Typography, TextField, Button, 
  Checkbox, FormControlLabel, Link, Stack, IconButton, InputAdornment, Divider 
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FadeSlide } from './FadeSlide';
import { loginSchema, type LoginFormData } from '../schemas/schemas';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

interface LoginProps {
  onLogin: (data: LoginFormData) => void;
  // New props for Google Auth
  onGoogleSuccess: (credentialResponse: CredentialResponse) => void;
  onGoogleError: () => void;
  onForgotPassword: () => void;
  onSignupClick: () => void;
}

export const LoginForm: React.FC<LoginProps> = ({ 
  onLogin, 
  onGoogleSuccess, 
  onGoogleError, 
  onForgotPassword, 
  onSignupClick 
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <FadeSlide>
      <Box sx={{ maxWidth: 400, mx: 'auto' }}>
        <Box mb={4}>
          <Typography variant="h4" gutterBottom>Welcome back</Typography>
          <Typography variant="body1" color="text.secondary">
            Please enter your details to access the dashboard.
          </Typography>
        </Box>

        <Stack component="form" onSubmit={handleSubmit(onLogin)} spacing={3}>
          <TextField 
            fullWidth label="Email Address" 
            placeholder="name@abc.com" 
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          
          <Box>
            <TextField 
              fullWidth label="Password" 
              type={showPassword ? 'text' : 'password'}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5 }}>
              <FormControlLabel 
                control={<Checkbox size="small" color="primary" />} 
                label={<Typography variant="body2" color="text.secondary">Remember me</Typography>} 
              />
              <Link 
                component="button" variant="body2" onClick={onForgotPassword}
                underline="hover" sx={{ color: 'primary.main', fontWeight: 600 }}
              >
                Forgot Password?
              </Link>
            </Stack>
          </Box>

          <Button fullWidth type="submit" variant="contained" size="large" sx={{ height: 52, fontSize: '1rem' }}>
            Sign In
          </Button>
        </Stack>

        {/* Standard UI Pattern: Divider + Google Button */}
        <Box sx={{ my: 3 }}>
          <Divider sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>Or continue with</Divider>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={onGoogleError}
            theme="outline"
            size="large"
            width="400" // Matches the max-width of the box
            text="signin_with"
            shape="rectangular"
          />
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
          Don't have an account?{' '}
          <Link 
            component="button" onClick={onSignupClick}
            underline="none" sx={{ color: '#134e4a', fontWeight: 700, cursor: 'pointer' }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </FadeSlide>
  );
};