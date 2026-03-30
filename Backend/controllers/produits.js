import { ProduitCollection } from "../models/produit.js";
import { CommandeCollection } from "../models/commande.js";

export const getProduits = async (req, res) => {
  try {
    const produits = await ProduitCollection.find({ actif: true });
    res.json(produits);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const createProduit = async (req, res) => {
  try {
    const produit = await ProduitCollection.create(req.body);
    res.status(201).json(produit);
  } catch (e) { res.status(400).json({ message: e.message }); }
};

export const updateProduit = async (req, res) => {
  try {
    const produit = await ProduitCollection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(produit);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};

export const passerCommande = async (req, res) => {
  try {
    const { produits, adresseLivraison } = req.body;
    let total = 0;
    for (const item of produits) {
      const p = await ProduitCollection.findById(item.produit);
      if (!p || p.stock < item.quantite) {
        return res.status(400).json({ message: `Stock insuffisant pour ${p?.nom || "ce produit"}` });
      }
      total += p.prix * item.quantite;
      item.prix = p.prix;
    }
    const commande = await CommandeCollection.create({
      user: req.user._id, produits, total, adresseLivraison,
    });
    for (const item of produits) {
      await ProduitCollection.findByIdAndUpdate(item.produit, { $inc: { stock: -item.quantite } });
    }
    res.status(201).json(commande);
  } catch (e) { res.status(400).json({ message: e.message }); }
};

export const getMesCommandes = async (req, res) => {
  try {
    const commandes = await CommandeCollection.find({ user: req.user._id })
      .populate("produits.produit")
      .sort({ createdAt: -1 });
    res.json(commandes);
  } catch { res.status(500).json({ message: "Erreur serveur" }); }
};
