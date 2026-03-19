import { Request, Response, NextFunction } from 'express';
import Event from '../models/Event.model';
import Product from '../models/Product.model';
import News from '../models/News.model';
import Result from '../models/Result.model';

export const search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const q = (req.query.q as string) || '';

    if (!q || q.trim().length < 2) {
      res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Le terme de recherche doit contenir au moins 2 caractères',
      });
      return;
    }

    const term = q.trim();
    const regex = { $regex: term, $options: 'i' };

    // Run searches in parallel across all entities
    const [events, products, news, results] = await Promise.all([
      Event.find({
        $or: [
          { title: regex },
          { location: regex },
          { description: regex },
          { category: regex },
        ],
      })
        .limit(10)
        .sort({ date: -1 }),
      Product.find({
        $or: [
          { name: regex },
          { description: regex },
          { category: regex },
        ],
      })
        .limit(10)
        .sort({ createdAt: -1 }),
      News.find({
        $or: [
          { title: regex },
          { summary: regex },
          { content: regex },
          { author: regex },
        ],
      })
        .limit(10)
        .sort({ date: -1 }),
      Result.find({
        $or: [
          { eventName: regex },
          { category: regex },
        ],
      })
        .limit(10)
        .sort({ date: -1 }),
    ]);

    const totalResults = events.length + products.length + news.length + results.length;

    res.status(200).json({
      success: true,
      data: {
        query: term,
        total: totalResults,
        results: {
          events: {
            data: events,
            count: events.length,
          },
          products: {
            data: products,
            count: products.length,
          },
          news: {
            data: news,
            count: news.length,
          },
          results: {
            data: results,
            count: results.length,
          },
        },
      },
      message: `${totalResults} résultat(s) trouvé(s) pour "${term}"`,
    });
  } catch (error) {
    next(error);
  }
};
