import { Router } from 'express';
import { submitCode } from '../controllers/judgeController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.post('/submit/:problemId', authenticateJWT, submitCode);

export default router;
