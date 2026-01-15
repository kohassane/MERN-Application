import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Sample events data (remplacez par une vraie base de données)
let events = [
  {
    id: '1',
    title: 'Championnat National de Football',
    date: '2025-03-15',
    location: 'Stade Félix Houphouët-Boigny, Abidjan',
    category: 'Football',
    description: 'Le championnat national des écoles secondaires verra s\'affronter les meilleures équipes du pays.',
    imageUrl: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
    status: 'upcoming',
    maxParticipants: 32,
    currentParticipants: 24,
    registrationDeadline: '2025-02-15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Tournoi de Basketball Interscolaire',
    date: '2025-04-10',
    location: 'Palais des Sports, Treichville',
    category: 'Basketball',
    description: 'Tournoi annuel réunissant les meilleures équipes de basketball des écoles de tout le pays.',
    imageUrl: 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg',
    status: 'upcoming',
    maxParticipants: 16,
    currentParticipants: 12,
    registrationDeadline: '2025-03-10',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/events - Récupérer tous les événements
router.get('/', (req, res) => {
  try {
    const { category, status, limit, page = 1 } = req.query;
    let filteredEvents = [...events];

    // Filtrer par catégorie
    if (category) {
      filteredEvents = filteredEvents.filter(event => 
        event.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filtrer par statut
    if (status) {
      filteredEvents = filteredEvents.filter(event => event.status === status);
    }

    // Pagination
    const pageSize = parseInt(limit) || 10;
    const startIndex = (parseInt(page) - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedEvents,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredEvents.length / pageSize),
        totalItems: filteredEvents.length,
        itemsPerPage: pageSize
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des événements'
    });
  }
});

// GET /api/events/:id - Récupérer un événement spécifique
router.get('/:id', (req, res) => {
  try {
    const event = events.find(e => e.id === req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Événement non trouvé'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de l\'événement'
    });
  }
});

// POST /api/events - Créer un nouvel événement
router.post('/', [
  body('title').notEmpty().withMessage('Le titre est requis'),
  body('date').isISO8601().withMessage('Date invalide'),
  body('location').notEmpty().withMessage('Le lieu est requis'),
  body('category').notEmpty().withMessage('La catégorie est requise'),
  body('description').notEmpty().withMessage('La description est requise')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const newEvent = {
      id: (events.length + 1).toString(),
      ...req.body,
      status: 'upcoming',
      currentParticipants: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    events.push(newEvent);

    res.status(201).json({
      success: true,
      data: newEvent,
      message: 'Événement créé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de l\'événement'
    });
  }
});

// PUT /api/events/:id - Mettre à jour un événement
router.put('/:id', [
  body('title').optional().notEmpty().withMessage('Le titre ne peut pas être vide'),
  body('date').optional().isISO8601().withMessage('Date invalide'),
  body('location').optional().notEmpty().withMessage('Le lieu ne peut pas être vide')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const eventIndex = events.findIndex(e => e.id === req.params.id);
    
    if (eventIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Événement non trouvé'
      });
    }

    events[eventIndex] = {
      ...events[eventIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: events[eventIndex],
      message: 'Événement mis à jour avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour de l\'événement'
    });
  }
});

// DELETE /api/events/:id - Supprimer un événement
router.delete('/:id', (req, res) => {
  try {
    const eventIndex = events.findIndex(e => e.id === req.params.id);
    
    if (eventIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Événement non trouvé'
      });
    }

    events.splice(eventIndex, 1);

    res.json({
      success: true,
      message: 'Événement supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression de l\'événement'
    });
  }
});

// GET /api/events/categories - Récupérer toutes les catégories
router.get('/meta/categories', (req, res) => {
  try {
    const categories = [...new Set(events.map(event => event.category))];
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des catégories'
    });
  }
});

export default router;