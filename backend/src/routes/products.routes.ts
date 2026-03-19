import { Router } from 'express';
import { Role } from '../types';
import { authenticate, authorize } from '../middleware/auth';
import * as productsController from '../controllers/products.controller';

const router = Router();

const canManageProducts = authorize(
  Role.DIRECTEUR_GENERAL,
  Role.CHEF_DEPT_AFFAIRES_ADMIN_FIN,
  Role.CHEF_SERVICE_BUDGET,
  Role.CHEF_SERVICE_INFORMATIQUE
);

// GET /api/products - public
router.get('/', productsController.list);

// GET /api/products/:id - public
router.get('/:id', productsController.getById);

// POST /api/products - protected
router.post('/', authenticate, canManageProducts, productsController.create);

// PUT /api/products/:id - protected
router.put('/:id', authenticate, canManageProducts, productsController.update);

// DELETE /api/products/:id - protected
router.delete('/:id', authenticate, canManageProducts, productsController.remove);

// PATCH /api/products/:id/stock - protected
router.patch('/:id/stock', authenticate, canManageProducts, productsController.toggleStock);

export default router;
