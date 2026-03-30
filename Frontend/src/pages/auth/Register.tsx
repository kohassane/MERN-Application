import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";

const ROLES = [
  { value: "etudiant", label: "Élève / Étudiant" },
  { value: "president_ase", label: "Président d'ASE" },
  { value: "officiel", label: "Officiel / Arbitre" },
  { value: "delegue", label: "Délégué OISSU" },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", password: "", tel: "", role: "etudiant", matricule: "",
  });

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Compte créé avec succès !");
      navigate("/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Erreur lors de l'inscription";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero bg-primary py-8">
      <div className="hero-content flex-col w-full max-w-lg">
        <div className="text-center text-primary-content">
          <img src="/LogoOISSU.jpeg" alt="OISSU" className="h-20 w-20 rounded-full object-cover mx-auto mb-4 border-4 border-secondary shadow-xl" />
          <h1 className="text-3xl font-bold">Créer un compte</h1>
          <p className="text-primary-content/70 mt-1">Rejoignez la plateforme OISSU</p>
        </div>

        <div className="card bg-base-100 w-full shadow-2xl">
          <form onSubmit={handleSubmit} className="card-body gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Nom</span></label>
                <input name="nom" value={form.nom} onChange={handle} required placeholder="Dupont" className="input input-bordered focus:input-primary" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Prénom</span></label>
                <input name="prenom" value={form.prenom} onChange={handle} required placeholder="Jean" className="input input-bordered focus:input-primary" />
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Email</span></label>
              <input type="email" name="email" value={form.email} onChange={handle} required placeholder="jean@email.com" className="input input-bordered focus:input-primary" />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Mot de passe</span></label>
              <input type="password" name="password" value={form.password} onChange={handle} required placeholder="Min. 6 caractères" minLength={6} className="input input-bordered focus:input-primary" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Téléphone</span></label>
                <input name="tel" value={form.tel} onChange={handle} placeholder="+225 XX XX XX XX" className="input input-bordered focus:input-primary" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Matricule</span></label>
                <input name="matricule" value={form.matricule} onChange={handle} placeholder="N° matricule" className="input input-bordered focus:input-primary" />
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Profil</span></label>
              <select name="role" value={form.role} onChange={handle} className="select select-bordered focus:select-primary">
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            <div className="form-control mt-2">
              <button type="submit" disabled={loading} className="btn btn-primary w-full gap-2">
                {loading ? <span className="loading loading-spinner loading-sm" /> : <UserPlus size={18} />}
                Créer mon compte
              </button>
            </div>

            <p className="text-center text-sm text-base-content/60">
              Déjà inscrit ?{" "}
              <Link to="/connexion" className="link link-primary font-semibold">Se connecter</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
