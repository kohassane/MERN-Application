import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../types';
import Event from '../models/Event.model';
import Result from '../models/Result.model';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const category = (req.query.category as string) || '';
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    const [events, total] = await Promise.all([
      Event.find(filter).skip(skip).limit(limit).sort({ date: -1 }),
      Event.countDocuments(filter),
    ]);

    // Attach result counts
    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const resultCount = await Result.countDocuments({ eventId: event._id });
        return { ...event.toObject(), _count: { results: resultCount } };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        data: eventsWithCounts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      message: 'Événements récupérés avec succès',
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
        message: 'Événement non trouvé',
      });
      return;
    }

    const event = await Event.findById(id);

    if (!event) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Événement non trouvé',
      });
      return;
    }

    const results = await Result.find({ eventId: id }).sort({ date: -1 });

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
      data: { ...event.toObject(), results: resultsWithSortedTeams },
      message: 'Événement récupéré avec succès',
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
    const { title, date, location, category, description, imageUrl } = req.body;

    if (!title || !date || !location || !category || !description) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Titre, date, lieu, catégorie et description sont requis',
      });
      return;
    }

    const event = await Event.create({
      title,
      date: new Date(date),
      location,
      category,
      description,
      imageUrl: imageUrl || undefined,
    });

    res.status(201).json({
      success: true,
      data: { ...event.toObject(), _count: { results: 0 } },
      message: 'Événement créé avec succès',
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
    const { title, date, location, category, description, imageUrl } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Événement non trouvé',
      });
      return;
    }

    const existing = await Event.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Événement non trouvé',
      });
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (title) updateData.title = title;
    if (date) updateData.date = new Date(date);
    if (location) updateData.location = location;
    if (category) updateData.category = category;
    if (description) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || undefined;

    const event = await Event.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    const resultCount = await Result.countDocuments({ eventId: id });

    res.status(200).json({
      success: true,
      data: { ...event!.toObject(), _count: { results: resultCount } },
      message: 'Événement mis à jour avec succès',
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
        message: 'Événement non trouvé',
      });
      return;
    }

    const existing = await Event.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Événement non trouvé',
      });
      return;
    }

    await Event.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      data: null,
      message: 'Événement supprimé avec succès',
    });
  } catch (error) {
    next(error);
  }
};
