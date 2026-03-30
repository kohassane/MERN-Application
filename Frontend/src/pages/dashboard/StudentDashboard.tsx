import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import type { Licence } from "../../../types";
import { Award, User, Download, Trophy, FileText } from "lucide-react";
import toast from "react-hot-toast";

const STATUT_BADGE: Record<string, string> = {
  validee: "badge-success",
  en_attente: "badge-warning",
  rejetee: "badge-error",
  expiree: "badge-ghost",
};
const STATUT_LABELS: Record<string, string> = {
  validee: "Validée", en_attente: "En attente", rejetee: "Rejetée", expiree: "Expirée",
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [licences, setLicences] = useState<Licence[]>([]);
  const [saisonActive, setSaisonActive] = useState<{ _id: string; annee: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/licences?user=${user?._id}`).then(r => setLicences(r.data)).catch(() => {});
    api.get("/saisons/active").then(r => setSaisonActive(r.data)).catch(() => {});
  }, [user]);

  const demanderLicence = async () => {
    if (!saisonActive) return toast.error("Aucune saison active");
    setLoading(true);
    try {
      const { data } = await api.post("/licences", { saison: saisonActive._id });
      setLicences(prev => [data, ...prev]);
      toast.success("Demande de licence envoyée !");
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Bonjour, {user?.prenom} 👋</h1>
        <p className="text-base-content/60 mt-1">Espace élève / étudiant</p>
      </div>

      {/* Stats */}
      <div className="stats stats-vertical md:stats-horizontal shadow w-full mb-8">
        <div className="stat">
          <div className="stat-figure text-primary"><Award size={28} /></div>
          <div className="stat-title">Mes licences</div>
          <div className="stat-value text-primary">{licences.length}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-info"><User size={28} /></div>
          <div className="stat-title">Matricule</div>
          <div className="stat-desc text-base mt-1">{user?.matricule || "Non renseigné"}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-secondary"><Trophy size={28} /></div>
          <div className="stat-title">Saison active</div>
          <div className="stat-value text-secondary text-xl">{saisonActive?.annee || "—"}</div>
        </div>
      </div>

      {/* Licences */}
      <div className="card bg-base-100 shadow mb-6">
        <div className="card-body p-0">
          <div className="flex items-center justify-between p-5 border-b border-base-300">
            <div className="flex items-center gap-2 font-semibold"><Award size={18} className="text-primary" /> Mes licences sportives</div>
            <button onClick={demanderLicence} disabled={loading || !saisonActive} className="btn btn-primary btn-sm gap-2">
              {loading ? <span className="loading loading-spinner loading-xs" /> : <Award size={14} />}
              Demander une licence
            </button>
          </div>
          {licences.length === 0 ? (
            <div className="text-center py-12 text-base-content/40 p-5">
              <Award size={40} className="mx-auto mb-3 opacity-30" />
              <p>Aucune licence pour le moment</p>
              {saisonActive && <p className="text-sm mt-1">Cliquez sur "Demander une licence" pour commencer</p>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead><tr><th>Numéro</th><th>Saison</th><th>Statut</th><th>Action</th></tr></thead>
                <tbody>
                  {licences.map(l => (
                    <tr key={l._id}>
                      <td className="font-medium">{l.numero}</td>
                      <td>{l.saison?.annee}</td>
                      <td><div className={`badge ${STATUT_BADGE[l.statut]} badge-sm`}>{STATUT_LABELS[l.statut]}</div></td>
                      <td>
                        {l.statut === "validee" && (
                          <button className="btn btn-ghost btn-xs gap-1 text-primary">
                            <Download size={13} /> Télécharger
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/competitions" className="card bg-base-100 shadow hover:shadow-md transition-shadow border border-base-300 hover:border-primary">
          <div className="card-body flex-row items-center gap-4 p-5">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0"><Trophy className="text-primary" size={22} /></div>
            <div><div className="font-semibold">Compétitions</div><div className="text-sm text-base-content/60">Consulter les compétitions en cours</div></div>
          </div>
        </Link>
        <Link to="/documents" className="card bg-base-100 shadow hover:shadow-md transition-shadow border border-base-300 hover:border-info">
          <div className="card-body flex-row items-center gap-4 p-5">
            <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center shrink-0"><FileText className="text-info" size={22} /></div>
            <div><div className="font-semibold">Ressources</div><div className="text-sm text-base-content/60">Guides et documents officiels</div></div>
          </div>
        </Link>
      </div>
    </div>
  );
}
