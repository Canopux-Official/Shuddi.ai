import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as DashboardService from '../services/dashboard.services';

export const getOverview = catchAsync(async (req: Request, res: Response) => {

    const {userId} = req.body;

    // const stats = await DashboardService.getCoreStats(req.user.id);

    const stats = await DashboardService.getCoreStats(userId);
    res.status(200).json({ status: 'success', data: stats });
});

export const getImpact = catchAsync(async (req: Request, res: Response) => {
    const {userId} = req.body;
    // const impact = await DashboardService.getImpactData(req.user.id);
    const impact = await DashboardService.getImpactData(userId);
    res.status(200).json({ status: 'success', data: impact });
});

export const getBadges = catchAsync(async (req: Request, res: Response) => {
    const {userId} = req.body;
    // const badges = await DashboardService.getUserBadges(req.user.id);
    const badges = await DashboardService.getUserBadges(userId);
    res.status(200).json({ status: 'success', data: badges });
});

export const getActivity = catchAsync(async (req: Request, res: Response) => {
    const {userId} = req.body;
    // const activity = await DashboardService.getActivityGraph(req.user.id);
    const activity = await DashboardService.getActivityGraph(userId);
    res.status(200).json({ status: 'success', data: activity });
});

export const getLeaderboard = catchAsync(async (req: Request, res: Response) => {
    const {userId} = req.body;
    const type = (req.query.type as 'global' | 'regional') || 'global';
    // const leaderboard = await DashboardService.getLeaderboard(req.user.id, type);
    const leaderboard = await DashboardService.getLeaderboard(userId, type);
    res.status(200).json({ status: 'success', data: leaderboard });
});