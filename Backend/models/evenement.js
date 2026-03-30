import { model, Schema } from "mongoose";

const EvenementSchema = new Schema({
  nom: { type: String, required: true },
  description: { type: String },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date },
  lieu: { type: String },
  type: { type: String, enum: ["competition", "forum", "marathon", "ceremonie", "autre"], required: true },
  prix: { type: Number, default: 0 },
  capacite: { type: Number },
  inscrits: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  statut: { type: String, enum: ["a_venir", "en_cours", "termine", "annule"], default: "a_venir" },
  image: { type: String },
}, { timestamps: true });

export const EvenementCollection = model("Evenements", EvenementSchema);
