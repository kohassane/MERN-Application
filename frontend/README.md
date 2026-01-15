# Sport Ivoirien - Frontend

Interface utilisateur React pour la plateforme institutionnelle ivoirienne dédiée au sport scolaire.

## 🚀 Fonctionnalités

- **Interface moderne et responsive** - Design adaptatif pour tous les appareils
- **Identité visuelle nationale** - Couleurs orange, blanc et vert de la Côte d'Ivoire
- **Gestion des événements** - Calendrier et détails des compétitions sportives
- **Résultats en temps réel** - Affichage des résultats avec filtres et recherche
- **E-commerce intégré** - Boutique en ligne pour équipements sportifs
- **Présentation des partenaires** - Showcase des sponsors et partenaires
- **Système d'actualités** - News et annonces importantes
- **Authentification** - Connexion et gestion des utilisateurs
- **Multilingue** - Support français et anglais
- **Optimisé SEO** - Métadonnées et structure optimisées

## 🛠️ Technologies

- **React 18** - Bibliothèque UI avec hooks
- **TypeScript** - Typage statique
- **Vite** - Build tool rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **React Router** - Navigation côté client
- **Axios** - Client HTTP pour API
- **Lucide React** - Icônes modernes
- **React Query** - Gestion d'état serveur (optionnel)

## 📦 Installation

1. **Installer les dépendances**
```bash
cd frontend
npm install
```

2. **Configuration**
```bash
cp .env.example .env
# Modifier VITE_API_URL selon votre configuration backend
```

3. **Démarrer le serveur de développement**
```bash
npm run dev
```

4. **Build pour la production**
```bash
npm run build
```

## 🏗️ Structure du projet

```
frontend/
├── public/                 # Fichiers statiques
├── src/
│   ├── components/        # Composants réutilisables
│   │   ├── ui/           # Composants UI de base
│   │   ├── layout/       # Header, Footer, Navigation
│   │   ├── home/         # Composants page d'accueil
│   │   └── shop/         # Composants e-commerce
│   ├── pages/            # Pages principales
│   ├── services/         # Services API
│   ├── hooks/            # Hooks personnalisés
│   ├── context/          # Contextes React
│   ├── types/            # Types TypeScript
│   ├── data/             # Données de démonstration
│   └── styles/           # Styles globaux
├── .env.example          # Variables d'environnement
└── README.md
```

## 🎨 Design System

### Couleurs principales
- **Orange**: `#FF8200` (Couleur nationale)
- **Vert**: `#009E60` (Couleur nationale)
- **Blanc**: `#FFFFFF` (Couleur nationale)

### Typographie
- **Titres**: Montserrat (600-700)
- **Corps**: Open Sans (400-500)

### Composants UI
- **Button** - Boutons avec variantes (primary, secondary, outline)
- **Card** - Cartes avec image, contenu et footer
- **Badge** - Étiquettes colorées pour catégories
- **Modal** - Fenêtres modales réutilisables

## 🔌 Intégration API

Le frontend communique avec le backend via des services API centralisés :

```typescript
// Exemple d'utilisation
import { eventsAPI } from '../services/api';
import { useAPI } from '../hooks/useAPI';

const { data, loading, error } = useAPI(() => eventsAPI.getAll());
```

### Services disponibles
- `eventsAPI` - Gestion des événements
- `resultsAPI` - Résultats sportifs
- `productsAPI` - Produits e-commerce
- `partnersAPI` - Partenaires
- `newsAPI` - Actualités
- `authAPI` - Authentification
- `uploadAPI` - Upload de fichiers

## 🔐 Authentification

Le système d'authentification utilise JWT avec un contexte React :

```typescript
import { useAuth } from '../context/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();
```

## 📱 Responsive Design

Le design s'adapte automatiquement aux différentes tailles d'écran :

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🌐 Internationalisation

Support multilingue avec basculement français/anglais dans le header.

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Aperçu de production
```bash
npm run preview
```

### Variables d'environnement de production
```bash
VITE_API_URL=https://api.votre-domaine.com/api
VITE_APP_NAME=Sport Ivoirien
VITE_FRONTEND_URL=https://votre-domaine.com
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:coverage

# Tests E2E
npm run test:e2e
```

## 📊 Performance

- **Lazy loading** des images
- **Code splitting** par routes
- **Optimisation des bundles** avec Vite
- **Mise en cache** des requêtes API
- **Compression** des assets

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Respectez les conventions de code (ESLint + Prettier)
4. Ajoutez des tests si nécessaire
5. Committez vos changements
6. Poussez vers la branche
7. Ouvrez une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.