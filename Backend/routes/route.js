import express from "express";
import { protect, requireRole } from "../middleware/auth.js";
import { register, login, getMe, getUsers } from "../controllers/auth.js";
import { getDisciplines, createDiscipline, updateDiscipline, deleteDiscipline } from "../controllers/disciplines.js";
import { getSaisons, getSaisonActive, createSaison, updateSaison } from "../controllers/saisons.js";
import { getCompetitions, getCompetition, createCompetition, updateCompetition } from "../controllers/competitions.js";
import { getMatchs, getProchainMatchs, createMatch, updateMatch, saisirScore } from "../controllers/matchs.js";
import { getEquipes, createEquipe, updateEquipe } from "../controllers/equipes.js";
import { getLicences, demanderLicence, validerLicence, rejeterLicence } from "../controllers/licences.js";
import { getProduits, createProduit, updateProduit, passerCommande, getMesCommandes } from "../controllers/produits.js";
import { getDocuments, createDocument } from "../controllers/documents.js";
import { getEvenements, createEvenement, sInscrireEvenement } from "../controllers/evenements.js";
import { getStats } from "../controllers/stats.js";
import { getEtablissements, createEtablissement, updateEtablissement } from "../controllers/etablissements.js";

const router = express.Router();

// Auth
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", protect, getMe);
router.get("/auth/users", protect, requireRole("admin", "delegue"), getUsers);

// Stats (public)
router.get("/stats", getStats);

// Disciplines
router.get("/disciplines", getDisciplines);
router.post("/disciplines", protect, requireRole("admin"), createDiscipline);
router.put("/disciplines/:id", protect, requireRole("admin"), updateDiscipline);
router.delete("/disciplines/:id", protect, requireRole("admin"), deleteDiscipline);

// Saisons
router.get("/saisons", getSaisons);
router.get("/saisons/active", getSaisonActive);
router.post("/saisons", protect, requireRole("admin"), createSaison);
router.put("/saisons/:id", protect, requireRole("admin"), updateSaison);

// Competitions
router.get("/competitions", getCompetitions);
router.get("/competitions/:id", getCompetition);
router.post("/competitions", protect, requireRole("admin", "delegue"), createCompetition);
router.put("/competitions/:id", protect, requireRole("admin", "delegue"), updateCompetition);

// Matchs
router.get("/matchs", getMatchs);
router.get("/matchs/prochains", getProchainMatchs);
router.post("/matchs", protect, requireRole("admin", "delegue"), createMatch);
router.put("/matchs/:id", protect, requireRole("admin", "delegue", "officiel"), updateMatch);
router.patch("/matchs/:id/score", protect, requireRole("officiel", "admin", "delegue"), saisirScore);

// Equipes
router.get("/equipes", getEquipes);
router.post("/equipes", protect, requireRole("president_ase", "admin", "delegue"), createEquipe);
router.put("/equipes/:id", protect, requireRole("president_ase", "admin", "delegue"), updateEquipe);

// Licences
router.get("/licences", protect, getLicences);
router.post("/licences", protect, demanderLicence);
router.patch("/licences/:id/valider", protect, requireRole("admin", "delegue"), validerLicence);
router.patch("/licences/:id/rejeter", protect, requireRole("admin", "delegue"), rejeterLicence);

// Boutique
router.get("/produits", getProduits);
router.post("/produits", protect, requireRole("admin"), createProduit);
router.put("/produits/:id", protect, requireRole("admin"), updateProduit);
router.post("/commandes", protect, passerCommande);
router.get("/commandes/mes-commandes", protect, getMesCommandes);

// Documents
router.get("/documents", getDocuments);
router.post("/documents", protect, requireRole("admin", "delegue"), createDocument);

// Evenements
router.get("/evenements", getEvenements);
router.post("/evenements", protect, requireRole("admin"), createEvenement);
router.post("/evenements/:id/inscrire", protect, sInscrireEvenement);

// Etablissements
router.get("/etablissements", getEtablissements);
router.post("/etablissements", protect, requireRole("admin", "delegue"), createEtablissement);
router.put("/etablissements/:id", protect, requireRole("admin", "delegue"), updateEtablissement);

export default router;
