import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import type { Equipe, Discipline, Saison } from "../../../types";
import { Users, Trophy, Plus, Building2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ASEDashboard() {
  const { user } = useAuth();
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [saisonActive, setSaisonActive] = useState<Saison | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom: "", discipline: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.etablissement) {
      const id = typeof user.etablissement === 'object' ? user.etablissement._id : user.etablissement;
      api.get(`/equipes?etablissement=${id}`).then(r => setEquipes(r.data)).catch(() => {});
    }
    api.get("/disciplines").then(r => setDisciplines(r.data)).catch(() => {});
    api.get("/saisons/active").then(r => setSaisonActive(r.data)).catch(() => {});
  }, [user]);

  const creerEquipe = async () => {
    if (!form.nom || !form.discipline || !saisonActive) return toast.error("Remplissez tous les champs");
    setLoading(true);
    try {
      const etablissementId = typeof user?.etablissement === 'object' ? user.etablissement?._id : user?.etablissement;
      const { data } = await api.post("/equipes", { ...form, etablissement: etablissementId, saison: saisonActive._id });
      setEquipes(prev => [data, ...prev]);
      setForm({ nom: "", discipline: "" });
      setShowForm(false);
      toast.success("Équipe créée !");
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const etab = typeof user?.etablissement === 'object' ? user.etablissement : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Espace Président d'ASE</h1>
        <p className="text-base-content/60 mt-1 flex items-center gap-2"><Building2 size={14} /> {etab?.nom || "Établissement non associé"}</p>
      </div>

      <div className="stats stats-vertical md:stats-horizontal shadow w-full mb-8">
        <div className="stat">
          <div className="stat-figure text-primary"><Trophy size={28} /></div>
          <div className="stat-title">Équipes engagées</div>
          <div className="stat-value text-primary">{equipes.length}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-info"><Users size={28} /></div>
          <div className="stat-title">Disciplines actives</div>
          <div className="stat-value text-info">{disciplines.length}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-secondary"><Trophy size={28} /></div>
          <div className="stat-title">Saison en cours</div>
          <div className="stat-value text-secondary text-xl">{saisonActive?.annee || "—"}</div>
        </div>
      </div>

      {/* Équipes */}
      <div className="card bg-base-100 shadow mb-6">
        <div className="card-body p-0">
          <div className="flex items-center justify-between p-5 border-b border-base-300">
            <div className="flex items-center gap-2 font-semibold"><Trophy className="text-primary" size={18} /> Mes équipes</div>
            <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm gap-2">
              <Plus size={16} /> Engager une équipe
            </button>
          </div>

          {showForm && (
            <div className="p-4 bg-primary/5 border-b border-base-300">
              <div className="grid md:grid-cols-3 gap-3">
                <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                  placeholder="Nom de l'équipe" className="input input-bordered input-sm focus:input-primary" />
                <select value={form.discipline} onChange={e => setForm(f => ({ ...f, discipline: e.target.value }))}
                  className="select select-bordered select-sm focus:select-primary">
                  <option value="">Choisir une discipline</option>
                  {disciplines.map(d => <option key={d._id} value={d._id}>{d.nom}</option>)}
                </select>
                <button onClick={creerEquipe} disabled={loading} className="btn btn-primary btn-sm">
                  {loading ? <span className="loading loading-spinner loading-xs" /> : "Créer l'équipe"}
                </button>
              </div>
            </div>
          )}

          {equipes.length === 0 ? (
            <div className="text-center py-10 text-base-content/40 p-5">
              <Trophy size={32} className="mx-auto mb-2 opacity-30" /><p>Aucune équipe engagée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead><tr><th>Équipe</th><th>Discipline</th><th>Statut</th></tr></thead>
                <tbody>
                  {equipes.map(e => (
                    <tr key={e._id}>
                      <td className="font-medium">{e.nom}</td>
                      <td>{e.discipline?.nom}</td>
                      <td>
                        <div className={`badge badge-sm ${e.statut === "validee" ? "badge-success" : e.statut === "eliminee" ? "badge-error" : "badge-warning"}`}>
                          {e.statut === "engagee" ? "En attente" : e.statut === "validee" ? "Validée" : "Éliminée"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/competitions" className="card bg-base-100 shadow hover:shadow-md transition-shadow border border-base-300 hover:border-primary">
          <div className="card-body flex-row items-center gap-4 p-5">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0"><Trophy className="text-primary" size={22} /></div>
            <div><div className="font-semibold">Compétitions</div><div className="text-sm text-base-content/60">Voir les compétitions disponibles</div></div>
          </div>
        </Link>
        <Link to="/mes-licences" className="card bg-base-100 shadow hover:shadow-md transition-shadow border border-base-300 hover:border-info">
          <div className="card-body flex-row items-center gap-4 p-5">
            <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center shrink-0"><Users className="text-info" size={22} /></div>
            <div><div className="font-semibold">Licences</div><div className="text-sm text-base-content/60">Gérer les licences des joueurs</div></div>
          </div>
        </Link>
      </div>
    </div>
  );
}
