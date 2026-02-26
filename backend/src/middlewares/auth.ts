import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey', (err, user: any) => {
            if (err) {
                res.status(403).json({ success: false, error: 'Forbidden' });
                return;
            }
            req.userId = user.userId;
            next();
        });
    } else {
        res.status(401).json({ success: false, error: 'Unauthorized' });
    }
};
