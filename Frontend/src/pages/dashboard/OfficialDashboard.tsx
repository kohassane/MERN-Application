import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import type { Match } from "../../../types";
import { Calendar, CheckCircle, MapPin } from "lucide-react";
import toast from "react-hot-toast";

export default function OfficialDashboard() {
  const { user } = useAuth();
  const [matchs, setMatchs] = useState<Match[]>([]);
  const [selected, setSelected] = useState<Match | null>(null);
  const [score, setScore] = useState({ scoreA: 0, scoreB: 0, rapport: "" });

  useEffect(() => {
    api.get("/matchs").then(r => setMatchs(r.data.filter((m: Match) => m.statut !== "termine"))).catch(() => {});
  }, []);

  const saisirScore = async () => {
    if (!selected) return;
    try {
      await api.patch(`/matchs/${selected._id}/score`, score);
      setMatchs(prev => prev.filter(m => m._id !== selected._id));
      setSelected(null);
      toast.success("Score saisi avec succès !");
    } catch { toast.error("Erreur lors de la saisie"); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Espace Officiel / Arbitre</h1>
        <p className="text-base-content/60 mt-1">Bonjour, {user?.prenom} — Saisie des feuilles de match</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Matchs */}
        <div className="card bg-base-100 shadow">
          <div className="card-body p-0">
            <div className="flex items-center gap-2 p-5 border-b border-base-300 font-semibold">
              <Calendar className="text-primary" size={18} /> Matchs à arbitrer
              <div className="badge badge-primary badge-sm ml-auto">{matchs.length}</div>
            </div>
            {matchs.length === 0 ? (
              <div className="text-center py-10 text-base-content/40 p-5">
                <Calendar size={32} className="mx-auto mb-2 opacity-30" /><p>Aucun match assigné</p>
              </div>
            ) : (
              <ul className="menu menu-sm p-2 gap-1">
                {matchs.map(m => (
                  <li key={m._id}>
                    <button onClick={() => { setSelected(m); setScore({ scoreA: m.scoreA, scoreB: m.scoreB, rapport: "" }); }}
                      className={selected?._id === m._id ? "active" : ""}>
                      <div className="w-full">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="badge badge-primary badge-xs">{m.competition?.nom}</div>
                          <div className="badge badge-ghost badge-xs">{m.statut}</div>
                        </div>
                        <div className="font-medium text-sm">
                          {m.equipeA?.etablissement?.nom || m.equipeA?.nom} vs {m.equipeB?.etablissement?.nom || m.equipeB?.nom}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-base-content/50 mt-1">
                          <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(m.dateMatch).toLocaleDateString("fr-FR")}</span>
                          {m.lieu && <span className="flex items-center gap-1"><MapPin size={10} /> {m.lieu}</span>}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Saisie score */}
        <div className="card bg-base-100 shadow">
          <div className="card-body p-0">
            <div className="flex items-center gap-2 p-5 border-b border-base-300 font-semibold">
              <CheckCircle className="text-success" size={18} /> Feuille de match
            </div>
            {!selected ? (
              <div className="text-center py-10 text-base-content/40 p-5">
                <CheckCircle size={32} className="mx-auto mb-2 opacity-30" />
                <p>Sélectionnez un match pour saisir le score</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <div className="text-center">
                  <div className="badge badge-primary mb-2">{selected.competition?.nom}</div>
                  <div className="font-bold">
                    {selected.equipeA?.etablissement?.nom || selected.equipeA?.nom}
                    <span className="mx-3 font-normal text-base-content/40">vs</span>
                    {selected.equipeB?.etablissement?.nom || selected.equipeB?.nom}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label text-xs text-center"><span className="label-text font-medium">{selected.equipeA?.etablissement?.nom || selected.equipeA?.nom}</span></label>
                    <input type="number" min={0} value={score.scoreA} onChange={e => setScore(s => ({ ...s, scoreA: +e.target.value }))}
                      className="input input-bordered text-center text-2xl font-bold input-primary" />
                  </div>
                  <div className="form-control">
                    <label className="label text-xs text-center"><span className="label-text font-medium">{selected.equipeB?.etablissement?.nom || selected.equipeB?.nom}</span></label>
                    <input type="number" min={0} value={score.scoreB} onChange={e => setScore(s => ({ ...s, scoreB: +e.target.value }))}
                      className="input input-bordered text-center text-2xl font-bold input-primary" />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Rapport d'arbitrage</span></label>
                  <textarea value={score.rapport} onChange={e => setScore(s => ({ ...s, rapport: e.target.value }))}
                    rows={4} placeholder="Observations, incidents, cartons..."
                    className="textarea textarea-bordered textarea-primary resize-none" />
                </div>
                <button onClick={saisirScore} className="btn btn-primary w-full gap-2">
                  <CheckCircle size={18} /> Valider la feuille de match
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
