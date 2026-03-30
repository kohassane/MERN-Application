import { model, Schema } from "mongoose";

const DisciplineSchema = new Schema({
  nom: { type: String, required: true },
  categorie: { type: String, enum: ["individuel", "collectif"], required: true },
  type: { type: String, enum: ["masse", "elite", "detection"], required: true },
  description: { type: String },
  icone: { type: String },
  actif: { type: Boolean, default: true },
}, { timestamps: true });

export const DisciplineCollection = model("Disciplines", DisciplineSchema);
