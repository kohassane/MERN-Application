import jwt from "jsonwebtoken";
import { UserCollection } from "../models/users.js";

export const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Non autorisé, token manquant" });
  }
  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserCollection.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "Utilisateur introuvable" });
    next();
  } catch {
    res.status(401).json({ message: "Token invalide" });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  next();
};
