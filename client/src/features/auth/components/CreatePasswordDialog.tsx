import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import CloseIcon from '@mui/icons-material/Close';
import axios, { AxiosError } from 'axios';

interface CreatePasswordDialogProps {
  open: boolean;
  onClose: () => void; // Always callable — no password required to close
}

const CreatePasswordDialog: React.FC<CreatePasswordDialogProps> = ({ open, onClose }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordStrength = (pwd: string): { label: string; color: string } => {
    if (pwd.length === 0) return { label: '', color: 'transparent' };
    if (pwd.length < 6) return { label: 'Too short', color: '#ef4444' };
    if (pwd.length < 8) return { label: 'Weak', color: '#f97316' };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd))
      return { label: 'Strong', color: '#16a34a' };
    return { label: 'Good', color: '#eab308' };
  };

  const strength = passwordStrength(password);

  const handleSubmit = async () => {
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const token = window.localStorage.getItem('authToken');
    if (!token) {
      setError('Session expired. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_LINK}/api/auth/create-password`,
        { password },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(true);
      // Close automatically after brief success feedback
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to set password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state on close so dialog is fresh if re-opened
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(false);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: 'background.default', // cream background from theme
          boxShadow: '0 8px 32px rgba(19, 78, 74, 0.12)',
          p: 0.5,
        },
      }}
    >
      {/* Close button — always visible, reinforces non-blocking nature */}
      <IconButton
        onClick={handleClose}
        size="small"
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          color: 'text.secondary',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <DialogTitle sx={{ pb: 0.5, pt: 3, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Box
            sx={{
              bgcolor: '#134e4a',
              borderRadius: 1.5,
              p: 0.8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LockOutlinedIcon sx={{ color: 'white', fontSize: 18 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            Set a password
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 400 }}>
          You signed in with Google. Add a password so you can also log in with email.{' '}
          <Box component="span" sx={{ fontStyle: 'italic', color: 'text.disabled' }}>
            (Optional — you can do this later from settings)
          </Box>
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
        {success ? (
          <Alert
            severity="success"
            sx={{ borderRadius: 2, bgcolor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}
          >
            Password set successfully!
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && (
              <Alert
                severity="error"
                sx={{ borderRadius: 2, bgcolor: '#fef2f2', border: '1px solid #fecaca', py: 0.5 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            <Box>
              <TextField
                label="New password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((p) => !p)}
                        edge="end"
                        size="small"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        ) : (
                          <VisibilityOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              {/* Password strength bar */}
              {password.length > 0 && (
                <Box sx={{ mt: 0.75, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      flex: 1,
                      height: 3,
                      borderRadius: 2,
                      bgcolor: '#e5e7eb',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        borderRadius: 2,
                        bgcolor: strength.color,
                        width:
                          strength.label === 'Too short'
                            ? '25%'
                            : strength.label === 'Weak'
                            ? '50%'
                            : strength.label === 'Good'
                            ? '75%'
                            : '100%',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: strength.color, fontWeight: 600, minWidth: 52 }}>
                    {strength.label}
                  </Typography>
                </Box>
              )}
            </Box>

            <TextField
              label="Confirm password"
              type={showConfirm ? 'text' : 'password'}
              fullWidth
              size="small"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              error={confirmPassword.length > 0 && confirmPassword !== password}
              helperText={
                confirmPassword.length > 0 && confirmPassword !== password ? "Passwords don't match" : ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirm((p) => !p)}
                      edge="end"
                      size="small"
                      tabIndex={-1}
                    >
                      {showConfirm ? (
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      ) : (
                        <VisibilityOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ px: 3, pb: 3, pt: 1.5, gap: 1 }}>
          <Button
            onClick={handleClose}
            variant="text"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              borderRadius: 2,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            Skip for now
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !password || !confirmPassword}
            sx={{
              bgcolor: '#134e4a',
              color: 'white',
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              '&:hover': { bgcolor: '#0f3d39' },
              '&:disabled': { bgcolor: '#134e4a', opacity: 0.5, color: 'white' },
            }}
          >
            {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Set password'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CreatePasswordDialog;