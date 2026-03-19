import { Router } from 'express';
import { Role } from '../types';
import { authenticate, authorize } from '../middleware/auth';
import * as usersController from '../controllers/users.controller';

const router = Router();

const canManageUsers = authorize(
  Role.DIRECTEUR_GENERAL,
  Role.CHEF_SERVICE_RH,
  Role.CHEF_SERVICE_INFORMATIQUE
);

// All routes require authentication and authorization
router.use(authenticate, canManageUsers);

// GET /api/users
router.get('/', usersController.list);

// POST /api/users
router.post('/', usersController.create);

// GET /api/users/:id
router.get('/:id', usersController.getById);

// PUT /api/users/:id
router.put('/:id', usersController.update);

// DELETE /api/users/:id - soft delete (deactivate)
router.delete('/:id', usersController.deactivate);

// PUT /api/users/:id/activate
router.put('/:id/activate', usersController.activate);

export default router;
