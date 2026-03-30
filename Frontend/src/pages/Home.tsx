import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import type { Stats, Match, Evenement } from "../../types";
import { Trophy, Users, Building2, Award, Calendar, ArrowRight, MapPin, Clock } from "lucide-react";

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [prochainMatchs, setProchainMatchs] = useState<Match[]>([]);
  const [evenements, setEvenements] = useState<Evenement[]>([]);

  useEffect(() => {
    api.get("/stats").then(r => setStats(r.data)).catch(() => {});
    api.get("/matchs/prochains").then(r => setProchainMatchs(r.data)).catch(() => {});
    api.get("/evenements").then(r => setEvenements(r.data.slice(0, 3))).catch(() => {});
  }, []);

  const heroSlides = [
    { title: "Compétitions Sportives Scolaires", sub: "Rejoignez la dynamique sportive nationale des élèves et étudiants" },
    { title: "Licences & Inscriptions en ligne", sub: "Dématérialisation complète des processus d'engagement sportif" },
    { title: "Résultats & Classements en temps réel", sub: "Suivez vos équipes et compétitions favorites en direct" },
  ];
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, [heroSlides.length]);

  const disciplines = [
    { nom: "Football", emoji: "⚽" }, { nom: "Handball", emoji: "🤾" },
    { nom: "Basket-ball", emoji: "🏀" }, { nom: "Volley-ball", emoji: "🏐" },
    { nom: "Athlétisme", emoji: "🏃" }, { nom: "Natation", emoji: "🏊" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <div className="hero min-h-125 bg-primary text-primary-content relative overflow-hidden">
        <div className="hero-content text-center flex-col max-w-4xl px-4 py-16 z-10">
          <div className="badge badge-secondary badge-lg mb-4 font-bold uppercase tracking-wider">
            Plateforme Officielle OISSU
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight transition-all duration-500">
            {heroSlides[slide].title}
          </h1>
          <p className="text-primary-content/80 text-lg md:text-xl mb-8 max-w-2xl">
            {heroSlides[slide].sub}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/inscription" className="btn btn-secondary btn-lg">S'inscrire maintenant</Link>
            <Link to="/competitions" className="btn btn-outline btn-lg text-primary-content border-primary-content hover:bg-primary-content hover:text-primary">
              Voir les compétitions
            </Link>
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                className={`h-2.5 rounded-full transition-all ${i === slide ? "bg-secondary w-6" : "bg-primary-content/40 w-2.5"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-base-100 border-b border-base-300 overflow-x-auto">
        <div className="stats stats-vertical md:stats-horizontal shadow-none w-full max-w-7xl mx-auto">
          {[
            { icon: <Users className="text-primary" size={26} />, val: stats?.users ?? "—", label: "Membres" },
            { icon: <Building2 className="text-primary" size={26} />, val: stats?.etablissements ?? "—", label: "Établissements" },
            { icon: <Trophy className="text-primary" size={26} />, val: stats?.competitions ?? "—", label: "Compétitions" },
            { icon: <Calendar className="text-primary" size={26} />, val: stats?.matchs ?? "—", label: "Matchs joués" },
            { icon: <Award className="text-primary" size={26} />, val: stats?.licences ?? "—", label: "Licences actives" },
          ].map((s, i) => (
            <div key={i} className="stat place-items-center">
              <div className="stat-figure">{s.icon}</div>
              <div className="stat-value text-primary">{s.val}</div>
              <div className="stat-desc text-base-content/60 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Prochains matchs */}
      <section className="py-16 px-4 bg-base-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Prochains matchs</h2>
              <p className="text-base-content/60 text-sm mt-1">Calendrier des rencontres à venir</p>
            </div>
            <Link to="/calendrier" className="btn btn-ghost btn-sm gap-1 text-primary">
              Voir tout <ArrowRight size={16} />
            </Link>
          </div>
          {prochainMatchs.length === 0 ? (
            <div className="text-center py-12 text-base-content/40">
              <Trophy size={40} className="mx-auto mb-3 opacity-30" />
              <p>Aucun match programmé pour le moment</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prochainMatchs.map((m) => (
                <div key={m._id} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                  <div className="card-body p-4">
                    <div className="badge badge-primary badge-sm mb-2">{m.competition?.nom || "Compétition"}</div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="text-center flex-1 font-bold text-sm">{m.equipeA?.etablissement?.nom || m.equipeA?.nom}</div>
                      <div className="badge badge-primary font-bold py-3 px-2">VS</div>
                      <div className="text-center flex-1 font-bold text-sm">{m.equipeB?.etablissement?.nom || m.equipeB?.nom}</div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-base-content/50">
                      <span className="flex items-center gap-1"><Clock size={11} /> {new Date(m.dateMatch).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                      {m.lieu && <span className="flex items-center gap-1"><MapPin size={11} /> {m.lieu}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Disciplines */}
      <section className="py-16 px-4 bg-base-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold">Nos disciplines sportives</h2>
            <p className="text-base-content/60 mt-2">Une offre sportive diversifiée pour tous les profils</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {disciplines.map((d) => (
              <Link key={d.nom} to="/disciplines" className="card bg-base-100 border border-base-300 hover:border-primary hover:bg-primary/5 transition-all">
                <div className="card-body items-center text-center p-4 gap-2">
                  <span className="text-3xl">{d.emoji}</span>
                  <span className="text-xs font-medium">{d.nom}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/disciplines" className="btn btn-ghost btn-sm text-primary gap-1">
              Toutes les disciplines <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Événements */}
      {evenements.length > 0 && (
        <section className="py-16 px-4 bg-base-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Événements à venir</h2>
                <p className="text-base-content/60 text-sm mt-1">Ne manquez aucun événement OISSU</p>
              </div>
              <Link to="/evenements" className="btn btn-ghost btn-sm gap-1 text-primary">
                Voir tout <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {evenements.map((evt) => (
                <div key={evt._id} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <figure className="bg-primary h-32 flex items-center justify-center">
                    <Trophy size={48} className="text-secondary" />
                  </figure>
                  <div className="card-body p-4">
                    <div className="badge badge-secondary badge-sm">{evt.type}</div>
                    <h3 className="card-title text-base mt-1">{evt.nom}</h3>
                    <div className="text-xs text-base-content/50 space-y-1">
                      <div className="flex items-center gap-1"><Calendar size={11} /> {new Date(evt.dateDebut).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</div>
                      {evt.lieu && <div className="flex items-center gap-1"><MapPin size={11} /> {evt.lieu}</div>}
                    </div>
                    <div className="card-actions justify-between items-center mt-2">
                      <span className="font-bold text-primary">{evt.prix === 0 ? "Gratuit" : `${evt.prix.toLocaleString()} FCFA`}</span>
                      <Link to="/evenements" className="btn btn-primary btn-xs">S'inscrire</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="hero py-16 bg-primary text-primary-content">
        <div className="hero-content text-center flex-col max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Rejoignez la plateforme OISSU</h2>
          <p className="text-primary-content/80 text-lg mb-8">
            Gérez vos inscriptions, licences, compétitions et résultats en ligne. Simple, rapide et sécurisé.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/inscription" className="btn btn-secondary btn-lg">Créer un compte gratuit</Link>
            <Link to="/oissu" className="btn btn-outline btn-lg text-primary-content border-primary-content hover:bg-primary-content hover:text-primary">En savoir plus</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
