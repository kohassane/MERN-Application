import { Router } from 'express';
import { Role } from '../types';
import { authenticate, authorize } from '../middleware/auth';
import * as resultsController from '../controllers/results.controller';

const router = Router();

const canManageResults = authorize(
  Role.DIRECTEUR_GENERAL,
  Role.CHEF_DEPT_DEV_SPORTIF,
  Role.CHEF_SERVICE_COMPETITION,
  Role.CHEF_SERVICE_INFORMATIQUE
);

// GET /api/results - public
router.get('/', resultsController.list);

// GET /api/results/:id - public
router.get('/:id', resultsController.getById);

// POST /api/results - protected
router.post('/', authenticate, canManageResults, resultsController.create);

// PUT /api/results/:id - protected
router.put('/:id', authenticate, canManageResults, resultsController.update);

// DELETE /api/results/:id - protected
router.delete('/:id', authenticate, canManageResults, resultsController.remove);

export default router;
