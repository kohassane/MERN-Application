import { DisciplineCollection } from "../models/discipline.js";

export const getDisciplines = async (req, res) => {
  try {
    const disciplines = await DisciplineCollection.find({ actif: true });
    res.json(disciplines);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const createDiscipline = async (req, res) => {
  try {
    const discipline = await DisciplineCollection.create(req.body);
    res.status(201).json(discipline);
  } catch (e) { res.status(400).json({ message: e.message }); }
};

export const updateDiscipline = async (req, res) => {
  try {
    const discipline = await DisciplineCollection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(discipline);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const deleteDiscipline = async (req, res) => {
  try {
    await DisciplineCollection.findByIdAndUpdate(req.params.id, { actif: false });
    res.json({ message: "Discipline désactivée" });
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};
