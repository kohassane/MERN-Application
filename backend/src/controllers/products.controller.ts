import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthRequest, OrderStatus } from '../types';
import Product from '../models/Product.model';
import Order from '../models/Order.model';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const category = (req.query.category as string) || '';
    const inStockParam = req.query.inStock as string;
    const featuredParam = req.query.featured as string;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (inStockParam !== undefined) {
      filter.inStock = inStockParam === 'true';
    }

    if (featuredParam !== undefined) {
      filter.featured = featuredParam === 'true';
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ featured: -1, createdAt: -1 }),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        data: products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      message: 'Produits récupérés avec succès',
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Produit non trouvé',
      });
      return;
    }

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Produit non trouvé',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
      message: 'Produit récupéré avec succès',
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
    const { name, description, price, imageUrl, category, inStock, featured } = req.body;

    if (!name || !description || price === undefined || !category) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Nom, description, prix et catégorie sont requis',
      });
      return;
    }

    if (typeof price !== 'number' || price < 0) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Le prix doit être un nombre positif',
      });
      return;
    }

    const product = await Product.create({
      name,
      description,
      price,
      imageUrl: imageUrl || undefined,
      category,
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      featured: featured !== undefined ? Boolean(featured) : false,
    });

    res.status(201).json({
      success: true,
      data: product,
      message: 'Produit créé avec succès',
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, category, inStock, featured } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Produit non trouvé',
      });
      return;
    }

    const existing = await Product.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Produit non trouvé',
      });
      return;
    }

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Le prix doit être un nombre positif',
      });
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || undefined;
    if (category) updateData.category = category;
    if (inStock !== undefined) updateData.inStock = Boolean(inStock);
    if (featured !== undefined) updateData.featured = Boolean(featured);

    const product = await Product.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    res.status(200).json({
      success: true,
      data: product,
      message: 'Produit mis à jour avec succès',
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Produit non trouvé',
      });
      return;
    }

    const existing = await Product.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Produit non trouvé',
      });
      return;
    }

    // Check if there are pending orders for this product
    const pendingOrder = await Order.findOne({
      'items.productId': new mongoose.Types.ObjectId(id),
      status: { $in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.SHIPPED] },
    });

    if (pendingOrder) {
      res.status(409).json({
        success: false,
        error: 'Conflict',
        message:
          'Impossible de supprimer ce produit car il est associé à des commandes en cours',
      });
      return;
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      data: null,
      message: 'Produit supprimé avec succès',
    });
  } catch (error) {
    next(error);
  }
};

export const toggleStock = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Produit non trouvé',
      });
      return;
    }

    const existing = await Product.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Produit non trouvé',
      });
      return;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: { inStock: !existing.inStock } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: product,
      message: `Produit marqué comme ${product!.inStock ? 'en stock' : 'hors stock'}`,
    });
  } catch (error) {
    next(error);
  }
};
