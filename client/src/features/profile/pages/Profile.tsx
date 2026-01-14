// File: src/pages/ProfilePage.tsx
import React from 'react';
import {
  Box,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import StatsCard from '../components/StatusCard';
import Ranking from '../components/Ranking';
import BadgesEarned from '../components/BadgesEarned';
import ImpactOverview from '../components/ImpactOverview';
import RecentActivity from '../components/RecentActivity';
import HowVerificationWorks from '../components/VerificationWorks';
import Rewards from '../components/Rewards';
import FooterInfo from '../components/FooterInfo';
import ProfileHeader from '../components/ProfileHeader';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

const ProfilePage: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 2, sm: 4 } }}>
        <Container maxWidth="lg">
          <ProfileHeader />
         
          {/* Desktop Layout: Two Columns */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
              gap: 3,
            }}
          >
            {/* Left Column */}
            <Box>
              <StatsCard />
              <Ranking />
              <BadgesEarned />
              <ImpactOverview />
              <RecentActivity />
            </Box>
            {/* Right Column */}
            <Box>
              <Rewards />
              <HowVerificationWorks />
              <FooterInfo />
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ProfilePage;