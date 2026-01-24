// src/routes/reward.routes.ts

import { Router } from 'express';
import { RewardController } from '../controllers/reward.controller';
import { RewardService } from '../services/reward.service';
import { DonationService } from '../services/donation.service';


// Middleware imports
import { authMiddleware } from '../../../gateway/middleware/auth.middleware';
import { requireRole } from '../../../gateway/middleware/rbac.middleware';
import prisma from '../../../lib/prisma';

// Initialize services
const rewardService = new RewardService(prisma);
const donationService = new DonationService(prisma);

// Initialize controller
const rewardController = new RewardController(rewardService, donationService);

// Create router
const router = Router();

// ==========================================
// REWARD ROUTES (User)
// ==========================================

// Get current user's balance
router.get(
  '/balance',
  authMiddleware,
  rewardController.getBalance
);

// Get current user's transaction history
router.get(
  '/history',
  authMiddleware,
  rewardController.getHistory
);

// Get current user's statistics
router.get(
  '/stats',
  authMiddleware,
  rewardController.getStats
);

// ==========================================
// DONATION ROUTES (User)
// ==========================================

// Create monetary donation order (Razorpay)
router.post(
  '/donate/money',
  authMiddleware,
  rewardController.createMonetaryDonation
);

// Verify Razorpay payment
router.post(
  '/donate/verify',
  authMiddleware,
  rewardController.verifyDonationPayment
);

// Handle payment failure
router.post(
  '/donate/failed',
  authMiddleware,
  rewardController.handleDonationFailure
);

// Get user's donation history
router.get(
  '/donations',
  authMiddleware,
  rewardController.getUserDonations
);

// ==========================================
// ADMIN ROUTES
// ==========================================

// Create balance adjustment
router.post(
  '/admin/adjust',
  authMiddleware,
  requireRole(["ADMIN"]),
  rewardController.createAdjustment
);

// Get any user's balance
router.get(
  '/admin/balance/:userId',
  authMiddleware,
  requireRole(["ADMIN"]),
  rewardController.getAdminBalance
);

// Create reward configuration
router.post(
  '/admin/config',
  authMiddleware,
  requireRole(["ADMIN"]),
  rewardController.createRewardConfig
);

// Update reward configuration
router.patch(
  '/admin/config/:id',
  authMiddleware,
  requireRole(["ADMIN"]),
  rewardController.updateRewardConfig
);

// Create refund
router.post(
  '/admin/refund/:donationId',
  authMiddleware,
  requireRole(["ADMIN"]),
  rewardController.createRefund
);

export default router;

// Export services for use in other modules
export { rewardService, donationService };



// src/routes/reward.routes.ts
// TESTING VERSION - No authentication required

// import { Router } from 'express';
// import { RewardController } from '../controllers/reward.controller';
// import { RewardService } from '../services/reward.service';
// import { DonationService } from '../services/donation.service';
// import prisma from '../../../lib/prisma';

// // Initialize services
// const rewardService = new RewardService(prisma);
// const donationService = new DonationService(prisma);

// // Initialize controller
// const rewardController = new RewardController(rewardService, donationService);

// // Create router
// const router = Router();

// // ==========================================
// // MOCK MIDDLEWARE FOR TESTING (NO OTP NEEDED)
// // ==========================================

// const mockAuth = (req: any, res: any, next: any) => {
//   // Get user ID from query params or headers
//   const userId = req.query.test_user_id || req.headers['x-test-user-id'];
//   const userRole = req.query.test_user_role || req.headers['x-test-user-role'] || 'CITIZEN';
  
//   if (!userId) {
//     return res.status(400).json({ 
//       success: false,
//       error: 'Testing Mode: Please provide test_user_id',
//       hint: 'Add ?test_user_id=YOUR_USER_ID to the URL',
//       example: `GET ${req.originalUrl}?test_user_id=clxxx123`
//     });
//   }

//   // Mock user object (like real auth middleware would create)
//   req.user = {
//     id: userId as string,
//     role: userRole as string
//   };

//   next();
// };

// const mockAdminCheck = (req: any, res: any, next: any) => {
//   if (req.user?.role !== 'ADMIN') {
//     return res.status(403).json({ 
//       success: false,
//       error: 'Admin access required',
//       hint: 'Add &test_user_role=ADMIN to your URL',
//       example: `${req.originalUrl}?test_user_id=YOUR_ADMIN_ID&test_user_role=ADMIN`
//     });
//   }
//   next();
// };

// // ==========================================
// // USER ROUTES
// // ==========================================

// // Get balance
// // TEST: GET /api/rewards/balance?test_user_id=USER_ID
// router.get('/balance', mockAuth, rewardController.getBalance);

// // Get transaction history
// // TEST: GET /api/rewards/history?test_user_id=USER_ID&page=1&limit=10
// router.get('/history', mockAuth, rewardController.getHistory);

