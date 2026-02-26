import { Router } from 'express';
import { createCharacter, getCharacter } from '../controllers/characterController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.post('/', authenticateJWT, createCharacter);
router.get('/', authenticateJWT, getCharacter);

export default router;
