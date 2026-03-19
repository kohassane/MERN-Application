import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, AuthPayload, Role } from '../types';

const ADMIN_ROLES: Role[] = [Role.DIRECTEUR_GENERAL, Role.CHEF_SERVICE_INFORMATIQUE];

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Token d\'authentification manquant ou invalide',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Configuration JWT manquante',
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as AuthPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: 'TokenExpired',
        message: 'Le token d\'authentification a expiré',
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: 'InvalidToken',
        message: 'Token d\'authentification invalide',
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Erreur lors de la vérification du token',
    });
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Utilisateur non authentifié',
      });
      return;
    }

    const userRole = req.user.role;

    // DIRECTEUR_GENERAL and CHEF_SERVICE_INFORMATIQUE have access to everything
    if (ADMIN_ROLES.includes(userRole)) {
      next();
      return;
    }

    if (!roles.includes(userRole)) {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Vous n\'avez pas les droits nécessaires pour effectuer cette action',
      });
      return;
    }

    next();
  };
};
