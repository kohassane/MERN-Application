import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthRequest, Role, OrderStatus } from '../types';
import Order from '../models/Order.model';
import Product from '../models/Product.model';
import User from '../models/User.model';

const ADMIN_ROLES: Role[] = [
  Role.DIRECTEUR_GENERAL,
  Role.CHEF_DEPT_AFFAIRES_ADMIN_FIN,
  Role.CHEF_SERVICE_INFORMATIQUE,
];

const isAdmin = (role: Role): boolean => ADMIN_ROLES.includes(role);

export const list = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized', message: 'Non authentifié' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter = isAdmin(req.user.role)
      ? {}
      : { userId: new mongoose.Types.ObjectId(req.user.userId) };

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('items.productId'),
      Order.countDocuments(filter),
    ]);

    // Attach user info for each order
    const ordersWithUser = await Promise.all(
      orders.map(async (order) => {
        const obj = order.toObject();
        const user = await User.findById(order.userId).select(
          'identifiant email firstName lastName'
        );
        return { ...obj, user: user ? user.toObject() : null };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        data: ordersWithUser,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      message: 'Commandes récupérées avec succès',
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized', message: 'Non authentifié' });
      return;
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Commande non trouvée',
      });
      return;
    }

    const order = await Order.findById(id).populate('items.productId');

    if (!order) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Commande non trouvée',
      });
      return;
    }

    // Non-admin users can only see their own orders
    if (!isAdmin(req.user.role) && order.userId.toString() !== req.user.userId) {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: "Vous n'avez pas accès à cette commande",
      });
      return;
    }

    const user = await User.findById(order.userId).select('identifiant email firstName lastName');
    const orderObj = order.toObject();

    res.status(200).json({
      success: true,
      data: { ...orderObj, user: user ? user.toObject() : null },
      message: 'Commande récupérée avec succès',
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized', message: 'Non authentifié' });
      return;
    }

    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'La commande doit contenir au moins un article',
      });
      return;
    }

    const orderItemsData: Array<{
      productId: mongoose.Types.ObjectId;
      quantity: number;
      price: number;
    }> = [];

    let total = 0;

    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity || quantity < 1) {
        res.status(400).json({
          success: false,
          error: 'BadRequest',
          message: 'Chaque article doit avoir un productId et une quantité valide (>= 1)',
        });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(404).json({
          success: false,
          error: 'NotFound',
          message: `Produit ${productId} non trouvé`,
        });
        return;
      }

      const product = await Product.findById(productId);

      if (!product) {
        res.status(404).json({
          success: false,
          error: 'NotFound',
          message: `Produit ${productId} non trouvé`,
        });
        return;
      }

      if (!product.inStock) {
        res.status(400).json({
          success: false,
          error: 'OutOfStock',
          message: `Le produit "${product.name}" est en rupture de stock`,
        });
        return;
      }

      const lineTotal = product.price * quantity;
      total += lineTotal;

      orderItemsData.push({
        productId: new mongoose.Types.ObjectId(productId),
        quantity,
        price: product.price,
      });
    }

    const order = await Order.create({
      userId: new mongoose.Types.ObjectId(req.user.userId),
      status: OrderStatus.PENDING,
      total,
      items: orderItemsData,
    });

    const populated = await Order.findById(order._id).populate('items.productId');

    res.status(201).json({
      success: true,
      data: populated,
      message: 'Commande créée avec succès',
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized', message: 'Non authentifié' });
      return;
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status || !Object.values(OrderStatus).includes(status)) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: `Statut invalide. Valeurs acceptées: ${Object.values(OrderStatus).join(', ')}`,
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Commande non trouvée',
      });
      return;
    }

    const existing = await Order.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Commande non trouvée',
      });
      return;
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).populate('items.productId');

    res.status(200).json({
      success: true,
      data: order,
      message: 'Statut de la commande mis à jour avec succès',
    });
  } catch (error) {
    next(error);
  }
};

export const cancel = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized', message: 'Non authentifié' });
      return;
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Commande non trouvée',
      });
      return;
    }

    const existing = await Order.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Commande non trouvée',
      });
      return;
    }

    // Non-admin users can only cancel their own orders
    if (!isAdmin(req.user.role) && existing.userId.toString() !== req.user.userId) {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: "Vous n'avez pas accès à cette commande",
      });
      return;
    }

    if (existing.status !== OrderStatus.PENDING) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Seules les commandes en attente peuvent être annulées',
      });
      return;
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: { status: OrderStatus.CANCELLED } },
      { new: true }
    ).populate('items.productId');

    res.status(200).json({
      success: true,
      data: order,
      message: 'Commande annulée avec succès',
    });
  } catch (error) {
    next(error);
  }
};
