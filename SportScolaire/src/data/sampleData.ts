import { SportEvent, SportResult, Product, Partner, NewsItem } from '../types';

export const sampleEvents: SportEvent[] = [
  {
    id: '1',
    title: 'Championnat National de Football',
    date: '2025-03-15',
    location: 'Stade Félix Houphouët-Boigny, Abidjan',
    category: 'Football',
    description: 'Le championnat national des écoles secondaires verra s\'affronter les meilleures équipes du pays.',
    imageUrl: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
  },
  {
    id: '2',
    title: 'Tournoi de Basketball Interscolaire',
    date: '2025-04-10',
    location: 'Palais des Sports, Treichville',
    category: 'Basketball',
    description: 'Tournoi annuel réunissant les meilleures équipes de basketball des écoles de tout le pays.',
    imageUrl: 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg',
  },
  {
    id: '3',
    title: 'Compétition d\'Athlétisme',
    date: '2025-05-22',
    location: 'Stade FHB, Abidjan',
    category: 'Athlétisme',
    description: 'Course, saut et lancer pour déterminer les meilleurs athlètes scolaires du pays.',
    imageUrl: 'https://images.pexels.com/photos/34514/spot-runs-start-la.jpg',
  },
  {
    id: '4',
    title: 'Tournoi de Volleyball',
    date: '2025-06-05',
    location: 'Complexe Sportif, Yamoussoukro',
    category: 'Volleyball',
    description: 'Les meilleures équipes féminines et masculines s\'affrontent dans ce tournoi national.',
    imageUrl: 'https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg',
  },
];

export const sampleResults: SportResult[] = [
  {
    id: '1',
    eventId: '1',
    eventName: 'Championnat National de Football',
    date: '2025-02-10',
    category: 'Football',
    teams: [
      { name: 'Lycée Classique d\'Abidjan', score: 3, position: 1 },
      { name: 'Collège Saint Viateur', score: 1, position: 2 },
      { name: 'Lycée Sainte Marie', score: 0, position: 3 },
    ],
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
      { name: 'Lycée Moderne de Treichville', score: 62, position: 3 },
    ],
  },
  {
    id: '3',
    eventId: '3',
    eventName: 'Compétition d\'Athlétisme',
    date: '2025-01-30',
    category: 'Athlétisme',
    teams: [
      { name: 'Lycée Moderne de Cocody', score: 95, position: 1 },
      { name: 'Collège Notre Dame', score: 88, position: 2 },
      { name: 'Lycée Municipal d\'Attécoubé', score: 75, position: 3 },
    ],
  },
];

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Maillot Officiel Équipe Nationale',
    description: 'Maillot officiel aux couleurs nationales, parfait pour supporter votre équipe.',
    price: 15000,
    imageUrl: 'https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg',
    category: 'Vêtements',
    inStock: true,
    featured: true,
  },
  {
    id: '2',
    name: 'Ballon de Football',
    description: 'Ballon de football réglementaire pour les compétitions scolaires.',
    price: 8000,
    imageUrl: 'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg',
    category: 'Équipement',
    inStock: true,
  },
  {
    id: '3',
    name: 'Short Sportif',
    description: 'Short confortable pour la pratique de tous les sports.',
    price: 5000,
    imageUrl: 'https://images.pexels.com/photos/9397326/pexels-photo-9397326.jpeg',
    category: 'Vêtements',
    inStock: true,
  },
  {
    id: '4',
    name: 'Chaussures de Sport',
    description: 'Chaussures polyvalentes pour toutes les activités sportives.',
    price: 25000,
    imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    category: 'Chaussures',
    inStock: true,
    featured: true,
  },
];

export const samplePartners: Partner[] = [
  {
    id: '1',
    name: 'Ministère des Sports',
    description: 'Le ministère des Sports de Côte d\'Ivoire soutient activement le développement du sport scolaire.',
    logoUrl: 'https://images.pexels.com/photos/2453551/pexels-photo-2453551.jpeg',
    websiteUrl: 'https://www.sports.gouv.ci',
    tier: 'platinum',
  },
  {
    id: '2',
    name: 'MTN Côte d\'Ivoire',
    description: 'Partenaire officiel des communications pour les événements sportifs scolaires.',
    logoUrl: 'https://images.pexels.com/photos/2529973/pexels-photo-2529973.jpeg',
    websiteUrl: 'https://www.mtn.ci',
    tier: 'gold',
  },
  {
    id: '3',
    name: 'CNPS',
    description: 'La Caisse Nationale de Prévoyance Sociale soutient le sport comme vecteur de cohésion sociale.',
    logoUrl: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg',
    websiteUrl: 'https://www.cnps.ci',
    tier: 'silver',
  },
  {
    id: '4',
    name: 'Solibra',
    description: 'Fournisseur officiel des boissons pour les événements sportifs scolaires.',
    logoUrl: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
    websiteUrl: 'https://www.solibra.ci',
    tier: 'bronze',
  },
];

export const sampleNews: NewsItem[] = [
  {
    id: '1',
    title: 'Ouverture des inscriptions pour le championnat national',
    summary: 'Les inscriptions pour le championnat national des écoles sont désormais ouvertes.',
    content: 'Le Ministère de l\'Éducation Nationale en collaboration avec la Fédération Ivoirienne du Sport Scolaire annonce l\'ouverture des inscriptions pour le championnat national des écoles. Toutes les écoles souhaitant participer sont invitées à s\'inscrire avant le 15 janvier 2025.',
    date: '2024-12-01',
    imageUrl: 'https://images.pexels.com/photos/159510/sport-tug-of-war-twins-war-159510.jpeg',
    author: 'Comité d\'Organisation',
  },
  {
    id: '2',
    title: 'Nouveaux équipements pour les écoles participantes',
    summary: 'Distribution de nouveaux équipements sportifs aux écoles participantes.',
    content: 'Grâce à nos partenaires, nous sommes heureux d\'annoncer la distribution de nouveaux équipements sportifs à toutes les écoles participant aux championnats nationaux cette année. Ces équipements comprennent des ballons, des maillots et divers matériels d\'entraînement.',
    date: '2024-11-15',
    imageUrl: 'https://images.pexels.com/photos/8224760/pexels-photo-8224760.jpeg',
    author: 'Direction du Sport Scolaire',
  },
];