import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateLogin } from '../validators/auth.validator';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', validateLogin, authController.login);
router.get('/profile', authenticate, authController.getProfile);

export default router;
