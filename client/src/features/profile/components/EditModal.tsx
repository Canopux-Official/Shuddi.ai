// EditProfileModal.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  CameraAlt as CameraAltIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  currentName?: string;
  currentLocation?: string;
  currentBio?: string;
  onSave?: (data: { name: string; location: string; bio: string }) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onClose,
  currentName = 'Eco Warrior',
  currentLocation = 'Bhubaneswar',
  currentBio = 'Passionate about environmental conservation',
  onSave,
}) => {
  const [name, setName] = useState(currentName);
  const [location, setLocation] = useState(currentLocation);
  const [bio, setBio] = useState(currentBio);

  const handleSave = () => {
    if (onSave) {
      onSave({ name, location, bio });
    }
    onClose();
  };

  const handlePhotoUpload = () => {
    // Handle photo upload logic
    console.log('Upload photo clicked');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e0e0e0',
          pb: 2,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Edit Profile
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 4, pb: 3 }}>
        {/* Avatar Upload */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box sx={{ position: 'relative', mb: 1.5 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: '#4caf50',
                fontSize: '48px',
                fontWeight: 700,
              }}
            >
              EW
            </Avatar>
            <IconButton
              onClick={handlePhotoUpload}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: '#4caf50',
                color: 'white',
                width: 40,
                height: 40,
                boxShadow: 3,
                '&:hover': {
                  bgcolor: '#45a049',
                },
              }}
            >
              <CameraAltIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Click to upload a new photo
          </Typography>
        </Box>

        {/* Name Field */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            fontWeight={600}
            color="text.primary"
            sx={{ mb: 1 }}
          >
            Name
          </Typography>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#4caf50',
                  borderWidth: 2,
                },
                '&:hover fieldset': {
                  borderColor: '#45a049',
                  borderWidth: 2,
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4caf50',
                  borderWidth: 2,
                },
              },
            }}
          />
        </Box>

        {/* Location Field */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            fontWeight={600}
            color="text.primary"
            sx={{ mb: 1 }}
          >
            City / Location
          </Typography>
          <TextField
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your location"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Bio Field */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            fontWeight={600}
            color="text.primary"
            sx={{ mb: 1 }}
          >
            Short Bio (optional)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Info Box */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: '#f5f5f5',
            p: 2,
            mb: 3,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="body2"
            fontWeight={600}
            color="text.primary"
            sx={{ mb: 1 }}
          >
            Non-editable information:
          </Typography>
          <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
            Impact Score, Level, Badges, and Verified Tasks are based on your
            verified contributions and cannot be manually changed.
          </Typography>
        </Paper>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            fullWidth
            onClick={onClose}
            startIcon={<CloseIcon />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              borderWidth: 2,
              borderColor: '#4caf50',
              color: '#4caf50',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '16px',
              '&:hover': {
                borderWidth: 2,
                borderColor: '#45a049',
                bgcolor: '#f1f8f4',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSave}
            startIcon={<SaveIcon />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              bgcolor: '#4caf50',
              color: 'white',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '16px',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#45a049',
                boxShadow: 'none',
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;