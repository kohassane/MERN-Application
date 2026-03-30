import { useEffect, useState } from "react";
import api from "../../lib/api";
import type { Licence } from "../../../types";
import { useAuth } from "../../context/AuthContext";
import { Award, Download } from "lucide-react";
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

export default function LicencesPage() {
  const { user } = useAuth();
  const [licences, setLicences] = useState<Licence[]>([]);
  const [saisonActive, setSaisonActive] = useState<{ _id: string; annee: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    api.get(`/licences?user=${user?._id}`).then(r => setLicences(r.data)).catch(() => {}).finally(() => setLoading(false));
    api.get("/saisons/active").then(r => setSaisonActive(r.data)).catch(() => {});
  }, [user]);

  const demander = async () => {
    if (!saisonActive) return toast.error("Aucune saison active");
    setRequesting(true);
    try {
      const { data } = await api.post("/licences", { saison: saisonActive._id });
      setLicences(prev => [data, ...prev]);
      toast.success("Demande envoyée !");
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Erreur");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3"><Award className="text-primary" /> Mes licences sportives</h1>
          <p className="text-base-content/60 mt-1">Gérez vos licences OISSU par saison</p>
        </div>
        <button onClick={demander} disabled={requesting || !saisonActive} className="btn btn-primary btn-sm">
          {requesting ? <span className="loading loading-spinner loading-xs" /> : <Award size={14} />}
          Demander une licence
        </button>
      </div>

      {saisonActive && (
        <div role="alert" className="alert alert-success mb-6">
          <Award size={18} />
          <span>Saison active : <strong>{saisonActive.annee}</strong></span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><span className="loading loading-spinner loading-lg text-primary" /></div>
      ) : licences.length === 0 ? (
        <div className="text-center py-16 text-base-content/40 bg-base-100 rounded-xl border border-base-300">
          <Award size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Aucune licence</p>
          <p className="text-sm mt-1">{saisonActive ? "Cliquez sur « Demander une licence » pour commencer" : "Aucune saison active pour le moment"}</p>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-sm">
          <div className="divide-y divide-base-300">
            {licences.map(l => (
              <div key={l._id} className="flex items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Award className="text-primary" size={22} />
                  </div>
                  <div>
                    <div className="font-bold">{l.numero}</div>
                    <div className="text-sm text-base-content/60">Saison {l.saison?.annee}</div>
                    {l.dateEmission && <div className="text-xs text-base-content/40 mt-0.5">Émise le {new Date(l.dateEmission).toLocaleDateString("fr-FR")}</div>}
                    {l.dateExpiration && l.statut === "validee" && (
                      <div className="text-xs text-base-content/40">Expire le {new Date(l.dateExpiration).toLocaleDateString("fr-FR")}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`badge ${STATUT_BADGE[l.statut]} badge-sm`}>{STATUT_LABELS[l.statut]}</div>
                  {l.statut === "validee" && (
                    <button className="btn btn-outline btn-primary btn-xs gap-1">
                      <Download size={13} /> Télécharger
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
