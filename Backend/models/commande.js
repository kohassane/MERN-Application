import { model, Schema } from "mongoose";

const CommandeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  produits: [{
    produit: { type: Schema.Types.ObjectId, ref: "Produits" },
    quantite: { type: Number, default: 1 },
    prix: { type: Number },
  }],
  total: { type: Number, required: true },
  statut: { type: String, enum: ["en_attente", "confirmee", "expediee", "livree", "annulee"], default: "en_attente" },
  paiement: { type: Schema.Types.ObjectId, ref: "Paiements" },
  adresseLivraison: { type: String },
}, { timestamps: true });

export const CommandeCollection = model("Commandes", CommandeSchema);
