import { Router } from "express";
import { handleRazorpayWebhook } from "../controllers/razorpayWebhook.controller";

const router = Router();

// NO auth middleware here
// router.post("/razorpay", handleRazorpayWebhook);

export default router;
