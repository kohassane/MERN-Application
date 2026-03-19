import { Router } from 'express';
import { Role } from '../types';
import { authenticate, authorize } from '../middleware/auth';
import * as eventsController from '../controllers/events.controller';

const router = Router();

const canManageEvents = authorize(
  Role.DIRECTEUR_GENERAL,
  Role.CHEF_DEPT_DEV_SPORTIF,
  Role.CHEF_SERVICE_COMPETITION,
  Role.CHEF_SERVICE_INFORMATIQUE
);

// GET /api/events - public
router.get('/', eventsController.list);

// GET /api/events/:id - public
router.get('/:id', eventsController.getById);

// POST /api/events - protected
router.post('/', authenticate, canManageEvents, eventsController.create);

// PUT /api/events/:id - protected
router.put('/:id', authenticate, canManageEvents, eventsController.update);

// DELETE /api/events/:id - protected
router.delete('/:id', authenticate, canManageEvents, eventsController.remove);

export default router;
