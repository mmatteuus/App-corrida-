import { Router } from 'express';
import { CreatePlaceSchema } from '@conexao-ativa/shared';
import { validateBody } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { getPlaces, createPlace } from '../controllers/placesController';

const router = Router();

router.get('/', getPlaces);
router.post('/', authenticateToken, validateBody(CreatePlaceSchema), createPlace);

export default router;

