import { Request, Response } from "express";
import {
  createPaymentIntentService,
  getPaymentIntentStatus,
} from "../../donation/donation.service";
import { createDonationCampaign, getAllCampaignsService } from "../../donation/campaign.service";

/**
 * POST /api/donation/order
 * Creates a Razorpay order + payment intent
 */
export async function createDonationOrder(req: Request, res: Response) {
  try {
    const { campaignId, amount } = req.body;

    if (!campaignId || !amount) {
      return res.status(400).json({ message: "campaignId and amount are required" });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await createPaymentIntentService({
      userId,
      campaignId,
      amount,
    });

    return res.status(201).json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Failed to create order" });
  }
}

/**
 * GET /api/donation/status?orderId=...
 * Poll donation/payment status
 */
export async function getDonationStatus(req: Request, res: Response) {
  try {
    const { orderId } = req.query;

    if (!orderId || typeof orderId !== "string") {
      return res.status(400).json({ message: "orderId is required" });
    }

    const status = await getPaymentIntentStatus(orderId);

    return res.status(200).json({ status });
  } catch (err: any) {
    return res.status(404).json({ message: err.message || "Not found" });
  }
}

/**
 * POST /api/donation/campaign
 * TEMP: Create a campaign (move to admin later)
 */
export async function createCampaignTemp(req: Request, res: Response) {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    const campaign = await createDonationCampaign({
      title,
      description,
    });

    return res.status(201).json(campaign);
  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Failed to create campaign" });
  }
}

export const getAllCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await getAllCampaignsService();

    return res.status(200).json({
      success: true,
      data: campaigns,
    });
  } catch (error) {
    console.error('Get campaigns error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch campaigns',
    });
  }
};
