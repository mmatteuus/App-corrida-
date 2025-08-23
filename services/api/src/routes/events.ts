import { Router } from 'express';
import { CreateEventSchema } from '@conexao-ativa/shared';
import { validateBody } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { getEvents, getEventById, createEvent, joinEvent } from '../controllers/eventsController';

const router = Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', authenticateToken, validateBody(CreateEventSchema), createEvent);
router.post('/:id/join', authenticateToken, joinEvent);

export default router;

