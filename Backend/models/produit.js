import { model, Schema } from "mongoose";

const ProduitSchema = new Schema({
  nom: { type: String, required: true },
  description: { type: String },
  prix: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  images: [{ type: String }],
  categorie: { type: String, enum: ["maillot", "equipement", "accessoire", "autre"], required: true },
  actif: { type: Boolean, default: true },
}, { timestamps: true });

export const ProduitCollection = model("Produits", ProduitSchema);
