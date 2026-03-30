import { EtablissementCollection } from "../models/etablissement.js";

export const getEtablissements = async (req, res) => {
  try {
    const etablissements = await EtablissementCollection.find({ statut: "actif" }).populate("president", "nom prenom");
    res.json(etablissements);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const createEtablissement = async (req, res) => {
  try {
    const etab = await EtablissementCollection.create(req.body);
    res.status(201).json(etab);
  } catch (e) { res.status(400).json({ message: e.message }); }
};

export const updateEtablissement = async (req, res) => {
  try {
    const etab = await EtablissementCollection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(etab);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};
