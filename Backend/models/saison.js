import { model, Schema } from "mongoose";

const SaisonSchema = new Schema({
  annee: { type: String, required: true, unique: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  statut: { type: String, enum: ["a_venir", "en_cours", "terminee"], default: "a_venir" },
  description: { type: String },
}, { timestamps: true });

export const SaisonCollection = model("Saisons", SaisonSchema);
