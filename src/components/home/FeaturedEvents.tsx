import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { sampleEvents } from '../../data/sampleData';

const FeaturedEvents: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Événements à venir</h2>
            <p className="text-gray-600 mt-2">Découvrez les prochaines compétitions sportives scolaires</p>
          </div>
          <Link to="/events" className="mt-4 md:mt-0 flex items-center text-orange-500 hover:text-orange-700 transition-colors">
            <span className="font-medium">Voir tous les événements</span>
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleEvents.map((event) => (
            <Card key={event.id} hoverable className="h-full flex flex-col">
              <Card.Image src={event.imageUrl} alt={event.title} />
              <Card.Content className="flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant={
                    event.category === 'Football' ? 'default' : 
                    event.category === 'Basketball' ? 'secondary' : 
                    event.category === 'Athlétisme' ? 'success' : 'warning'
                  }>
                    {event.category}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <Card.Title>{event.title}</Card.Title>
                <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar size={16} className="mr-2" />
                  <span>{new Date(event.date).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin size={16} className="mr-2" />
                  <span>{event.location}</span>
                </div>
              </Card.Content>
              <Card.Footer>
                <Link to={`/events/${event.id}`}>
                  <Button variant="outline" fullWidth>
                    Voir les détails
                  </Button>
                </Link>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;