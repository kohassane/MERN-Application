import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Sample results data
let results = [
  {
    id: '1',
    eventId: '1',
    eventName: 'Championnat National de Football',
    date: '2025-02-10',
    category: 'Football',
    teams: [
      { name: 'Lycée Classique d\'Abidjan', score: 3, position: 1 },
      { name: 'Collège Saint Viateur', score: 1, position: 2 },
      { name: 'Lycée Sainte Marie', score: 0, position: 3 }
    ],
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    eventId: '2',
    eventName: 'Tournoi de Basketball Interscolaire',
    date: '2025-01-15',
    category: 'Basketball',
    teams: [
      { name: 'Lycée Technique d\'Abidjan', score: 76, position: 1 },
      { name: 'Collège International', score: 68, position: 2 },
      { name: 'Lycée Moderne de Treichville', score: 62, position: 3 }
    ],
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/results - Récupérer tous les résultats
router.get('/', (req, res) => {
  try {
    const { category, eventId, limit, page = 1, sortBy = 'date', sortOrder = 'desc' } = req.query;
    let filteredResults = [...results];

    // Filtrer par catégorie
    if (category) {
      filteredResults = filteredResults.filter(result => 
        result.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filtrer par événement
    if (eventId) {
      filteredResults = filteredResults.filter(result => result.eventId === eventId);
    }

    // Tri
    filteredResults.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    // Pagination
    const pageSize = parseInt(limit) || 10;
    const startIndex = (parseInt(page) - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = filteredResults.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedResults,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredResults.length / pageSize),
        totalItems: filteredResults.length,
        itemsPerPage: pageSize
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des résultats'
    });
  }
});

// GET /api/results/:id - Récupérer un résultat spécifique
router.get('/:id', (req, res) => {
  try {
    const result = results.find(r => r.id === req.params.id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Résultat non trouvé'
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du résultat'
    });
  }
});

// POST /api/results - Créer un nouveau résultat
router.post('/', [
  body('eventId').notEmpty().withMessage('L\'ID de l\'événement est requis'),
  body('eventName').notEmpty().withMessage('Le nom de l\'événement est requis'),
  body('date').isISO8601().withMessage('Date invalide'),
  body('category').notEmpty().withMessage('La catégorie est requise'),
  body('teams').isArray({ min: 1 }).withMessage('Au moins une équipe est requise')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const newResult = {
      id: (results.length + 1).toString(),
      ...req.body,
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    results.push(newResult);

    res.status(201).json({
      success: true,
      data: newResult,
      message: 'Résultat créé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création du résultat'
    });
  }
});

// GET /api/results/stats/summary - Statistiques générales
router.get('/stats/summary', (req, res) => {
  try {
    const totalResults = results.length;
    const categories = [...new Set(results.map(r => r.category))];
    const recentResults = results
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    const stats = {
      totalResults,
      totalCategories: categories.length,
      categories,
      recentResults: recentResults.map(r => ({
        id: r.id,
        eventName: r.eventName,
        date: r.date,
        category: r.category,
        winner: r.teams.find(t => t.position === 1)?.name
      }))
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques'
    });
  }
});

export default router;