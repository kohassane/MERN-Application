import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as authController from '../controllers/auth.controller';

const router = Router();

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/logout
router.post('/logout', authenticate, authController.logout);

// GET /api/auth/me
router.get('/me', authenticate, authController.me);

// PUT /api/auth/me/password
router.put('/me/password', authenticate, authController.changePassword);

export default router;
