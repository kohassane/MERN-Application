import { useEffect, useState } from "react";
import api from "../../lib/api";
import type { Evenement } from "../../../types";
import { useAuth } from "../../context/AuthContext";
import { Calendar, MapPin, Users, Tag } from "lucide-react";
import toast from "react-hot-toast";

const TYPE_BADGE: Record<string, string> = {
  competition: "badge-success",
  forum: "badge-info",
  marathon: "badge-warning",
  ceremonie: "badge-secondary",
  autre: "badge-ghost",
};

export default function EvenementsPage() {
  const { user } = useAuth();
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [inscribing, setInscribing] = useState<string | null>(null);

  useEffect(() => {
    api.get("/evenements").then(r => setEvenements(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const sInscrire = async (id: string) => {
    if (!user) return toast.error("Connectez-vous pour vous inscrire");
    setInscribing(id);
    try {
      await api.post(`/evenements/${id}/inscrire`);
      toast.success("Inscription confirmée !");
      setEvenements(prev => prev.map(e => e._id === id ? { ...e, inscrits: [...e.inscrits, user._id] } : e));
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Erreur");
    } finally {
      setInscribing(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3"><Calendar className="text-primary" /> Événements OISSU</h1>
        <p className="text-base-content/60 mt-2">Inscrivez-vous aux événements sportifs et institutionnels</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><span className="loading loading-spinner loading-lg text-primary" /></div>
      ) : evenements.length === 0 ? (
        <div className="text-center py-16 text-base-content/40">
          <Calendar size={48} className="mx-auto mb-4 opacity-30" /><p className="text-lg">Aucun événement à venir</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evenements.map(evt => {
            const isInscrit = user && evt.inscrits.includes(user._id);
            const isFull = evt.capacite !== undefined && evt.inscrits.length >= evt.capacite;
            return (
              <div key={evt._id} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <figure className="bg-primary h-40 flex flex-col items-center justify-center gap-2 p-4">
                  <Calendar size={36} className="text-secondary" />
                  <span className="text-primary-content font-bold text-center">{evt.nom}</span>
                </figure>
                <div className="card-body p-5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className={`badge badge-sm ${TYPE_BADGE[evt.type] || "badge-ghost"}`}>{evt.type}</div>
                    <div className={`badge badge-sm ${evt.statut === "a_venir" ? "badge-info" : "badge-success"}`}>
                      {evt.statut === "a_venir" ? "À venir" : "En cours"}
                    </div>
                  </div>
                  {evt.description && <p className="text-sm text-base-content/70 line-clamp-2">{evt.description}</p>}
                  <div className="space-y-1 text-xs text-base-content/50">
                    <div className="flex items-center gap-2"><Calendar size={12} /> {new Date(evt.dateDebut).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</div>
                    {evt.lieu && <div className="flex items-center gap-2"><MapPin size={12} /> {evt.lieu}</div>}
                    <div className="flex items-center gap-2"><Users size={12} /> {evt.inscrits.length} inscrits{evt.capacite ? ` / ${evt.capacite}` : ""}</div>
                    <div className="flex items-center gap-2"><Tag size={12} /> {evt.prix === 0 ? "Gratuit" : `${evt.prix.toLocaleString()} FCFA`}</div>
                  </div>
                  <div className="card-actions mt-2">
                    <button
                      onClick={() => sInscrire(evt._id)}
                      disabled={!!isInscrit || isFull || inscribing === evt._id}
                      className={`btn btn-sm btn-block ${isInscrit ? "btn-success btn-outline" : isFull ? "btn-disabled" : "btn-primary"}`}
                    >
                      {inscribing === evt._id ? <span className="loading loading-spinner loading-xs" /> : isInscrit ? "✓ Inscrit" : isFull ? "Complet" : "S'inscrire"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
