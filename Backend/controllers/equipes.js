import { EquipeCollection } from "../models/equipe.js";

export const getEquipes = async (req, res) => {
  try {
    const filter = {};
    if (req.query.discipline) filter.discipline = req.query.discipline;
    if (req.query.saison) filter.saison = req.query.saison;
    if (req.query.etablissement) filter.etablissement = req.query.etablissement;
    const equipes = await EquipeCollection.find(filter)
      .populate("etablissement")
      .populate("discipline")
      .populate("joueurs", "nom prenom matricule");
    res.json(equipes);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const createEquipe = async (req, res) => {
  try {
    const equipe = await EquipeCollection.create(req.body);
    res.status(201).json(equipe);
  } catch (e) { res.status(400).json({ message: e.message }); }
};

export const updateEquipe = async (req, res) => {
  try {
    const equipe = await EquipeCollection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(equipe);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};
