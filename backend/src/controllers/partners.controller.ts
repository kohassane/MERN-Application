import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthRequest, PartnerTier } from '../types';
import Partner from '../models/Partner.model';

const TIER_ORDER: Record<PartnerTier, number> = {
  PLATINUM: 1,
  GOLD: 2,
  SILVER: 3,
  BRONZE: 4,
};

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tier = (req.query.tier as string) || '';

    const filter: Record<string, unknown> = {};

    if (tier && Object.values(PartnerTier).includes(tier as PartnerTier)) {
      filter.tier = tier;
    }

    const partners = await Partner.find(filter).sort({ name: 1 });

    // Sort by tier order (PLATINUM first)
    const sorted = partners.sort(
      (a, b) =>
        (TIER_ORDER[a.tier as PartnerTier] ?? 99) - (TIER_ORDER[b.tier as PartnerTier] ?? 99)
    );

    res.status(200).json({
      success: true,
      data: sorted,
      message: 'Partenaires récupérés avec succès',
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
        message: 'Partenaire non trouvé',
      });
      return;
    }

    const partner = await Partner.findById(id);

    if (!partner) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Partenaire non trouvé',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: partner,
      message: 'Partenaire récupéré avec succès',
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
    const { name, description, logoUrl, websiteUrl, tier } = req.body;

    if (!name || !tier) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Nom et niveau de partenariat (tier) sont requis',
      });
      return;
    }

    if (!Object.values(PartnerTier).includes(tier)) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Niveau de partenariat invalide. Valeurs acceptées: PLATINUM, GOLD, SILVER, BRONZE',
      });
      return;
    }

    const partner = await Partner.create({
      name,
      description: description || undefined,
      logoUrl: logoUrl || undefined,
      websiteUrl: websiteUrl || undefined,
      tier,
    });

    res.status(201).json({
      success: true,
      data: partner,
      message: 'Partenaire créé avec succès',
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
    const { name, description, logoUrl, websiteUrl, tier } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Partenaire non trouvé',
      });
      return;
    }

    const existing = await Partner.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Partenaire non trouvé',
      });
      return;
    }

    if (tier && !Object.values(PartnerTier).includes(tier)) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Niveau de partenariat invalide. Valeurs acceptées: PLATINUM, GOLD, SILVER, BRONZE',
      });
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description || undefined;
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl || undefined;
    if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl || undefined;
    if (tier) updateData.tier = tier;

    const partner = await Partner.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    res.status(200).json({
      success: true,
      data: partner,
      message: 'Partenaire mis à jour avec succès',
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
        message: 'Partenaire non trouvé',
      });
      return;
    }

    const existing = await Partner.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Partenaire non trouvé',
      });
      return;
    }

    await Partner.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      data: null,
      message: 'Partenaire supprimé avec succès',
    });
  } catch (error) {
    next(error);
  }
};
