import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../types';
import Result from '../models/Result.model';
import Event from '../models/Event.model';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const category = (req.query.category as string) || '';
    const sort = (req.query.sort as string) || 'desc';
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { eventName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    const sortDirection = sort === 'asc' ? 1 : -1;

    const [results, total] = await Promise.all([
      Result.find(filter).skip(skip).limit(limit).sort({ date: sortDirection }),
      Result.countDocuments(filter),
    ]);

    // Sort teams by position within each result
    const resultsWithSortedTeams = results.map((r) => {
      const obj = r.toObject();
      obj.teams = obj.teams.sort(
        (a: { position?: number }, b: { position?: number }) =>
          (a.position ?? 999) - (b.position ?? 999)
      );
      return obj;
    });

    res.status(200).json({
      success: true,
      data: {
        data: resultsWithSortedTeams,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      message: 'Résultats récupérés avec succès',
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
        message: 'Résultat non trouvé',
      });
      return;
    }

    const result = await Result.findById(id).populate('eventId');

    if (!result) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Résultat non trouvé',
      });
      return;
    }

    const obj = result.toObject();
    obj.teams = obj.teams.sort(
      (a: { position?: number }, b: { position?: number }) =>
        (a.position ?? 999) - (b.position ?? 999)
    );

    // Expose populated event under "event" key for compatibility
    const responseData = { ...obj, event: obj.eventId };

    res.status(200).json({
      success: true,
      data: responseData,
      message: 'Résultat récupéré avec succès',
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
    const { eventId, eventName, date, category, teams } = req.body;

    if (!eventId || !eventName || !date || !category) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'eventId, eventName, date et category sont requis',
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Événement non trouvé',
      });
      return;
    }

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Événement non trouvé',
      });
      return;
    }

    const teamsData = Array.isArray(teams)
      ? teams.map((t: { name: string; score: number; position?: number }) => ({
          name: t.name,
          score: t.score,
          position: t.position ?? undefined,
        }))
      : [];

    const result = await Result.create({
      eventId,
      eventName,
      date: new Date(date),
      category,
      teams: teamsData,
    });

    const populated = await Result.findById(result._id).populate('eventId');
    const obj = populated!.toObject();
    obj.teams = obj.teams.sort(
      (a: { position?: number }, b: { position?: number }) =>
        (a.position ?? 999) - (b.position ?? 999)
    );

    res.status(201).json({
      success: true,
      data: { ...obj, event: obj.eventId },
      message: 'Résultat créé avec succès',
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
    const { eventId, eventName, date, category, teams } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Résultat non trouvé',
      });
      return;
    }

    const existing = await Result.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Résultat non trouvé',
      });
      return;
    }

    // If eventId is being changed, verify the new event exists
    if (eventId && eventId !== existing.eventId.toString()) {
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        res.status(404).json({
          success: false,
          error: 'NotFound',
          message: 'Événement non trouvé',
        });
        return;
      }
      const event = await Event.findById(eventId);
      if (!event) {
        res.status(404).json({
          success: false,
          error: 'NotFound',
          message: 'Événement non trouvé',
        });
        return;
      }
    }

    const updateData: Record<string, unknown> = {};
    if (eventId) updateData.eventId = eventId;
    if (eventName) updateData.eventName = eventName;
    if (date) updateData.date = new Date(date);
    if (category) updateData.category = category;
    if (teams !== undefined) {
      updateData.teams = Array.isArray(teams)
        ? teams.map((t: { name: string; score: number; position?: number }) => ({
            name: t.name,
            score: t.score,
            position: t.position ?? undefined,
          }))
        : [];
    }

    const updated = await Result.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate('eventId');

    const obj = updated!.toObject();
    obj.teams = obj.teams.sort(
      (a: { position?: number }, b: { position?: number }) =>
        (a.position ?? 999) - (b.position ?? 999)
    );

    res.status(200).json({
      success: true,
      data: { ...obj, event: obj.eventId },
      message: 'Résultat mis à jour avec succès',
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
        message: 'Résultat non trouvé',
      });
      return;
    }

    const existing = await Result.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Résultat non trouvé',
      });
      return;
    }

    await Result.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      data: null,
      message: 'Résultat supprimé avec succès',
    });
  } catch (error) {
    next(error);
  }
};
