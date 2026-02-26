import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middlewares/auth';

export const getRegions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const regions = await prisma.region.findMany({
            orderBy: { order: 'asc' },
            include: {
                _count: {
                    select: { levels: true }
                }
            }
        });
        res.status(200).json({ success: true, data: regions });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const getLevelsInRegion = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const regionId = req.params.regionId as string;
        const levels = await prisma.level.findMany({
            where: { regionId },
            orderBy: { order: 'asc' },
            include: {
                problem: {
                    select: { id: true, title: true, difficulty: true }
                }
            }
        });
        res.status(200).json({ success: true, data: levels });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const getLevelDetails = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const levelId = req.params.levelId as string;
        const level = await prisma.level.findUnique({
            where: { id: levelId },
            include: {
                problem: {
                    include: {
                        testCases: {
                            where: { isHidden: false }
                        }
                    }
                }
            }
        });

        if (!level) {
            res.status(404).json({ success: false, error: 'Level not found' });
            return;
        }

        res.status(200).json({ success: true, data: level });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
