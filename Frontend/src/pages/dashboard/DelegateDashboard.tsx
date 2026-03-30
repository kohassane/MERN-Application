import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import type { Licence, Competition } from "../../../types";
import { Award, Trophy, CheckCircle, XCircle, Plus, MapPin, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export default function DelegateDashboard() {
  const [licences, setLicences] = useState<Licence[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  useEffect(() => {
    api.get("/licences?statut=en_attente").then(r => setLicences(r.data)).catch(() => {});
    api.get("/competitions").then(r => setCompetitions(r.data.slice(0, 5))).catch(() => {});
  }, []);

  const valider = async (id: string) => {
    try {
      await api.patch(`/licences/${id}/valider`);
      setLicences(prev => prev.filter(l => l._id !== id));
      toast.success("Licence validée");
    } catch { toast.error("Erreur"); }
  };

  const rejeter = async (id: string) => {
    try {
      await api.patch(`/licences/${id}/rejeter`);
      setLicences(prev => prev.filter(l => l._id !== id));
      toast.success("Licence rejetée");
    } catch { toast.error("Erreur"); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Espace Délégué OISSU</h1>
        <p className="text-base-content/60 mt-1">Supervision et validation des inscriptions de votre zone</p>
      </div>

      <div className="stats stats-vertical md:stats-horizontal shadow w-full mb-8">
        <div className="stat">
          <div className="stat-figure text-warning"><Award size={28} /></div>
          <div className="stat-title">Licences en attente</div>
          <div className="stat-value text-warning">{licences.length}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-primary"><Trophy size={28} /></div>
          <div className="stat-title">Compétitions supervisées</div>
          <div className="stat-value text-primary">{competitions.length}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Licences */}
        <div className="card bg-base-100 shadow">
          <div className="card-body p-0">
            <div className="flex items-center gap-2 p-5 border-b border-base-300 font-semibold">
              <Award className="text-warning" size={18} /> Licences à valider
              {licences.length > 0 && <div className="badge badge-warning badge-sm ml-auto">{licences.length}</div>}
            </div>
            {licences.length === 0 ? (
              <div className="text-center py-10 text-base-content/40 p-5">
                <Award size={32} className="mx-auto mb-2 opacity-30" /><p>Aucune licence en attente</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead><tr><th>Membre</th><th>Numéro</th><th>Actions</th></tr></thead>
                  <tbody>
                    {licences.map(l => (
                      <tr key={l._id}>
                        <td className="font-medium">{l.user?.nom} {l.user?.prenom}</td>
                        <td className="text-xs text-base-content/60">{l.numero}</td>
                        <td>
                          <div className="flex gap-2">
                            <button onClick={() => valider(l._id)} className="btn btn-success btn-xs gap-1">
                              <CheckCircle size={12} /> Valider
                            </button>
                            <button onClick={() => rejeter(l._id)} className="btn btn-error btn-xs gap-1">
                              <XCircle size={12} /> Rejeter
                            </button>
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

        {/* Compétitions */}
        <div className="card bg-base-100 shadow">
          <div className="card-body p-0">
            <div className="flex items-center justify-between p-5 border-b border-base-300">
              <div className="flex items-center gap-2 font-semibold"><Trophy className="text-primary" size={18} /> Compétitions</div>
              <Link to="/admin/competitions" className="btn btn-ghost btn-xs gap-1 text-primary">
                <Plus size={13} /> Créer
              </Link>
            </div>
            {competitions.length === 0 ? (
              <div className="text-center py-10 text-base-content/40 p-5">
                <Trophy size={32} className="mx-auto mb-2 opacity-30" /><p>Aucune compétition</p>
              </div>
            ) : (
              <ul className="menu menu-sm p-2 gap-1">
                {competitions.map(c => (
                  <li key={c._id}>
                    <div className="flex flex-col items-start gap-1 py-2">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-sm">{c.nom}</span>
                        <div className={`badge badge-xs ${c.statut === "en_cours" ? "badge-success" : "badge-ghost"}`}>{c.statut}</div>
                      </div>
                      <div className="text-xs text-base-content/50">{c.discipline?.nom} • {c.categorieAge}</div>
                      <div className="flex items-center gap-3 text-xs text-base-content/40">
                        {c.dateDebut && <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(c.dateDebut).toLocaleDateString("fr-FR")}</span>}
                        {c.lieu && <span className="flex items-center gap-1"><MapPin size={10} /> {c.lieu}</span>}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
