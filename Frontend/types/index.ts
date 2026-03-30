export type UserRole = "etudiant" | "president_ase" | "officiel" | "delegue" | "admin";

export interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  tel?: string;
  matricule?: string;
  etablissement?: Etablissement;
  statut?: string;
}

export interface Etablissement {
  _id: string;
  nom: string;
  code: string;
  type: string;
  region: string;
  ville?: string;
}

export interface Discipline {
  _id: string;
  nom: string;
  categorie: "individuel" | "collectif";
  type: "masse" | "elite" | "detection";
  description?: string;
  actif: boolean;
}

export interface Saison {
  _id: string;
  annee: string;
  dateDebut: string;
  dateFin: string;
  statut: "a_venir" | "en_cours" | "terminee";
}

export interface Competition {
  _id: string;
  nom: string;
  discipline: Discipline;
  saison: Saison;
  type: "masse" | "elite" | "detection";
  categorieAge: string;
  phase: string;
  statut: string;
  dateDebut?: string;
  dateFin?: string;
  lieu?: string;
}

export interface Equipe {
  _id: string;
  nom: string;
  etablissement: Etablissement;
  discipline: Discipline;
  statut: string;
}

export interface Match {
  _id: string;
  competition: Competition;
  equipeA: Equipe;
  equipeB: Equipe;
  dateMatch: string;
  lieu?: string;
  scoreA: number;
  scoreB: number;
  statut: string;
}

export interface Licence {
  _id: string;
  user: User;
  saison: Saison;
  numero: string;
  statut: "en_attente" | "validee" | "rejetee" | "expiree";
  dateEmission?: string;
  dateExpiration?: string;
}

export interface Produit {
  _id: string;
  nom: string;
  description?: string;
  prix: number;
  stock: number;
  images: string[];
  categorie: string;
}

export interface Evenement {
  _id: string;
  nom: string;
  description?: string;
  dateDebut: string;
  dateFin?: string;
  lieu?: string;
  type: string;
  prix: number;
  capacite?: number;
  inscrits: string[];
  statut: string;
  image?: string;
}

export interface Document {
  _id: string;
  titre: string;
  type: string;
  fichier?: string;
  description?: string;
  acces: string;
  telechargements: number;
  createdAt: string;
}

export interface Stats {
  users: number;
  etablissements: number;
  competitions: number;
  matchs: number;
  licences: number;
}
