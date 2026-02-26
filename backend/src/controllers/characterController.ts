import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middlewares/auth';

export const createCharacter = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { displayName, hair, glasses, dress, shoes, aura } = req.body;
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        if (!displayName) {
            res.status(400).json({ success: false, error: 'Display name is required' });
            return;
        }

        const existingCharacter = await prisma.character.findUnique({ where: { displayName } });
        if (existingCharacter) {
            res.status(400).json({ success: false, error: 'Display name is already taken' });
            return;
        }

        // Create character and update user characterCreated = true
        const character = await prisma.character.create({
            data: {
                userId,
                displayName,
                hair: hair || 'default_hair',
                glasses: glasses || null,
                dress: dress || 'default_dress',
                shoes: shoes || 'default_shoes',
                aura: aura || 'default_aura'
            }
        });

        await prisma.user.update({
            where: { id: userId },
            data: { characterCreated: true }
        });

        res.status(201).json({ success: true, data: character });
    } catch (error) {
        console.error('Create character error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const getCharacter = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const character = await prisma.character.findUnique({ where: { userId } });
        if (!character) {
            res.status(404).json({ success: false, error: 'Character not found' });
            return;
        }

        res.status(200).json({ success: true, data: character });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
