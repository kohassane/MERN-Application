import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.teamResult.deleteMany();
  await prisma.result.deleteMany();
  await prisma.event.deleteMany();
  await prisma.product.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.news.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin@2024', 12);
  const admin = await prisma.user.create({
    data: {
      identifiant: 'admin',
      email: 'admin@oissu.ci',
      password: hashedPassword,
      role: 'DIRECTEUR_GENERAL',
      firstName: 'Administrateur',
      lastName: 'OISSU',
      isActive: true,
    },
  });
  console.log('Admin user created:', admin.identifiant);

  // Create events
  const event1 = await prisma.event.create({
    data: {
      title: 'Championnat Scolaire de Football 2024',
      date: new Date('2024-03-15T09:00:00Z'),
      location: 'Stade Félix Houphouët-Boigny, Abidjan',
      category: 'Football',
      description:
        "Le championnat scolaire de football réunit les meilleures équipes des lycées et collèges de Côte d'Ivoire pour une compétition de haut niveau.",
      imageUrl: null,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Tournoi Universitaire de Basketball',
      date: new Date('2024-04-20T10:00:00Z'),
      location: 'Complexe Sportif de Treichville, Abidjan',
      category: 'Basketball',
      description:
        "Le tournoi universitaire de basketball oppose les équipes des universités publiques et privées de Côte d'Ivoire.",
      imageUrl: null,
    },
  });

  const event3 = await prisma.event.create({
    data: {
      title: "Championnat d'Athlétisme Scolaire",
      date: new Date('2024-05-10T08:00:00Z'),
      location: 'Stade de la Université FHB, Abidjan',
      category: 'Athlétisme',
      description:
        "Compétition d'athlétisme regroupant les talents des établissements scolaires de toutes les régions de Côte d'Ivoire.",
      imageUrl: null,
    },
  });

  const event4 = await prisma.event.create({
    data: {
      title: 'Tournoi de Volleyball Inter-Lycées',
      date: new Date('2024-06-05T09:00:00Z'),
      location: 'Salle Omnisports de Bouaké',
      category: 'Volleyball',
      description:
        "Le tournoi inter-lycées de volleyball est une compétition annuelle qui rassemble les équipes des établissements secondaires.",
      imageUrl: null,
    },
  });

  // suppress unused variable warnings
  void event3;

  console.log('Events created:', 4);

  // Create results with teams
  await prisma.result.create({
    data: {
      eventId: event1.id,
      eventName: 'Championnat Scolaire de Football 2024',
      date: new Date('2024-03-15T09:00:00Z'),
      category: 'Football',
      teams: {
        create: [
          { name: "Lycée Technique d'Abidjan", score: 3, position: 1 },
          { name: 'Lycée Sainte-Marie de Cocody', score: 1, position: 2 },
          { name: 'Lycée Municipal de Yopougon', score: 0, position: 3 },
          { name: "Lycée Classique d'Abidjan", score: 0, position: 4 },
        ],
      },
    },
  });

  await prisma.result.create({
    data: {
      eventId: event2.id,
      eventName: 'Tournoi Universitaire de Basketball',
      date: new Date('2024-04-20T10:00:00Z'),
      category: 'Basketball',
      teams: {
        create: [
          { name: 'Université FHB Abidjan', score: 78, position: 1 },
          { name: 'INPHB Yamoussoukro', score: 65, position: 2 },
          { name: 'Université Alassane Ouattara', score: 60, position: 3 },
        ],
      },
    },
  });

  await prisma.result.create({
    data: {
      eventId: event4.id,
      eventName: 'Tournoi de Volleyball Inter-Lycées',
      date: new Date('2024-06-05T09:00:00Z'),
      category: 'Volleyball',
      teams: {
        create: [
          { name: 'Lycée Moderne de Bouaké', score: 3, position: 1 },
          { name: 'Lycée Professionnel de Korhogo', score: 1, position: 2 },
          { name: 'Lycée Municipal de Daloa', score: 0, position: 3 },
        ],
      },
    },
  });

  console.log('Results created:', 3);

  // Create products
  await prisma.product.createMany({
    data: [
      {
        name: 'Maillot Officiel OISSU',
        description:
          "Maillot officiel de l'OISSU en polyester respirant, idéal pour les compétitions scolaires et universitaires.",
        price: 15000,
        imageUrl: null,
        category: 'Vêtements',
        inStock: true,
        featured: true,
      },
      {
        name: 'Ballon de Football Officiel',
        description:
          "Ballon de football homologué FIFA, utilisé lors des championnats scolaires organisés par l'OISSU.",
        price: 8000,
        imageUrl: null,
        category: 'Équipements',
        inStock: true,
        featured: true,
      },
      {
        name: 'Short de Sport OISSU',
        description:
          'Short de sport léger et confortable, disponible en plusieurs tailles pour les athlètes scolaires.',
        price: 5000,
        imageUrl: null,
        category: 'Vêtements',
        inStock: true,
        featured: false,
      },
      {
        name: 'Chaussures de Sport Multisports',
        description:
          'Chaussures de sport polyvalentes adaptées à plusieurs disciplines sportives pratiquées dans les établissements scolaires.',
        price: 25000,
        imageUrl: null,
        category: 'Chaussures',
        inStock: true,
        featured: true,
      },
    ],
  });

  console.log('Products created:', 4);

  // Create partners
  await prisma.partner.createMany({
    data: [
      {
        name: 'Ministère des Sports et du Cadre de Vie',
        description:
          "Partenaire institutionnel principal de l'OISSU, le Ministère des Sports soutient le développement du sport scolaire et universitaire en Côte d'Ivoire.",
        logoUrl: null,
        websiteUrl: 'https://www.sports.gouv.ci',
        tier: 'PLATINUM',
      },
      {
        name: "Orange Côte d'Ivoire",
        description:
          "Opérateur télécom partenaire de l'OISSU, Orange CI contribue à la digitalisation et à la communication des événements sportifs scolaires.",
        logoUrl: null,
        websiteUrl: 'https://www.orange.ci',
        tier: 'GOLD',
      },
      {
        name: 'Caisse Nationale de Prévoyance Sociale (CNPS)',
        description:
          "La CNPS accompagne l'OISSU dans la protection sociale des athlètes et du personnel impliqué dans le sport scolaire.",
        logoUrl: null,
        websiteUrl: 'https://www.cnps.ci',
        tier: 'SILVER',
      },
      {
        name: 'Solibra',
        description:
          "Partenaire privé de l'OISSU, Solibra soutient les événements sportifs scolaires et universitaires à travers le sponsoring.",
        logoUrl: null,
        websiteUrl: 'https://www.solibra.ci',
        tier: 'BRONZE',
      },
    ],
  });

  console.log('Partners created:', 4);

  // Create news
  await prisma.news.createMany({
    data: [
      {
        title: 'Lancement du Championnat Scolaire National 2024',
        summary:
          "L'OISSU lance officiellement la saison 2024 du Championnat Scolaire National avec plus de 500 établissements participants.",
        content: `L'Office Ivoirien du Sport Scolaire et Universitaire (OISSU) a officiellement lancé le Championnat Scolaire National 2024 lors d'une cérémonie tenue à Abidjan.

Cette nouvelle édition réunit plus de 500 établissements scolaires de toutes les régions de Côte d'Ivoire, représentant plus de 50 000 jeunes athlètes dans diverses disciplines sportives.

Le Directeur Général de l'OISSU a souligné l'importance du sport dans le développement des jeunes Ivoiriens : "Le sport scolaire est un vecteur de cohésion sociale, de discipline et d'excellence. Nous sommes fiers de voir autant d'établissements s'engager dans cette compétition."

Les disciplines retenues pour cette édition comprennent le football, le basketball, le volleyball, l'athlétisme, le handball et la natation. Les finales nationales sont prévues pour juin 2024.`,
        date: new Date('2024-01-15T08:00:00Z'),
        imageUrl: null,
        author: 'Service Communication OISSU',
      },
      {
        title: "L'OISSU signe un partenariat avec Orange Côte d'Ivoire",
        summary:
          "Un accord de partenariat stratégique a été signé entre l'OISSU et Orange CI pour digitaliser le sport scolaire ivoirien.",
        content: `L'Office Ivoirien du Sport Scolaire et Universitaire (OISSU) et Orange Côte d'Ivoire ont signé un accord de partenariat stratégique visant à moderniser et digitaliser le sport scolaire en Côte d'Ivoire.

Cet accord prévoit notamment la mise en place d'une plateforme numérique pour la gestion des compétitions, la diffusion des résultats en temps réel et la promotion des événements sportifs scolaires.

Orange CI s'engage également à équiper plusieurs établissements scolaires en matériel sportif connecté, permettant un suivi plus précis des performances des jeunes athlètes.

Ce partenariat s'inscrit dans la vision du gouvernement ivoirien de faire du numérique un levier de développement du sport scolaire, conformément aux objectifs de la Stratégie Nationale du Sport 2030.`,
        date: new Date('2024-02-10T10:00:00Z'),
        imageUrl: null,
        author: 'Direction Générale OISSU',
      },
    ],
  });

  console.log('News articles created:', 2);
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
