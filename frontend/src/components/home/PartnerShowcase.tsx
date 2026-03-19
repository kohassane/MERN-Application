import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { samplePartners } from '../../data/sampleData';

const PartnerShowcase: React.FC = () => {
  // Filter platinum and gold partners for showcase
  const featuredPartners = samplePartners.filter(partner => 
    partner.tier === 'platinum' || partner.tier === 'gold'
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Nos Partenaires</h2>
            <p className="text-gray-600 mt-2">Ils soutiennent le sport scolaire en Côte d'Ivoire</p>
          </div>
          <Link to="/partners" className="mt-4 md:mt-0 flex items-center text-orange-500 hover:text-orange-700 transition-colors">
            <span className="font-medium">Découvrir tous nos partenaires</span>
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredPartners.map((partner) => (
            <a 
              key={partner.id} 
              href={partner.websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col items-center justify-center">
                <div className="w-24 h-24 mb-4 relative overflow-hidden rounded-full">
                  <img 
                    src={partner.logoUrl} 
                    alt={partner.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-center text-gray-800 mb-1">{partner.name}</h3>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  partner.tier === 'platinum' ? 'bg-gray-800 text-white' : 
                  partner.tier === 'gold' ? 'bg-yellow-500 text-white' : 
                  partner.tier === 'silver' ? 'bg-gray-300 text-gray-800' : 
                  'bg-amber-700 text-white'
                }`}>
                  Partenaire {
                    partner.tier === 'platinum' ? 'Platinum' : 
                    partner.tier === 'gold' ? 'Gold' : 
                    partner.tier === 'silver' ? 'Silver' : 'Bronze'
                  }
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-8">
            {samplePartners.filter(partner => partner.tier === 'silver' || partner.tier === 'bronze').map((partner) => (
              <a 
                key={partner.id} 
                href={partner.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img 
                  src={partner.logoUrl} 
                  alt={partner.name} 
                  className="h-12 object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerShowcase;