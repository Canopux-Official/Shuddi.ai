import prisma from "../../../lib/prisma";
import { Prisma } from '@prisma/client';

export const getCoreStats = async (userId: string) => {
    const stats = await prisma.userStats.findUnique({
        where: { userId },
        include: {
            user: {
                include: { profile: true }
            }
        }
    });

    if (!stats) throw new Error("Stats not found");

    // Logic for Level Progress (Assuming 1000 XP per level for this example)
    const xpIntoLevel = stats.xp % 1000;
    const progressPercentage = (xpIntoLevel / 1000) * 100;

    return {
        username: stats.user.profile?.username,
        avatar: stats.user.profile?.avatarUrl,
        xp: stats.xp,
        level: stats.level,
        progressPercentage,
        streaks: {
            current: stats.currentStreak,
            longest: stats.longestStreak
        },
        walletBalance: stats.rewardPoints
    };
};

export const getImpactData = async (userId: string) => {
    const stats = await prisma.userStats.findUnique({
        where: { userId },
        select: { totalContributions: true, totalWeightRemoved: true, nextMilestone: true }
    });

    if (!stats) throw new Error("Stats not found");

    const percentageToMilestone = (stats.totalWeightRemoved / stats.nextMilestone) * 100;

    return {
        totalContributions: stats.totalContributions,
        totalWeightRemoved: stats.totalWeightRemoved,
        nextMilestone: stats.nextMilestone,
        percentageToMilestone: Math.min(percentageToMilestone, 100) // Cap at 100%
    };
};

export const getUserBadges = async (userId: string) => {
    const [userBadges, totalBadgesCount] = await Promise.all([
        prisma.userBadge.findMany({
            where: { userId },
            include: { badge: true }
        }),
        prisma.badge.count()
    ]);

    return {
        badges: userBadges.map(ub => ({
            name: ub.badge.name,
            image: ub.badge.imageUrl,
            rarity: ub.badge.rarity,
            earnedAt: ub.earnedAt
        })),
        stats: {
            earned: userBadges.length,
            totalAvailable: totalBadgesCount
        }
    };
};

export const getActivityGraph = async (userId: string) => {
    const stats = await prisma.userStats.findUnique({
        where: { userId },
        select: { actionsLast7Days: true, engagementLevel: true }
    });

    // Note: For a real daily breakdown, you would query an 'Activity' table. 
    // Here we mock the breakdown based on the schema's total actions.
    const mockDailyData = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        actions: Math.floor(Math.random() * 5) // Mock logic
    })).reverse();

    return {
        history: mockDailyData,
        engagementLevel: stats?.engagementLevel || 0
    };
};

export const getLeaderboard = async (userId: string, type: 'global' | 'regional') => {
    const userStats = await prisma.userStats.findUnique({ where: { userId } });

    // 1. Define the include structure clearly
    const leaderboardInclude = {
        user: {
            include: {
                profile: true
            }
        }
    } satisfies Prisma.UserStatsInclude; // This ensures TS knows what's being included

    // 2. Execute the query
    const topUsers = await prisma.userStats.findMany({
        where: type === 'regional' && userStats?.region ? { region: userStats.region } : {},
        take: 10,
        orderBy: { xp: 'desc' },
        include: leaderboardInclude
    });

    return {
        myRank: {
            global: userStats?.globalRank,
            regional: userStats?.regionalRank
        },
        leaderboard: topUsers.map((u, index) => ({
            rank: index + 1,
            // Now TypeScript knows u.user exists!
            username: u.user.profile?.username || "Anonymous",
            points: u.xp,
            avatar: u.user.profile?.avatarUrl
        }))
    };
};