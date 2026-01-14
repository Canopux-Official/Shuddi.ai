// src/components/HeroBanner.tsx
import React from 'react';
import { Paper, Box, Typography, Chip } from '@mui/material';

interface HeroBannerProps {
  userName?: string;
  verifiedImpacts?: number;
  impactPoints?: number;
  rank?: number;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  userName = 'Pratik',
  verifiedImpacts = 12,
  impactPoints = 420,
  rank = 56
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        minHeight: { xs: '200px', sm: '250px', md: '280px' },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background Image - Replace this URL with your actual banner image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://static.vecteezy.com/system/resources/thumbnails/049/150/623/small/green-valley-with-mountns-in-the-background-photo.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Gradient Overlay for better text readability */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: 'blur(2px)',
        }}
      />
      
      {/* Content */}
      <Box 
        sx={{ 
          position: 'relative', 
          zIndex: 2,
          p: { xs: 3, sm: 4, md: 5 },
          width: '100%',
        }}
      >
        <Typography 
          variant="h4" 
          component="h1"
          sx={{
            fontWeight: 700,
            color: 'white',
            mb: 2,
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          Welcome back, {userName}!
        </Typography>
        
        <Box 
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <Typography 
            variant="body1" 
            sx={{
              color: 'white',
              fontSize: { xs: '0.95rem', sm: '1rem' },
              textShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
          >
            You've made <strong style={{ fontWeight: 700 }}>{verifiedImpacts} verified impacts</strong> so far 🌱
          </Typography>
          
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
            <Chip 
              label={`Impact Points: ${impactPoints}`}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                height: { xs: '28px', sm: '32px' },
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.35)',
                },
              }} 
            />
            <Chip 
              label={`Rank: #${rank}`}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                height: { xs: '28px', sm: '32px' },
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.35)',
                },
              }} 
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default HeroBanner;