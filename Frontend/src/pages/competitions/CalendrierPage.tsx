import { useEffect, useState } from "react";
import api from "../../lib/api";
import type { Match } from "../../../types";
import { Calendar, MapPin, Clock } from "lucide-react";

const STATUT_BADGE: Record<string, string> = {
  programme: "badge-info",
  en_cours: "badge-success",
  termine: "badge-ghost",
  reporte: "badge-warning",
  annule: "badge-error",
};

export default function CalendrierPage() {
  const [matchs, setMatchs] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState("tous");

  useEffect(() => {
    api.get("/matchs").then(r => setMatchs(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filtre === "tous" ? matchs : matchs.filter(m => m.statut === filtre);

  const grouped = filtered.reduce<Record<string, Match[]>>((acc, m) => {
    const day = new Date(m.dateMatch).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    if (!acc[day]) acc[day] = [];
    acc[day].push(m);
    return acc;
  }, {});

  const FILTRES = [
    { val: "tous", label: "Tous" },
    { val: "programme", label: "Programmés" },
    { val: "en_cours", label: "En cours" },
    { val: "termine", label: "Terminés" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3"><Calendar className="text-primary" /> Calendrier des matchs</h1>
        <p className="text-base-content/60 mt-2">Planification de toutes les rencontres</p>
      </div>

      <div className="tabs tabs-box mb-6 w-fit">
        {FILTRES.map(f => (
          <button key={f.val} onClick={() => setFiltre(f.val)} className={`tab ${filtre === f.val ? "tab-active" : ""}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><span className="loading loading-spinner loading-lg text-primary" /></div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 text-base-content/40">
          <Calendar size={48} className="mx-auto mb-4 opacity-30" /><p>Aucun match trouvé</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([day, dayMatchs]) => (
            <div key={day}>
              <div className="divider capitalize text-sm font-semibold">{day}</div>
              <div className="space-y-3">
                {dayMatchs.map(m => (
                  <div key={m._id} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="card-body p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="badge badge-primary badge-sm">{m.competition?.nom}</div>
                        <div className={`badge badge-sm ${STATUT_BADGE[m.statut] || "badge-ghost"}`}>{m.statut}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 text-center">
                          <div className="font-bold">{m.equipeA?.etablissement?.nom || m.equipeA?.nom}</div>
                        </div>
                        <div className="px-6 text-center">
                          {m.statut === "termine" ? (
                            <div className="text-2xl font-black">{m.scoreA} - {m.scoreB}</div>
                          ) : (
                            <div className="btn btn-primary btn-sm pointer-events-none">VS</div>
                          )}
                        </div>
                        <div className="flex-1 text-center">
                          <div className="font-bold">{m.equipeB?.etablissement?.nom || m.equipeB?.nom}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-base-content/50">
                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(m.dateMatch).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
                        {m.lieu && <span className="flex items-center gap-1"><MapPin size={12} /> {m.lieu}</span>}
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
