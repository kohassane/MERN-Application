import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { AuthRequest, Role } from '../types';
import User from '../models/User.model';

export const list = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { identifiant: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        data: users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      message: 'Utilisateurs récupérés avec succès',
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
    const { identifiant, email, password, role, firstName, lastName } = req.body;

    if (!identifiant || !password || !role || !firstName || !lastName) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Identifiant, mot de passe, rôle, prénom et nom sont requis',
      });
      return;
    }

    // Validate role
    if (!Object.values(Role).includes(role)) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Rôle invalide',
      });
      return;
    }

    // Check identifiant uniqueness
    const existingByIdentifiant = await User.findOne({ identifiant });
    if (existingByIdentifiant) {
      res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'Cet identifiant est déjà utilisé',
      });
      return;
    }

    // Check email uniqueness if provided
    if (email) {
      const existingByEmail = await User.findOne({ email });
      if (existingByEmail) {
        res.status(409).json({
          success: false,
          error: 'Conflict',
          message: 'Cet email est déjà utilisé',
        });
        return;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      identifiant,
      email: email || undefined,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      isActive: true,
    });

    const userObj = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pwd, ...userWithoutPassword } = userObj;

    res.status(201).json({
      success: true,
      data: userWithoutPassword,
      message: 'Utilisateur créé avec succès',
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
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Utilisateur non trouvé',
      });
      return;
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Utilisateur non trouvé',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'Utilisateur récupéré avec succès',
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
    const { identifiant, email, role, firstName, lastName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Utilisateur non trouvé',
      });
      return;
    }

    const existing = await User.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Utilisateur non trouvé',
      });
      return;
    }

    // Check identifiant uniqueness if changing
    if (identifiant && identifiant !== existing.identifiant) {
      const conflict = await User.findOne({ identifiant });
      if (conflict) {
        res.status(409).json({
          success: false,
          error: 'Conflict',
          message: 'Cet identifiant est déjà utilisé',
        });
        return;
      }
    }

    // Check email uniqueness if changing
    if (email && email !== existing.email) {
      const conflict = await User.findOne({ email });
      if (conflict) {
        res.status(409).json({
          success: false,
          error: 'Conflict',
          message: 'Cet email est déjà utilisé',
        });
        return;
      }
    }

    // Validate role if provided
    if (role && !Object.values(Role).includes(role)) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Rôle invalide',
      });
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (identifiant) updateData.identifiant = identifiant;
    if (email !== undefined) updateData.email = email || undefined;
    if (role) updateData.role = role;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user,
      message: 'Utilisateur mis à jour avec succès',
    });
  } catch (error) {
    next(error);
  }
};

export const deactivate = async (
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
        message: 'Utilisateur non trouvé',
      });
      return;
    }

    const existing = await User.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Utilisateur non trouvé',
      });
      return;
    }

    // Prevent self-deactivation
    if (req.user && req.user.userId === id) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Vous ne pouvez pas désactiver votre propre compte',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user,
      message: 'Utilisateur désactivé avec succès',
    });
  } catch (error) {
    next(error);
  }
};

export const activate = async (
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
        message: 'Utilisateur non trouvé',
      });
      return;
    }

    const existing = await User.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Utilisateur non trouvé',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { isActive: true } },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user,
      message: 'Utilisateur activé avec succès',
    });
  } catch (error) {
    next(error);
  }
};
