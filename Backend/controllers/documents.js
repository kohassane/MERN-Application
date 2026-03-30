import { DocumentCollection } from "../models/document.js";

export const getDocuments = async (req, res) => {
  try {
    const filter = {};
    const userRole = req.user?.role;
    if (!userRole || userRole === "etudiant") filter.acces = "public";
    else if (userRole === "president_ase" || userRole === "officiel") filter.acces = { $in: ["public", "membres"] };
    else if (userRole === "delegue") filter.acces = { $in: ["public", "membres", "delegues"] };
    const docs = await DocumentCollection.find(filter).sort({ createdAt: -1 });
    res.json(docs);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const createDocument = async (req, res) => {
  try {
    const doc = await DocumentCollection.create({ ...req.body, uploadePar: req.user._id });
    res.status(201).json(doc);
  } catch (e) { res.status(400).json({ message: e.message }); }
};
