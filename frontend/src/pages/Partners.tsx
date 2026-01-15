import React from 'react';
import { ExternalLink } from 'lucide-react';
import { samplePartners } from '../data/sampleData';

const Partners: React.FC = () => {
  // Group partners by tier
  const partnersByTier = {
    platinum: samplePartners.filter(partner => partner.tier === 'platinum'),
    gold: samplePartners.filter(partner => partner.tier === 'gold'),
    silver: samplePartners.filter(partner => partner.tier === 'silver'),
    bronze: samplePartners.filter(partner => partner.tier === 'bronze'),
  };

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Nos Partenaires</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Découvrez les organisations qui soutiennent le développement du sport scolaire en Côte d'Ivoire.
          </p>
        </div>
      </div>
      
      {/* Partners Intro */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ensemble pour le sport scolaire</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Nos partenaires jouent un rôle essentiel dans le développement et la promotion du sport scolaire 
            en Côte d'Ivoire. Grâce à leur soutien, nous pouvons organiser des compétitions de qualité, 
            fournir des équipements aux écoles et offrir des opportunités sportives aux jeunes talents.
          </p>
        </div>
      </div>
      
      {/* Platinum Partners */}
      {partnersByTier.platinum.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
              <span className="border-b-4 border-gray-800 pb-2">Partenaires Platinum</span>
            </h2>
            
            <div className="grid grid-cols-1 gap-8">
              {partnersByTier.platinum.map((partner) => (
                <div key={partner.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="md:col-span-1 p-6 flex items-center justify-center bg-gray-50">
                      <img 
                        src={partner.logoUrl} 
                        alt={partner.name} 
                        className="max-h-36 object-contain"
                      />
                    </div>
                    <div className="md:col-span-2 p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{partner.name}</h3>
                      <p className="text-gray-600 mb-4">{partner.description}</p>
                      <a 
                        href={partner.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-orange-500 hover:text-orange-700 transition-colors"
                      >
                        <span>Visiter le site web</span>
                        <ExternalLink size={16} className="ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Gold Partners */}
      {partnersByTier.gold.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
              <span className="border-b-4 border-yellow-500 pb-2">Partenaires Gold</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {partnersByTier.gold.map((partner) => (
                <div key={partner.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                  <div className="p-6">
                    <div className="flex justify-center mb-4">
                      <img 
                        src={partner.logoUrl} 
                        alt={partner.name} 
                        className="h-24 object-contain"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{partner.name}</h3>
                    <p className="text-gray-600 mb-4 text-center">{partner.description}</p>
                    <div className="text-center">
                      <a 
                        href={partner.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-orange-500 hover:text-orange-700 transition-colors"
                      >
                        <span>Visiter le site web</span>
                        <ExternalLink size={16} className="ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Silver and Bronze Partners */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {partnersByTier.silver.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
                <span className="border-b-4 border-gray-300 pb-2">Partenaires Silver</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {partnersByTier.silver.map((partner) => (
                  <div key={partner.id} className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <img 
                      src={partner.logoUrl} 
                      alt={partner.name} 
                      className="h-16 object-contain mx-auto mb-4"
                    />
                    <h3 className="font-bold text-gray-900 mb-2">{partner.name}</h3>
                    <a 
                      href={partner.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-orange-500 hover:text-orange-700 transition-colors text-sm"
                    >
                      <span>Site web</span>
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {partnersByTier.bronze.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
                <span className="border-b-4 border-amber-700 pb-2">Partenaires Bronze</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {partnersByTier.bronze.map((partner) => (
                  <div key={partner.id} className="bg-white rounded-lg shadow-sm p-4 text-center">
                    <img 
                      src={partner.logoUrl} 
                      alt={partner.name} 
                      className="h-12 object-contain mx-auto mb-3"
                    />
                    <h3 className="font-medium text-gray-900 text-sm">{partner.name}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Become a Partner */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Devenez Partenaire</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Rejoignez notre réseau de partenaires et contribuez au développement du sport scolaire en Côte d'Ivoire.
          </p>
          <a 
            href="/partnership" 
            className="inline-block bg-white text-orange-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Nos offres de partenariat
          </a>
        </div>
      </section>
    </div>
  );
};

export default Partners;