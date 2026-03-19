import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, Globe } from 'lucide-react';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  };

  const navLinks = [
    { name: language === 'fr' ? 'Accueil' : 'Home', path: '/' },
    { name: language === 'fr' ? 'Résultats' : 'Results', path: '/results' },
    { name: language === 'fr' ? 'Boutique' : 'Shop', path: '/shop' },
    { name: language === 'fr' ? 'Événements' : 'Events', path: '/events' },
    { name: language === 'fr' ? 'Partenaires' : 'Partners', path: '/partners' },
    { name: language === 'fr' ? 'À Propos' : 'About', path: '/about' },
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">SS</span>
              </div>
              <span className={`font-bold text-xl ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                Sport Scolaire
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors hover:text-orange-500 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleLanguage}
              className={`flex items-center space-x-1 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
            >
              <Globe size={18} />
              <span>{language.toUpperCase()}</span>
            </button>
            
            <Link to="/search">
              <Search className={`${isScrolled ? 'text-gray-700' : 'text-white'}`} />
            </Link>
            
            <Link to="/cart" className="relative">
              <ShoppingCart className={`${isScrolled ? 'text-gray-700' : 'text-white'}`} />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
            
            <Link to="/connexion">
              <Button variant="primary" size="sm">
                {language === 'fr' ? 'Connexion' : 'Login'}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className={`${isScrolled ? 'text-gray-800' : 'text-white'}`} />
            ) : (
              <Menu className={`${isScrolled ? 'text-gray-800' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-orange-500"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
              <button 
                onClick={toggleLanguage}
                className="flex items-center space-x-1 text-gray-700"
              >
                <Globe size={18} />
                <span>{language.toUpperCase()}</span>
              </button>
              
              <div className="flex items-center space-x-4">
                <Link to="/search" className="text-gray-700">
                  <Search />
                </Link>
                
                <Link to="/cart" className="relative text-gray-700">
                  <ShoppingCart />
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
              </div>
            </div>
            <Link to="/connexion" onClick={() => setIsMenuOpen(false)}>
              <Button variant="primary" fullWidth className="mt-4">
                {language === 'fr' ? 'Connexion' : 'Login'}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;