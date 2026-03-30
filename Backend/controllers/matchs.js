import { MatchCollection } from "../models/match.js";

export const getMatchs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.competition) filter.competition = req.query.competition;
    if (req.query.statut) filter.statut = req.query.statut;
    const matchs = await MatchCollection.find(filter)
      .populate({ path: "equipeA", populate: { path: "etablissement" } })
      .populate({ path: "equipeB", populate: { path: "etablissement" } })
      .populate("competition")
      .populate("arbitre", "nom prenom")
      .sort({ dateMatch: 1 });
    res.json(matchs);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const getProchainMatchs = async (req, res) => {
  try {
    const matchs = await MatchCollection.find({
      statut: "programme",
      dateMatch: { $gte: new Date() },
    })
      .populate({ path: "equipeA", populate: { path: "etablissement discipline" } })
      .populate({ path: "equipeB", populate: { path: "etablissement" } })
      .populate("competition")
      .sort({ dateMatch: 1 })
      .limit(6);
    res.json(matchs);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const createMatch = async (req, res) => {
  try {
    const match = await MatchCollection.create(req.body);
    res.status(201).json(match);
  } catch (e) { res.status(400).json({ message: e.message }); }
};

export const updateMatch = async (req, res) => {
  try {
    const match = await MatchCollection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(match);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const saisirScore = async (req, res) => {
  try {
    const { scoreA, scoreB, rapport } = req.body;
    const match = await MatchCollection.findByIdAndUpdate(
      req.params.id,
      { scoreA, scoreB, rapport, statut: "termine" },
      { new: true }
    );
    res.json(match);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};
