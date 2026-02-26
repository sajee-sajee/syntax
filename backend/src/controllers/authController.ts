import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ success: false, error: 'Email and password are required' });
            return;
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ success: false, error: 'Email already exists' });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                provider: 'local',
                passwordHash,
                characterCreated: false,
            }
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ success: true, data: { token, user: { id: user.id, email: user.email, characterCreated: user.characterCreated } } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ success: false, error: 'Email and password are required' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.provider !== 'local' || !user.passwordHash) {
            res.status(400).json({ success: false, error: 'Invalid email or password' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(400).json({ success: false, error: 'Invalid email or password' });
            return;
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ success: true, data: { token, user: { id: user.id, email: user.email, characterCreated: user.characterCreated } } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const getMe = async (req: any, res: Response): Promise<void> => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, email: true, characterCreated: true, provider: true, character: true }
        });

        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
