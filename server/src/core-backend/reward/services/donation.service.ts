// src/services/donation.service.ts

import { PrismaClient, DonationStatus } from '@prisma/client';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay
// Get these from Razorpay Dashboard: https://dashboard.razorpay.com/
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export interface CreateDonationParams {
  userId: string;
  ngoId: string;
  amount: number; // Amount in INR
  campaignId?: string;
  donorName?: string;
  donorEmail?: string;
  message?: string;
  isAnonymous?: boolean;
}

export class DonationService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // ==========================================
  // STEP 1: Create Razorpay Order
  // ==========================================
  // This is called when user clicks "Donate" button
  // Creates a payment order in Razorpay and returns order ID
  // Frontend will use this order ID to open Razorpay payment modal
  
  async createDonationOrder(params: CreateDonationParams) {
    // Validate NGO exists and is active
    const ngo = await this.prisma.ngo.findUnique({
      where: { id: params.ngoId }
    });

    if (!ngo || !ngo.isActive) {
      throw new Error('NGO not found or inactive');
    }

    // If campaign specified, validate it
    if (params.campaignId) {
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: params.campaignId }
      });

      if (!campaign || !campaign.isActive) {
        throw new Error('Campaign not found or inactive');
      }
    }

    // Get user details
    const user = await this.prisma.user.findUnique({
      where: { id: params.userId },
      include: { profile: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate unique receipt number
    const receiptNumber = `RECEIPT_${Date.now()}_${params.userId.slice(0, 8)}`;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: params.amount * 100, // Razorpay expects amount in paise (1 INR = 100 paise)
      currency: 'INR',
      receipt: receiptNumber,
      notes: {
        userId: params.userId,
        ngoId: params.ngoId,
        campaignId: params.campaignId || '',
        donorName: params.donorName || user.profile?.displayName || 'Anonymous',
        purpose: 'Environmental Donation'
      }
    });

    // Create donation record in database (status: PENDING)
    const donation = await this.prisma.donation.create({
      data: {
        donorUserId: params.userId,
        donorName: params.donorName || user.profile?.displayName,
        donorEmail: params.donorEmail || user.email,
        recipientNgoId: params.ngoId,
        campaignId: params.campaignId,
        amount: params.amount,
        currency: 'INR',
        paymentGateway: 'RAZORPAY',
        gatewayOrderId: razorpayOrder.id,
        receiptNumber,
        message: params.message,
        isAnonymous: params.isAnonymous || false,
        status: DonationStatus.PENDING
      }
    });

    return {
      donation,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        // Send these to frontend to open Razorpay checkout
        key: process.env.RAZORPAY_KEY_ID,
        name: ngo.name,
        description: params.message || `Donation to ${ngo.name}`,
        prefill: {
          name: params.donorName || user.profile?.displayName || '',
          email: params.donorEmail || user.email,
        }
      }
    };
  }

  // ==========================================
  // STEP 2: Verify Razorpay Payment
  // ==========================================
  // Called after user completes payment in Razorpay modal
  // Frontend sends: razorpay_order_id, razorpay_payment_id, razorpay_signature
  // We verify the signature to ensure payment is genuine
  
  async verifyAndCompletePayment(
    orderId: string,
    paymentId: string,
    signature: string
  ) {
    // Find the donation
    const donation = await this.prisma.donation.findUnique({
      where: { gatewayOrderId: orderId }
    });

    if (!donation) {
      throw new Error('Donation not found');
    }

    // Verify signature
    // Razorpay sends: razorpay_order_id|razorpay_payment_id
    // We hash this with our secret key and compare with signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      // Signature mismatch - possible fraud
      await this.prisma.donation.update({
        where: { id: donation.id },
        data: { status: DonationStatus.FAILED }
      });
      throw new Error('Payment verification failed');
    }

    // Signature verified! Payment is genuine
    // Update donation to COMPLETED
    const updatedDonation = await this.prisma.$transaction(async (tx) => {
      // Update donation
      const updated = await tx.donation.update({
        where: { id: donation.id },
        data: {
          gatewayPaymentId: paymentId,
          gatewaySignature: signature,
          status: DonationStatus.COMPLETED,
          completedAt: new Date()
        }
      });

      // Update campaign raised amount if applicable
      if (donation.campaignId) {
        await tx.campaign.update({
          where: { id: donation.campaignId },
          data: {
            raisedAmount: {
              increment: donation.amount
            }
          }
        });
      }

      return updated;
    });

    // TODO: Send receipt email to donor
    // await this.sendDonationReceipt(updatedDonation);

    return updatedDonation;
  }

  // ==========================================
  // Handle Payment Failure
  // ==========================================
  
  async handlePaymentFailure(orderId: string, errorCode?: string, errorDescription?: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { gatewayOrderId: orderId }
    });

    if (!donation) {
      throw new Error('Donation not found');
    }

    return this.prisma.donation.update({
      where: { id: donation.id },
      data: {
        status: DonationStatus.FAILED,
        metadata: {
          errorCode,
          errorDescription,
          failedAt: new Date().toISOString()
        }
      }
    });
  }

  // ==========================================
  // Get User's Donation History
  // ==========================================
  
  async getUserDonations(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      status?: DonationStatus;
    } = {}
  ) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where = {
      donorUserId: userId,
      ...(options.status && { status: options.status })
    };

    const [donations, total] = await Promise.all([
      this.prisma.donation.findMany({
        where,
        include: {
          recipientNgo: {
            select: {
              id: true,
              name: true,
              logoUrl: true
            }
          },
          campaign: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.donation.count({ where })
    ]);

    return {
      data: donations.map(d => ({
        ...d,
        amount: d.amount.toNumber()
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // ==========================================
  // Get NGO's Received Donations
  // ==========================================
  
  async getNgoDonations(
    ngoId: string,
    options: {
      page?: number;
      limit?: number;
      status?: DonationStatus;
    } = {}
  ) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where = {
      recipientNgoId: ngoId,
      status: options.status || DonationStatus.COMPLETED
    };

    const [donations, total, totalAmount] = await Promise.all([
      this.prisma.donation.findMany({
        where,
        include: {
          donor: {
            select: {
              id: true,
              profile: {
                select: {
                  displayName: true,
                  avatarUrl: true
                }
              }
            }
          },
          campaign: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.donation.count({ where }),
      this.prisma.donation.aggregate({
        where,
        _sum: { amount: true }
      })
    ]);

    return {
      data: donations.map(d => ({
        ...d,
        amount: d.amount.toNumber(),
        // Hide donor info if anonymous
        donor: d.isAnonymous ? null : d.donor
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      totalRaised: totalAmount._sum.amount?.toNumber() || 0
    };
  }

  // ==========================================
  // Get Donation Statistics
  // ==========================================
  
  async getDonationStats(ngoId?: string) {
    const where = ngoId ? { recipientNgoId: ngoId } : {};

    const stats = await this.prisma.donation.groupBy({
      by: ['status'],
      where,
      _count: { id: true },
      _sum: { amount: true }
    });

    return stats.map(stat => ({
      status: stat.status,
      count: stat._count.id,
      total: stat._sum.amount?.toNumber() || 0
    }));
  }

  // ==========================================
  // Create Refund (Admin)
  // ==========================================
  
  async createRefund(donationId: string, adminId: string, reason: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { id: donationId }
    });

    if (!donation) {
      throw new Error('Donation not found');
    }

    if (donation.status !== DonationStatus.COMPLETED) {
      throw new Error('Can only refund completed donations');
    }

    if (!donation.gatewayPaymentId) {
      throw new Error('No payment ID found');
    }

    // Create refund in Razorpay
    const refund = await razorpay.payments.refund(donation.gatewayPaymentId, {
      amount: donation.amount.toNumber() * 100, // Razorpay expects paise
      notes: {
        reason,
        refundedBy: adminId
      }
    });

    // Update donation and campaign
    return await this.prisma.$transaction(async (tx) => {
      // Update donation status
      const updatedDonation = await tx.donation.update({
        where: { id: donationId },
        data: {
          status: DonationStatus.REFUNDED,
          metadata: {
            refundId: refund.id,
            refundReason: reason,
            refundedBy: adminId,
            refundedAt: new Date().toISOString()
          }
        }
      });

      // Deduct from campaign if applicable
      if (donation.campaignId) {
        await tx.campaign.update({
          where: { id: donation.campaignId },
          data: {
            raisedAmount: {
              decrement: donation.amount
            }
          }
        });
      }

      return updatedDonation;
    });
  }
}