import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Sample news data
let news = [
  {
    id: '1',
    title: 'Ouverture des inscriptions pour le championnat national',
    summary: 'Les inscriptions pour le championnat national des écoles sont désormais ouvertes.',
    content: 'Le Ministère de l\'Éducation Nationale en collaboration avec la Fédération Ivoirienne du Sport Scolaire annonce l\'ouverture des inscriptions pour le championnat national des écoles. Toutes les écoles souhaitant participer sont invitées à s\'inscrire avant le 15 janvier 2025.',
    date: '2024-12-01',
    imageUrl: 'https://images.pexels.com/photos/159510/sport-tug-of-war-twins-war-159510.jpeg',
    author: 'Comité d\'Organisation',
    category: 'Annonces',
    published: true,
    featured: true,
    tags: ['inscription', 'championnat', 'national'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Nouveaux équipements pour les écoles participantes',
    summary: 'Distribution de nouveaux équipements sportifs aux écoles participantes.',
    content: 'Grâce à nos partenaires, nous sommes heureux d\'annoncer la distribution de nouveaux équipements sportifs à toutes les écoles participant aux championnats nationaux cette année. Ces équipements comprennent des ballons, des maillots et divers matériels d\'entraînement.',
    date: '2024-11-15',
    imageUrl: 'https://images.pexels.com/photos/8224760/pexels-photo-8224760.jpeg',
    author: 'Direction du Sport Scolaire',
    category: 'Équipements',
    published: true,
    featured: false,
    tags: ['équipements', 'partenaires', 'distribution'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/news - Récupérer toutes les actualités
router.get('/', (req, res) => {
  try {
    const { 
      category, 
      featured, 
      published, 
      author,
      search,
      limit, 
      page = 1,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;
    
    let filteredNews = [...news];

    // Filtrer par catégorie
    if (category) {
      filteredNews = filteredNews.filter(article => 
        article.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filtrer par articles vedettes
    if (featured !== undefined) {
      filteredNews = filteredNews.filter(article => 
        article.featured === (featured === 'true')
      );
    }

    // Filtrer par statut de publication
    if (published !== undefined) {
      filteredNews = filteredNews.filter(article => 
        article.published === (published === 'true')
      );
    }

    // Filtrer par auteur
    if (author) {
      filteredNews = filteredNews.filter(article => 
        article.author.toLowerCase().includes(author.toLowerCase())
      );
    }

    // Recherche textuelle
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredNews = filteredNews.filter(article => 
        article.title.toLowerCase().includes(searchTerm) ||
        article.summary.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm)
      );
    }

    // Tri
    filteredNews.sort((a, b) => {
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
    const paginatedNews = filteredNews.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedNews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredNews.length / pageSize),
        totalItems: filteredNews.length,
        itemsPerPage: pageSize
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des actualités'
    });
  }
});

// GET /api/news/:id - Récupérer une actualité spécifique
router.get('/:id', (req, res) => {
  try {
    const article = news.find(n => n.id === req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Actualité non trouvée'
      });
    }

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de l\'actualité'
    });
  }
});

// POST /api/news - Créer une nouvelle actualité
router.post('/', [
  body('title').notEmpty().withMessage('Le titre est requis'),
  body('summary').notEmpty().withMessage('Le résumé est requis'),
  body('content').notEmpty().withMessage('Le contenu est requis'),
  body('author').notEmpty().withMessage('L\'auteur est requis'),
  body('category').notEmpty().withMessage('La catégorie est requise')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const newArticle = {
      id: (news.length + 1).toString(),
      ...req.body,
      date: req.body.date || new Date().toISOString().split('T')[0],
      published: req.body.published !== undefined ? req.body.published : true,
      featured: req.body.featured || false,
      tags: req.body.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    news.push(newArticle);

    res.status(201).json({
      success: true,
      data: newArticle,
      message: 'Actualité créée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de l\'actualité'
    });
  }
});

// GET /api/news/meta/categories - Récupérer toutes les catégories
router.get('/meta/categories', (req, res) => {
  try {
    const categories = [...new Set(news.map(article => article.category))];
    
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