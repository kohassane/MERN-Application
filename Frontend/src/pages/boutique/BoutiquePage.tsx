import { useEffect, useState } from "react";
import api from "../../lib/api";
import type { Produit } from "../../../types";
import { useAuth } from "../../context/AuthContext";
import { ShoppingBag, ShoppingCart, Plus, Minus, X } from "lucide-react";
import toast from "react-hot-toast";

interface CartItem { produit: Produit; quantite: number }

export default function BoutiquePage() {
  const { user } = useAuth();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ordering, setOrdering] = useState(false);
  const [adresse, setAdresse] = useState("");

  useEffect(() => {
    api.get("/produits").then(r => setProduits(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const addToCart = (p: Produit) => {
    setCart(prev => {
      const exists = prev.find(i => i.produit._id === p._id);
      if (exists) return prev.map(i => i.produit._id === p._id ? { ...i, quantite: i.quantite + 1 } : i);
      return [...prev, { produit: p, quantite: 1 }];
    });
    toast.success(`${p.nom} ajouté au panier`);
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => i.produit._id === id ? { ...i, quantite: Math.max(1, i.quantite + delta) } : i));
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.produit._id !== id));

  const total = cart.reduce((s, i) => s + i.produit.prix * i.quantite, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantite, 0);

  const commander = async () => {
    if (!user) return toast.error("Connectez-vous pour commander");
    if (!adresse) return toast.error("Renseignez votre adresse de livraison");
    setOrdering(true);
    try {
      await api.post("/commandes", {
        produits: cart.map(i => ({ produit: i.produit._id, quantite: i.quantite })),
        adresseLivraison: adresse,
      });
      toast.success("Commande passée avec succès !");
      setCart([]);
      (document.getElementById("cart-modal") as HTMLDialogElement)?.close();
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Erreur");
    } finally {
      setOrdering(false);
    }
  };

  const categories = [...new Set(produits.map(p => p.categorie))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3"><ShoppingBag className="text-primary" /> Boutique OISSU</h1>
          <p className="text-base-content/60 mt-2">Équipements et accessoires officiels</p>
        </div>
        <button onClick={() => (document.getElementById("cart-modal") as HTMLDialogElement)?.showModal()}
          className="btn btn-primary gap-2 relative">
          <ShoppingCart size={18} /> Panier
          {cartCount > 0 && <div className="badge badge-secondary badge-sm absolute -top-2 -right-2">{cartCount}</div>}
        </button>
      </div>

      {/* Cart modal */}
      <dialog id="cart-modal" className="modal modal-end">
        <div className="modal-box h-full max-h-screen rounded-none w-full max-w-md flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Mon panier</h3>
            <form method="dialog"><button className="btn btn-ghost btn-sm btn-circle"><X size={16} /></button></form>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-base-content/40">
                <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" /><p>Panier vide</p>
              </div>
            ) : cart.map(item => (
              <div key={item.produit._id} className="flex items-center gap-3 bg-base-200 rounded-xl p-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <ShoppingBag size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{item.produit.nom}</div>
                  <div className="text-xs text-base-content/50">{item.produit.prix.toLocaleString()} FCFA</div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQty(item.produit._id, -1)} className="btn btn-ghost btn-xs btn-circle"><Minus size={12} /></button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantite}</span>
                  <button onClick={() => updateQty(item.produit._id, 1)} className="btn btn-ghost btn-xs btn-circle"><Plus size={12} /></button>
                </div>
                <button onClick={() => removeFromCart(item.produit._id)} className="btn btn-ghost btn-xs btn-circle text-error"><X size={14} /></button>
              </div>
            ))}
          </div>
          {cart.length > 0 && (
            <div className="pt-4 border-t border-base-300 space-y-3 mt-4">
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{total.toLocaleString()} FCFA</span></div>
              <input value={adresse} onChange={e => setAdresse(e.target.value)} placeholder="Adresse de livraison"
                className="input input-bordered input-sm w-full focus:input-primary" />
              <button onClick={commander} disabled={ordering} className="btn btn-primary btn-block">
                {ordering ? <span className="loading loading-spinner loading-sm" /> : "Confirmer la commande"}
              </button>
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      {loading ? (
        <div className="flex justify-center py-16"><span className="loading loading-spinner loading-lg text-primary" /></div>
      ) : produits.length === 0 ? (
        <div className="text-center py-16 text-base-content/40">
          <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" /><p className="text-lg">Aucun produit disponible</p>
        </div>
      ) : (
        <div className="space-y-10">
          {categories.map(cat => (
            <div key={cat}>
              <h2 className="text-xl font-bold mb-4 capitalize">{cat}</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {produits.filter(p => p.categorie === cat).map(p => (
                  <div key={p._id} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <figure className="bg-primary/10 h-40 flex items-center justify-center">
                      <ShoppingBag size={48} className="text-primary/30" />
                    </figure>
                    <div className="card-body p-4">
                      <h3 className="card-title text-sm">{p.nom}</h3>
                      {p.description && <p className="text-xs text-base-content/50 line-clamp-2">{p.description}</p>}
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <div className="font-bold text-primary">{p.prix.toLocaleString()} FCFA</div>
                          <div className="text-xs text-base-content/50">{p.stock > 0 ? `${p.stock} en stock` : "Rupture"}</div>
                        </div>
                        <button onClick={() => addToCart(p)} disabled={p.stock === 0}
                          className="btn btn-primary btn-sm gap-1">
                          <ShoppingCart size={14} /> Ajouter
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
