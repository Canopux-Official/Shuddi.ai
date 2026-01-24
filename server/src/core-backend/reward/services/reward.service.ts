// src/services/reward.service.ts

import { PrismaClient, TransactionType, DonationStatus, Prisma } from '@prisma/client';

export interface CreateRewardParams {
    userId: string;
    transactionType: TransactionType;
    amount: number;
    referenceType: string;
    referenceId: string;
    metadata?: Record<string, any>;
    createdBy?: string;
    idempotencyKey: string;
}

export class RewardService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    // ==========================================
    // CORE: Create Ledger Entry
    // ==========================================
    // This creates an immutable record of any reward transaction

    async createLedgerEntry(params: CreateRewardParams) {
        return await this.prisma.$transaction(async (tx) => {

            // STEP 1: Check if we already processed this (prevent duplicates)
            const existingIdempotency = await tx.rewardIdempotency.findUnique({
                where: { idempotencyKey: params.idempotencyKey },
                include: { ledgerEntry: true }
            });

            if (existingIdempotency) {
                console.log('✅ Duplicate prevented:', params.idempotencyKey);
                return existingIdempotency.ledgerEntry;
            }

            // STEP 2: Calculate current balance
            const currentBalance = await this.calculateUserBalance(params.userId, tx);

            // STEP 3: Validate balance for deductions
            if (params.amount < 0) {
                const newBalance = currentBalance + params.amount;
                if (newBalance < 0) {
                    throw new Error(`Insufficient balance. Current: ${currentBalance}, Attempting: ${params.amount}`);
                }
            }

            // STEP 4: Create the ledger entry
            const ledgerEntry = await tx.ledgerEntry.create({
                data: {
                    userId: params.userId,
                    transactionType: params.transactionType,
                    amount: params.amount,
                    balanceAfter: currentBalance + params.amount,
                    referenceType: params.referenceType,
                    referenceId: params.referenceId,
                    metadata: params.metadata || {},
                    createdBy: params.createdBy
                }
            });

            // STEP 5: Record idempotency to prevent future duplicates
            await tx.rewardIdempotency.create({
                data: {
                    idempotencyKey: params.idempotencyKey,
                    userId: params.userId,
                    ledgerEntryId: ledgerEntry.id
                }
            });

            return ledgerEntry;
        });
    }

    // ==========================================
    // Calculate User Balance
    // ==========================================
    // Balance is NEVER stored - always calculated from ledger

    private async calculateUserBalance(
        userId: string,
        tx?: Prisma.TransactionClient
    ): Promise<number> {
        const prismaClient = tx || this.prisma;

        const result = await prismaClient.ledgerEntry.aggregate({
            where: { userId },
            _sum: { amount: true }
        });

        return result._sum.amount?.toNumber() || 0;
    }

    async getUserBalance(userId: string): Promise<number> {
        return this.calculateUserBalance(userId);
    }

    // ==========================================
    // Reward Task Completion
    // ==========================================

    async rewardTaskCompletion(
        userId: string,
        taskId: string,
        taskType: string,
        verificationId: string
    ) {
        const rewardAmount = await this.getRewardAmount(taskType);
        const idempotencyKey = `task:${taskId}:user:${userId}:verification:${verificationId}`;

        return this.createLedgerEntry({
            userId,
            transactionType: TransactionType.EARN,
            amount: rewardAmount,
            referenceType: 'TASK',
            referenceId: taskId,
            metadata: {
                taskType,
                verificationId,
                rewardedAt: new Date().toISOString()
            },
            idempotencyKey
        });
    }

    // ==========================================
    // Reward Event Participation
    // ==========================================

    async rewardEventParticipation(
        userId: string,
        eventId: string,
        eventType: string,
        participationType: 'PARTICIPATION' | 'COMPLETION'
    ) {
        const rewardAmount = await this.getRewardAmount(eventType, participationType);
        const idempotencyKey = `event:${eventId}:user:${userId}:type:${participationType}`;

        return this.createLedgerEntry({
            userId,
            transactionType: TransactionType.EARN,
            amount: rewardAmount,
            referenceType: 'EVENT',
            referenceId: eventId,
            metadata: {
                eventType,
                participationType,
                rewardedAt: new Date().toISOString()
            },
            idempotencyKey
        });
    }

    // ==========================================
    // Get Reward Amount from Config
    // ==========================================

    private async getRewardAmount(
        taskType: string,
        eventType?: string
    ): Promise<number> {
        const config = await this.prisma.rewardConfig.findFirst({
            where: {
                taskType,
                eventType: eventType || null,
                isActive: true,
                effectiveFrom: { lte: new Date() },
                OR: [
                    { effectiveUntil: null },
                    { effectiveUntil: { gte: new Date() } }
                ]
            },
            orderBy: { effectiveFrom: 'desc' }
        });

        if (!config) {
            throw new Error(`No reward configuration found for task: ${taskType}`);
        }

        return config.rewardAmount.toNumber();
    }

    // ==========================================
    // Get User Reward History
    // ==========================================

    async getUserRewardHistory(
        userId: string,
        options: {
            page?: number;
            limit?: number;
            transactionType?: TransactionType;
        } = {}
    ) {
        const page = options.page || 1;
        const limit = options.limit || 20;
        const skip = (page - 1) * limit;

        const where: Prisma.LedgerEntryWhereInput = {
            userId,
            ...(options.transactionType && { transactionType: options.transactionType })
        };

        const [entries, total] = await Promise.all([
            this.prisma.ledgerEntry.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            this.prisma.ledgerEntry.count({ where })
        ]);

        return {
            data: entries.map(entry => ({
                ...entry,
                amount: entry.amount.toNumber(),
                balanceAfter: entry.balanceAfter.toNumber()
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
    // Admin: Create Adjustment
    // ==========================================

    async createAdjustment(
        userId: string,
        amount: number,
        reason: string,
        adminId: string
    ) {
        const idempotencyKey = `adjust:${userId}:${Date.now()}:${adminId}`;

        return this.createLedgerEntry({
            userId,
            transactionType: TransactionType.ADJUST,
            amount,
            referenceType: 'ADMIN',
            referenceId: adminId,
            metadata: {
                reason,
                adjustedBy: adminId,
                adjustedAt: new Date().toISOString()
            },
            createdBy: adminId,
            idempotencyKey
        });
    }
    // ==========================================
    // Get User Statistics
    // ==========================================

    async getUserRewardStats(userId: string) {
        const breakdown = await this.prisma.ledgerEntry.groupBy({
            by: ['transactionType'],
            where: { userId },
            _count: { id: true },
            _sum: { amount: true }
        });

        const currentBalance = await this.getUserBalance(userId);

        // Get total donations (both points and money)
        const totalDonations = await this.prisma.donation.aggregate({
            where: {
                donorUserId: userId,
                status: DonationStatus.COMPLETED
            },
            _sum: { amount: true },
            _count: { id: true }
        });

        return {
            currentBalance,
            breakdown: breakdown.map(item => ({
                type: item.transactionType,
                count: item._count.id,
                total: item._sum.amount?.toNumber() || 0
            })),
            donations: {
                totalAmount: totalDonations._sum.amount?.toNumber() || 0,
                count: totalDonations._count.id
            }
        };
    }

    // ==========================================
    // Create Reward Configuration (Admin)
    // ==========================================

    async createRewardConfig(data: {
        taskType: string;
        eventType?: string;
        rewardAmount: number;
        description?: string;
        effectiveFrom?: Date;
        effectiveUntil?: Date;
    }) {
        return this.prisma.rewardConfig.create({
            data: {
                taskType: data.taskType,
                eventType: data.eventType,
                rewardAmount: data.rewardAmount,
                description: data.description,
                effectiveFrom: data.effectiveFrom || new Date(),
                effectiveUntil: data.effectiveUntil
            }
        });
    }

    // ==========================================
    // Update Reward Configuration (Admin)
    // ==========================================

    async updateRewardConfig(id: string, data: {
        rewardAmount?: number;
        isActive?: boolean;
        description?: string;
    }) {
        return this.prisma.rewardConfig.update({
            where: { id },
            data
        });
    }

    // ==========================================
    // Clean Up Expired Idempotency Records
    // ==========================================

    async cleanupExpiredIdempotency() {
        const result = await this.prisma.rewardIdempotency.deleteMany({
            where: {
                expiresAt: { lt: new Date() }
            }
        });

        console.log(`🧹 Cleaned up ${result.count} expired idempotency records`);
        return result.count;
    }
}