import { model, Schema } from "mongoose";

const EquipeSchema = new Schema({
  nom: { type: String, required: true },
  etablissement: { type: Schema.Types.ObjectId, ref: "Etablissements", required: true },
  discipline: { type: Schema.Types.ObjectId, ref: "Disciplines", required: true },
  saison: { type: Schema.Types.ObjectId, ref: "Saisons", required: true },
  joueurs: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  encadreur: { type: String },
  statut: { type: String, enum: ["engagee", "validee", "eliminee"], default: "engagee" },
}, { timestamps: true });

export const EquipeCollection = model("Equipes", EquipeSchema);
