import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Sample products data
let products = [
  {
    id: '1',
    name: 'Maillot Officiel Équipe Nationale',
    description: 'Maillot officiel aux couleurs nationales, parfait pour supporter votre équipe.',
    price: 15000,
    imageUrl: 'https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg',
    category: 'Vêtements',
    inStock: true,
    stockQuantity: 50,
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Orange', 'Blanc', 'Vert'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Ballon de Football',
    description: 'Ballon de football réglementaire pour les compétitions scolaires.',
    price: 8000,
    imageUrl: 'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg',
    category: 'Équipement',
    inStock: true,
    stockQuantity: 25,
    featured: false,
    specifications: {
      size: 5,
      material: 'Cuir synthétique',
      weight: '410-450g'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/products - Récupérer tous les produits
router.get('/', (req, res) => {
  try {
    const { 
      category, 
      featured, 
      inStock, 
      minPrice, 
      maxPrice, 
      search,
      limit, 
      page = 1,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    let filteredProducts = [...products];

    // Filtrer par catégorie
    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filtrer par produits vedettes
    if (featured !== undefined) {
      filteredProducts = filteredProducts.filter(product => 
        product.featured === (featured === 'true')
      );
    }

    // Filtrer par disponibilité
    if (inStock !== undefined) {
      filteredProducts = filteredProducts.filter(product => 
        product.inStock === (inStock === 'true')
      );
    }

    // Filtrer par prix
    if (minPrice) {
      filteredProducts = filteredProducts.filter(product => 
        product.price >= parseInt(minPrice)
      );
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => 
        product.price <= parseInt(maxPrice)
      );
    }

    // Recherche textuelle
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    // Tri
    filteredProducts.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'price') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortBy === 'createdAt') {
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
    const pageSize = parseInt(limit) || 12;
    const startIndex = (parseInt(page) - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredProducts.length / pageSize),
        totalItems: filteredProducts.length,
        itemsPerPage: pageSize
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des produits'
    });
  }
});

// GET /api/products/:id - Récupérer un produit spécifique
router.get('/:id', (req, res) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du produit'
    });
  }
});

// POST /api/products - Créer un nouveau produit
router.post('/', [
  body('name').notEmpty().withMessage('Le nom du produit est requis'),
  body('description').notEmpty().withMessage('La description est requise'),
  body('price').isNumeric().withMessage('Le prix doit être un nombre'),
  body('category').notEmpty().withMessage('La catégorie est requise'),
  body('stockQuantity').isInt({ min: 0 }).withMessage('La quantité en stock doit être un nombre positif')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const newProduct = {
      id: (products.length + 1).toString(),
      ...req.body,
      inStock: req.body.stockQuantity > 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.push(newProduct);

    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Produit créé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création du produit'
    });
  }
});

// GET /api/products/meta/categories - Récupérer toutes les catégories
router.get('/meta/categories', (req, res) => {
  try {
    const categories = [...new Set(products.map(product => product.category))];
    
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