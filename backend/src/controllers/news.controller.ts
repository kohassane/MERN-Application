import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../types';
import News from '../models/News.model';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const [articles, total] = await Promise.all([
      News.find(filter).skip(skip).limit(limit).sort({ date: -1 }),
      News.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        data: articles,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      message: 'Actualités récupérées avec succès',
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
        message: 'Article non trouvé',
      });
      return;
    }

    const article = await News.findById(id);

    if (!article) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Article non trouvé',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: article,
      message: 'Article récupéré avec succès',
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
    const { title, summary, content, date, imageUrl, author } = req.body;

    if (!title || !summary || !content || !date || !author) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Titre, résumé, contenu, date et auteur sont requis',
      });
      return;
    }

    const article = await News.create({
      title,
      summary,
      content,
      date: new Date(date),
      imageUrl: imageUrl || undefined,
      author,
    });

    res.status(201).json({
      success: true,
      data: article,
      message: 'Article créé avec succès',
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
    const { title, summary, content, date, imageUrl, author } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Article non trouvé',
      });
      return;
    }

    const existing = await News.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Article non trouvé',
      });
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (title) updateData.title = title;
    if (summary) updateData.summary = summary;
    if (content) updateData.content = content;
    if (date) updateData.date = new Date(date);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || undefined;
    if (author) updateData.author = author;

    const article = await News.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    res.status(200).json({
      success: true,
      data: article,
      message: 'Article mis à jour avec succès',
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
        message: 'Article non trouvé',
      });
      return;
    }

    const existing = await News.findById(id);
    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Article non trouvé',
      });
      return;
    }

    await News.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      data: null,
      message: 'Article supprimé avec succès',
    });
  } catch (error) {
    next(error);
  }
};
