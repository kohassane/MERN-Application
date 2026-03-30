import { Film, Image, Users } from "lucide-react";

const partners = [
  { nom: "Ministère de l'Éducation Nationale", type: "Tutelle" },
  { nom: "Comité National Olympique", type: "Partenaire sportif" },
  { nom: "Orange CI", type: "Partenaire Mobile Money" },
  { nom: "MTN CI", type: "Partenaire Mobile Money" },
  { nom: "Moov Africa", type: "Partenaire Mobile Money" },
  { nom: "Wave", type: "Partenaire paiement" },
];

export default function MediaPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3"><Film className="text-primary" /> Espace Médias</h1>
        <p className="text-base-content/60 mt-2">OISSU TV, galeries photos et partenaires</p>
      </div>

      {/* OISSU TV */}
      <div className="card bg-base-100 shadow-sm mb-8">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2"><Film className="text-primary" size={20} /> OISSU TV</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-neutral rounded-xl aspect-video flex items-center justify-center cursor-pointer hover:bg-neutral-focus transition-colors group">
                <div className="text-center">
                  <div className="w-14 h-14 bg-white/10 group-hover:bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors">
                    <div className="w-0 h-0 border-l-18 border-l-white border-t-12 border-t-transparent border-b-12 border-b-transparent ml-1.5" />
                  </div>
                  <span className="text-neutral-content/70 text-sm">Compétition {i} - Saison 2024</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-base-content/50 text-center mt-2">Plus de vidéos disponibles sur notre chaîne officielle</p>
        </div>
      </div>

      {/* Galerie */}
      <div className="card bg-base-100 shadow-sm mb-8">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2"><Image className="text-primary" size={20} /> Galerie photos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`rounded-xl aspect-square flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity ${["bg-primary/10", "bg-info/10", "bg-secondary/10", "bg-accent/10"][i % 4]}`}>
                <div className="text-center">
                  <Image size={28} className="mx-auto text-base-content/30 mb-1" />
                  <span className="text-xs text-base-content/40">Photo {i + 1}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-base-content/50 text-center mt-2">Les galeries sont mises à jour après chaque compétition</p>
        </div>
      </div>

      {/* Partenaires */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2"><Users className="text-primary" size={20} /> Nos partenaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {partners.map(p => (
              <div key={p.nom} className="card border border-base-300 hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="card-body p-4 items-center text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <Users size={24} className="text-primary" />
                  </div>
                  <div className="font-semibold text-sm">{p.nom}</div>
                  <div className="badge badge-ghost badge-xs">{p.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
