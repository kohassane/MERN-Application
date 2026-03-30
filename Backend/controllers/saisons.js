import { SaisonCollection } from "../models/saison.js";

export const getSaisons = async (req, res) => {
  try {
    const saisons = await SaisonCollection.find().sort({ dateDebut: -1 });
    res.json(saisons);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const getSaisonActive = async (req, res) => {
  try {
    const saison = await SaisonCollection.findOne({ statut: "en_cours" });
    res.json(saison);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const createSaison = async (req, res) => {
  try {
    const saison = await SaisonCollection.create(req.body);
    res.status(201).json(saison);
  } catch (e) { res.status(400).json({ message: e.message }); }
};

export const updateSaison = async (req, res) => {
  try {
    const saison = await SaisonCollection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(saison);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};
