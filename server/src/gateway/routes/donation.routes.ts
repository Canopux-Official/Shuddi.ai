import { Router } from "express";
import {
  createDonationOrder,
  getDonationStatus,
  createCampaignTemp,
  getAllCampaigns,
} from "../controllers/donation.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// All donation routes require auth (except webhooks)
router.post("/order", authMiddleware, createDonationOrder);
router.get("/status", authMiddleware, getDonationStatus);

// TEMP: campaign creation (to be moved under admin later)
router.post("/campaign", authMiddleware, createCampaignTemp);
router.get('/campaign', getAllCampaigns);

export default router;
