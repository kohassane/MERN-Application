import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import type { Stats, Licence } from "../../../types";
import { Users, Building2, Trophy, Award, Calendar, Settings, FileText, ShoppingBag, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [licences, setLicences] = useState<Licence[]>([]);

  useEffect(() => {
    api.get("/stats").then(r => setStats(r.data)).catch(() => {});
    api.get("/licences?statut=en_attente").then(r => setLicences(r.data.slice(0, 10))).catch(() => {});
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
      toast.error("Licence rejetée");
    } catch { toast.error("Erreur"); }
  };

  const quickLinks = [
    { to: "/admin/disciplines", icon: <Trophy size={22} />, label: "Disciplines", sub: "Gérer les disciplines", cls: "text-primary" },
    { to: "/admin/saisons", icon: <Calendar size={22} />, label: "Saisons", sub: "Paramétrer les saisons", cls: "text-info" },
    { to: "/admin/competitions", icon: <Award size={22} />, label: "Compétitions", sub: "Créer et gérer", cls: "text-secondary" },
    { to: "/admin/matchs", icon: <Settings size={22} />, label: "Matchs", sub: "Planifier les rencontres", cls: "text-warning" },
    { to: "/admin/etablissements", icon: <Building2 size={22} />, label: "Établissements", sub: "Gérer les établissements", cls: "text-accent" },
    { to: "/admin/utilisateurs", icon: <Users size={22} />, label: "Utilisateurs", sub: "Gérer les membres", cls: "text-info" },
    { to: "/documents", icon: <FileText size={22} />, label: "Documents", sub: "GED & ressources", cls: "text-error" },
    { to: "/boutique", icon: <ShoppingBag size={22} />, label: "Boutique", sub: "Gérer les produits", cls: "text-secondary" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Tableau de bord Administrateur</h1>
        <p className="text-base-content/60 mt-1">Gestion globale de la plateforme OISSU</p>
      </div>

      {/* Stats */}
      <div className="stats stats-vertical md:stats-horizontal shadow w-full mb-8 overflow-x-auto">
        {[
          { icon: <Users className="text-primary" size={24} />, val: stats?.users, label: "Membres" },
          { icon: <Building2 className="text-info" size={24} />, val: stats?.etablissements, label: "Établissements" },
          { icon: <Trophy className="text-secondary" size={24} />, val: stats?.competitions, label: "Compétitions" },
          { icon: <Calendar className="text-warning" size={24} />, val: stats?.matchs, label: "Matchs joués" },
          { icon: <Award className="text-accent" size={24} />, val: stats?.licences, label: "Licences validées" },
        ].map((s, i) => (
          <div key={i} className="stat">
            <div className="stat-figure">{s.icon}</div>
            <div className="stat-title">{s.label}</div>
            <div className="stat-value">{s.val ?? "—"}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Licences en attente */}
        <div className="lg:col-span-2 card bg-base-100 shadow">
          <div className="card-body p-0">
            <div className="flex items-center gap-2 p-5 border-b border-base-300">
              <Award className="text-warning" size={18} />
              <h2 className="card-title text-base">Licences en attente ({licences.length})</h2>
              {licences.length > 0 && <div className="badge badge-warning badge-sm ml-auto">{licences.length}</div>}
            </div>
            {licences.length === 0 ? (
              <div className="text-center py-10 text-base-content/40 p-5">
                <Award size={32} className="mx-auto mb-2 opacity-30" />
                <p>Aucune licence en attente</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr><th>Membre</th><th>Numéro</th><th>Saison</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {licences.map(l => (
                      <tr key={l._id}>
                        <td className="font-medium">{l.user?.nom} {l.user?.prenom}</td>
                        <td className="text-xs text-base-content/60">{l.numero}</td>
                        <td><div className="badge badge-ghost badge-sm">{l.saison?.annee}</div></td>
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

        {/* Quick links */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title text-base mb-2">Accès rapides</h2>
            <ul className="menu menu-sm gap-1 p-0">
              {quickLinks.slice(0, 6).map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="flex items-center gap-3">
                    <span className={link.cls}>{link.icon}</span>
                    <div>
                      <div className="font-medium">{link.label}</div>
                      <div className="text-xs text-base-content/50">{link.sub}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* All quick links grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {quickLinks.map(link => (
          <Link key={link.to} to={link.to} className="card bg-base-100 shadow hover:shadow-md transition-shadow border border-base-300 hover:border-primary">
            <div className="card-body items-center text-center p-5 gap-2">
              <span className={link.cls}>{link.icon}</span>
              <div className="font-semibold text-sm">{link.label}</div>
              <div className="text-xs text-base-content/50">{link.sub}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
