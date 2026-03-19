import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">SI</span>
              </div>
              <span className="font-bold text-xl text-white">Sport Scolaire et Universitaire</span>
            </div>
            <p className="text-gray-400 mb-4">
              Plateforme officielle du sport scolaire en Côte d'Ivoire, promouvant l'excellence sportive et académique.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-gray-700 pb-2">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  À Propos
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition-colors">
                  Événements
                </Link>
              </li>
              <li>
                <Link to="/results" className="text-gray-400 hover:text-white transition-colors">
                  Résultats
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-white transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-gray-400 hover:text-white transition-colors">
                  Partenaires
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-gray-700 pb-2">Catégories Sportives</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sports/football" className="text-gray-400 hover:text-white transition-colors">
                  Football
                </Link>
              </li>
              <li>
                <Link to="/sports/basketball" className="text-gray-400 hover:text-white transition-colors">
                  Basketball
                </Link>
              </li>
              <li>
                <Link to="/sports/athletics" className="text-gray-400 hover:text-white transition-colors">
                  Athlétisme
                </Link>
              </li>
              <li>
                <Link to="/sports/volleyball" className="text-gray-400 hover:text-white transition-colors">
                  Volleyball
                </Link>
              </li>
              <li>
                <Link to="/sports/handball" className="text-gray-400 hover:text-white transition-colors">
                  Handball
                </Link>
              </li>
              <li>
                <Link to="/sports/other" className="text-gray-400 hover:text-white transition-colors">
                  Autres Sports
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-gray-700 pb-2">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-orange-500 flex-shrink-0 mt-1" />
                <span className="text-gray-400">
                  Avenue de la République, Plateau, Abidjan, Côte d'Ivoire
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-orange-500" />
                <span className="text-gray-400">+225 27 20 30 40 50</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-orange-500" />
                <span className="text-gray-400">contact@sportivoirien.ci</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Sport Scolaire. Tous droits réservés.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Politique de Confidentialité
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Conditions d'Utilisation
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Politique des Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;