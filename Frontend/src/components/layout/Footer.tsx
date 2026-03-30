import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer footer-center bg-primary text-primary-content p-0 mt-auto">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <img src="/LogoOISSU.jpeg" alt="OISSU" className="h-10 w-10 rounded-full object-cover border-2 border-secondary" />
            <span className="font-bold text-xl">OISSU</span>
          </Link>
          <p className="text-primary-content/70 text-sm leading-relaxed">
            Organisation des Institutions Sportives Scolaires et Universitaires. Plateforme officielle de gestion des compétitions sportives scolaires.
          </p>
          <div className="flex gap-2 mt-4">
            <a href="#" className="btn btn-circle btn-sm btn-ghost border border-primary-content/30 hover:btn-secondary">
              <Share2 size={16} />
            </a>
            <a href="#" className="btn btn-circle btn-sm btn-ghost border border-primary-content/30 hover:btn-secondary">
              <Share2 size={16} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="footer-title text-secondary">Navigation</h4>
          <nav className="flex flex-col gap-2 text-sm text-primary-content/70">
            <Link to="/" className="hover:text-secondary transition-colors">Accueil</Link>
            <Link to="/competitions" className="hover:text-secondary transition-colors">Compétitions</Link>
            <Link to="/calendrier" className="hover:text-secondary transition-colors">Calendrier</Link>
            <Link to="/evenements" className="hover:text-secondary transition-colors">Événements</Link>
            <Link to="/boutique" className="hover:text-secondary transition-colors">Boutique</Link>
          </nav>
        </div>

        {/* Espace membres */}
        <div>
          <h4 className="footer-title text-secondary">Espace Membres</h4>
          <nav className="flex flex-col gap-2 text-sm text-primary-content/70">
            <Link to="/inscription" className="hover:text-secondary transition-colors">S'inscrire</Link>
            <Link to="/connexion" className="hover:text-secondary transition-colors">Se connecter</Link>
            <Link to="/mes-licences" className="hover:text-secondary transition-colors">Mes licences</Link>
            <Link to="/documents" className="hover:text-secondary transition-colors">Ressources</Link>
            <Link to="/oissu" className="hover:text-secondary transition-colors">À propos</Link>
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h4 className="footer-title text-secondary">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-primary-content/70">
            <span className="flex items-center gap-2"><MapPin size={15} className="text-secondary shrink-0" /> Abidjan, Côte d'Ivoire</span>
            <span className="flex items-center gap-2"><Phone size={15} className="text-secondary shrink-0" /> +225 XX XX XX XX XX</span>
            <span className="flex items-center gap-2"><Mail size={15} className="text-secondary shrink-0" /> contact@oissu.ci</span>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-content/20 w-full py-4 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-primary-content/50">
        <p>© {new Date().getFullYear()} OISSU. Tous droits réservés.</p>
        <p>Plateforme Digitale OISSU v1.0</p>
      </div>
    </footer>
  );
}
