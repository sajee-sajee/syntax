import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middlewares/auth';

export const getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const streak = await prisma.streak.upsert({
            where: { userId },
            update: {},
            create: {
                userId,
                currentStreak: 0,
                longestStreak: 0,
            }
        });

        const ranking = await prisma.ranking.upsert({
            where: { userId },
            update: {},
            create: {
                userId,
                skillScore: 0,
                consistencyScore: 0,
                codeQualityScore: 0,
                totalScore: 0,
                tier: 'Recruit'
            }
        });

        // Get total unique problems solved
        const solvedAttempts = await prisma.attempt.findMany({
            where: { userId, status: 'accepted' },
            select: { problemId: true },
            distinct: ['problemId']
        });
        const totalSolved = solvedAttempts.length;

        // Current skills region (default to first region if no progress)
        const regions = await prisma.region.findMany({
            orderBy: { order: 'asc' },
            take: 1
        });
        const currentRegion = regions.length > 0 ? regions[0] : null;

        res.status(200).json({
            success: true,
            data: {
                streak,
                totalSolved,
                ranking,
                currentRegion,
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
