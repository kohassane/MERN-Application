# Sport Ivoirien - Backend API

API REST pour la plateforme institutionnelle ivoirienne dédiée au sport scolaire.

## 🚀 Fonctionnalités

- **Gestion des événements sportifs** - CRUD complet avec filtres et pagination
- **Résultats sportifs** - Affichage et gestion des résultats de compétitions
- **E-commerce** - Gestion des produits avec catégories et stock
- **Partenaires** - Système de partenariat avec niveaux (Platinum, Gold, Silver, Bronze)
- **Actualités** - Système de news avec catégories et tags
- **Authentification** - JWT avec rôles utilisateurs
- **Upload de fichiers** - Gestion des images avec validation
- **Sécurité** - Rate limiting, CORS, validation des données

## 🛠️ Technologies

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **JWT** - Authentification
- **Multer** - Upload de fichiers
- **bcryptjs** - Hashage des mots de passe
- **express-validator** - Validation des données
- **helmet** - Sécurité HTTP
- **cors** - Cross-Origin Resource Sharing
- **morgan** - Logging des requêtes

## 📦 Installation

1. **Installer les dépendances**
```bash
cd backend
npm install
```

2. **Configuration**
```bash
cp .env.example .env
# Modifier les variables d'environnement selon vos besoins
```

3. **Créer le dossier uploads**
```bash
mkdir uploads
```

4. **Démarrer le serveur**
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## 🔗 Endpoints API

### Événements
- `GET /api/events` - Liste des événements
- `GET /api/events/:id` - Détails d'un événement
- `POST /api/events` - Créer un événement
- `PUT /api/events/:id` - Modifier un événement
- `DELETE /api/events/:id` - Supprimer un événement
- `GET /api/events/meta/categories` - Catégories d'événements

### Résultats
- `GET /api/results` - Liste des résultats
- `GET /api/results/:id` - Détails d'un résultat
- `POST /api/results` - Créer un résultat
- `GET /api/results/stats/summary` - Statistiques des résultats

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit
- `GET /api/products/meta/categories` - Catégories de produits

### Partenaires
- `GET /api/partners` - Liste des partenaires
- `GET /api/partners/:id` - Détails d'un partenaire
- `POST /api/partners` - Créer un partenaire
- `GET /api/partners/stats/tiers` - Statistiques par niveau

### Actualités
- `GET /api/news` - Liste des actualités
- `GET /api/news/:id` - Détails d'une actualité
- `POST /api/news` - Créer une actualité
- `GET /api/news/meta/categories` - Catégories d'actualités

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/profile` - Profil utilisateur
- `POST /api/auth/logout` - Déconnexion

### Upload
- `POST /api/upload/image` - Upload d'une image
- `POST /api/upload/multiple` - Upload de plusieurs images

### Santé
- `GET /api/health` - Vérification de l'état du serveur

## 📝 Paramètres de requête

### Filtres communs
- `page` - Numéro de page (défaut: 1)
- `limit` - Nombre d'éléments par page (défaut: 10)
- `sortBy` - Champ de tri
- `sortOrder` - Ordre de tri (asc/desc)

### Filtres spécifiques
- **Événements**: `category`, `status`
- **Résultats**: `category`, `eventId`
- **Produits**: `category`, `featured`, `inStock`, `minPrice`, `maxPrice`, `search`
- **Partenaires**: `tier`, `isActive`
- **Actualités**: `category`, `featured`, `published`, `author`, `search`

## 🔒 Authentification

L'API utilise JWT pour l'authentification. Incluez le token dans l'en-tête Authorization :

```
Authorization: Bearer <votre-token-jwt>
```

## 📊 Format des réponses

### Succès
```json
{
  "success": true,
  "data": {...},
  "message": "Message de succès",
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

### Erreur
```json
{
  "success": false,
  "error": "Message d'erreur",
  "errors": [...]
}
```

## 🚀 Déploiement

1. **Variables d'environnement de production**
```bash
NODE_ENV=production
PORT=5000
JWT_SECRET=votre-clé-secrète-sécurisée
FRONTEND_URL=https://votre-domaine.com
```

2. **Commandes de déploiement**
```bash
npm install --production
npm start
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.