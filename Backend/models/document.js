import { model, Schema } from "mongoose";

const DocumentSchema = new Schema({
  titre: { type: String, required: true },
  type: { type: String, enum: ["manuel", "guide", "texte_loi", "rapport", "autre"], required: true },
  fichier: { type: String },
  description: { type: String },
  acces: { type: String, enum: ["public", "membres", "delegues", "admin"], default: "public" },
  uploadePar: { type: Schema.Types.ObjectId, ref: "Users" },
  telechargements: { type: Number, default: 0 },
}, { timestamps: true });

export const DocumentCollection = model("Documents", DocumentSchema);
