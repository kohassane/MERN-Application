import { model, Schema } from "mongoose";

const EtablissementSchema = new Schema({
  nom: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ["lycee", "universite", "college"], required: true },
  region: { type: String, required: true },
  ville: { type: String },
  president: { type: Schema.Types.ObjectId, ref: "Users" },
  statut: { type: String, enum: ["actif", "inactif"], default: "actif" },
}, { timestamps: true });

export const EtablissementCollection = model("Etablissements", EtablissementSchema);
