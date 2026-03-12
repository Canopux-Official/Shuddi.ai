import React, { useState, useEffect } from 'react';
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
import { DonationDialog } from '../components/DonationDialog';
import { useDonationPayment } from '../hook/useDonationPayment';
import type { Foundation } from '../types/types';
import { Backdrop, CircularProgress } from '@mui/material';
import { getCampaigns } from '../../../apis/campaign/campaign.api';
import { mapCampaignToFoundation } from '../utils/campaignAdapter';
import { getBalance } from "../../../apis/reward/reward.api"



const RewardsPage: React.FC = () => {
  const [donationTab, setDonationTab] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { donationState, startDonation } = useDonationPayment();

  const [donationDialogOpen, setDonationDialogOpen] = useState(false);
  const [selectedFoundation, setSelectedFoundation] = useState<Foundation | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(0);

  const [campaigns, setCampaigns] = useState<Foundation[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [campaignError, setCampaignError] = useState<string | null>(null);

  const [balance, setBalance] = useState<number>(0);

  const fetchCampaigns = async () => {
    try {
      setLoadingCampaigns(true);
      const data = await getCampaigns();
      setCampaigns(data.map(mapCampaignToFoundation));
    } catch (err) {
      console.error(err);
      setCampaignError('Failed to load campaigns');
    } finally {
      setLoadingCampaigns(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);
  
  useEffect(() => {
    const fetchBalance = async() => {
      try{
        const res = await getBalance()
        setBalance(res.rewardPoints)
      }catch(err){
        console.error("Failed to fetch balance", err)
      }
    }
    fetchBalance()
    
  }, [])
  

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

  const handleDonateClick = (foundation: Foundation) => {
    setSelectedFoundation(foundation);
    setDonationAmount(0);
    setDonationDialogOpen(true);
  };

  const handleCloseDonationDialog = () => {
    if (donationState !== 'IDLE') return;
    setDonationDialogOpen(false);
    setSelectedFoundation(null);
    setDonationAmount(0);
  };

  const handleConfirmDonation = () => {
    if (!selectedFoundation) return;

    setDonationDialogOpen(false);

    startDonation(
      selectedFoundation,
      donationAmount,
      () => {
        // later: refetchCampaigns()
        alert('Thank you! Your donation was successful ❤️');
        fetchCampaigns();
      },
      () => {
        console.log('Donation failed');
      }
    );
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
      <CreditBalance balance={balance} />

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
      {/* Donate Section */}
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Favorite sx={{ color: '#EF4444' }} />
        <Typography variant="h5" fontWeight="600">
          Donate to Causes
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Support verified causes through secure donations.
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
        {loadingCampaigns && (
          <Typography color="text.secondary">
            Loading campaigns...
          </Typography>
        )}

        {campaignError && (
          <Typography color="error">
            {campaignError}
          </Typography>
        )}

        {!loadingCampaigns && !campaignError && campaigns.length === 0 && (
          <Typography color="text.secondary">
            No active campaigns available.
          </Typography>
        )}

        {campaigns.map((foundation) => (
          <FoundationCard
            key={foundation.id}
            foundation={foundation}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onDonateClick={handleDonateClick}
          />
        ))}

      </Box>
    </Box>

    <DonationDialog
      open={donationDialogOpen}
      foundationName={selectedFoundation?.name ?? ''}
      amount={donationAmount}
      loading={donationState !== 'IDLE'}
      onAmountChange={setDonationAmount}
      onCancel={handleCloseDonationDialog}
      onConfirm={handleConfirmDonation}
    />

    {donationState !== 'IDLE' && (
      <Backdrop open sx={{ zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    )}



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