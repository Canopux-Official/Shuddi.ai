// File: src/components/Profile/ProfileHeader.tsx
import React, { useState } from 'react';
import { Box } from '@mui/material';
import EditProfileModal from './EditModal';


const ProfileHeader: React.FC = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [name, setName] = useState('Eco Warrior');
  const [location, setLocation] = useState('Bhubaneswar');
  const [bio, setBio] = useState('Passionate about environmental conservation');

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
  };

  const handleSaveProfile = (data: { name: string; location: string; bio: string }) => {
    setName(data.name);
    setLocation(data.location);
    setBio(data.bio);
    // Optionally, persist changes to parent or API here
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: 3,
          p: { xs: 2, sm: 3 },
          mb: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                width: { xs: 56, sm: 64 },
                height: { xs: 56, sm: 64 },
                borderRadius: '50%',
                bgcolor: '#4caf50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: { xs: '20px', sm: '24px' },
                fontWeight: 700,
              }}
            >
              EW
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: '#9c27b0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                border: '2px solid white',
              }}
            >
              ⚡
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Box
                sx={{
                  fontSize: { xs: '18px', sm: '20px' },
                  fontWeight: 700,
                  color: '#1a1a1a',
                }}
              >
                {name}
              </Box>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  bgcolor: '#f0f0f0',
                  borderRadius: 1,
                  fontSize: '12px',
                  color: '#666',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  '&:hover': { bgcolor: '#e8e8e8' },
                }}
                onClick={handleEditClick}
              >
                ✏️ Edit Profile
              </Box>
            </Box>
            <Box sx={{ fontSize: '14px', color: '#666', mb: 1 }}>
              {bio}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                fontSize: '13px',
                color: '#888',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                📍 {location}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                📅 Active since January 1, 2024
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <EditProfileModal
        open={editModalOpen}
        onClose={handleCloseModal}
        currentName={name}
        currentLocation={location}
        currentBio={bio}
        onSave={handleSaveProfile}
      />
    </>
  );
};

export default ProfileHeader;