import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, ChevronDown } from 'lucide-react';

const roles = [
  'Directeur Général',
  'Chef Département des Affaires Administratives et Financières',
  'Chef Département du Développement Sportif',
  "Chef Département du Développement de l'Offre d'Infrastructures Sportives, de l'Équipement et du Matériel",
  'Chef Département de la Communication, du Marketing et des Relations Extérieures',
  'Chef de Service Budget',
  'Chef de Service Ressources Humaines',
  'Chef de Service Compétition',
  'Chef de Service Détection',
  'Chef de Service Juridique',
  'Chef de Service Infrastructures Sportives',
  'Chef de Service Communication',
  'Chef de Service Informatique',
  'Chef de Service Courrier',
  'Sécrétaire DG',
  'Sécrétaire Principal',
  'Agent',
  'Délégué de District',
  'Délégué de Région',
  'Délégué de Département',
  'Machiniste',
  "Agent d'Hygiène",
];

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifiant: '', motDePasse: '', role: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.identifiant || !form.motDePasse || !form.role) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    // Simulation d'authentification — à remplacer par un vrai appel API
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-orange-700 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header banner */}
          <div className="bg-gradient-to-r from-green-800 to-green-600 px-8 py-8 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-extrabold text-xl">SS</span>
              </div>
            </div>
            <h1 className="text-white text-2xl font-bold tracking-wide">OISSU</h1>
            <p className="text-green-200 text-sm mt-1">
              Office Ivoirien du Sport Scolaire et Universitaire
            </p>
            <p className="text-orange-300 text-xs mt-3 font-medium uppercase tracking-widest">
              Espace Personnel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {/* Rôle / Fonction */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Fonction <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white"
                >
                  <option value="" disabled>-- Sélectionnez votre fonction --</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Identifiant */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Identifiant <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="identifiant"
                value={form.identifiant}
                onChange={handleChange}
                placeholder="Nom d'utilisateur ou email"
                autoComplete="username"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="motDePasse"
                  value={form.motDePasse}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Message d'erreur */}
            {error && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            {/* Mot de passe oublié */}
            <div className="text-right">
              <Link to="/mot-de-passe-oublie" className="text-xs text-green-700 hover:underline font-medium">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm shadow-md"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Connexion en cours…
                </span>
              ) : (
                <>
                  <LogIn size={16} />
                  Se connecter
                </>
              )}
            </button>

            {/* Retour accueil */}
            <p className="text-center text-xs text-gray-400 mt-2">
              <Link to="/" className="hover:text-green-700 transition-colors">
                ← Retour à l'accueil
              </Link>
            </p>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-green-200 mt-6 opacity-70">
          Accès réservé au personnel autorisé de l'OISSU
        </p>
      </div>
    </div>
  );
};

export default Login;
