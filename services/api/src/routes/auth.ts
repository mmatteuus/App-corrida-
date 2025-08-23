import { Router } from 'express';
import { CreateUserSchema, LoginSchema } from '@conexao-ativa/shared';
import { validateBody } from '../middleware/validation';
import { signup, login } from '../controllers/authController';

const router = Router();

router.post('/signup', validateBody(CreateUserSchema), signup);
router.post('/login', validateBody(LoginSchema), login);

export default router;

