import prisma from "../../lib/prisma";
import { Prisma, TransactionType } from '@prisma/client';
import { validateRedemption } from "../functions/reward.functions";

/**
 * Credits rewards with strict idempotency check.
 * @param taskScoreId - The unique ID of the TaskScore being rewarded
 * @param weightagePercentage - Multiplier for the reward calculation
 */

//Idempotency can be separated, also update user, a simple reward schema, a get function to show all rewards
//update seed.ts to store different rewards


export const creditTaskReward = async (
    taskScoreId: string,
) => {
    // 1. Check for existing ledger entry BEFORE starting a transaction
    // This saves database resources for duplicate requests
    const existingEntry = await prisma.rewardLedger.findUnique({
        where: { taskScoreId },
        select: { id: true, amount: true }
    });

    if (existingEntry) {
        console.log(`Idempotency Triggered: Task ${taskScoreId} already rewarded.`);
        return {
            status: "ALREADY_PROCESSED",
            ledgerId: existingEntry.id,
            rewardAmount: existingEntry.amount
        };
    }

    return await prisma.$transaction(async (tx) => {
        // 2. Fetch the task score with a Row-Level Lock
        // 'for update' prevents other processes from modifying this specific task score
        const taskScore = await tx.taskScore.findUnique({
            where: { id: taskScoreId },
            include: { user: true }
        });

        if (!taskScore) throw new Error("TASK_SCORE_NOT_FOUND");

        // 3. Reward Calculation (Simple Formula)
        // Formula: Reward = TotalScore * (Weightage / 100)
        const rewardAmount = Math.floor((taskScore.baseScore * taskScore.performanceScore) / 100);

        // 4. Create Ledger Entry
        // This will fail at the DB level if taskScoreId isn't unique, providing a second layer of safety
        const ledgerEntry = await tx.rewardLedger.create({
            data: {
                userId: taskScore.userId,
                taskScoreId: taskScore.id,
                amount: rewardAmount,
                type: TransactionType.REWARD_EARNED,
                reason: `Task ${taskScore.id} completed with ${taskScore.performanceScore}% performance`,
            },
        });

        // 5. Atomic Update of User Balance & Stats
        await tx.userStats.update({
            where: { userId: taskScore.userId },
            data: {
                rewardPoints: { increment: rewardAmount },
                xp: { increment: taskScore.baseScore },
                lastActivityAt: new Date(),
            },
        });

        // 6. Update Task Score Status
        await tx.taskScore.update({
            where: { id: taskScoreId },
            data: {
                status: 'COMPLETED',
                rewardedAt: new Date(),
            },
        });

        return {
            status: "SUCCESS",
            rewardAmount,
            ledgerId: ledgerEntry.id,
        };
    });
};



export const processRedemptionEntry = async (
    tx: any, // Prisma Transaction Client
    userId: string,
    rewardName: string,
    amount: number
) => {


    const stats = await tx.userStats.findUnique({ where: { userId } });
    if (!stats) throw new Error("User stats not found");

    // 2. CALL YOUR SEPARATE VALIDATOR HERE
    validateRedemption(stats.rewardPoints, amount);

    // 1. Create the Redemption Request record

    const redemption = await tx.redemption.create({
        data: {
            userId,
            rewardName,
            amount: new Prisma.Decimal(amount),
            status: "APPROVED", // Or "PENDING" if you want admin oversight
        },
    });

    // 2. Create the Ledger Entry (Debit)
    // We store the amount as a negative decimal to represent a deduction
    await tx.rewardLedger.create({
        data: {
            userId,
            amount: new Prisma.Decimal(-amount),
            type: TransactionType.REDEMPTION,
            reason: `Redemption ID: ${redemption.id}`,
        },
    });

    // 3. Update User Stats (Deduct the points)
    const updatedStats = await tx.userStats.update({
        where: { userId },
        data: {
            rewardPoints: { decrement: amount },
        },
    });

    return { redemption, newBalance: updatedStats.rewardPoints };
};


/**
 * Get user's reward history by populating user's ledgerEntries
 */
export const getUserRewardHistory = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            ledgerEntries: {
                orderBy: { createdAt: 'desc' },
                include: {
                    taskScore: {
                        include: {
                            task: {
                                select: {
                                    title: true,
                                    type: true,
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!user) throw new Error("User not found");

    return user.ledgerEntries.map(entry => ({
        id: entry.id,
        amount: Number(entry.amount),
        type: entry.type,
        reason: entry.reason,
        createdAt: entry.createdAt,
        taskTitle: entry.taskScore?.task.title || null,
    }));
};

export const getRewards = async() => {
    const data = await prisma.reward.findMany({
        where: {isActive: true},
        orderBy: {createdAt: "desc"}
    });
    return data
}

