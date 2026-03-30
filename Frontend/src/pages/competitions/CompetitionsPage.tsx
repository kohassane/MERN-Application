import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../../lib/api";
import type { Competition } from "../../../types";
import { Trophy, Calendar, MapPin } from "lucide-react";

const TYPES = [
  { value: "", label: "Tous" },
  { value: "masse", label: "Masse" },
  { value: "elite", label: "Élite" },
  { value: "detection", label: "Détection" },
];

const STATUT_BADGE: Record<string, string> = {
  planifiee: "badge-info", en_cours: "badge-success", terminee: "badge-ghost", annulee: "badge-error",
};
const STATUT_LABELS: Record<string, string> = {
  planifiee: "Planifiée", en_cours: "En cours", terminee: "Terminée", annulee: "Annulée",
};

export default function CompetitionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const typeFilter = searchParams.get("type") || "";

  useEffect(() => {
    setLoading(true);
    const params = typeFilter ? `?type=${typeFilter}` : "";
    api.get(`/competitions${params}`).then(r => setCompetitions(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [typeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3"><Trophy className="text-primary" /> Compétitions</h1>
        <p className="text-base-content/60 mt-2">Toutes les compétitions sportives scolaires et universitaires</p>
      </div>

      <div className="tabs tabs-box mb-6 w-fit">
        {TYPES.map(t => (
          <button key={t.value} onClick={() => t.value ? setSearchParams({ type: t.value }) : setSearchParams({})}
            className={`tab ${typeFilter === t.value ? "tab-active" : ""}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><span className="loading loading-spinner loading-lg text-primary" /></div>
      ) : competitions.length === 0 ? (
        <div className="text-center py-16 text-base-content/40">
          <Trophy size={48} className="mx-auto mb-4 opacity-30" /><p className="text-lg">Aucune compétition trouvée</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {competitions.map(c => (
            <div key={c._id} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <figure className="bg-primary h-20 flex items-start justify-between px-5 pt-4">
                <div>
                  <div className="badge badge-secondary badge-sm capitalize">{c.type}</div>
                  <h3 className="text-primary-content font-bold mt-1">{c.nom}</h3>
                </div>
                <Trophy className="text-secondary" size={24} />
              </figure>
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{c.discipline?.nom}</span>
                  <div className={`badge badge-sm ${STATUT_BADGE[c.statut] || "badge-ghost"}`}>{STATUT_LABELS[c.statut] || c.statut}</div>
                </div>
                <div className="text-xs text-base-content/50 space-y-1 mt-1">
                  <div>Catégorie : <span className="font-medium">{c.categorieAge}</span></div>
                  <div>Phase : <span className="font-medium">{c.phase}</span></div>
                  {c.dateDebut && <div className="flex items-center gap-1"><Calendar size={11} /> {new Date(c.dateDebut).toLocaleDateString("fr-FR")}</div>}
                  {c.lieu && <div className="flex items-center gap-1"><MapPin size={11} /> {c.lieu}</div>}
                </div>
                <div className="card-actions mt-3">
                  <Link to={`/competitions/${c._id}`} className="btn btn-primary btn-sm btn-block">Voir les matchs →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
