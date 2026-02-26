import { Router } from 'express';
import { getDashboard } from '../controllers/dashboardController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.get('/', authenticateJWT, getDashboard);

export default router;
