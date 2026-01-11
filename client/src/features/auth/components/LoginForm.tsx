import React from 'react';
import { 
  Box, Typography, TextField, Button, Divider, 
  Checkbox, FormControlLabel, Link, Stack, IconButton, InputAdornment 
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FadeSlide } from './FadeSlide';
import { loginSchema, type LoginFormData } from '../schemas/schemas';

interface LoginProps {
  onLogin: (data: LoginFormData) => void;
  onGoogleClick: () => void;
  onForgotPassword: () => void;
  onSignupClick: () => void;
}

export const LoginForm: React.FC<LoginProps> = ({ 
  onLogin, onGoogleClick, onForgotPassword, onSignupClick 
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
            placeholder="name@company.com" 
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

        <Divider sx={{ my: 3, color: 'text.secondary', fontSize: '0.875rem' }}>or sign in with</Divider>

        <Button
          fullWidth variant="outlined" startIcon={<GoogleIcon />} onClick={onGoogleClick}
          sx={{ height: 52, borderColor: '#e2e8f0', color: 'text.primary', bgcolor: 'white' }}
        >
          Google
        </Button>

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