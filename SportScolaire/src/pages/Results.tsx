import React, { useState } from 'react';
import { Filter, Search, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { sampleResults } from '../data/sampleData';
import Badge from '../components/ui/Badge';

const Results: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const categories = [...new Set(sampleResults.map(result => result.category))];
  
  const filteredResults = sampleResults
    .filter(result => {
      const matchesSearch = result.eventName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || result.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Résultats Sportifs</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Consultez les résultats des compétitions sportives scolaires à travers la Côte d'Ivoire.
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-auto flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher des compétitions..."
                className="pl-10 w-full h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <span className="text-gray-700">Filtrer par:</span>
                <select
                  className="h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition-colors"
                onClick={toggleSortDirection}
              >
                <Calendar size={18} />
                <span>Date</span>
                {sortDirection === 'desc' ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronUp size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory ? `${selectedCategory} (${filteredResults.length})` : `Tous les résultats (${filteredResults.length})`}
            </h2>
          </div>
          
          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((result) => (
                <div key={result.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 text-white">
                    <h3 className="font-bold text-lg">{result.eventName}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm opacity-90">{new Date(result.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}</span>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {result.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="space-y-3">
                      {result.teams.map((team, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-50 shadow-sm">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                              index === 0 ? 'bg-yellow-500' : 
                              index === 1 ? 'bg-gray-300' : 
                              index === 2 ? 'bg-amber-700' : 'bg-gray-200'
                            }`}>
                              <span className="text-white font-medium">{index + 1}</span>
                            </div>
                            <span className="font-medium">{team.name}</span>
                          </div>
                          <span className="font-bold text-lg">{team.score}</span>
                        </div>
                      ))}
                    </div>
                    
                    <a 
                      href={`/results/${result.id}`}
                      className="mt-4 block text-center py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Détails complets
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun résultat ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Archive Notice */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Archives des Résultats</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Consultez nos archives pour accéder aux résultats des compétitions des années précédentes.
          </p>
          <a 
            href="/results/archive" 
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition-colors"
          >
            Voir les archives
          </a>
        </div>
      </div>
    </div>
  );
};

export default Results;