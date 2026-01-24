// src/controllers/reward.controller.ts

import { Request, Response } from 'express';
import { RewardService } from '../services/reward.service';
import { DonationService } from '../services/donation.service';
import { DonationStatus, TransactionType } from '@prisma/client';


export class RewardController {
  private rewardService: RewardService;
  private donationService: DonationService;

  constructor(rewardService: RewardService, donationService: DonationService) {
    this.rewardService = rewardService;
    this.donationService = donationService;
  }

  // ==========================================
  // REWARD ENDPOINTS
  // ==========================================

  // GET /api/rewards/balance
  getBalance = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const balance = await this.rewardService.getUserBalance(userId);

      res.json({
        success: true,
        data: { balance }
      });

    } catch (error) {
      console.error('Error getting balance:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch balance'
      });
    }
  };

  // GET /api/rewards/history
  getHistory = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const type = req.query.type as TransactionType | undefined;

      const history = await this.rewardService.getUserRewardHistory(userId, {
        page,
        limit,
        transactionType: type
      });

      res.json({
        success: true,
        data: history.data,
        meta: history.meta
      });

    } catch (error) {
      console.error('Error getting history:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch history'
      });
    }
  };

  // GET /api/rewards/stats
  getStats = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const stats = await this.rewardService.getUserRewardStats(userId);

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error getting stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch statistics'
      });
    }
  };

  // ==========================================
  // DONATION ENDPOINTS
  // ==========================================
  // POST /api/rewards/donate/money
  // User donates real money via Razorpay
  // Body: { ngoId, amount, campaignId?, donorName?, donorEmail?, message?, isAnonymous? }
  createMonetaryDonation = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { ngoId, amount, campaignId, donorName, donorEmail, message, isAnonymous } = req.body;

      if (!ngoId || !amount) {
        return res.status(400).json({
          success: false,
          error: 'ngoId and amount are required'
        });
      }

      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Amount must be positive'
        });
      }

      // Create Razorpay order
      const result = await this.donationService.createDonationOrder({
        userId,
        ngoId,
        amount,
        campaignId,
        donorName,
        donorEmail,
        message,
        isAnonymous
      });

      res.status(201).json({
        success: true,
        data: {
          donationId: result.donation.id,
          razorpay: result.razorpayOrder
        },
        message: 'Donation order created. Proceed with payment.'
      });

    } catch (error) {
      console.error('Error creating donation:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create donation'
      });
    }
  };

  // POST /api/rewards/donate/verify
  // Verify Razorpay payment after user completes payment
  // Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
  verifyDonationPayment = async (req: Request, res: Response) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
          success: false,
          error: 'Payment details are required'
        });
      }

      const donation = await this.donationService.verifyAndCompletePayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      res.json({
        success: true,
        data: {
          ...donation,
          amount: donation.amount.toNumber()
        },
        message: 'Payment verified successfully! Thank you for your donation.'
      });

    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Payment verification failed'
      });
    }
  };

  // POST /api/rewards/donate/failed
  // Handle payment failure
  // Body: { razorpay_order_id, error_code?, error_description? }
  handleDonationFailure = async (req: Request, res: Response) => {
    try {
      const { razorpay_order_id, error_code, error_description } = req.body;

      if (!razorpay_order_id) {
        return res.status(400).json({
          success: false,
          error: 'Order ID is required'
        });
      }

      await this.donationService.handlePaymentFailure(
        razorpay_order_id,
        error_code,
        error_description
      );

      res.json({
        success: true,
        message: 'Payment failure recorded'
      });

    } catch (error) {
      console.error('Error handling payment failure:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to record payment failure'
      });
    }
  };

  // GET /api/rewards/donations
  // Get user's donation history
  getUserDonations = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as DonationStatus | undefined;

      const result = await this.donationService.getUserDonations(userId, {
        page,
        limit,
        status
      });

      res.json({
        success: true,
        data: result.data,
        meta: result.meta
      });

    } catch (error) {
      console.error('Error getting donations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch donations'
      });
    }
  };

  // ==========================================
  // ADMIN ENDPOINTS
  // ==========================================

  // POST /api/rewards/admin/adjust
  createAdjustment = async (req: Request, res: Response) => {
    try {
      const adminId = req.user?.id;
      
      if (req.user?.role != 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { userId, amount, reason } = req.body;

      if (!userId || amount === undefined || !reason) {
        return res.status(400).json({
          success: false,
          error: 'userId, amount, and reason are required'
        });
      }

      const entry = await this.rewardService.createAdjustment(
        userId,
        amount,
        reason,
        adminId!
      );

      res.status(201).json({
        success: true,
        data: {
          ...entry,
          amount: entry.amount.toNumber(),
          balanceAfter: entry.balanceAfter.toNumber()
        },
        message: 'Adjustment created successfully'
      });

    } catch (error) {
      console.error('Error creating adjustment:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create adjustment'
      });
    }
  };

  // GET /api/rewards/admin/balance/:userId
  getAdminBalance = async (req: Request, res: Response) => {
    try {
      if (req.user?.role != 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId is required'
        });
      }

      const balance = await this.rewardService.getUserBalance(userId);

      res.json({
        success: true,
        data: { userId, balance }
      });

    } catch (error) {
      console.error('Error getting admin balance:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch balance'
      });
    }
  };

  // POST /api/rewards/admin/config
  createRewardConfig = async (req: Request, res: Response) => {
    try {
      if (req.user?.role != 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { taskType, eventType, rewardAmount, description, effectiveFrom, effectiveUntil } = req.body;

      if (!taskType || !rewardAmount) {
        return res.status(400).json({
          success: false,
          error: 'taskType and rewardAmount are required'
        });
      }

      const config = await this.rewardService.createRewardConfig({
        taskType,
        eventType,
        rewardAmount,
        description,
        effectiveFrom: effectiveFrom ? new Date(effectiveFrom) : undefined,
        effectiveUntil: effectiveUntil ? new Date(effectiveUntil) : undefined
      });

      res.status(201).json({
        success: true,
        data: {
          ...config,
          rewardAmount: config.rewardAmount.toNumber()
        },
        message: 'Reward configuration created successfully'
      });

    } catch (error) {
      console.error('Error creating reward config:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create reward configuration'
      });
    }
  };

  // PATCH /api/rewards/admin/config/:id
  updateRewardConfig = async (req: Request, res: Response) => {
    try {
      if (req.user?.role != 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { id } = req.params;
      const { rewardAmount, isActive, description } = req.body;

      const config = await this.rewardService.updateRewardConfig(id, {
        rewardAmount,
        isActive,
        description
      });

      res.json({
        success: true,
        data: {
          ...config,
          rewardAmount: config.rewardAmount.toNumber()
        },
        message: 'Reward configuration updated successfully'
      });

    } catch (error) {
      console.error('Error updating reward config:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update reward configuration'
      });
    }
  };

  // POST /api/rewards/admin/refund/:donationId
  createRefund = async (req: Request, res: Response) => {
    try {
      const adminId = req.user?.id;
      
      if (req.user?.role == 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { donationId } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({
          success: false,
          error: 'Refund reason is required'
        });
      }

      const donation = await this.donationService.createRefund(
        donationId,
        adminId!,
        reason
      );

      res.json({
        success: true,
        data: {
          ...donation,
          amount: donation.amount.toNumber()
        },
        message: 'Refund processed successfully'
      });

    } catch (error) {
      console.error('Error creating refund:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create refund'
      });
    }
  };
}