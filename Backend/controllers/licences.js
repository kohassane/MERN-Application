import { LicenceCollection } from "../models/licence.js";
import { v4 as uuidv4 } from "uuid";

export const getLicences = async (req, res) => {
  try {
    const filter = {};
    if (req.query.user) filter.user = req.query.user;
    if (req.query.saison) filter.saison = req.query.saison;
    if (req.query.statut) filter.statut = req.query.statut;
    const licences = await LicenceCollection.find(filter)
      .populate("user", "nom prenom email matricule")
      .populate("saison");
    res.json(licences);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const demanderLicence = async (req, res) => {
  try {
    const { saison } = req.body;
    const existing = await LicenceCollection.findOne({ user: req.user._id, saison });
    if (existing) return res.status(409).json({ message: "Demande déjà existante pour cette saison" });

    const licence = await LicenceCollection.create({
      user: req.user._id,
      saison,
      numero: `OISSU-${Date.now()}-${uuidv4().slice(0, 6).toUpperCase()}`,
    });
    res.status(201).json(licence);
  } catch (e) { res.status(400).json({ message: e.message }); }
};

export const validerLicence = async (req, res) => {
  try {
    const licence = await LicenceCollection.findByIdAndUpdate(
      req.params.id,
      { statut: "validee", dateEmission: new Date(), dateExpiration: new Date(Date.now() + 365 * 24 * 3600 * 1000) },
      { new: true }
    );
    res.json(licence);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const rejeterLicence = async (req, res) => {
  try {
    const licence = await LicenceCollection.findByIdAndUpdate(
      req.params.id,
      { statut: "rejetee" },
      { new: true }
    );
    res.json(licence);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};
