import { model, Schema } from "mongoose";

const LicenceSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  saison: { type: Schema.Types.ObjectId, ref: "Saisons", required: true },
  numero: { type: String, unique: true },
  statut: { type: String, enum: ["en_attente", "validee", "rejetee", "expiree"], default: "en_attente" },
  dateEmission: { type: Date },
  dateExpiration: { type: Date },
  qrCode: { type: String },
  paiement: { type: Schema.Types.ObjectId, ref: "Paiements" },
}, { timestamps: true });

export const LicenceCollection = model("Licences", LicenceSchema);
