import { Request } from 'express';

// Role string-enum (SQLite does not support native Prisma enums)
export const Role = {
  DIRECTEUR_GENERAL: 'DIRECTEUR_GENERAL',
  CHEF_DEPT_AFFAIRES_ADMIN_FIN: 'CHEF_DEPT_AFFAIRES_ADMIN_FIN',
  CHEF_DEPT_DEV_SPORTIF: 'CHEF_DEPT_DEV_SPORTIF',
  CHEF_DEPT_INFRASTRUCTURES: 'CHEF_DEPT_INFRASTRUCTURES',
  CHEF_DEPT_COMMUNICATION: 'CHEF_DEPT_COMMUNICATION',
  CHEF_SERVICE_BUDGET: 'CHEF_SERVICE_BUDGET',
  CHEF_SERVICE_RH: 'CHEF_SERVICE_RH',
  CHEF_SERVICE_COMPETITION: 'CHEF_SERVICE_COMPETITION',
  CHEF_SERVICE_DETECTION: 'CHEF_SERVICE_DETECTION',
  CHEF_SERVICE_JURIDIQUE: 'CHEF_SERVICE_JURIDIQUE',
  CHEF_SERVICE_INFRASTRUCTURES: 'CHEF_SERVICE_INFRASTRUCTURES',
  CHEF_SERVICE_COMMUNICATION: 'CHEF_SERVICE_COMMUNICATION',
  CHEF_SERVICE_INFORMATIQUE: 'CHEF_SERVICE_INFORMATIQUE',
  CHEF_SERVICE_COURRIER: 'CHEF_SERVICE_COURRIER',
  SECRETAIRE_DG: 'SECRETAIRE_DG',
  SECRETAIRE_PRINCIPAL: 'SECRETAIRE_PRINCIPAL',
  AGENT: 'AGENT',
  DELEGUE_DISTRICT: 'DELEGUE_DISTRICT',
  DELEGUE_REGION: 'DELEGUE_REGION',
  DELEGUE_DEPARTEMENT: 'DELEGUE_DEPARTEMENT',
  MACHINISTE: 'MACHINISTE',
  AGENT_HYGIENE: 'AGENT_HYGIENE',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const PartnerTier = {
  PLATINUM: 'PLATINUM',
  GOLD: 'GOLD',
  SILVER: 'SILVER',
  BRONZE: 'BRONZE',
} as const;

export type PartnerTier = (typeof PartnerTier)[keyof typeof PartnerTier];

export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface AuthPayload {
  userId: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  sort?: string;
}
