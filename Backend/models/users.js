import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  tel: { type: String },
  role: {
    type: String,
    enum: ["etudiant", "president_ase", "officiel", "delegue", "admin"],
    default: "etudiant",
  },
  matricule: { type: String },
  etablissement: { type: Schema.Types.ObjectId, ref: "Etablissements" },
  statut: { type: String, enum: ["actif", "inactif", "suspendu"], default: "actif" },
  photo: { type: String },
}, { timestamps: true });

export const UserCollection = model("Users", UserSchema);
