import { Link } from "react-router-dom";
import { Target, Eye, Shield, Users, Phone, Mail, MapPin } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="hero bg-primary rounded-2xl mb-10 py-10 px-6">
        <div className="hero-content text-center text-primary-content">
          <div>
            <img src="/LogoOISSU.jpeg" alt="OISSU" className="h-20 w-20 rounded-full object-cover mx-auto mb-6 border-4 border-secondary" />
            <h1 className="text-3xl font-bold mb-3">L'OISSU</h1>
            <p className="text-primary-content/80 text-lg max-w-2xl mx-auto">
              Organisation des Institutions Sportives Scolaires et Universitaires — Organe officiel de gestion du sport scolaire et universitaire.
            </p>
          </div>
        </div>
      </div>

      {/* Mission, Vision, Valeurs */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { icon: <Target className="text-primary" size={28} />, title: "Notre Mission", text: "Promouvoir et développer la pratique sportive au sein des établissements scolaires et universitaires. Encadrer les compétitions, délivrer les licences et former les talents de demain.", cls: "border-primary/20 bg-primary/5" },
          { icon: <Eye className="text-info" size={28} />, title: "Notre Vision", text: "Construire un écosystème sportif scolaire moderne, inclusif et performant, capable de révéler les champions nationaux de demain sur la scène internationale.", cls: "border-info/20 bg-info/5" },
          { icon: <Shield className="text-secondary" size={28} />, title: "Nos Valeurs", text: "Excellence sportive, équité de genre, fair-play, intégrité institutionnelle, transparence dans la gestion et accessibilité pour tous les établissements.", cls: "border-secondary/20 bg-secondary/5" },
        ].map((item, i) => (
          <div key={i} className={`card border ${item.cls}`}>
            <div className="card-body p-6">
              <div className="mb-2">{item.icon}</div>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-sm text-base-content/70 leading-relaxed">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chiffres clés */}
      <div className="stats stats-vertical md:stats-horizontal shadow w-full bg-primary text-primary-content mb-10">
        {[
          { val: "15+", label: "Disciplines sportives" },
          { val: "500+", label: "Établissements affiliés" },
          { val: "50K+", label: "Élèves licenciés" },
          { val: "200+", label: "Compétitions/an" },
        ].map((s, i) => (
          <div key={i} className="stat">
            <div className="stat-value text-secondary">{s.val}</div>
            <div className="stat-title text-primary-content/70">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Textes officiels */}
      <div className="card bg-base-100 shadow-sm mb-10">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2"><Shield className="text-primary" size={20} /> Textes officiels</h2>
          <div className="space-y-2">
            {[
              "Décret portant création de l'OISSU",
              "Textes ASPDO (Activités Sportives Post-diplômantes et Olympiques)",
              "Règlement intérieur des compétitions scolaires",
              "Code de conduite du sport scolaire",
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Shield size={16} className="text-primary" />
                </div>
                <span className="text-sm">{t}</span>
              </div>
            ))}
          </div>
          <div className="card-actions mt-2">
            <Link to="/documents" className="btn btn-ghost btn-sm text-primary">Accéder à tous les documents →</Link>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2"><Users className="text-primary" size={20} /> Nous contacter</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: <MapPin className="text-primary" size={20} />, label: "Adresse", val: "Abidjan, Côte d'Ivoire" },
              { icon: <Phone className="text-primary" size={20} />, label: "Téléphone", val: "+225 XX XX XX XX XX" },
              { icon: <Mail className="text-primary" size={20} />, label: "Email", val: "contact@oissu.ci" },
            ].map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-base-200 rounded-xl">
                <div className="mt-0.5">{c.icon}</div>
                <div>
                  <div className="text-xs font-medium text-base-content/50 uppercase tracking-wide">{c.label}</div>
                  <div className="text-sm font-medium mt-1">{c.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
