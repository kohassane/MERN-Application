import { EvenementCollection } from "../models/evenement.js";

export const getEvenements = async (req, res) => {
  try {
    const evenements = await EvenementCollection.find({ statut: { $in: ["a_venir", "en_cours"] } }).sort({ dateDebut: 1 });
    res.json(evenements);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const createEvenement = async (req, res) => {
  try {
    const evt = await EvenementCollection.create(req.body);
    res.status(201).json(evt);
  } catch (e) { res.status(400).json({ message: e.message }); }
};

export const sInscrireEvenement = async (req, res) => {
  try {
    const evt = await EvenementCollection.findById(req.params.id);
    if (!evt) return res.status(404).json({ message: "Événement introuvable" });
    if (evt.inscrits.includes(req.user._id))
      return res.status(409).json({ message: "Déjà inscrit" });
    if (evt.capacite && evt.inscrits.length >= evt.capacite)
      return res.status(400).json({ message: "Événement complet" });
    evt.inscrits.push(req.user._id);
    await evt.save();
    res.json({ message: "Inscription confirmée" });
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};