// // Get statistics
// // TEST: GET /api/rewards/stats?test_user_id=USER_ID
// router.get('/stats', mockAuth, rewardController.getStats);

// // ==========================================
// // DONATION ROUTES
// // ==========================================

// // Donate reward points
// // TEST: POST /api/rewards/donate/points?test_user_id=USER_ID
// // BODY: { "ngoId": "NGO_ID", "points": 50, "campaignId": "CAMPAIGN_ID" }
// router.post('/donate/points', mockAuth, rewardController.donatePoints);

// // Create monetary donation (Razorpay)
// // TEST: POST /api/rewards/donate/money?test_user_id=USER_ID
// // BODY: { "ngoId": "NGO_ID", "amount": 500 }
// router.post('/donate/money', mockAuth, rewardController.createMonetaryDonation);

// // Verify payment
// // TEST: POST /api/rewards/donate/verify?test_user_id=USER_ID
// // BODY: { "razorpay_order_id": "...", "razorpay_payment_id": "...", "razorpay_signature": "..." }
// router.post('/donate/verify', mockAuth, rewardController.verifyDonationPayment);

// // Handle payment failure
// // TEST: POST /api/rewards/donate/failed?test_user_id=USER_ID
// // BODY: { "razorpay_order_id": "...", "error_code": "card_declined" }
// router.post('/donate/failed', mockAuth, rewardController.handleDonationFailure);

// // Get donation history
// // TEST: GET /api/rewards/donations?test_user_id=USER_ID
// router.get('/donations', mockAuth, rewardController.getUserDonations);

// // ==========================================
// // ADMIN ROUTES
// // ==========================================

// // Create balance adjustment
// // TEST: POST /api/rewards/admin/adjust?test_user_id=ADMIN_ID&test_user_role=ADMIN
// // BODY: { "userId": "TARGET_USER_ID", "amount": 100, "reason": "Bonus reward" }
// router.post('/admin/adjust', mockAuth, mockAdminCheck, rewardController.createAdjustment);

// // Get any user's balance
// // TEST: GET /api/rewards/admin/balance/USER_ID?test_user_id=ADMIN_ID&test_user_role=ADMIN
// router.get('/admin/balance/:userId', mockAuth, mockAdminCheck, rewardController.getAdminBalance);

// // Create reward config
// // TEST: POST /api/rewards/admin/config?test_user_id=ADMIN_ID&test_user_role=ADMIN
// // BODY: { "taskType": "PLASTIC_COLLECTION", "rewardAmount": 60, "description": "..." }
// router.post('/admin/config', mockAuth, mockAdminCheck, rewardController.createRewardConfig);

// // Update reward config
// // TEST: PATCH /api/rewards/admin/config/CONFIG_ID?test_user_id=ADMIN_ID&test_user_role=ADMIN
// // BODY: { "rewardAmount": 80, "isActive": true }
// router.patch('/admin/config/:id', mockAuth, mockAdminCheck, rewardController.updateRewardConfig);

// // Create refund
// // TEST: POST /api/rewards/admin/refund/DONATION_ID?test_user_id=ADMIN_ID&test_user_role=ADMIN
// // BODY: { "reason": "User requested refund" }
// router.post('/admin/refund/:donationId', mockAuth, mockAdminCheck, rewardController.createRefund);

// // ==========================================
// // TEST HELPER ROUTES (Remove in production)
// // ==========================================

// // Get test user IDs
// router.get('/test/users', async (req, res) => {
//   try {
//     const users = await prisma.user.findMany({
//       include: { profile: true },
//       take: 10
//     });

//     const admin = users.find(u => u.role === 'ADMIN');
//     const citizens = users.filter(u => u.role === 'CITIZEN');

//     res.json({
//       success: true,
//       data: {
//         admin: admin ? {
//           id: admin.id,
//           email: admin.email,
//           displayName: admin.profile?.displayName,
//           role: admin.role
//         } : null,
//         citizens: citizens.map(u => ({
//           id: u.id,
//           email: u.email,
//           displayName: u.profile?.displayName,
//           role: u.role
//         }))
//       },
//       hint: 'Use these IDs in ?test_user_id=ID'
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: 'Failed to fetch users' });
//   }
// });

// // Get NGOs and Campaigns
// router.get('/test/ngos', async (req, res) => {
//   try {
//     const ngos = await prisma.ngo.findMany({
//       include: { campaigns: true }
//     });

//     res.json({
//       success: true,
//       data: ngos.map(ngo => ({
//         id: ngo.id,
//         name: ngo.name,
//         campaigns: ngo.campaigns.map(c => ({
//           id: c.id,
//           title: c.title,
//           goalAmount: c.goalAmount.toNumber(),
//           raisedAmount: c.raisedAmount.toNumber()
//         }))
//       })),
//       hint: 'Use these IDs in donation requests'
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: 'Failed to fetch NGOs' });
//   }
// });

// export default router;
// export { rewardService, donationService };