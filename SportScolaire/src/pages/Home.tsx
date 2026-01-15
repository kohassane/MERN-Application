import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedEvents from '../components/home/FeaturedEvents';
import LatestResults from '../components/home/LatestResults';
import PartnerShowcase from '../components/home/PartnerShowcase';
import { ShoppingBag, Calendar, Trophy, Users } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nos Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Événements Sportifs</h3>
              <p className="text-gray-600">Calendrier complet des compétitions scolaires nationales et régionales.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Résultats Sportifs</h3>
              <p className="text-gray-600">Consultez les résultats en temps réel de toutes les compétitions scolaires.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Boutique Officielle</h3>
              <p className="text-gray-600">Achetez des équipements sportifs et des articles aux couleurs nationales.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Partenariats</h3>
              <p className="text-gray-600">Découvrez nos partenaires et les opportunités de collaboration.</p>
            </div>
          </div>
        </div>
      </section>
      
      <FeaturedEvents />
      <LatestResults />
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Rejoignez le mouvement sportif scolaire</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Participez à nos événements, suivez les compétitions et soutenez le développement du sport scolaire en Côte d'Ivoire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/events" className="bg-white text-orange-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
              Voir les événements
            </a>
            <a href="/contact" className="bg-transparent border-2 border-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors">
              Contactez-nous
            </a>
          </div>
        </div>
      </section>
      
      <PartnerShowcase />
      
      {/* Testimonials/News Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Actualités Récentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
              <img 
                src="https://images.pexels.com/photos/159510/sport-tug-of-war-twins-war-159510.jpeg" 
                alt="Ouverture des inscriptions" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <span className="text-sm text-gray-500">5 Janvier 2026</span>
                <h3 className="text-xl font-bold mt-1 mb-2">Ouverture des inscriptions pour le championnat national</h3>
                <p className="text-gray-600 mb-4">
                  Les inscriptions pour le championnat national des écoles sont désormais ouvertes. Toutes les écoles souhaitant participer sont invitées à s'inscrire avant le 15 janvier 2025.
                </p>
                <a href="/news/1" className="text-orange-500 font-medium hover:text-orange-700 transition-colors">
                  Lire la suite →
                </a>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
              <img 
                src="https://images.pexels.com/photos/8224760/pexels-photo-8224760.jpeg" 
                alt="Nouveaux équipements" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <span className="text-sm text-gray-500">15 Février 2026</span>
                <h3 className="text-xl font-bold mt-1 mb-2">Nouveaux équipements pour les écoles participantes</h3>
                <p className="text-gray-600 mb-4">
                  Grâce à nos partenaires, nous sommes heureux d'annoncer la distribution de nouveaux équipements sportifs à toutes les écoles participant aux championnats nationaux cette année.
                </p>
                <a href="/news/2" className="text-orange-500 font-medium hover:text-orange-700 transition-colors">
                  Lire la suite →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;