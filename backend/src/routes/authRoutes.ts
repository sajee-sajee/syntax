import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateJWT, getMe);

// OAuth stubs for frontend to integrate with later
router.get('/google', (req, res) => {
    res.json({ success: false, error: 'Google OAuth not implemented yet. Use local auth.' });
});
router.get('/github', (req, res) => {
    res.json({ success: false, error: 'GitHub OAuth not implemented yet. Use local auth.' });
});

export default router;
