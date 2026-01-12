import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import Badge from '../ui/Badge';
import { sampleResults } from '../../data/sampleData';

const LatestResults: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Derniers Résultats</h2>
            <p className="text-gray-600 mt-2">Les résultats des compétitions récentes</p>
          </div>
          <Link to="/results" className="mt-4 md:mt-0 flex items-center text-orange-500 hover:text-orange-700 transition-colors">
            <span className="font-medium">Voir tous les résultats</span>
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleResults.map((result) => (
            <div key={result.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
                <h3 className="font-bold text-lg">{result.eventName}</h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm opacity-90">{new Date(result.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</span>
                  <Badge variant="default" className="bg-white/20 text-white">
                    {result.category}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  {result.teams.map((team, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md bg-white shadow-sm">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-300' : 
                          index === 2 ? 'bg-amber-700' : 'bg-gray-200'
                        }`}>
                          {index < 3 ? (
                            <Trophy size={16} className="text-white" />
                          ) : (
                            <span className="text-white font-medium">{index + 1}</span>
                          )}
                        </div>
                        <span className="font-medium">{team.name}</span>
                      </div>
                      <span className="font-bold text-lg">{team.score}</span>
                    </div>
                  ))}
                </div>
                
                <Link 
                  to={`/results/${result.id}`}
                  className="mt-4 block text-center py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Détails complets
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestResults;