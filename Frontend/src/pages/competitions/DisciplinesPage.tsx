import { useEffect, useState } from "react";
import api from "../../lib/api";
import type { Discipline } from "../../../types";
import { Dumbbell } from "lucide-react";

const EMOJI: Record<string, string> = {
  football: "⚽", handball: "🤾", basketball: "🏀", volley: "🏐",
  athletisme: "🏃", natation: "🏊", tennis: "🎾", boxe: "🥊",
};

const getEmoji = (nom: string) => {
  const key = nom.toLowerCase().replace(/[- ]/g, "");
  return Object.entries(EMOJI).find(([k]) => key.includes(k))?.[1] || "🏆";
};

const TYPE_BADGE: Record<string, string> = {
  masse: "badge-info",
  elite: "badge-secondary",
  detection: "badge-warning",
};

export default function DisciplinesPage() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/disciplines").then(r => setDisciplines(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const masse = disciplines.filter(d => d.type === "masse");
  const elite = disciplines.filter(d => d.type === "elite");
  const detection = disciplines.filter(d => d.type === "detection");

  const DisciplineCard = ({ d }: { d: Discipline }) => (
    <div className="card bg-base-100 shadow-sm hover:shadow-md hover:border-primary border border-base-300 transition-all items-center text-center">
      <div className="card-body p-5 items-center gap-2">
        <span className="text-4xl">{getEmoji(d.nom)}</span>
        <div>
          <div className="font-bold">{d.nom}</div>
          <div className="text-xs text-base-content/50 mt-0.5 capitalize">{d.categorie}</div>
        </div>
        <div className={`badge badge-sm ${TYPE_BADGE[d.type] || "badge-ghost"}`}>{d.type}</div>
        {d.description && <p className="text-xs text-base-content/50">{d.description}</p>}
      </div>
    </div>
  );

  const sections = [
    { list: masse, label: "Compétitions de Masse", color: "text-info" },
    { list: elite, label: "Compétitions d'Élite", color: "text-secondary" },
    { list: detection, label: "Détection de Talents", color: "text-warning" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3"><Dumbbell className="text-primary" /> Disciplines sportives</h1>
        <p className="text-base-content/60 mt-2">L'ensemble des disciplines pratiquées au sein de l'OISSU</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><span className="loading loading-spinner loading-lg text-primary" /></div>
      ) : disciplines.length === 0 ? (
        <div className="text-center py-16 text-base-content/40">
          <Dumbbell size={48} className="mx-auto mb-4 opacity-30" />
          <p>Aucune discipline configurée</p>
        </div>
      ) : (
        <div className="space-y-10">
          {sections.filter(s => s.list.length > 0).map(s => (
            <div key={s.label}>
              <h2 className={`text-xl font-bold mb-4 ${s.color}`}>{s.label}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {s.list.map(d => <DisciplineCard key={d._id} d={d} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
