import { model, Schema } from "mongoose";

const CompetitionSchema = new Schema({
  nom: { type: String, required: true },
  discipline: { type: Schema.Types.ObjectId, ref: "Disciplines", required: true },
  saison: { type: Schema.Types.ObjectId, ref: "Saisons", required: true },
  type: { type: String, enum: ["masse", "elite", "detection"], required: true },
  categorieAge: { type: String, enum: ["benjamin", "minime", "cadet", "junior", "senior"], required: true },
  phase: { type: String, enum: ["qualifications", "poules", "eliminatoires", "finale"], default: "qualifications" },
  statut: { type: String, enum: ["planifiee", "en_cours", "terminee", "annulee"], default: "planifiee" },
  dateDebut: { type: Date },
  dateFin: { type: Date },
  lieu: { type: String },
  description: { type: String },
}, { timestamps: true });

export const CompetitionCollection = model("Competitions", CompetitionSchema);
