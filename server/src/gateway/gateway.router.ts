import { Router } from "express";

import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import feedRoutes from "./routes/feed.routes";
import webhookRoutes from "./routes/webhook.routes";
import donationRoutes from "./routes/donation.routes";


/**
 * Error handled:
 * Network failures
 * Unexpected crashes
 */
const gatewayRouter = Router();
// Auth routes
gatewayRouter.use("/auth", authRoutes);

// Profile routes
gatewayRouter.use("/profile", profileRoutes);

// Dashboard routes
gatewayRouter.use("/dashboard", dashboardRoutes);

// Feed routes
gatewayRouter.use("/feed", feedRoutes);

// gatewayRouter.use("/webhooks", webhookRoutes);

gatewayRouter.use("/donation", donationRoutes);

export default gatewayRouter;
