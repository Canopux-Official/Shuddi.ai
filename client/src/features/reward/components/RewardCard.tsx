
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CardGiftcard,
  ShoppingBag,
  LocalCafe,
  WorkspacePremium,
} from '@mui/icons-material';
import GrassIcon from '@mui/icons-material/Grass';
import type { Reward } from '../../../utils/reward.type';
import { redeemReward } from '../../../apis/reward/reward.api';

const RewardCard: React.FC<{ reward: Reward, onRedeemSuccess: () => void; userBalance: number }> = ({ reward, onRedeemSuccess, userBalance }) => {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'bag':
        return <ShoppingBag sx={{ fontSize: 40, color: '#10B981' }} />;
      case 'tree':
        return <GrassIcon sx={{ fontSize: 40, color: '#10B981' }} />;
      case 'cafe':
        return <LocalCafe sx={{ fontSize: 40, color: '#10B981' }} />;
      case 'workshop':
        return <WorkspacePremium sx={{ fontSize: 40, color: '#10B981' }} />;
      default:
        return <CardGiftcard sx={{ fontSize: 40, color: '#10B981' }} />;
    }
  };

  const [open, setOpen] = React.useState(false);
  const [selectedReward, setSelectedReward] = React.useState<Reward | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleRedeem = () => {
    setSelectedReward(reward);
    setOpen(true);
  };



  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;
    try {
      setError(null);
      if (reward.credits > userBalance) {
        setError("You don’t have enough credits");
        return;
      }
      await redeemReward(selectedReward.id, selectedReward.credits);
      alert(`Successfully redeemed ${selectedReward.name} for ${selectedReward.credits} credits!`);
      setOpen(false);
      setSelectedReward(null);
      onRedeemSuccess();
    } catch (err: any) {
      console.error("Redeem failed", err);

      // Extract backend message safely
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      setError(message);
    }
  };


  const handleClose = () => {
    setOpen(false);
    setSelectedReward(null);
  };

  //after handleConfirmRedeem succeeds we should refresh the page, the getUserCredits in the parent page in is useEffect so it will fetch the balance


  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 1 }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2 }}>{getIcon(reward.icon)}</Box>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          {reward.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
          {reward.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CardGiftcard sx={{ color: '#F59E0B', fontSize: 20 }} />
            <Typography variant="h6" color="#F59E0B" fontWeight="600">
              {reward.credits}
            </Typography>
          </Box>
          <Button variant="outlined" size="small" sx={{ textTransform: 'none' }} onClick={handleRedeem} >
            Redeem
          </Button>
        </Box>
      </CardContent>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Redemption</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to redeem{" "}
            <strong>{selectedReward?.name}</strong> for{" "}
            <strong>{selectedReward?.credits} credits</strong>?
          </Typography>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmRedeem} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default RewardCard;