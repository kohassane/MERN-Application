import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Sample partners data
let partners = [
  {
    id: '1',
    name: 'Ministère des Sports',
    description: 'Le ministère des Sports de Côte d\'Ivoire soutient activement le développement du sport scolaire.',
    logoUrl: 'https://images.pexels.com/photos/2453551/pexels-photo-2453551.jpeg',
    websiteUrl: 'https://www.sports.gouv.ci',
    tier: 'platinum',
    contactEmail: 'contact@sports.gouv.ci',
    contactPhone: '+225 27 20 30 40 50',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Orange Côte d\'Ivoire',
    description: 'Partenaire officiel des communications pour les événements sportifs scolaires.',
    logoUrl: 'https://images.pexels.com/photos/2529973/pexels-photo-2529973.jpeg',
    websiteUrl: 'https://www.orange.ci',
    tier: 'gold',
    contactEmail: 'partenariat@orange.ci',
    contactPhone: '+225 07 07 07 07',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/partners - Récupérer tous les partenaires
router.get('/', (req, res) => {
  try {
    const { tier, isActive, limit, page = 1 } = req.query;
    let filteredPartners = [...partners];

    // Filtrer par niveau de partenariat
    if (tier) {
      filteredPartners = filteredPartners.filter(partner => 
        partner.tier === tier
      );
    }

    // Filtrer par statut actif
    if (isActive !== undefined) {
      filteredPartners = filteredPartners.filter(partner => 
        partner.isActive === (isActive === 'true')
      );
    }

    // Tri par niveau de partenariat (platinum > gold > silver > bronze)
    const tierOrder = { platinum: 4, gold: 3, silver: 2, bronze: 1 };
    filteredPartners.sort((a, b) => tierOrder[b.tier] - tierOrder[a.tier]);

    // Pagination
    const pageSize = parseInt(limit) || 10;
    const startIndex = (parseInt(page) - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPartners = filteredPartners.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedPartners,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredPartners.length / pageSize),
        totalItems: filteredPartners.length,
        itemsPerPage: pageSize
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des partenaires'
    });
  }
});

// GET /api/partners/:id - Récupérer un partenaire spécifique
router.get('/:id', (req, res) => {
  try {
    const partner = partners.find(p => p.id === req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        error: 'Partenaire non trouvé'
      });
    }

    res.json({
      success: true,
      data: partner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du partenaire'
    });
  }
});

// POST /api/partners - Créer un nouveau partenaire
router.post('/', [
  body('name').notEmpty().withMessage('Le nom du partenaire est requis'),
  body('description').notEmpty().withMessage('La description est requise'),
  body('tier').isIn(['platinum', 'gold', 'silver', 'bronze']).withMessage('Niveau de partenariat invalide'),
  body('websiteUrl').isURL().withMessage('URL du site web invalide'),
  body('contactEmail').isEmail().withMessage('Email de contact invalide')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const newPartner = {
      id: (partners.length + 1).toString(),
      ...req.body,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    partners.push(newPartner);

    res.status(201).json({
      success: true,
      data: newPartner,
      message: 'Partenaire créé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création du partenaire'
    });
  }
});

// GET /api/partners/stats/tiers - Statistiques par niveau de partenariat
router.get('/stats/tiers', (req, res) => {
  try {
    const tierStats = partners.reduce((acc, partner) => {
      if (partner.isActive) {
        acc[partner.tier] = (acc[partner.tier] || 0) + 1;
      }
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        platinum: tierStats.platinum || 0,
        gold: tierStats.gold || 0,
        silver: tierStats.silver || 0,
        bronze: tierStats.bronze || 0,
        total: partners.filter(p => p.isActive).length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques'
    });
  }
});

export default router;