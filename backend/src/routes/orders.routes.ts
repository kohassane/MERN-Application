import { Router } from 'express';
import { Role } from '../types';
import { authenticate, authorize } from '../middleware/auth';
import * as ordersController from '../controllers/orders.controller';

const router = Router();

const canManageOrderStatus = authorize(
  Role.DIRECTEUR_GENERAL,
  Role.CHEF_DEPT_AFFAIRES_ADMIN_FIN,
  Role.CHEF_SERVICE_BUDGET,
  Role.CHEF_SERVICE_INFORMATIQUE
);

// All order routes require authentication
router.use(authenticate);

// GET /api/orders - list own orders (admin sees all)
router.get('/', ordersController.list);

// GET /api/orders/:id - get order (own or admin)
router.get('/:id', ordersController.getById);

// POST /api/orders - create order from cart
router.post('/', ordersController.create);

// PUT /api/orders/:id/status - update status (admin roles only)
router.put('/:id/status', canManageOrderStatus, ordersController.updateStatus);

// DELETE /api/orders/:id - cancel order
router.delete('/:id', ordersController.cancel);

export default router;
