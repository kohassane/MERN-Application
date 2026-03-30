import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserCollection } from "../models/users.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  try {
    const { nom, prenom, email, password, tel, role, matricule } = req.body;
    if (!nom || !prenom || !email || !password)
      return res.status(400).json({ message: "Champs obligatoires manquants" });

    const exists = await UserCollection.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email déjà utilisé" });

    const hash = await bcrypt.hash(password, 12);
    const user = await UserCollection.create({
      nom, prenom, email, password: hash, tel, role: role || "etudiant", matricule,
    });

    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: { _id: user._id, nom, prenom, email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email et mot de passe requis" });

    const user = await UserCollection.findOne({ email });
    if (!user) return res.status(401).json({ message: "Identifiants incorrects" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Identifiants incorrects" });

    const token = signToken(user._id);
    res.json({
      token,
      user: { _id: user._id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};

export const getUsers = async (req, res) => {
  try {
    const users = await UserCollection.find().select("-password").populate("etablissement");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
