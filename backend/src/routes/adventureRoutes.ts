import { Router } from 'express';
import { getRegions, getLevelsInRegion, getLevelDetails } from '../controllers/adventureController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.get('/regions', authenticateJWT, getRegions);
router.get('/regions/:regionId/levels', authenticateJWT, getLevelsInRegion);
router.get('/levels/:levelId', authenticateJWT, getLevelDetails);

export default router;
