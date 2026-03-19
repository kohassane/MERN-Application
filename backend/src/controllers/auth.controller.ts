import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';
import User from '../models/User.model';

export const login = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { identifiant, password } = req.body;

    if (!identifiant || !password) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Identifiant et mot de passe requis',
      });
      return;
    }

    // Find user by identifiant OR email
    const user = await User.findOne({
      $or: [{ identifiant }, { email: identifiant }],
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'InvalidCredentials',
        message: 'Identifiant ou mot de passe incorrect',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        error: 'AccountDisabled',
        message: 'Ce compte est désactivé. Contactez un administrateur.',
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: 'InvalidCredentials',
        message: 'Identifiant ou mot de passe incorrect',
      });
      return;
    }

    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!secret) {
      res.status(500).json({
        success: false,
        error: 'ConfigError',
        message: 'Configuration JWT manquante',
      });
      return;
    }

    const token = jwt.sign(
      { userId: (user._id as object).toString(), role: user.role },
      secret,
      { expiresIn } as jwt.SignOptions
    );

    const userObj = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pwd, ...userWithoutPassword } = userObj;

    res.status(200).json({
      success: true,
      data: {
        token,
        user: userWithoutPassword,
      },
      message: 'Connexion réussie',
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // JWT is stateless — client is responsible for discarding the token
    res.status(200).json({
      success: true,
      data: null,
      message: 'Déconnexion réussie',
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Utilisateur non authentifié',
      });
      return;
    }

    const user = await User.findById(req.user.userId).select('-password');

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
      message: 'Profil récupéré avec succès',
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Utilisateur non authentifié',
      });
      return;
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Ancien et nouveau mot de passe requis',
      });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Le nouveau mot de passe doit contenir au moins 8 caractères',
      });
      return;
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Utilisateur non trouvé',
      });
      return;
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      res.status(401).json({
        success: false,
        error: 'InvalidCredentials',
        message: 'Ancien mot de passe incorrect',
      });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await User.findByIdAndUpdate(req.user.userId, { $set: { password: hashedNewPassword } });

    res.status(200).json({
      success: true,
      data: null,
      message: 'Mot de passe modifié avec succès',
    });
  } catch (error) {
    next(error);
  }
};
