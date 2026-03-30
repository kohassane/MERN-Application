import { model, Schema } from "mongoose";

const PaiementSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  montant: { type: Number, required: true },
  type: { type: String, enum: ["licence", "engagement", "boutique", "evenement"], required: true },
  methode: { type: String, enum: ["orange_money", "mtn_money", "moov_money", "wave", "carte_bancaire"], required: true },
  statut: { type: String, enum: ["en_attente", "confirme", "echoue", "rembourse"], default: "en_attente" },
  reference: { type: String, unique: true },
  details: { type: Schema.Types.Mixed },
}, { timestamps: true });

export const PaiementCollection = model("Paiements", PaiementSchema);
