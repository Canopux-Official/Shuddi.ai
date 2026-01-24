
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import {
  CardGiftcard,
  Favorite,
} from '@mui/icons-material';
import RewardCard from '../components/RewardCard';
import { CreditBalance } from '../components/CreditBalance';
import { FoundationCard } from '../components/FoundationCard';
import GrassIcon from '@mui/icons-material/Grass';
import { DonationHistoryTable } from '../components/DonationHistory';
import { rewardItems, foundations, donationCategories, donationHistory } from '../demo/demoData';

const RewardsPage: React.FC = () => {
  const [donationTab, setDonationTab] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Rewards
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Redeem credits for rewards or donate to verified causes
        </Typography>
      </Box>

      {/* Credit Balance */}
      <CreditBalance balance={1250} />

      {/* Redeem Credits Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CardGiftcard sx={{ color: '#3B82F6' }} />
          <Typography variant="h5" fontWeight="600">
            Redeem Credits
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 2,
          }}
        >
          {rewardItems.map((reward) => (
            <RewardCard key={reward.id} reward={reward} />
          ))}
        </Box>
      </Box>

      {/* Donate Credits Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Favorite sx={{ color: '#EF4444' }} />
          <Typography variant="h5" fontWeight="600">
            Donate Your Credits
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Support verified causes using your earned credits.
        </Typography>

        {/* Tabs */}
        <Tabs
          value={donationTab}
          onChange={(_, newValue) => setDonationTab(newValue)}
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          {donationCategories.map((category) => (
            <Tab
              key={category.id}
              label={category.name}
              sx={{ textTransform: 'none' }}
            />
          ))}
        </Tabs>

        {/* Foundations Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 2,
          }}
        >
          {foundations.map((foundation) => (
            <FoundationCard 
              key={foundation.id} 
              foundation={foundation}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </Box>
      </Box>

      {/* Donation History Section */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <GrassIcon sx={{ color: '#10B981' }} />
          <Typography variant="h5" fontWeight="600">
            Donation History
          </Typography>
        </Box>
        <DonationHistoryTable history={donationHistory} />
      </Box>
    </Container>
  );
};

export default RewardsPage;