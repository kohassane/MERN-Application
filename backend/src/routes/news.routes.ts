import { Router } from 'express';
import { Role } from '../types';
import { authenticate, authorize } from '../middleware/auth';
import * as newsController from '../controllers/news.controller';

const router = Router();

const canManageNews = authorize(
  Role.DIRECTEUR_GENERAL,
  Role.CHEF_DEPT_COMMUNICATION,
  Role.CHEF_SERVICE_COMMUNICATION,
  Role.CHEF_SERVICE_INFORMATIQUE
);

// GET /api/news - public
router.get('/', newsController.list);

// GET /api/news/:id - public
router.get('/:id', newsController.getById);

// POST /api/news - protected (communication roles)
router.post('/', authenticate, canManageNews, newsController.create);

// PUT /api/news/:id - protected
router.put('/:id', authenticate, canManageNews, newsController.update);

// DELETE /api/news/:id - protected
router.delete('/:id', authenticate, canManageNews, newsController.remove);

export default router;
