import { CompetitionCollection } from "../models/competition.js";

export const getCompetitions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.saison) filter.saison = req.query.saison;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.discipline) filter.discipline = req.query.discipline;
    const competitions = await CompetitionCollection.find(filter)
      .populate("discipline")
      .populate("saison")
      .sort({ dateDebut: 1 });
    res.json(competitions);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const getCompetition = async (req, res) => {
  try {
    const comp = await CompetitionCollection.findById(req.params.id)
      .populate("discipline")
      .populate("saison");
    if (!comp) return res.status(404).json({ message: "Compétition introuvable" });
    res.json(comp);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const createCompetition = async (req, res) => {
  try {
    const comp = await CompetitionCollection.create(req.body);
    res.status(201).json(comp);
  } catch (e) { res.status(400).json({ message: e.message }); }
};

export const updateCompetition = async (req, res) => {
  try {
    const comp = await CompetitionCollection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(comp);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};
