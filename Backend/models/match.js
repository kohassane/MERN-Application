import { model, Schema } from "mongoose";

const MatchSchema = new Schema({
  competition: { type: Schema.Types.ObjectId, ref: "Competitions", required: true },
  equipeA: { type: Schema.Types.ObjectId, ref: "Equipes", required: true },
  equipeB: { type: Schema.Types.ObjectId, ref: "Equipes", required: true },
  dateMatch: { type: Date, required: true },
  lieu: { type: String },
  scoreA: { type: Number, default: 0 },
  scoreB: { type: Number, default: 0 },
  arbitre: { type: Schema.Types.ObjectId, ref: "Users" },
  statut: { type: String, enum: ["programme", "en_cours", "termine", "reporte", "annule"], default: "programme" },
  rapport: { type: String },
}, { timestamps: true });

export const MatchCollection = model("Matchs", MatchSchema);
