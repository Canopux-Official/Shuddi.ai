import { Router } from "express";

import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import feedRoutes from "./routes/feed.routes";
import webhookRoutes from "./routes/webhook.routes";
import donationRoutes from "./routes/donation.routes";
import taskRouter from "./routes/task.routes"
import rewardRouter from "./routes/reward.router"
import ngoRoutes from "./routes/ngo.routes"
import adminRoutes from "./routes/admin.routes";


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

gatewayRouter.use("/tasks", taskRouter);

gatewayRouter.use("/rewards", rewardRouter)

gatewayRouter.use("/ngo", ngoRoutes)

gatewayRouter.use("/admin", adminRoutes );

// Add one lightweight API:
// GET /api/rewards/balance
// That just returns userStats.rewardPoints.

export default gatewayRouter;
