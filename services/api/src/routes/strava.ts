import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { startStravaAuth, stravaCallback } from '../controllers/stravaController';

const router = Router();

router.get('/start', authenticateToken, startStravaAuth);
router.get('/callback', stravaCallback);

export default router;

