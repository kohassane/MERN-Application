import { Router } from 'express';
import { Role } from '../types';
import { authenticate, authorize } from '../middleware/auth';
import * as partnersController from '../controllers/partners.controller';

const router = Router();

const canManagePartners = authorize(
  Role.DIRECTEUR_GENERAL,
  Role.CHEF_DEPT_COMMUNICATION,
  Role.CHEF_SERVICE_COMMUNICATION,
  Role.CHEF_SERVICE_INFORMATIQUE
);

// GET /api/partners - public
router.get('/', partnersController.list);

// GET /api/partners/:id - public
router.get('/:id', partnersController.getById);

// POST /api/partners - protected
router.post('/', authenticate, canManagePartners, partnersController.create);

// PUT /api/partners/:id - protected
router.put('/:id', authenticate, canManagePartners, partnersController.update);

// DELETE /api/partners/:id - protected
router.delete('/:id', authenticate, canManagePartners, partnersController.remove);

export default router;
